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

// Commented routes for testing

// router.post('/', (req, res) => {
//   const product = new Product({
//     name: req.body.name,
//     quantity: req.body.quantity,
//     price: req.body.price
//   })
//     .save()
//     .then(() => {
//       res.status(201).json({
//         message: 'New product added'
//       });
//     })
//     .catch(error => {
//       res.status(400).json({
//         error: error.message
//       });
//     });
// });

// router.put('/:id', (req, res) => {
//   const product = new Product({
//     _id: req.params.id,
//     name: req.body.name,
//     quantity: req.body.quantity,
//     price: req.body.price
//   });
//   Product.updateOne(
//     {
//       _id: req.params.id
//     },
//     product
//   )
//     .then(() => {
//       res.status(201).json({
//         message: 'Product updated'
//       });
//     })
//     .catch(error => {
//       res.status(400).json({
//         error: error.message
//       });
//     });
// });

module.exports = router;
