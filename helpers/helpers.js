const Product = require('../models/Product');
const Order = require('../models/Order');

// function checkProduct(request) {
//   return new Promise((resolve, reject) => {
//     const quantityWanted = request.body.quantity;
//     const productWanted = request.body.product;
//     Product.findOne({
//       name: productWanted
//     })
//       .then(product => {
//         if (!product) {
//           reject(
//             new Error({
//               message: "We don't have this product"
//             })
//           );
//         } else if (product.quantity < quantityWanted) {
//           reject(
//             new Error(
//               `We don't have this quantity available. Quantity available: ${
//                 product.quantity
//               }`
//             )
//           );
//         } else {
//           const total_price = product.price * quantityWanted;
//           resolve(total_price);
//         }
//       })
//       .catch(error => {
//         error: error;
//       });
//   });
// }

function postProduct(req, res) {
  return Product.findOne({
    name: req.body.product
  })
    .then(checkedProduct => {
      if (!checkedProduct) {
        throw new Error("We don't have this product");
      } else if (checkedProduct.quantity < req.body.quantity) {
        throw new Error(
          "We don't have enough quantity. Quantity available: " +
            checkedProduct.quantity
        );
      }

      const total_price = req.body.quantity * checkedProduct.price;

      const order = new Order({
        customer: req.body.customer,
        product: req.body.product,
        quantity: req.body.quantity,
        total_price: total_price,
        username: req.body.username
      }).save();
    })
    .then(() => {
      return res.status(201).json({
        message: 'Order created successfully'
      });
    })
    .catch(error => {
      return res.status(400).json({
        error: error.message
      });
    });
}

function getProductFromDB(req) {
  return Product.findOne({
    name: req.body.product
  })
    .then(product => {
      return product;
    })
    .catch(error => {
      res.status(500).json({
        error: error
      });
    });
}

function updateProductsInDB(req, res, productID) {
  const newQuantity = productID.quantity - req.body.quantity;
  const product = new Product({
    _id: productID._id,
    name: productID.name,
    quantity: newQuantity,
    price: productID.price
  });

  Product.updateOne(
    {
      _id: productID._id
    },
    product
  )
    .then(() => {
      res.status(200).json({
        message: 'Order updated successfully'
      });
    })
    .catch(error => {
      error: 'Order not found';
    });
}

module.exports = { postProduct, getProductFromDB, updateProductsInDB };
