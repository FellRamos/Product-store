const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./openapi.yaml');
require('dotenv').config();

// Requiring the routes
const customersRouter = require('./routes/customers');
const productsRouter = require('./routes/products');
const ordersRouter = require('./routes/orders');

// initializing express
const app = express();

// getting mongoose url:
const mongoURL = require('./config/database').mongoURI;

mongoose
  .connect(mongoURL, { useNewUrlParser: true, useCreateIndex: true })
  .then(() => {
    console.log('Connected to MongoDB..');
  })
  .catch(error => {
    console.log('Unable to connect to MondoDB!');
    console.error(error);
  });

app.use(morgan('short'));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  );
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/customers', customersRouter);
app.use('/products', productsRouter);
app.use('/orders', ordersRouter);

const options = {
  customCss: '.swagger-ui .topbar { display: none }'
};
// Route for the API documentation
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));

module.exports = app;
