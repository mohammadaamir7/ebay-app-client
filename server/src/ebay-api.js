const axios = require("axios");
const xml2js = require("xml2js");

const endpoint = "https://api.sandbox.ebay.com/ws/api.dll";
const oauthToken =
  "v^1.1#i^1#f^0#p^3#r^0#I^3#t^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";

  const xmlPayload = `
  <?xml version="1.0" encoding="utf-8"?>
  <GetMyeBaySellingRequest xmlns="urn:ebay:apis:eBLBaseComponents">
    <RequesterCredentials>
      <eBayAuthToken>${oauthToken}</eBayAuthToken>
    </RequesterCredentials>
    <ActiveList>
      <Sort>TimeLeft</Sort>
      <Pagination>
        <EntriesPerPage>3</EntriesPerPage>
        <PageNumber>1</PageNumber>
      </Pagination>
    </ActiveList>
  </GetMyeBaySellingRequest>
`;

// Construct headers for the request
const headers = {
  "X-EBAY-API-CALL-NAME": "GetMyeBaySelling",
  "X-EBAY-API-SITEID": "0", // Change to the appropriate site ID
  "X-EBAY-API-COMPATIBILITY-LEVEL": "967", // Replace with the required compatibility level
  "Content-Type": "text/xml",
};

// Make the API request
axios
  .post(endpoint, xmlPayload, { headers })
  .then((response) => {
    xml2js.parseString(response.data, (error, result) => {
      if (error) {
        console.error('Error parsing eBay API response:', error);
      } else {
        console.log('eBay API Response:', JSON.stringify(result, null, 2));
        // Handle the eBay API response data here
      }
    });
  })
  .catch((error) => {
    console.error('Error making eBay API request:', error);
  });

// const itemId = '110554323264'
// const newPrice = parseFloat(210.5)
// const xmlPayload = `
// <?xml version="1.0" encoding="utf-8"?>
// <ReviseItemRequest xmlns="urn:ebay:apis:eBLBaseComponents">
//   <RequesterCredentials>
//     <eBayAuthToken>${oauthToken}</eBayAuthToken>
//   </RequesterCredentials>
//   <Item>
//     <ItemID>${itemId}</ItemID>
//     <StartPrice>${newPrice}</StartPrice>
//   </Item>
// </ReviseItemRequest>

// `;
// const title = "Wattbox WB-400-8 / 8 Outlet Rack Mountable Power Strip FREE SHIPPING BRAND NEW"
// // Construct headers for the request
// const headers = {
//   "X-EBAY-API-CALL-NAME": "ReviseItem",
//   "X-EBAY-API-SITEID": "0", // Change to the appropriate site ID
//   "X-EBAY-API-COMPATIBILITY-LEVEL": "967", // Replace with the required compatibility level
//   "Content-Type": "text/xml",
// };

// // Make the API request
// axios
//   .post(endpoint, xmlPayload, { headers })
//   .then((response) => {
//     xml2js.parseString(response.data, (error, result) => {
//       if (error) {
//         console.error("Error parsing eBay API response:", error);
//       } else {
//         console.log("eBay API Response:", JSON.stringify(result, null, 2));
//         // Handle the eBay API response data here
//       }
//     });
//   })
//   .catch((error) => {
//     console.error("Error making eBay API request:", error);
//   });


// const itemId = '110554323275'
// const newPrice = parseFloat(210.5)
// const xmlPayload = `
// <?xml version="1.0" encoding="utf-8"?>
// <GetItemRequest xmlns="urn:ebay:apis:eBLBaseComponents">
//   <RequesterCredentials>
//     <eBayAuthToken>${oauthToken}</eBayAuthToken>
//   </RequesterCredentials>
//   <ItemID>${itemId}</ItemID>
// </GetItemRequest>

// `;
// const title = "Wattbox WB-400-8 / 8 Outlet Rack Mountable Power Strip FREE SHIPPING BRAND NEW"
// // Construct headers for the request
// const headers = {
//   "X-EBAY-API-CALL-NAME": "GetItem",
//   "X-EBAY-API-SITEID": "0", // Change to the appropriate site ID
//   "X-EBAY-API-COMPATIBILITY-LEVEL": "1227", // Replace with the required compatibility level
//   "Content-Type": "text/xml",
// };

// // Make the API request
// axios
//   .post(endpoint, xmlPayload, { headers })
//   .then((response) => {
//     xml2js.parseString(response.data, (error, result) => {
//       if (error) {
//         console.error("Error parsing eBay API response:", error);
//       } else {
//         console.log("eBay API Response:", JSON.stringify(result, null, 2));
//         // Handle the eBay API response data here
//       }
//     });
//   })
//   .catch((error) => {
//     console.error("Error making eBay API request:", error);
//   });
