const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required!"],
  },
  password: {
    type: String,
    require: [true, "Password is required!"],
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  orderedProduct: [
    {
      products: [
        {
          productId: {
            type: ObjectId,
          },
          productName: {
            type: String,
          },
          quantity: {
            type: Number,
          },
        },
      ],
      totalAmount: {
        type: Number,
      },
      purchasedOn: {
        type: Date,
        default: new Date(),
      },
    },
  ],
});

const User = mongoose.model("user", userSchema);

module.exports = User;
