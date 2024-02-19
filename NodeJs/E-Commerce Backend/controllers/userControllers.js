const express = require("express");
const User = require("../models/User.js");
const Product = require("../models/Product.js");

const bcrypt = require("bcrypt");
const auth = require("../auth.js");

// Controllers

// Check if email exists
module.exports.checkEmailExists = (req, res, next) => {
  User.find({ email: req.body.email })
    .then((result) => {
      if (result.length > 0) {
        return res.json({ emailExists: true });
      } else {
        next();
      }
    })
    .catch((err) => res.status(500).json({ emailExists: false }));
};

// User registration
module.exports.registerUser = (req, res) => {
  const reqBody = req.body;

  const newUser = new User({
    email: reqBody.email,
    password: bcrypt.hashSync(reqBody.password, 10),
  });

  newUser
    .save()
    .then((save) => {
      return res.json({ registrationSuccess: true });
    })
    .catch((err) => res.status(500).json({ registrationSuccess: false }));
};

// User Login
module.exports.loginUser = (req, res) => {
  const reqBody = req.body;

  User.findOne({ email: reqBody.email }).then((result) => {
    if (result === null) {
      return res.send({ loginSuccess: false });
    } else {
      const isPasswordCorrect = bcrypt.compareSync(
        reqBody.password,
        result.password,
      );

      if (isPasswordCorrect) {
        const token = auth.createAccessToken(result);
        return res.json({ loginSuccess: true, key: token });
      } else {
        return res.json({ loginSuccess: false });
      }
    }
  });
};

// Order Checkout (Verified but non admin user)

module.exports.createOrder = async (req, res) => {
  const { productId, quantity } = req.body;
  // Check if the user is and admin
  if (!req.user || req.user.isAdmin) {
    return res.status(403).json({
      message:
        "By Morradin's Beard! Only sanctioned adventurers are allowed to procure items.",
    });
  }
  // Validate input
  if (!productId || !quantity || isNaN(quantity) || quantity <= 0) {
    return res.status(400).json({
      message: "Cyric's Black Heart! You provided the wrong value",
    });
  }

  try {
    // Find the product
    const product = await Product.findById(productId);

    if (!product || !product.isActive) {
      return res
        .status(404)
        .json({ message: "Shadow's breath! No item found!" });
    }

    // Calculate total amount
    const totalAmount = product.price * quantity;

    // Find and update the user with the new order
    const user = await User.findById(req.user.id);
    const order = {
      products: [
        {
          productId: product._id,
          productName: product.name,
          quantity: quantity,
        },
      ],
      totalAmount: totalAmount,
      purchasedOn: new Date(),
    };
    user.orderedProduct.push(order);
    await user.save();

    // const orderId = await User.findById(orderedProduct.id);

    // Update the product with the user order
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        $push: {
          userOrders: {
            userId: user._id,
            orderId: user.orderedProduct._id,
          },
        },
      },
      { new: true },
    );
    await updatedProduct.save();
    if (!updatedProduct) {
      return res.status(500).json({ message: "Cyric's Black Heart!" });
    }

    // Display Order
    return res.json({
      message: "The dance of commerce is a symphony of abundance!",
      adventurer: user.email,
      order: order,
    });
  } catch (error) {
    return res.status(500).json({ message: "Cyric's Black Heart!" });
  }
};

// Retrieve User details
module.exports.getUserDetails = (req, res) => {
  User.findById(req.user.id)
    .then((result) => {
      return res.send(result);
    })
    .catch((error) => res.send(error));
};

// Set User as Admin
module.exports.updateAsAdmin = async (req, res) => {
  try {
    //Check if the user is admin
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Cyric's Black Heart!" });
    }
    const { userId } = req.body;
    //update to admin
    await User.findByIdAndUpdate(userId, { isAdmin: true });
    res.status(401).json({ message: "Yes my lord!" });
  } catch (error) {
    res.status(500).json({ message: "Cyric's Black Heart!" });
  }
};

// Get authenticated user's orders
module.exports.displayOrders = async (req, res) => {
  try {
    const result = await User.findById(req.params.userId);
    if (!result) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json(result.orderedProduct);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
// Display all the orders. Admin only
module.exports.displayAllOrders = async (req, res) => {
  try {
    // Ensure the user is an admin
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({
        message: "Permission denied. Only admins can view all orders.",
      });
    }

    // Find all users who have ordered products and retrieve their orderedProduct details
    const usersWithOrders = await User.find({
      orderedProduct: { $exists: true, $ne: [] },
    });

    // Extract and flatten orderedProduct details
    const orderedProducts = usersWithOrders.flatMap(
      (user) => user.orderedProduct,
    );

    return res.json(orderedProducts);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
