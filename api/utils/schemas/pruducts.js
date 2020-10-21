const joi = require('joi');

const productIdSchema = joi.string().regex(/^[0-9a-fA-F]{24}$/);
const productNameSchema = joi.string().max(80);
const productPriceSchema = joi.number();
const productImageSchema = joi.string().uri();
const productDescriptionSchema = joi().string().max(300);
const productTagSchema = joi.array().items(joi.string().max(50));

const createProductSchema = {
  Name: productNameSchema.required(),
  Price: productPriceSchema.required(),
  Image: productImageSchema.required(),
  Description: productDescriptionSchema.required(),
  Tag: productTagSchema.required(),
};

const updateProductSchema = {
  Name: productNameSchema,
  Price: productPriceSchema,
  Image: productImageSchema,
  Description: productDescriptionSchema,
  Tag: productTagSchema,
};

module.exports = {
  productIdSchema,
  createProductSchema,
  updateProductSchema,
};