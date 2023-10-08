const axios = require("axios");
const xml2js = require("xml2js");
const EbayItems = require("../models/EbayItems");
const Item = require("../models/Item");
const Store = require("../models/Store");
const Supplier = require("../models/Supplier");

const trimModelNumber = (modelNumer) => modelNumer.split("-").join("");

exports.reviseItem = async (itemId, price, quantity, title, store, supplier, oAuthToken) => {
  let item = {};
  const buyPrice = parseFloat((price * 0.3));
  const xmlPayload = `
<?xml version="1.0" encoding="utf-8"?>
<ReviseItemRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials>
    <eBayAuthToken>${oAuthToken}</eBayAuthToken>
  </RequesterCredentials>
  <Item>
    <Title>${title}</Title>
    <ItemID>${itemId}</ItemID>
    <StartPrice>${parseFloat(price)}</StartPrice>
    <Quantity>${parseInt(quantity)}</Quantity>
  </Item>
</ReviseItemRequest>
`;
// console.log(xmlPayload)
  // Construct headers for the request
  const headers = {
    "X-EBAY-API-CALL-NAME": "ReviseItem",
    "X-EBAY-API-SITEID": "0", // Change to the appropriate site ID
    "X-EBAY-API-COMPATIBILITY-LEVEL": "1227", // Replace with the required compatibility level
    "Content-Type": "text/xml",
  };

  // Make the API request
  axios
    .post(process.env.EBAY_ENDPOINT, xmlPayload, { headers })
    .then((response) => {
      xml2js.parseString(response.data, async (error, result) => {
        if (error) {
          console.error("Error parsing eBay API response:", error);
        } else {
          // console.log("eBay API Response:", JSON.stringify(result, null, 2));
          item = result;
          // Handle the eBay API response data here
         await this.getItem(itemId, store, supplier, oAuthToken)
        }
      });
    })
    .catch((error) => {
      console.error("Error making eBay API request:", error);
    });
};

exports.addItem = async (title, model, brand, price, quantity) => {
  const xmlPayload = `
  <?xml version="1.0" encoding="utf-8"?>
<AddItemRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials>
    <eBayAuthToken>${process.env.O_AUTH_TOKEN}</eBayAuthToken>
  </RequesterCredentials>
  <ErrorLanguage>en_US</ErrorLanguage>
  <WarningLevel>High</WarningLevel>
  <Item>
    <Title>${title}</Title>
    <Quantity>${quantity}</Quantity>
    <SKU>${model}</SKU>
    <Description>
      Arakins Product!
    </Description>
    <PrimaryCategory>
      <CategoryID>29223</CategoryID>
    </PrimaryCategory>
    <StartPrice currencyID="USD">${price}</StartPrice>
    <CategoryMappingAllowed>true</CategoryMappingAllowed>
    <Country>US</Country>
    <Currency>USD</Currency>
    <DispatchTimeMax>3</DispatchTimeMax>
    <ListingDuration>Days_7</ListingDuration>
    <ListingType>Chinese</ListingType>
    <PostalCode>95125</PostalCode>
    <ItemSpecifics>     
     <NameValueList> 
        <Name>Model</Name>
        <Value>${model}</Value> 
     </NameValueList> 
     <NameValueList> 
        <Name>MPN</Name> 
        <Value>${model}</Value> 
     </NameValueList> 
     <NameValueList> 
        <Name>Brand</Name> 
        <Value>${brand}</Value> 
     </NameValueList>
    </ItemSpecifics>
    <ReturnPolicy>
      <ReturnsAcceptedOption>ReturnsAccepted</ReturnsAcceptedOption>
      <RefundOption>MoneyBack</RefundOption>
      <ReturnsWithinOption>Days_30</ReturnsWithinOption>
      <ShippingCostPaidByOption>Buyer</ShippingCostPaidByOption>
    </ReturnPolicy>
    <ShippingDetails>
      <ShippingType>Flat</ShippingType>
      <ShippingServiceOptions>
        <ShippingServicePriority>1</ShippingServicePriority>
        <ShippingService>USPSMedia</ShippingService>
        <ShippingServiceCost>2.50</ShippingServiceCost>
      </ShippingServiceOptions>
    </ShippingDetails>
    <Site>US</Site>
  </Item>
</AddItemRequest>
`;
console.log(xmlPayload)
// console.log('add payload : ', xmlPayload)
  // Construct headers for the request
  const headers = {
    "X-EBAY-API-CALL-NAME": "AddItem",
    "X-EBAY-API-SITEID": "0", // Change to the appropriate site ID
    "X-EBAY-API-COMPATIBILITY-LEVEL": "1227", // Replace with the required compatibility level
    "Content-Type": "text/xml",
  };

  // Make the API request
  axios
    .post(process.env.EBAY_ENDPOINT, xmlPayload, { headers })
    .then((response) => {
      xml2js.parseString(response.data, (error, result) => {
        if (error) {
          console.error("Error parsing eBay API response:", error);
        } else {
          console.log("eBay API Response:", JSON.stringify(result, null, 2));
          item = result;
          // Handle the eBay API response data here
        }
      });
    })
    .catch((error) => {
      console.error("Error making eBay API request:", error);
    });
};

const getMyEbaySelling = async (oAuthToken) => {
  let data = [];

  const xmlPayload = `
  <?xml version="1.0" encoding="utf-8"?>
  <GetMyeBaySellingRequest xmlns="urn:ebay:apis:eBLBaseComponents">
    <RequesterCredentials>
      <eBayAuthToken>${oAuthToken}</eBayAuthToken>
    </RequesterCredentials>
    <IncludeItemSpecifics>true</IncludeItemSpecifics>
    <DetailLevel>ReturnAll</DetailLevel>
    <ActiveList>
    <Include>true</Include>
      <Sort>TimeLeft</Sort>
      <Pagination>
        <EntriesPerPage>2</EntriesPerPage>
        <PageNumber>1</PageNumber>
      </Pagination>
    </ActiveList>
  </GetMyeBaySellingRequest>
`;

  // Construct headers for the request
  const headers = {
    "X-EBAY-API-CALL-NAME": "GetMyeBaySelling",
    "X-EBAY-API-SITEID": "0", // Change to the appropriate site ID
    "X-EBAY-API-COMPATIBILITY-LEVEL": "1227", // Replace with the required compatibility level
    "Content-Type": "text/xml",
  };

  // Make the API request
  const response = await axios.post(process.env.EBAY_ENDPOINT, xmlPayload, {
    headers,
  });

  xml2js.parseString(response.data, async (error, result) => {
    if (error) {
      console.error("Error parsing eBay API response:", error);
    } else {
      // console.log("eBay API Response:", JSON.stringify(result, null, 2));
      // console.log('ebay length : ', result.GetMyeBaySellingResponse.ActiveList[0].ItemArray.length)
      const initialData =
        result.GetMyeBaySellingResponse.ActiveList[0].ItemArray[0].Item;
      initialData.forEach((element) => {
        // data.push({ item: element });
        data.push(element);
      });
      // await EbayItems.insertMany(data)
    }
  });

  return data;
};

exports.getItem = async (itemId, store, supplier, oAuthToken) => {
  let data = [];

  const xmlPayload = `
<?xml version="1.0" encoding="utf-8"?>
<GetItemRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials>
    <eBayAuthToken>${oAuthToken}</eBayAuthToken>
  </RequesterCredentials>
  <IncludeItemSpecifics>true</IncludeItemSpecifics>
  <ItemID>${itemId}</ItemID>
</GetItemRequest>

`;
  // Construct headers for the request
  const headers = {
    "X-EBAY-API-CALL-NAME": "GetItem",
    "X-EBAY-API-SITEID": "0", // Change to the appropriate site ID
    "X-EBAY-API-COMPATIBILITY-LEVEL": "1227", // Replace with the required compatibility level
    "Content-Type": "text/xml",
  };

  // Make the API request
  axios
    .post(process.env.EBAY_ENDPOINT, xmlPayload, { headers })
    .then((response) => {
      xml2js.parseString(response.data, async (error, result) => {
        if (error) {
          console.error("Error parsing eBay API response:", error);
        } else {
          if(result.GetItemResponse.Item){
          
          // console.log("eBay API Response:", JSON.stringify(result, null, 2));
          const ebayItem = await EbayItems.findOne({ itemId });

          const initialData = {
            itemId: result.GetItemResponse.Item[0]?.ItemID[0],
            previousQuantity: ebayItem?.item[0]?.Quantity[0] ? ebayItem?.item[0]?.Quantity[0] : 0,
            previousPrice: ebayItem?.item[0]?.StartPrice[0]._ ? ebayItem?.item[0]?.StartPrice[0]._ : 0,
            item: result.GetItemResponse.Item,
            price: result.GetItemResponse.Item[0]?.StartPrice[0]._,
            quantity: result.GetItemResponse.Item[0]?.Quantity[0],
            soldQuantity: result.GetItemResponse.Item[0]?.SellingStatus[0]?.QuantitySold[0],
            title: result.GetItemResponse.Item[0]?.Title[0],
            brand: result.GetItemResponse.Item[0]?.ItemSpecifics[0]?.NameValueList.find(val => val.Name[0].toLowerCase() === "brand").Value[0],
            sku: trimModelNumber(result.GetItemResponse.Item[0]?.ItemSpecifics[0]?.NameValueList.find(val => val.Name[0].toLowerCase() === "model").Value[0]),
            store,
            supplier,
            fixedPrice: true,
            synced: true
          };
          await EbayItems.findOneAndUpdate({ itemId: initialData?.itemId }, initialData, { upsert: true });
          return {success: true, message: 'Item revised successfully'}

        }else{
          return {success: false, message: 'token expired'}

        }
          // Handle the eBay API response data here
        }
      });
    })
    .catch((error) => {
      console.error("Error making eBay API request:", error);
    });
};

exports.getItemsToRevise = (items, listings) => {
  const idsToFilter = listings.map(list => list.item[0]?.ItemSpecifics[0]?.NameValueList.find(val => val.Name[0].toLowerCase() === "model") ? trimModelNumber(list.item[0]?.ItemSpecifics[0]?.NameValueList.find(val => val.Name[0].toLowerCase() === "model").Value[0]) : null);
  const filteredData = items.filter(item => idsToFilter.includes(item.itemNumber))
  // const filteredData = items.filter((item) =>
  //   listings.some((list) => {
  //     if (list.item[0]?.ItemSpecifics) {
  //       return (
  //         trimModelNumber(
  //           list.item[0]?.ItemSpecifics[0]?.NameValueList[0]?.Value[0]
  //         ) === item.itemNumber
  //       );
  //     }
  //   })
  // );
  console.log("filtered : ", filteredData.length);
  return filteredData
};

exports.getItemsToList = (items, listings) => {
  const idsToFilter = listings?.map(list => trimModelNumber(list?.item[0]?.ItemSpecifics[0]?.NameValueList?.find(val => val.Name[0].toLowerCase() === "model")?.Value[0]));
  const requiredListings = items.filter(item => !idsToFilter.includes(item.itemNumber))
 
  console.log("filtered addition : ", requiredListings.length);
  return requiredListings
};

exports.reviseListings = async (items, listings, store, supplier, oAuthToken) => {
  try{
    const storeData = await Store.findOne({ email: store });
    const supplierData = await Supplier.findOne({ name: supplier });
    console.log('len listings : ', listings.length)
  
    
    for (let index = 0; index < items.length; index++) {
      let markUp = 0
      let requiredQuantity = supplierData?.defaultQuantity
  
      const element = listings.find(listing => listing.item[0]?.ItemSpecifics && (trimModelNumber(listing.item[0]?.ItemSpecifics[0]?.NameValueList.find(val => val.Name[0].toLowerCase() === "model").Value[0]) === items[index].itemNumber));
      if (element) {
        const inventory = [
          ...items[index].inventory.map((rec) => {
            return { name: rec.warehouse, value: rec.quantity };
          }),
        ];
        const totalQuantity = items[index].inventory.reduce((acc, val) => {
          acc += val.quantity
          return acc
        }, 0)
  
        const handlingCost = element?.item[0]?.ShippingDetails[0]?.CalculatedShippingRate[0]?.PackagingHandlingCosts ? element.item[0]?.ShippingDetails[0]?.CalculatedShippingRate[0]?.PackagingHandlingCosts[0] : 0
        const shippingCost = element?.item[0]?.ShippingDetails[0]?.ShippingServiceOptions[0]?.ShippingServiceCost[0]?._
  
        let price = 0
  
        if(element?.fixedPrice){
          price = parseFloat(element?.item[0]?.StartPrice[0]._)
        } else {
          if(storeData?.useStoreMarkUp){
            markUp = storeData?.markUp
          }else {
            for (
              let ind = 0;
              ind < supplierData?.markUpRange?.length;
              ind++
            ) {
              if (
                parseFloat(items[index]?.price) >= parseFloat(supplierData?.markUpRange[ind]?.min) &&
                parseFloat(items[index]?.price) < parseFloat(supplierData?.markUpRange[ind]?.max)
              ) {
                markUp = supplierData?.markUpRange[ind]?.markUp
              }
            }
          }
          if(markUp == 0) markUp = storeData?.markUp
          
          const markUpAmount = parseFloat(items[index]?.price) * (parseFloat(markUp) / 100)
  
          const initialPrice = (markUpAmount) + (parseFloat(handlingCost) + parseFloat(shippingCost) + parseFloat(items[index]?.price))
          price = initialPrice ? initialPrice : 0
        }
        
        console.log('price : ', parseFloat(price.toFixed(2)))
        
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
              (items[index]?.quantity - supplierData?.quantityOffset) <
              storeData?.quantityOffset[index]?.quantity
                ? (items[index]?.quantity - supplierData?.quantityOffset)
                : storeData?.quantityOffset[index]?.quantity;
          }
        }
  
        console.log('quantity : ', requiredQuantity)
  
        await this.reviseItem(
          element.item[0]?.ItemID[0],
          parseFloat(price.toFixed(2)),
          requiredQuantity,
          element.item[0]?.Title[0],
          store, 
          supplier,
          oAuthToken
        );
      }
    }
  }catch(err){
    throw new Error(err)
  }
};

exports.addNewListings = async (items) => {
  for (let index = 0; index < items.length; index++) {
    const inventory = [
      ...items[index].inventory.map((rec) => {
        return { name: rec.warehouse, value: rec.quantity };
      })
    ];

    await this.addItem(items[index].productName, items[index].itemNumber, items[index].brand, parseFloat(items[index].price), inventory)
  }
};

exports.fetchListingsAndPopulateDB = async (store = "ebaystore@test.com", supplier, oAuthToken) => {
  try{
    const ebayListings = await getMyEbaySelling(oAuthToken)
    console.log('len : ', ebayListings.length)
    for (let index = 0; index < ebayListings.length; index++) {
      await this.getItem(ebayListings[index].ItemID[0], store, supplier, oAuthToken)
    }
  
    return true
  }catch(err){
    throw new Error(err)
  }
}