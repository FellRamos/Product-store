const express = require('express');
const router = express.Router();
const Product = require('../models/Product')

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
      error: error
    })
  });



})

module.exports = router;