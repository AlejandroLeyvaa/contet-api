const express = require('express');
const ProductsService = require('../services/products');

const {
  productIdSchema,
  createProductSchema,
  updateProductSchema,
} = require('../utils/schemas/pruducts');

const validationHandler = require('../utils/middleware/validationHandler');

function productsApi(app) {
  const router = express.Router();
  app.use('/api/products', router);

  const productsService = new ProductsService();

  router.get('/', async function(req, res, next) {
    const { tags } = req.query;

    try {
      const products = await productsService.getAllProducts({ tags });
      res.status(200).json({
        data: products,
        message: 'products listed'
      });
    } catch (err) {
      next(err);
    }
  });

  router.post('/', validationHandler(createProductSchema), async function(
    req,
    res,
    next
  ) {
    const { body: product } = req;

    try {
      const createdProductId = await productsService.createProduct({ product });

      res.status(201).json({
        data: createdProductId,
        message: 'product created'
      });
    } catch (err) {
      next(err);
    }
  });
};

module.exports = productsApi;