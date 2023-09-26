const EbayItems = require("../models/EbayItems");
const Item = require("../models/Item");
const {
  getItemsToRevise,
  getItemsToList,
  reviseListings,
  addNewListings,
  fetchListingsAndPopulateDB,
} = require("./ebayHelper");

exports.synchronizeData = async (store, supplier, oAuthToken) => {
  try {
    const items = await Item.find({ site: supplier });
    const isItemsFetched = await fetchListingsAndPopulateDB(store, supplier, oAuthToken);

    if (isItemsFetched) {
      const listings = await EbayItems.find({ supplier });
      const itemsToRevise = getItemsToRevise(items, listings);
      // const itemsToList = getItemsToList(items, listings);
      await reviseListings(itemsToRevise, listings, store, supplier, oAuthToken);
      // await addNewListings(itemsToList)
      // console.log("ebay : ", listings.length);
    }
    // setTimeout(async () => {

    // }, 100)

    // await fetchListingsAndPopulateDB()
  } catch (err) {
    console.log(err);
  }
};