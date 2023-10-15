const mongoose = require("mongoose");

const brandsSchema = new mongoose.Schema(
  {
    name: { type: String },
  },
  {
    timestamps: true,
  }
);

const Brands = mongoose.model("Brands", brandsSchema, "brands");
module.exports = Brands;
