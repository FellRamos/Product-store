const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Product = require('../models/Product');

router.get('/:id', (req, res) => {
  Product.findOne({
    _id: req.params.id
  })
    .then(product => {
      res.status(200).json(product);
    })
    .catch(error => {
      res.status(404).json({
        error: 'Product not found'
      });
    });
});


router.get('/', (req, res) => {
  Product.find()
    .then(products => {
      res.status(200).json(products);
    })
    .catch(error => {
      res.status(400).json({
        error: error
      });
    });
});


module.exports = router;
