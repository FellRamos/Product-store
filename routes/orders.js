const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Order = require('../models/Order');
const {
  postProduct,
  getProductFromDB,
  updateProductsInDB
} = require('../helpers/helpers');
const Product = require('../models/Product');

router.get('/:id', auth, (req, res) => {
  Order.findOne({
    _id: req.params.id,
    username: req.username
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

router.put('/:id', auth, (req, res) => {
  const order = new Order({
    _id: req.params.id,
    customer: req.body.customer,
    product: req.body.product,
    quantity: req.body.quantity,
    total_price: req.body.total_price,
    username: req.body.username
  });
  Order.updateOne(
    {
      _id: req.params.id,
      username: req.username
    },
    order
  )
    .then(() => {
      res.status(200).json({
        message: 'Order updated successfully'
      });
    })
    .catch(error => {
      res.status(404).json({
        error: 'Order not found'
      });
    });
});

router.delete('/:id', auth, (req, res) => {
  Order.deleteOne({
    _id: req.params.id,
    username: req.username
  })
    .then(() => {
      res.status(200).json({
        message: 'Order deleted!'
      });
    })
    .catch(error => {
      res.status(404).json({
        error: 'Order not found'
      });
    });
});

router.get('/', auth, (req, res) => {
  Order.find({
    username: req.username
  })
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

router.post('/', auth, (req, res) => {
  async function postNewOrder(req, res) {
    const postOrder = await postProduct(req, res);

    if (postOrder.statusCode < 400) {
      const productID = await getProductFromDB(req);
      await updateProductsInDB(req, res, productID);
    }
  }

  postNewOrder(req, res);
});

module.exports = router;
