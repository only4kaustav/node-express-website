const express = require('express');

const router = express.Router();
const createError = require('http-errors');

module.exports = params => {
  const { productsService } = params;

  router.get('/', async (request, response, next) => {
    try {
      const products = await productsService.getList();
      const gallerys = await productsService.getAllGallery();
      return response.render('layout', {
        pageTitle: 'Products',
        template: 'products',
        products,
        gallerys,
      });
    } catch (err) {
      return next(err);
    }
  });

  router.get('/:shortname', async (request, response, next) => {
    try {
      const product = await productsService.getProduct(request.params.shortname);
      const related_products = await productsService.getRelatedProducts(request.params.shortname);
      const gallerys = await productsService.getGalleryForProduct(request.params.shortname);
      if(product) {
        return response.render('layout', {
          pageTitle: 'Products',
          template: 'product-detail',
          product,
          related_products,
          gallerys,
        });
      }
      else {
        return next(createError(404, 'Page not found'));
      }
    } catch (err) {
      return next(err);
    }
  });

  return router;
};
