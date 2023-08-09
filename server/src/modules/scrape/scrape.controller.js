const moment = require('moment-timezone');

const ScraperConfig = require('../../models/ScraperConfig');

const scrapers = async (req, res) => {
    try {
        const scraperConfig = await ScraperConfig.find({});
        const scrapers = scraperConfig.map((doc) => doc.site);

        res.json({ scrapers: scrapers });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};

const scraperConfig = async (req, res) => {
    const { site } = req.query;

    try {
        const [{ config, brands }] = await ScraperConfig.find({ site: site });

        res.json({ scraperConfig: config, brands: brands });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};

const scraperControl = async (req, res) => {
    const { site, action } = req.body;

    console.log(action)

    const wrongfields = [];

    if (!site) wrongfields.push('site');
    if (!['start', 'pause', 'stop', 'brandRefresh'].includes(action)) wrongfields.push('action');

    console.log(wrongfields)

    if (wrongfields.length > 0) {
        res.json({ message: `error on query ${wrongfields}` })
    }

    const updateFields = {};

    switch (action) {
        case 'start':
            updateFields['config.status.text'] = 'Starting';
            updateFields['config.control.action'] = 'start';
            break;
        case 'pause':
            updateFields['config.status.text'] = 'Paused';
            updateFields['config.control.action'] = 'stop';
            updateFields['config.control.paused'] = true;
            break;
        case 'stop':
            updateFields['config.status.text'] = 'Idle';
            updateFields['config.control.action'] = 'stop';
            updateFields['config.control.paused'] = false;
            break;
        case 'brandRefresh':
            updateFields['config.status.text'] = 'Idle';
            updateFields['config.control.action'] = 'start';
            updateFields['config.control.type'] = 'brandRefresh';
            break;
    }

    try {
        const result = await ScraperConfig.updateMany(
            { site },
            { $set: updateFields }
        );

        if (result.nModified === 0) {
            return res.status(404).json({ message: 'No matching documents found.' });
        }
 
        res.status(200).json({ message: '' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};

const uploadConfig = async (req, res) => {
    const { site, scraperConfig, brand, delayOn, delayTime, interception } = req.body;

    if (!site) {
        return res.status(400).json({ message: 'Site is required.' });
    }

    const updateFields = {};

    if (scraperConfig !== undefined) updateFields['config'] = scraperConfig;
    if (brand !== undefined) updateFields['config.brand'] = brand;
    if (delayOn !== undefined) updateFields['config.delay.delayOn'] = delayOn;
    if (delayTime !== undefined) updateFields['config.delay.delayTime'] = delayTime;
    if (interception !== undefined) updateFields['config.interception'] = interception;

    try {
        const result = await ScraperConfig.updateOne(
            { site },
            { $set: { ...updateFields, updatedDate: moment().tz("America/Los_Angeles").format() } }
        );

        if (result.nModified === 0) {
            return res.status(404).json({ message: 'No matching documents found.' });
        }

        res.status(200).json({ message: 'Config updated successfully.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

module.exports = { scrapers, scraperConfig, scraperControl, uploadConfig };