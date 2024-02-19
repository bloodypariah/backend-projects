const express = require("express");
const productControllers = require("../controllers/productControllers.js");

// Router
const router = express.Router();
const auth = require("../auth.js");
const { verify, verifyAdmin } = auth;
// Routes

// Add products(admin)
router.post(
  "/acquisition",
  verify,
  verifyAdmin,
  productControllers.addNewProduct,
);

// Retrieve All products
router.get(
  "/inventory",
  verify,
  verifyAdmin,
  productControllers.getAllProducts,
);

// Retrieve all active products
router.get("/wares", productControllers.getActiveProducts);

// Retrieve a single product using productId for Admin only
router.get("/:productId", productControllers.getProduct);

// Search for active products for customer use
router.post("/search-for-items", productControllers.searchProduct);

// Update Product information (Admin Only);
router.put(
  "/:productId/revise-item",
  verify,
  verifyAdmin,
  productControllers.updateProductInfo,
);
// Archive Product (Admin Only)
router.put(
  "/:productId/bury-treasure",
  verify,
  verifyAdmin,
  productControllers.archiveProduct,
);

// Activate Product (Admin Only)
router.put(
  "/:productId/uncover-treasure",
  verify,
  verifyAdmin,
  productControllers.activateProduct,
);

// Router exportable
module.exports = router;
