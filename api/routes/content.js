const express = require('express');
const ContentService = require('../services/content');

const {
  postIdSchema,
  createPostSchema,
  updatePostSchema,
} = require('../utils/schemas/content');

const validationHandler = require('../utils/middleware/validationHandler');

function contentApi(app) {
  const router = express.Router();
  app.use('/api/content', router);

  const contentService = new ContentService();

  router.get('/', async function(req, res, next) {
    const { tags } = req.query;


    try {
      const content = await contentService.getAllContent({ tags });
      res.status(200).json({
        data: content,
        message: 'content listed'
      });
    } catch (err) {
      next(err);
    }
  });

  router.post('/', /*validationHandler(createPostSchema),*/ async function(
    req,
    res,
    next
  ) {
    const { body: content } = req;
    try {
      const createdContentId = await contentService.createContent({ content });

      res.status(201).json({
        data: createdContentId,
        message: 'content created'
      });
    } catch (err) {
      next(err);
    }
  });
};

module.exports = contentApi;