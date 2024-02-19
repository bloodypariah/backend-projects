const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
  },
  category: {
    type: String,
    enum: [
      "Novella/Chapbooks(Fiction)",
      "Sava(Boardgames)",
      "Tomes(Campaign and Source Books)",
      "Compendium(Rulebook/Handbook)",
      "Accoutrements(Accessories)",
    ],
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdOn: {
    type: Date,
    default: new Date(),
  },
  userOrders: [
    {
      userId: {
        type: ObjectId,
      },
      orderId: {
        type: ObjectId,
      },
    },
  ],
});

const Product = mongoose.model("product", productSchema);

module.exports = Product;
