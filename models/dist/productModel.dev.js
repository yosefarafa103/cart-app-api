"use strict";

var _require = require("mongoose"),
    Schema = _require.Schema,
    model = _require.model;

var productSchema = new Schema({
  productName: {
    type: String,
    required: [true, "product Name is required "]
  },
  price: {
    type: Number,
    required: [true, "price is required "]
  },
  commentedBy: {
    type: [Schema.ObjectId],
    ref: "User",
    required: [true, "please provide user he commented this product"]
  },
  images: {
    type: [String],
    "default": []
  },
  comments: {
    type: [String],
    "default": [],
    ref: "Comment" // required: [true, "please provide user he commented this product"],

  }
}, {
  virtuals: true
}); // index to product name to speed up searching

productSchema.index({
  productName: 1
}, {});
productSchema.virtual("finalPrice").get(function () {
  return this.price - 10;
});
var productModel = new model("Product", productSchema);
module.exports = productModel;