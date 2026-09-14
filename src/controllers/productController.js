const AppError = require("../utils/AppError");
const Products = require("../models/Product");
const { validateCreateProduct } = require("../validation/productValidation");
const { dataUri } = require("../utils/multer");
const { uploader } = require("../utils/cloudinary")

//create new products

const createNewProduct = async (req, res, next) =>{
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

        if(validation.error){
            throw new AppError(validation.error.message, 400);
        };

        const {title, description, price} = req.body;

        const newProduct = await Products.create({
            title,
            description,
            price,
            user: userId,
            product_image: result.secure_url,
        });

        if(!newProduct){
            throw new AppError("An error occured while creating product", 404)
        };

        res.status(201).json({
            status: "successful",
            message: "Product created succesfully",
            data: {
                product: newProduct
            }
        })
        
    } catch (error) {
        next(error)
    }
};

//getallProducts

//getproductdetails

module.exports = {
    createNewProduct
}