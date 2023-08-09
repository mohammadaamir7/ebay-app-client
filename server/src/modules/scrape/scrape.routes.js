const express = require('express');
const router = express.Router();

const { scrapers, scraperConfig, scraperControl, uploadConfig } = require('./scrape.controller');

router.get('/scrapers', scrapers);
router.get('/scraper-config', scraperConfig);
router.post('/scraper-control', scraperControl);
router.post('/upload-config', uploadConfig)

module.exports = router;