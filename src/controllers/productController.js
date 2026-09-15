const AppError = require("../utils/AppError");
const Products = require("../models/Product");
const { validateCreateProduct } = require("../validation/productValidation");
const { dataUri } = require("../utils/multer");
const { uploader } = require("../utils/cloudinary");

// create new products
const createNewProduct = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new AppError("Please upload product image with field name product_image", 400);
    }

    const fileData = dataUri(req).content;
    const result = await uploader.upload(fileData, {
      folder: "Augustbackend/Product",
    });

    const userId = req.user._id;

    const validation = validateCreateProduct(req.body);

    if (validation.error) {
      throw new AppError(validation.error.message, 400);
    }

    const { title, description, price } = req.body;

    const newProduct = await Products.create({
      title,
      description,
      price,
      user: userId,
      product_image: result.secure_url,
    });

    if (!newProduct) {
      throw new AppError("An error occurred while creating product", 400);
    }

    res.status(201).json({
      status: "successful",
      message: "Product created successfully",
      data: {
        product: newProduct,
      },
    });
  } catch (error) {
    next(error);
  }
};

// get all products
const getAllProducts = async (req, res, next) => {
  try {
    const products = await Products.find();

    res.status(200).json({
      status: "successful",
      message: "Products fetched successfully",
      results: products.length,
      data: {
        products,
      },
    });
  } catch (error) {
    next(error);
  }
};

// get product details
const getProductDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Products.findById(id);

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    res.status(200).json({
      status: "successful",
      message: "Product details fetched successfully",
      data: {
        product,
      },
    });
  } catch (error) {
    next(error);
  }
};

// update product
const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    let updateData = { ...req.body };

    if (req.file) {
      const fileData = dataUri(req).content;
      const result = await uploader.upload(fileData, {
        folder: "Augustbackend/Product",
      });
      updateData.product_image = result.secure_url;
    }

    const updatedProduct = await Products.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      throw new AppError("Product not found", 404);
    }

    res.status(200).json({
      status: "successful",
      message: "Product updated successfully",
      data: {
        product: updatedProduct,
      },
    });
  } catch (error) {
    next(error);
  }
};

// delete product
const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Products.findByIdAndDelete(id);

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    res.status(200).json({
      status: "successful",
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createNewProduct,
  getAllProducts,
  getProductDetails,
  updateProduct,
  deleteProduct,
};