const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String },
    password: { type: String },
    redirectUrl: { type: String },
    markUp: { type: Number },
    useStoreMarkUp: { type: Boolean, default: true },
    oAuthToken: { type: String },
    quantityOffset: { type: [mongoose.Schema.Types.Mixed] },
    Suppliers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Supplier" }],
  },
  {
    timestamps: true,
  }
);

const Store = mongoose.model("Store", storeSchema, "store");
module.exports = Store;
