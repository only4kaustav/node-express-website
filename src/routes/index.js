const express = require('express');

const productsRoute = require('./products');
const feedbackRoute = require('./feedback');

const router = express.Router();

module.exports = params => {
  const { productsService } = params;

  router.get('/', async (request, response, next) => {
    try {
      const gallerys = await productsService.getAllGallery();
      const topProducts = await productsService.getTopList();
      return response.render('layout', {
        pageTitle: 'Welcome',
        template: 'index',
        topProducts,
        gallerys,
      });
    } catch (err) {
      return next(err);
    }
  });

  router.use('/products', productsRoute(params));
  router.use('/feedback', feedbackRoute(params));

  return router;
};
