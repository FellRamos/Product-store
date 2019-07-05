const Product = require('../models/Product');

function checkProduct(request) {
  return new Promise((resolve, reject) => {
    const quantityWanted = request.body.quantity;
    const productWanted = request.body.product;
    Product.findOne({
      name: productWanted
    })
      .then(product => {
        if (!product) {
          reject(
            new Error({
              message: "We don't have this product"
            })
          );
        } else if (product.quantity < quantityWanted) {
          reject(
            new Error(
              `We don't have this quantity available. Quantity available: ${
                product.quantity
              }`
            )
          );
        } else {
          const total_price = product.price * quantityWanted;
          resolve(total_price);
        }
      })
      .catch(error => {
        error: error;
      });
  });
}

function checkProduct2(request) {
  return new Promise((resolve, reject) => {
    const quantityWanted = request.body.quantity;
    const productWanted = request.body.product;
    Product.findOne({
      name: productWanted
    })
      .then(product => {
        if (!product) {
          resolve(new Error("We don't have this product"));
        } else if (product.quantity < quantityWanted) {
          resolve(
            new Error(
              `We don't have this quantity available. Quantity available: ${
                product.quantity
              }`
            )
          );
        } else {
          const total_price = product.price * quantityWanted;
          resolve(total_price);
        }
      })
      .catch(error => {
        error: error;
      });
  });
}

module.exports = { checkProduct2 };
