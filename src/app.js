const express = require('express');
const path = require('path');
const serverless = require('serverless-http');
const cookieSession = require('cookie-session');
const createError = require('http-errors');
const bodyParser = require('body-parser');

const FeedbackService = require('./services/FeedbackService');
const ProductsService = require('./services/ProductService');

const feedbackService = new FeedbackService('./data/feedback.json');
const productsService = new ProductsService('./data/products.json');

const routes = require('./routes');

const app = express();

app.locals.siteName = 'Lavanese';
app.locals.siteSlogan = 'The ultimate cake shop';
app.locals.currentYear = new Date().getFullYear();

app.set('trust proxy', 1);

app.use(
  cookieSession({
    name: 'session',
    keys: ['QAquo54JkXAlDcxZ', 'n2pAhfWkAGV8KV9j'],
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));

app.use(express.static(path.join(__dirname, './static')));

app.use(async (request, response, next) => {
  try {
    const names = await productsService.getNames();
    response.locals.productNames = names;
    return next();
  } catch (err) {
    return next(err);
  }
});

const expessRoutes = routes({
  feedbackService,
  productsService,
});

app.use(
  '/',
  expessRoutes
);

app.use((request, response, next) => {
  return next(createError(404, 'File not found'));
});

app.use((err, request, response, next) => {
  console.error(err);
  const status = err.status || 500;
  if (status == 500) {
    err.message = 'Oops something went wrong';
  }
  response.locals.message = err.message;
  response.locals.status = status;
  response.status(status);
  response.render('error');
});

app.use('/.netlify/functions/app', expessRoutes);
app.use('/', (req, res) => res.sendFile(path.join(__dirname, '../index.html')));

module.exports = app;
module.exports.handler = serverless(app);
