const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

router.get('/:id', (req, res) => {
  Order.findOne({
    _id: req.params.id
  })
    .then(order => {
      res.status(200).json(order);
    })
    .catch(error => {
      res.status(404).json({
        error: 'Order not found'
      });
    });
});

router.put('/:id', (req, res) => {
  const order = new Order({
    _id: req.params.id,
    customer: req.body.customer,
    product: req.body.product,
    quantity: req.body.quantity,
    total_price: req.body.total_price
  });
  Order.updateOne(
    {
      _id: req.params.id
    },
    order
  )
    .then(() => {
      res.status(200).json({
        message: 'Order updated successfully'
      });
    })
    .catch(error => {
      res.status(400).json({
        error: error.message
      });
    });
});

router.delete('/:id', (req, res) => {
  Order.deleteOne({
    _id: req.params.id
  })
    .then(() => {
      res.status(200).json({
        message: 'Order deleted!'
      });
    })
    .catch(error => {
      res.status(400).json({
        error: error.message
      });
    });
});

router.get('/', (req, res) => {
  Order.find()
    .then(orders => {
      if (orders.length === 0) {
        res.status(200).json({ message: 'No orders found' });
      } else {
        res.status(200).json(orders);
      }
    })
    .catch(error => {
      res.status(400).json({
        error: error
      });
    });
});

router.post('/', (req, res) => {
  const order = new Order({
    customer: req.body.customer,
    product: req.body.product,
    quantity: req.body.quantity,
    total_price: req.body.total_price
  })
    .save()
    .then(() => {
      res.status(201).json({
        message: 'Order created successfully'
      });
    })
    .catch(error => {
      res.status(400).json({
        error: error.message
      });
    });
});

module.exports = router;
