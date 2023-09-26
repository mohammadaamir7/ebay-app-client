const axios = require("axios")

axios.post("https://api.gumroad.com/v2/licenses/verify", {
  product_id: "o9lCcm8VdcNsHOHJEK7KKw==",
  license_key: "D25D857B-316447AC-BF9CB08C-08C96FA0",
}).then(res => console.log('res : ', res))
  .catch(err => console.log(err))

