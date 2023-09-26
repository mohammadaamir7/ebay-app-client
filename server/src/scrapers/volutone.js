if (process.env.NODE_ENV !== "production") require("dotenv").config();

const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const puppeteer = require('puppeteer-extra');
puppeteer.use(StealthPlugin())

const mainPuppeteer = require('puppeteer');
const cheerio = require('cheerio');
const path = require('path');

const connectDB = require('../config/db');
connectDB();

const ScraperConfig = require('../models/ScraperConfig');
const Item = require('../models/Item');

const baseUrl = 'https://www.volutone.com';
const site = path.basename(__filename, '.js');
const query = {
    page: '&pi=',
    view: '&pv=1',
};

let config = null;
let itemCount = 0;

const scrape = async (initial) => {
    config = initial;

    await ScraperConfig.updateOne(
        { site: site },
        {
            $set: {
                'config.control.instance': true,
                'config.status.text': 'Running',
                'config.status.pages': 0,
                'config.status.items': 0
            }
        }
    );

    itemCount = 0;

    const browser = await puppeteer.launch({
        headless: false,
        args: [
            '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36',
            '--no-sandbox'
        ],
        defaultViewport: {
            width: 1280,
            height: 720,
        },
        executablePath: mainPuppeteer.executablePath(),
    });

    const page = await browser.newPage();

    try {
        query.size = `&ps=${config.itemPerPage}`;

        await login(page, config.login.user, config.login.pass);

        await page.goto(`${baseUrl}/?tab=1`, { timeout: 0 });

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

        if (config.control.paused) {
            manufacturerInfo = sliceArray(manufacturerInfo, 'title', config.checkpoint.brand);
            console.log(manufacturerInfo);
        }

        console.log(manufacturerInfo);

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
        console.log(err);
    } finally {
        await resetConfig();
        await browser.close();
    }
    console.log('scraping done...')
}

const login = async (page, username, password) => {
    await page.goto(`${baseUrl}/Login.aspx`, { waitUntil: 'networkidle0' });

    await page.type('input#ctl00_wpm_Login_ctl04_UserName', username);
    await page.type('input#ctl00_wpm_Login_ctl04_Password', password);

    await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle0' }),
        page.click('td.loginButtons > input'),
    ]);
}

const fetchManufacturerInfo = async (page) => {
    await page.waitForSelector('ul.leftNavItems > li > a');

    const content = await page.content();
    const $ = cheerio.load(content);

    const manufacturerInfo = [];

    $('ul.leftNavItems > li > a', content).each(function () {
        const manufacturerName = $(this).text().trim();
        const manufacturerUrl = $(this).attr('href');

        if (config.brand === manufacturerName || config.brand === 'all' || config.control.type === 'brandRefresh') {
            manufacturerInfo.push({ title: manufacturerName, url: `${baseUrl}/${manufacturerUrl}` });
        }
    });

    if (config.control.type === 'brandRefresh') {
        await ScraperConfig.updateMany(
            { site: site },
            { $set: { brands: manufacturerInfo.map((obj) => obj.title) } }
        );
    }
    
    console.log(manufacturerInfo);

    return manufacturerInfo;
}

const fetchManufacturer = async (page, manufacturer) => {
    const manufacturerPageUrl = manufacturer.url.replace('&ps=12', query.size);

    await page.goto(`${manufacturerPageUrl}${query.view}`, { timeout: 0 });
    await page.waitForTimeout(2000);

    const content = await page.content();
    const $ = cheerio.load(content);

    const totalItems = parseInt($('b.dxp-lead.dxp-summary').text().match(/(?<=\()\d+/)[0]);

    let totalPages = Math.ceil(totalItems / config.itemPerPage);
    let startPage = 1;

    if (config.control.paused) startPage = config.checkpoint.page;

    console.log(totalPages);

    for (let i = startPage; i <= totalPages; i++) {
        console.log(`Starting Page ${i} of ${totalPages}`);

        const pageItemsUrls = await fetchItemUrls(page, `${manufacturerPageUrl}${query.view}`, i);
        await fetchItems(page, pageItemsUrls);  

        await configUpdate();
        if (config.control.action !== 'start') break;

        console.log(`Scraped Page ${i} of ${totalPages}`);

        await ScraperConfig.updateOne(
            { site: site },
            { $set: { 'config.checkpoint.page': i, 'config.status.pages': i } }
        );
    }
}

const fetchItemUrls = async (page, manufacturerPageUrl, pageCount) => {
    const itemUrls = [];

    const pageUrl = `${manufacturerPageUrl}${query.page}${pageCount}`;
    await page.goto(pageUrl, { timeout: 0 });

    const content = await page.content();
    const $ = cheerio.load(content);

    $('table.pagedList > tbody > tr a[style="font-weight:bold;"]', content).each(function () {
        itemUrls.push(`${baseUrl}/${$(this).attr('href')}`);
    });

    return itemUrls;
}

const fetchItems = async (page, pageItemsUrls) => {
    for (const [index, url] of pageItemsUrls.entries()) {
        console.log(url)
        await configUpdate();
        if (config.control.action !== 'start') break;

        await page.goto(url, { timeout: 0 });

        const content = await page.content();
        const $ = cheerio.load(content);

        const itemInfo = {
            site: 'volutone',
            productName: $('div.pageHeader').text().trim(),
            itemNumber: $('table.buyProductForm > tbody > tr:nth-child(1) > td:nth-child(2)').text().trim(),
            msrp: $('table.buyProductForm > tbody > tr:nth-child(2) > td:nth-child(2)').text().trim(),
            price: $('table.buyProductForm > tbody > tr:nth-child(3) > td:nth-child(2)').text().trim(),
            inventory: [],
            availableUnits: 0,
            brand: $('#ctl00_wpm_ShowProduct_ctl06_ManufacturerLinkButton').text().trim(),
            imageUrl: `${baseUrl}/${$('#ctl00_wpm_ShowProduct_ctl05_ProductImage').attr('src')}`,
            itemUrl: url,
            category: '',
            description: $('#ctl00_wpm_ShowProduct_ctl11_pcDescriptions').text().trim(),
        };

        // category
        const category = [];

        $('div.breadCrumbPanel a', content).each(function () {
            category.push($(this).text().trim());
        });

        itemInfo['category'] = category.join(' > ');

        // inventory & available
        $('table.buyProductForm select > option', content).each(function () {
            const warehouseText = $(this).text().trim();
            const warehouseParts = warehouseText.split(":");
            const warehouseName = warehouseParts[0].trim();
            console.log(warehouseParts)
            const warehouseQuantity = parseInt(warehouseParts[1]);
        
            const warehouse = {
                "warehouse": warehouseName,
                "quantity": warehouseQuantity
            };
        
            itemInfo['inventory'].push(warehouse);
            itemInfo['availableUnits'] += warehouseQuantity;
        });        
        // save and update items
        await Item.findOneAndUpdate({ itemNumber: itemInfo.itemNumber }, itemInfo, { upsert: true });
        itemCount++;

        await ScraperConfig.updateOne(
            { site: site },
            { $set: { 'config.status.items': itemCount } }
        );

        console.log(itemInfo)
        console.log(`Scraped product ${index + 1} of ${pageItemsUrls.length}`);
    }
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
                'config.control.action': '',
                'config.control.paused': false,
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