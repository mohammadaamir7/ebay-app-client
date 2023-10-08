const mongoose = require("mongoose");

const ebayItemsSchema = new mongoose.Schema(
  { itemId: mongoose.Schema.Types.String,
    cost: mongoose.Schema.Types.Number,
    previousQuantity: mongoose.Schema.Types.Number,
    price: mongoose.Schema.Types.Number,
    quantity: mongoose.Schema.Types.Number,
    soldQuantity: mongoose.Schema.Types.Number,
    title: mongoose.Schema.Types.String,
    brand: mongoose.Schema.Types.String,
    sku: mongoose.Schema.Types.String,
    store: mongoose.Schema.Types.String,
    supplier: mongoose.Schema.Types.String,
    item: mongoose.Schema.Types.Mixed,
    fixedPrice: mongoose.Schema.Types.Boolean,
    synced: mongoose.Schema.Types.Boolean
  },
  {
    timestamps: true,
  }
);

const EbayItems = mongoose.model("EbayItems", ebayItemsSchema, "ebay_items");
module.exports = EbayItems;
