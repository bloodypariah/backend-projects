const express = require("express");
const Product = require("../models/Product.js");
const auth = require("../auth.js");

// Controllers

// Add product(admin)
module.exports.addNewProduct = (req, res) => {
  const reqBody = req.body;

  const newProduct = new Product({
    name: reqBody.name,
    description: reqBody.description,
    price: reqBody.price,
    category: reqBody.category,
    isActive: reqBody.isActive,
  });

  // Add product
  newProduct
    .save()
    .then((save) => {
      return res.send(true);
    })
    .catch((err) => {
      return res.send(false);
    });
};

// Retrieve all products
module.exports.getAllProducts = (req, res) => {
  Product.find({})
    .then((result) => {
      return res.send(result);
    })
    .catch((err) => res.send("The beholder's hoarding all the inventory!"));
};

// Retrieve a single product using productId for Admin only
module.exports.getProduct = (req, res) => {
  const reqParams = req.params.productId;

  Product.findById(reqParams)
    .then((result) => {
      if (!result) {
        return res.status(404).json({ message: "Product not found" });
      }
      return res.json(result);
    })
    .catch((err) => res.status(500).json({ message: "Internal Server Error" }));
};

module.exports.updateProductInfo = (req, res) => {
  const reqParams = req.params.productInfo;

  const updatedProduct = {
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
  };

  Product.findOneAndUpdate(reqParams, updatedProduct)
    .then((result) => {
      if (result) {
        return res.send(true);
      } else {
        return res.send(false);
      }
    })
    .catch((error) => res.send(error));
};

// Retrieve all active products
module.exports.getActiveProducts = (req, res) => {
  Product.find({ isActive: true })
    .then((result) => {
      return res.send(result);
    })
    .catch((err) => res.send("The beholder is at it again!"));
};

module.exports.searchProduct = async (req, res) => {
  try {
    const { productName } = req.body;

    // Validate input

    // Query active products by name
    const products = await Product.find({
      name: { $regex: new RegExp(productName, "i") },
      isActive: true,
    });
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.archiveProduct = async (req, res) => {
  try {
    const reqParams = req.params.productId;

    const updatedProduct = await Product.findByIdAndUpdate(
      reqParams,
      { isActive: false },
      { new: true },
    );

    if (!updatedProduct) {
      return res
        .status(404)
        .json({ message: "Xanathar's red balls! Product not found" });
    }

    return res.json({
      message: "Sweet Oghma! Product successfully archived",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ message: "Xanathar's red balls!" });
  }
};

module.exports.activateProduct = async (req, res) => {
  try {
    const reqParams = req.params.productId;

    const updatedProduct = await Product.findByIdAndUpdate(
      reqParams,
      { isActive: true },
      { new: true },
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Xanathar's red balls!" });
    }

    return res.json({
      message: "Waukeen's Blessing! Product successfully activated",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ message: "Xanathar's red balls!" });
  }
};
