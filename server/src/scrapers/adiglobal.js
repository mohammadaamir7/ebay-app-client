const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const puppeteer = require('puppeteer-extra')
puppeteer.use(StealthPlugin())

const mainPuppeteer = require('puppeteer');
const cheerio = require('cheerio');
const path = require('path');

const ScraperConfig = require('../models/ScraperConfig');
const Item = require('../models/Item');

const baseUrl = 'https://www.adiglobaldistribution.us';
const site = path.basename(__filename, '.js');
const query = {
    page: "?page="
}

let config = null;
let itemCount = 0;

const scrape = async (initial) => {
    config = initial;

    await ScraperConfig.updateOne(
        { site: site },
        {
            $set: {
                'config.control.instance': true,
                'config.status.pages': 0,
                'config.status.items': 0,
                'config.status.text': 'Running'
            }
        }
    );

    const browser = await puppeteer.launch({
        headless: true,
        args: [
            `--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36`,
            '--no-sandbox'
        ],
        defaultViewport: {
            width: 1500,
            height: 800
        },
        executablePath: mainPuppeteer.executablePath(),
    });

    const page = await browser.newPage();

    try {
        await page.goto(`${baseUrl}/Catalog/shop-brands`, { timeout: 0 })
        await page.waitForSelector('div.rd-brand-name > a');

        // await login(page, config.login.user, config.login.pass);

        if (config.interception) {
            page.setRequestInterception(true);
            page.on('request', (request) => {
                request._interceptionHandled = false;
                if (!['document', 'script', 'xhr'].includes(request.resourceType())) {
                    request.respond({
                        status: 200,
                        body: 'foo',
                    });
                } else {
                    request.continue();
                }
            });
        }

        let manufacturerInfo = await fetchManufacturerInfo(page);

        if (config.control.type === 'brandRefresh') {
            await resetConfig();
            return;
        }

        if (config.control.paused) manufacturerInfo = sliceArray(manufacturerInfo, 'title', config.checkpoint.brand);

        await page.evaluate((key, value) => {
            localStorage.setItem(key, value);
        }, config.localStorage[0], JSON.stringify(config.localStorage[1]));

        for (const manufacturer of manufacturerInfo) {
            await ScraperConfig.updateOne(
                { site: site },
                { $set: { 'config.checkpoint.brand': manufacturer.title } }
            );

            await fetchManufacturer(page, manufacturer);

            await configUpdate();
            if (config.control.action !== 'start') break;
        }
    } catch (err) {
        console.error(err);
    } finally {
        await resetConfig();
        await browser.close();
    }
}

const login = async (page, username, password) => {
    const [button] = await page.$x("//span[contains(., 'Sign In')]");
    if (button) {
        await button.click();
    } else {
        console.log('Sign in button not found');
    }

    await page.waitForSelector('input#SignInInfo_UserName');

    await page.type('input#SignInInfo_UserName', username);

    await page.type('input#SignInInfo_Password', password);

    await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle0' }),
        page.click('button.sign-in-btn')
    ]);
}

const fetchManufacturerInfo = async (page) => {
    const content = await page.content();
    const $ = cheerio.load(content);

    console.log('3')

    const manufacturerInfo = [];

    $('div.rd-brand-name > a', content).each(function () {
        const manufacturerName = $(this).text().trim();
        const manufacturerUrl = $(this).attr('href');

        if (config.brand === manufacturerName || config.brand === 'all') {
            manufacturerInfo.push({ title: manufacturerName, url: `${baseUrl}/${manufacturerUrl}` });
        }
    });

    console.log(manufacturerInfo.map((obj) => obj.title))

    await ScraperConfig.updateOne(
        { site: site },
        { $set: { brands: manufacturerInfo.map((obj) => obj.title) } }
    );

    return manufacturerInfo;
}

const fetchManufacturer = async (page, manufacturer) => {
    await page.goto(manufacturer.url, { timeout: 0 })
    await page.waitForTimeout(2 * 1000);

    await page.waitForSelector('a.page-number');

    const content = await page.content();
    const $ = cheerio.load(content);

    let totalPages = 0;
    let startPage = 1;

    $('a.page-number', content).each(function (i) {
        if (i === 3) {
            totalPages = parseInt($(this).text().trim());
        }
    });

    if (config.control.paused) startPage = config.checkpoint.page;

    for (let i = startPage; i <= totalPages; i++) {
        console.log(`Starting Page ${i} of ${totalPages}`)

        const pageitemsUrls = await fetchItemUrls(page, `${manufacturer.url}`, i);
        await fetchItems(page, pageItemsUrls);  
        
        await configUpdate();
        if (config.control.action !== 'start') break;

        console.log(`Scraped Page ${i} of ${totalPages}`)

        await ScraperConfig.updateOne(
            { site: site },
            { $set: { 'config.checkpoint.page': i, 'config.status.pages': i } }
        );

        if (config.delay.delayOn === 'page') {
            await page.waitForTimeout(1000 * config.delay.delayTime);
        }
    }
}

const fetchItemUrls = async (page, manufacturerPageUrl, pageCount) => {
    const itemUrls = []

    const pageUrl = `${manufacturerPageUrl}${query.page}${pageCount}`;
    await page.goto(pageUrl, { timeout: 0 });

    await page.waitForSelector('div.rd-item-name > a');

    const content = await page.content();
    const $ = cheerio.load(content);

    $('div.rd-item-name > a', content).each(function () {
        itemUrls.push(`${baseUrl}${$(this).attr('href')}`)
    });

    return itemUrls;
}

const fetchItems = async (page, pageitemsUrls) => {
    for (const [index, url] of pageitemsUrls.entries()) {
        await configUpdate();
        if (config.control.action !== 'start') break;

        await page.goto(url, { timeout: 0 });

        await page.waitForSelector('div.pd-show-overview');

        const content = await page.content();
        const $ = cheerio.load(content);

        let item = {
            site: 'adiglobal',
            productName: $('h1.product-title-description').first().text().trim(),
            itemNumber: $('h2.item-num-mfg').first().text().trim(),
            price: `$${$('span.net-price.value:first').text()}.${$('span.net-price.value + sup:first').text()}`,
            inventory: [],
            availableUnits: 0,
            options: [],
            brand: $('div.brand-name.brand-title > a > h2').first().text().trim(),
            imageUrl: $('img#productImage:last').attr('src'),
            itemUrl: url,
            category: '',
            description: $('div.pd-show-overview').text().trim(),
        };

        // category
        const category = [];

        $('ul.breadcrumbs > li > a').each(function () {
            category.push($(this).text().trim());
        });

        item['category'] = category.join(' > ');

        // inventory & available
        $('div.redesign-stock-details-row').each(function () {
            const firstValue = $(this).find('div.text-align-left span').text().trim();
            const secondValue = $(this).find('div.text-align-right span').text().trim();

            const rowString = `${firstValue}: ${secondValue}`;
            item.inventory.push(rowString);

            item.availableUnits += parseInt(secondValue);
        });

        // options
        $('button.pdp-singlevariant-btn > span').each(function () {
            item.options.push($(this).text().trim());
        });

        // save and update items
        await Item.findOneAndUpdate({ itemNumber: itemInfo.itemNumber }, itemInfo, { upsert: true });
        itemCount++;

        await ScraperConfig.updateOne(
            { site: site },
            { $set: { 'config.status.items': itemCount } }
        );

        console.log(`Scraped product ${index + 1} of ${pageitemsUrls.length}`);

        if (config.delay.delayOn === 'item') {
            await page.waitForTimeout(1000 * config.delay.delayTime);
        }
    }
}

const savePageData = async (pageitemsData) => {
    await Item.insertMany(pageitemsData);
}

const sliceArray = (array, key, value) => {
    const startIndex = array.findIndex(obj => obj[key] === value);

    if (startIndex === -1) {
        return [];
    }
    return array.slice(startIndex);
}

const resetConfig = async () => {
    await ScraperConfig.updateOne(
        { site: site },
        {
            $set: {
                'config.control.action ': '',
                'config.control.paused ': false,
                'config.control.type': '',
                'config.control.instance': false,
                'config.status.text': 'Idle',
            }
        }
    );
}

const configUpdate = async () => {
    const result = await ScraperConfig.find({ site: site });
    config = result[0].config;
}

module.exports = { scrape };