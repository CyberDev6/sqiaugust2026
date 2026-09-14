const express = require("express");

const productController = require("../controllers/productController");
const authMiddleware = require("../middleware/authMiddleware");

const {imageUploads} = require("../utils/multer");
const { model } = require("mongoose");

const router = express.Router();

router.route("/createproduct").post(authMiddleware.protectRoute, imageUploads, productController.createNewProduct)


module.exports = router;