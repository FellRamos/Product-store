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

router.put('/:id', (req, res) => {
  const product = new Product({
    _id: req.params.id,
    name: req.body.name,
    quantity: req.body.quantity,
    price: req.body.price
  });
  Product.updateOne(
    {
      _id: req.params.id
    },
    product
  )
    .then(() => {
      res.status(201).json({
        message: 'Product updated successfully'
      });
    })
    .catch(error => {
      res.status(400).json({
        error: error
      });
    });
});

router.delete('/:id', auth, (req, res) => {
  Product.deleteOne({ _id: req.params.id })
    .then(() => {
      res.status(200).json({
        message: 'Product deleted!'
      });
    })
    .catch(error => {
      res.status(404).json({
        error: error
      });
    });
});

router.get('/', auth, (req, res) => {
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

router.post('/', auth, (req, res) => {
  const product = new Product({
    name: req.body.name,
    quantity: req.body.quantity,
    price: req.body.price,
    token: req.token
  })
    .save()
    .then(() => {
      res.status(201).json({
        message: 'Product stored successfully'
      });
    })
    .catch(error => {
      res.status(400).json({
        error: error.message
      });
    });
});

module.exports = router;
