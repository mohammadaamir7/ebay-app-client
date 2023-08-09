const express = require('express');
const router = express.Router();

const { sendItems, sendItemInfo, updateItemInfo, sendSiteInfo, sendSearchInfo } = require('./site.controller');

router.get('/items', sendItems);

router.get('/items/:id', sendItemInfo);
router.put('/items/:id', updateItemInfo);

router.get('/configs', sendSiteInfo);
router.get('/search', sendSearchInfo);

module.exports = router;