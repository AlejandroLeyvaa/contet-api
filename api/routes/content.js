const express = require('express');
const passport = require('passport');
const ContentService = require('../services/content');

const {
  postIdSchema,
  createPostSchema,
  updatePostSchema,
} = require('../utils/schemas/content');

const validationHandler = require('../utils/middleware/validationHandler');
const scopesValidationHandler = require('../utils/middleware/scopesValidation')

const cacheResponse = require('../utils/cacheResponse');
const {
  FIVE_MINUTES_IN_SECONDS,
  SIXTY_MINUTES_IN_SECONDS
} = require('../utils/time');
const content = require('../utils/schemas/content');

// JWT strategy
require('../utils/auth/strategies/jwt');

function contentApi(app) {
  const router = express.Router();
  app.use('/api/content', router);

  const contentService = new ContentService();

  router.get('/',
  // passport.authenticate('jwt', { session: false }),
  // scopesValidationHandler(['read:content']),
  async function(req, res, next) {
    cacheResponse(res, FIVE_MINUTES_IN_SECONDS);
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

  router.get('/:contentId', async (req, res, next) => {
    const { contentId } = req.params;

    try {
      const content = await contentService.getOnePost({ contentId });

      res.status(200).json({
        data: content,
        message: 'content retrieved'
      });
    } catch(err) {
      next(err);
    }
  });

  router.post('/',
  // passport.authenticate('jwt', { session: false }),
  // scopesValidationHandler(['create:content']),
  validationHandler(createPostSchema), async function(
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