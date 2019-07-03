const express = require('express');
const router = express.Router();
const Product = require('../models/Product')


router.get('/:name', (req, res) => {
  Product.findOne({
    name: req.params.name
  })
    .then( (product) => {
      if (product === null) {
        throw new Error()
      }
      res.status(200).json(product)
    })
    .catch( (error) => {
      res.status(404).json({
        error: 'Product not found'
      })
    })
})

router.get('/', (req, res) => {
  Product.find()
    .then( (products) => {
      res.status(200).json(products);
    })
    .catch( (error) => {
      res.status(400).json({
        error: error
      })
    })
})


router.post('/', (req, res) => {
  const product = new Product({
    name: req.body.name,
    quantity: req.body.quantity,
    price: req.body.price
  })
  .save()
  .then( () => {
    res.status(201).json({
      message: 'Product stored successfully'
    })
  })
  .catch( (error) => {
    res.status(400).json({
      error: error.message
    })
  });
})

module.exports = router;