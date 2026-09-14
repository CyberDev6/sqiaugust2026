const joi = require("joi");

const validateCreateProduct = (object)=>{
    const  schema = joi.object().keys({
        title: joi
        .string()
        .required()
        .error(new Error("Please provide title")),
        price: joi
        .number()
        .required()
        .min(500)
        .max(50000)
        .error(new Error("Please provide price")),
        description: joi
        .string()
        .required()
        .trim()
        .error(new Error("Please provide description"))

    });

    return schema.validate(object);
};

module.exports = {validateCreateProduct}