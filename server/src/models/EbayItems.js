const mongoose = require("mongoose");

const ebayItemsSchema = new mongoose.Schema(
  { itemId: mongoose.Schema.Types.String,
    cost: mongoose.Schema.Types.Number,
    previousQuantity: mongoose.Schema.Types.Number,
    previousPrice: mongoose.Schema.Types.Number,
    store: mongoose.Schema.Types.String,
    supplier: mongoose.Schema.Types.String,
    item: mongoose.Schema.Types.Mixed,
    fixedPrice: mongoose.Schema.Types.Boolean
  },
  {
    timestamps: true,
  }
);

const EbayItems = mongoose.model("EbayItems", ebayItemsSchema, "ebay_items");
module.exports = EbayItems;
