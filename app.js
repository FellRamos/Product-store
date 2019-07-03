const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
require('dotenv').config();

// Requiring the routes
const customersRouter = require('./routes/customers');
const productsRouter = require('./routes/products');
const ordersRouter = require('./routes/orders');

// initializing express
const app = express();

// getting mongoose url:
const mongoURL = require('./config/database').mongoURI

mongoose.connect(mongoURL, {useNewUrlParser: true })
  .then( () => {
    console.log('Connected to MongoDB..')
  })
  .catch( (error) => {
    console.log('Unable to connect to MondoDB!');
    console.error(error);
  })

app.use(morgan('short'));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(express.json());
app.use(express.urlencoded({extended: true}))


app.use('/customers', customersRouter);
app.use('/products', productsRouter)
app.use('/orders', ordersRouter)



module.exports = app;