const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema(
  {
    name: { type: String },
    itemIdentifier: { type: String },
    quantityOffset: { type: [mongoose.Schema.Types.Mixed] },
    markUpRange: { type: [mongoose.Schema.Types.Mixed] },
    defaultQuantity: { type: Number, default: 0 },
    quantityAdjustment: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

const Supplier = mongoose.model("Supplier", supplierSchema, "supplier");
module.exports = Supplier;
