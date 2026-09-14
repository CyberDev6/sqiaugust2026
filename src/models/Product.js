const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please provide product title"],
        unique: [true, "Title must be unique"],
        trim: true,
    },

    description: {
        type: String,
        required: [true, "Please provide product description"],
        unique: [true, "Description must be unique"],
        trim: true,
    },

    price: {
        type: Number,
        min: [500, "price must be greater than 499"],
        max: [50000, "Price must be less than 50000"],
        required: [true, "Please provide product price"],
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    product_image: {
        type: String,
        required: [true, "Please provide product image"],
    },


});

const Products = mongoose.model("Products", productSchema);

module.exports = Products;