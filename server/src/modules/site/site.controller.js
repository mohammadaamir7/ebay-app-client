const { reviseItem, getItemsToList, addItem, fetchListingsAndPopulateDB } = require('../../helpers/ebayHelper');
const EbayItems = require('../../models/EbayItems');
const Item = require('../../models/Item');
const ScraperConfig = require('../../models/ScraperConfig');
const Store = require('../../models/Store');
const Supplier = require('../../models/Supplier');
const trimModelNumber = (modelNumer) => modelNumer.split("-").join("");

exports.sendItems = async (req, res) => {
    const { page, limit } = req.query;

    try {
        const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);

        const items = await Item.find({}).skip(offset).limit(parseInt(limit, 10));
        const total = await Item.countDocuments({});

        res.status(200).json({ items, total });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};

exports.sendListings = async (req, res) => {
    const { page, limit } = req.query;

    try {
        const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);

        const items = await EbayItems.find({}).skip(offset).limit(parseInt(limit, 10));
        const total = await EbayItems.countDocuments({});
        
        const listingsData = items.map(item => {
            return {
              _id: item._id,
              itemId: item.itemId,
              sku: item?.item[0]?.ItemSpecifics[0]?.NameValueList?.find(
                (val) => val.Name[0].toLowerCase() === "model"
              )?.Value[0]
                ? trimModelNumber(
                    item.item[0]?.ItemSpecifics[0]?.NameValueList.find(
                      (val) => val.Name[0].toLowerCase() === "model"
                    ).Value[0]
                  )
                : "SKU",
              oem: "OEM",
              title: item.item[0].Title[0],
              startPrice: item.item[0].StartPrice[0]._,
              quantity: item.item[0].Quantity[0],
              brand: item.item[0]?.ItemSpecifics[0]?.NameValueList.find(
                (val) => val.Name[0].toLowerCase() === "brand"
              ).Value[0],
            };
        })
        console.log(listingsData)
        res.status(200).json({ items: listingsData, total });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};

exports.sendNewListings = async (req, res) => {
    const { site } = req.query;

    try {

        const items = await Item.find({ site });
        const listings = await EbayItems.find({});
        const itemsToList = getItemsToList(items, listings);

        const listingsData = itemsToList.reduce((acc, item) => {
            acc.push({
                itemNumber: item?.itemNumber,
                title: item?.productName,
                // description: item?.description,
                price: item?.price,
                quantity: item?.availableUnits,
                model: item?.itemNumber,
                brand: site
            })

            return acc
        },[])

        res.status(200).json({ items: listingsData });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};

exports.addNewListings = async (req, res) => {
    const { site } = req.query;
    const { items, store } = req.body;
    // console.log(req.body)
    try {
        const storeData = await Store.findOne({ email: store });
        const markUpPercentage = parseInt(storeData?.markUp) / 100
        const handlingCost = 0
        const shippingCost = 0
        
        if(items){
            for (let index = 0; index < 2; index++) {
                const initialPrice = (markUpPercentage) * (parseInt(handlingCost) + parseInt(shippingCost) + items[index]?.price)
                const price = initialPrice ? initialPrice : 0
                let requiredQuantity = 0
    
                for (
                  let index = 0;
                  index < storeData?.quantityOffset?.length;
                  index++
                ) {
                  if (
                    price >= parseInt(storeData?.quantityOffset[index]?.min) &&
                    price < parseInt(storeData?.quantityOffset[index]?.max)
                  ) {
                    requiredQuantity =
                      items[index]?.quantity <
                      storeData?.quantityOffset[index]?.quantity
                        ? items[index]?.quantity
                        : storeData?.quantityOffset[index]?.quantity;
                  }
                }
    
                // await addItem(items[index]?.title, items[index]?.itemNumber, items[index]?.brand, parseFloat(price.toFixed(2)), parseInt(requiredQuantity))
                // await fetchListingsAndPopulateDB()
            }
        }
        

        res.status(200).json({  });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};

exports.sendSuppliers = async (req, res) => {
    const { page, limit } = req.query;

    try {
        const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);

        const items = await Supplier.find({}).skip(offset).limit(parseInt(limit, 10));
        const total = await Supplier.countDocuments({});

        res.status(200).json({ items, total });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};

exports.sendStores = async (req, res) => {
    const { page, limit } = req.query;

    try {
        const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);

        const items = await Store.find({}).populate("Suppliers").skip(offset).limit(parseInt(limit, 10));
        const total = await Store.countDocuments({});

        res.status(200).json({ items, total });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};


exports.sendItemInfo = async (req, res) => {
    const { id } = req.params;

    try {
        const item = await Item.findById(id);

        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        res.status(200).json({ item });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

exports.sendListingInfo = async (req, res) => {
    const { id } = req.params;

    try {
        const item = await EbayItems.findById(id);
        const itemInfo = await Item.findOne({itemNumber: trimModelNumber(item?.item[0]?.ItemSpecifics[0]?.NameValueList.find(val => val.Name[0].toLowerCase() === "model").Value[0])});
        
        const listing = {
            _id: item?._id,
            itemId: item?.itemId,
            sku: trimModelNumber(item?.item[0]?.ItemSpecifics[0]?.NameValueList.find(val => val.Name[0].toLowerCase() === "model").Value[0]),
            oem: "OEM",
            title: item?.item[0].Title[0],
            startPrice: item?.item[0].StartPrice[0]._,
            quantity: item?.item[0].Quantity[0],
            brand: item?.item[0]?.ItemSpecifics[0]?.NameValueList.find(val => val.Name[0].toLowerCase() === "brand").Value[0],
            handlingCost: item?.item[0]?.ShippingDetails[0]?.CalculatedShippingRate[0]?.PackagingHandlingCosts ? item.item[0]?.ShippingDetails[0]?.CalculatedShippingRate[0]?.PackagingHandlingCosts[0] : 0,
            shippingCost: item?.item[0]?.ShippingDetails[0]?.ShippingServiceOptions[0]?.ShippingServiceCost[0]?._,
            soldQuantity: item?.item[0]?.SellingStatus[0]?.QuantitySold[0],
            cost: itemInfo?.price ? itemInfo?.price : 0,
            previousCost: item?.previousPrice,
            previousQuantity: item?.previousQuantity,
            synced: true,
            fixedPrice: item?.fixedPrice
        }

        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        res.status(200).json({ item: listing });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
}

exports.sendSupplierInfo = async (req, res) => {
    const { id } = req.params;

    try {
        const item = await Supplier.findById(id);

        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        res.status(200).json({ item });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

exports.sendStoreInfo = async (req, res) => {
    const { id } = req.params;

    try {
        const item = await Store.findById(id).populate("Suppliers");

        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        res.status(200).json({ item });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

exports.updateItemInfo = async (req, res) => {
    const { id } = req.params;

    try {
        const updatedItem = await Item.findByIdAndUpdate(id, req.body.updatedItem, { new: true, runValidators: true });

        if (!updatedItem) {
            return res.status(404).json({ message: 'Item not found' });
        }

        res.status(200).json({ success: true, data: updatedItem });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

exports.updateListingInfo = async (req, res) => {
    const { id } = req.params;
    
    const { _id, itemId, startPrice, quantity, title, fixedPrice } = req.body;
    
    try {
        const ebayItem = await EbayItems.findOneAndUpdate(
          { _id: id },
          { fixedPrice }
        );
        
        const storeData = await Store.findOne({ email: ebayItem?.store });

        const handlingCost = ebayItem?.item[0]?.ShippingDetails[0]?.CalculatedShippingRate[0]?.PackagingHandlingCosts ? ebayItem.item[0]?.ShippingDetails[0]?.CalculatedShippingRate[0]?.PackagingHandlingCosts[0] : 0
        const shippingCost = ebayItem?.item[0]?.ShippingDetails[0]?.ShippingServiceOptions[0]?.ShippingServiceCost[0]?._
        const markUpAmount = parseFloat(startPrice) * (parseInt(storeData?.markUp) / 100)
        let price = 0
  
        if(fixedPrice){
          price = parseFloat(startPrice)
        } else {
          const initialPrice = (markUpAmount) + (parseInt(handlingCost) + parseInt(shippingCost) + parseFloat(startPrice))
          price = initialPrice ? initialPrice : 0
        }
        
        let requiredQuantity = 0
  
        for (
            let index = 0;
            index < storeData?.quantityOffset?.length;
            index++
          ) {
            if (
              price >= parseInt(storeData?.quantityOffset[index]?.min) &&
              price < parseInt(storeData?.quantityOffset[index]?.max)
            ) {
              requiredQuantity = storeData?.quantityOffset[index]?.quantity;
            }
          }
          
        await reviseItem(itemId, price, requiredQuantity, title, storeData?.email, ebayItem?.supplier, storeData?.oAuthToken)
        // const updatedItem = await EbayItems.findByIdAndUpdate(id, req.body.updatedItem, { new: true, runValidators: true });

        // if (!updatedItem) {
        //     return res.status(404).json({ message: 'Item not found' });
        // }

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

exports.updateStoreInfo = async (req, res) => {
    const { id } = req.params;
    console.log(req.body)
    const { name, markUp, quantityOffset, markUpRange, supplier, defaultQuantity, quantityAdjustment, useStoreMarkUp, oAuthToken } = req.body;

    try {
        const updatedItem = await Store.findByIdAndUpdate(
          id,
          { name, markUp, useStoreMarkUp, oAuthToken },
        );

        const reqSupplier = await Supplier.findOneAndUpdate(
          { name: supplier },
          { quantityOffset, markUpRange, defaultQuantity, quantityAdjustment }
        );

        if (!updatedItem) {
            return res.status(404).json({ message: 'Item not found' });
        }

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

exports.sendSiteInfo = async (req, res) => {
    try {
        const configs = await ScraperConfig.find({});

        const sites = configs.map(obj => {
            return { site: obj.site, brands: obj.brands }
        });

        res.status(200).json({ sites })
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
}

exports.sendSearchInfo = async (req, res) => {
    const { term, site, brand, page, limit } = req.query;

    let query = {
        $or: [
            { productName: { $regex: term, $options: 'i' } },
            { itemNumber: { $regex: term, $options: 'i' } },
        ],
    };

    if (site) query.site = site;
    if (brand) query.brand = brand;

    if (term.length < 1 && Object.keys(query).length === 1) {
        res.status(200).json({ items: [], term, total: 1 });
        return;
    }

    // const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    try {
        const items = await Item.find(query)// .skip(offset).limit(parseInt(limit, 10));
        // const total = await Item.countDocuments({});

        res.status(200).json({ items, term, total: 1 })
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
}

exports.sendListingSearchInfo = async (req, res) => {
    const { term, page, limit } = req.query;

    let query = {
        $or: [
            { productName: { $regex: term, $options: 'i' } },
            { itemNumber: { $regex: term, $options: 'i' } },
        ],
    };

    if (term.length < 1 && Object.keys(query).length === 1) {
        res.status(200).json({ items: [], term, total: 1 });
        return;
    }

    // const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    try {
        const items = await EbayItems.find()// .skip(offset).limit(parseInt(limit, 10));
        // const total = await Item.countDocuments({});

        res.status(200).json({ items, term, total: 1 })
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
}

exports.addSupplier = async (req, res) => {
    try {
        const supplier = await Supplier.create({...req.body});

        res.status(200).json({ status: true })
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
}

exports.addStore = async (req, res) => {
    try {
        const { name, email, password, redirectUrl, suppliers } = req.body;
        let supplierIds = await Supplier.find(
          { name: { $in: suppliers } },
          "_id"
        );

        supplierIds = supplierIds.map(obj => obj._id)

        await Store.create({
          name,
          email,
          password,
          redirectUrl,
          Suppliers: supplierIds,
        });

        res.status(200).json({ status: true })
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
}
