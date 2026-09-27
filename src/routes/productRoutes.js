const express = require("express");

const productController = require("../controllers/productController");
const authMiddleware = require("../middleware/authMiddleware");

const { imageUploads } = require("../utils/multer");

const router = express.Router();

// Create new product
router.route("/createproduct").post(authMiddleware.protectRoute, imageUploads, productController.createNewProduct);

// Get all products - updated to match class documentation
router.route("/getallproduct").get(productController.getAllProducts);

// Get, update, and delete product details by ID
router
  .route("/:id")
  .get(productController.getProductDetails)
  .patch(authMiddleware.protectRoute, imageUploads, productController.updateProduct)
  .delete(authMiddleware.protectRoute, productController.deleteProduct);

module.exports = router;