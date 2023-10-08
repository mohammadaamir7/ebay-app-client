const express = require('express');
const router = express.Router();

const { sendItems, sendItemInfo, updateItemInfo, sendSiteInfo, sendSearchInfo, sendListingInfo, sendListingSearchInfo, sendListings, updateListingInfo, addSupplier, sendSuppliers, sendSupplierInfo, addStore, sendStores, sendStoreInfo, updateStoreInfo, sendNewListings, addNewListings, deleteListing, deleteItem, deleteStore } = require('./site.controller');
const { queryhandler } = require('../../middlewares/queryHandler');

router.post('/addSupplier', addSupplier);
router.post('/addStore', addStore);
router.post('/addNewListings', addNewListings);
router.get('/items', sendItems);
router.get('/listings', queryhandler, sendListings);
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

router.delete('/listings', deleteListing);
router.delete('/items', deleteItem);
router.delete('/store', deleteStore);

module.exports = router;