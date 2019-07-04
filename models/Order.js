const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
  customer: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  product: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  total_price: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Order', orderSchema);