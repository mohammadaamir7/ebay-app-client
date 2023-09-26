const express = require('express');
const router = express.Router();

const { sendItems, sendItemInfo, updateItemInfo, sendSiteInfo, sendSearchInfo, sendListingInfo, sendListingSearchInfo, sendListings, updateListingInfo, addSupplier, sendSuppliers, sendSupplierInfo, addStore, sendStores, sendStoreInfo, updateStoreInfo, sendNewListings, addNewListings } = require('./site.controller');

router.post('/addSupplier', addSupplier);
router.post('/addStore', addStore);
router.post('/addNewListings', addNewListings);
router.get('/items', sendItems);
router.get('/listings', sendListings);
router.get('/newListings', sendNewListings);
router.get('/suppliers', sendSuppliers);
router.get('/stores', sendStores);

router.get('/items/:id', sendItemInfo);
router.get('/listings/:id', sendListingInfo);
router.get('/supplier/:id', sendSupplierInfo);
router.get('/store/:id', sendStoreInfo);
router.put('/items/:id', updateItemInfo);
router.put('/listing/:id', updateListingInfo);
router.put('/store/:id', updateStoreInfo);


router.get('/configs', sendSiteInfo);
router.get('/search', sendSearchInfo);
router.get('/searchListings', sendListingSearchInfo);

module.exports = router;