const ebay = require('ebay-api');

const config = {
  production: false, // Set to true if using production environment
  authToken: process.env.O_AUTH_TOKEN,
  siteId: 0, // Replace with the appropriate eBay site ID
  compatLevel: 967, // Replace with the appropriate compatibility level
  verb: 'GetMyeBaySelling',
  detailLevel: 'ReturnAll',
  outputSelector: 'Item.ItemID,Item.Title,Item.ItemSpecifics',
};

ebay.xmlRequest(config, (error, response) => {
  if (error) {
    console.error('Error making eBay API request:', error);
    return;
  }

  const items = response.ItemArray.Item || [];
  items.forEach(item => {
    const itemID = item.ItemID;
    const title = item.Title;
    const itemSpecifics = item.ItemSpecifics.NameValueList || [];
    
    // Process the item data and specifics as needed
    console.log('Item ID:', itemID);
    console.log('Title:', title);
    console.log('Item Specifics:', itemSpecifics);
  });
});
