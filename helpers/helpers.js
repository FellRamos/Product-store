const Product = require('../models/Product');
const Order = require('../models/Order');

function deleteOrderInDB(req, res) {
  return Order.deleteOne({
    _id: req.params.id,
    username: req.username
  })
    .then(() => {
      res.status(200).json({
        message: `Order ${req.params.id} deleted!`
      });
    })
    .catch(error => {
      res.status(404).json({
        error: 'Order not found'
      });
    });
}

// **********************************

function getOrderFromDB(req) {
  return Order.findOne({
    _id: req.params.id
  })
    .then(product => product)
    .catch(error => error);
}

function getProductFromDB(req) {
  return Product.findOne({
    name: req.body.product
  })
    .then(product => product)
    .catch(error => error);
}

function updateProductInDB(productFound) {
  const product = new Product({
    _id: productFound._id,
    name: productFound.name,
    price: productFound.price,
    quantity: productFound.quantity
  });
  Product.updateOne(
    {
      _id: productFound._id
    },
    product
  )
    .then(() => {
      console.log('Updated in Products DB');
    })
    .catch(error => {
      console.log(error);
    });
}

module.exports = { getOrderFromDB, getProductFromDB, updateProductInDB };
