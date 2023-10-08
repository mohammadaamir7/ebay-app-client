const mongoose = require('mongoose');
const { Schema } = mongoose;

const inventorySchema = new Schema({
    warehouse: { type: String },
    quantity: { type: Number },
});

const itemSchema = new Schema({
    site: { type: String },
    productName: { type: String },
    itemNumber: { type: String },
    msrp: { type: String },
    price: { type: Number },
    inventory: [inventorySchema],
    quantity: { type: Number },
    brand: { type: String },
    imageUrl: { type: String },
    itemUrl: { type: String },
    scrapedDate: { type: Date, default: Date.now },
    category: { type: String },
    options: { type: Array },
    description: { type: String },
});

const Item = mongoose.model('Item', itemSchema, 'items');

module.exports = Item;