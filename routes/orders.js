const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Order = require('../models/Order');
const {
  getOrderFromDB,
  getProductFromDB,
  updateProductInDB
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
  if (req.body.quantity <= 0 || !req.body.quantity) {
    res.status(400).json({
      error: 'Please enter a positive number for quantity'
    });
  } else {
    async function updateOrder(req, res) {
      const orderInfo = await getOrderFromDB(req);
      const productInfo = await getProductFromDB(req);

      if (orderInfo === (undefined || null)) {
        res.status(404).json({
          error: 'Order not found!'
        });
      } else if (productInfo === (undefined || null)) {
        res.status(404).json({
          error: 'Product not found!'
        });
      } else if (
        orderInfo.quantity + productInfo.quantity <
        req.body.quantity
      ) {
        res.status(404).json({
          error: `Unavailable quantity for this product. Quantity available: ${productInfo.quantity +
            orderInfo.quantity}`
        });
      } else {
        const total_price = productInfo.price * req.body.quantity;
        productInfo.quantity =
          productInfo.quantity + orderInfo.quantity - req.body.quantity;

        const order = new Order({
          _id: req.params.id,
          product: req.body.product,
          quantity: req.body.quantity,
          total_price: total_price
        });
        console.log(order);
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
            updateProductInDB(productInfo);
          })
          .catch(error => {
            res.status(400).json({
              error: error.message
            });
          });
      }
    }
    updateOrder(req, res);
  }
});

router.delete('/:id', auth, (req, res) => {
  async function deleteOrder(req, res) {
    // retrieve info about the order to delete
    const orderInfo = await getOrderFromDB(req);

    if (orderInfo === (undefined || null)) {
      res.status(404).json({
        error: 'Order not found!'
      });
    } else {
      req.body.product = orderInfo.product;
      // With the name of the product, we get the product info needed
      const productInfo = await getProductFromDB(req);

      if (productInfo === (undefined || null)) {
        res.status(404).json({
          error: 'Product not found!'
        });
      }

      Order.deleteOne({
        _id: req.params.id,
        username: req.username
      })
        .then(() => {
          res.status(200).json({
            message: 'Order deleted!'
          });
          productInfo.quantity += orderInfo.quantity;
          updateProductInDB(productInfo);
        })
        .catch(error => {
          res.status(404).json({
            error: error.message
          });
        });
    }
  }
  deleteOrder(req, res);
});

router.get('/', auth, (req, res) => {
  Order.find({
    username: req.username
  })
    .then(orders => {
      if (orders.length === 0) {
        res.status(200).json({ message: 'No orders found' });
      } else {
        res.status(200).json({
          message: `You have ${orders.length} order(s):`,
          orders: orders
        });
      }
    })
    .catch(error => {
      res.status(400).json({
        error: error
      });
    });
});

router.post('/', auth, (req, res) => {
  if (req.body.quantity <= 0) {
    res.status(400).json({
      error: 'Please enter a positive number for quantity'
    });
  }
  async function postNewOrder(req, res) {
    const productInfo = await getProductFromDB(req);

    console.log(productInfo);

    if (productInfo === (undefined || null)) {
      res.status(404).json({
        error: 'Product not found!'
      });
    } else if (productInfo.quantity < req.body.quantity) {
      res.status(404).json({
        error: `Unavailable quantity for this product. Quantity available: ${
          productInfo.quantity
        }`
      });
    } else {
      const total_price = productInfo.price * req.body.quantity;
      productInfo.quantity = productInfo.quantity - req.body.quantity;

      const order = new Order({
        customer: req.body.customer,
        product: req.body.product,
        productID: productInfo._id,
        quantity: req.body.quantity,
        total_price: total_price,
        username: req.username
      })
        .save()
        .then(() => {
          res.send(
            `New order created! ${req.body.quantity} ${
              req.body.product
            }: ${total_price}$`
          );
          updateProductInDB(productInfo);
        })
        .catch(error => {
          res.status(400).json({
            error: error.message
          });
        });
    }
  }
  postNewOrder(req, res);
});

module.exports = router;
