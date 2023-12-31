const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  productImage: { type: String },
  productSeller: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    email: String,
  },
});

module.exports = mongoose.model("Product", productSchema);
