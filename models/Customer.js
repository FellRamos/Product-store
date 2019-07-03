const mongoose = require('mongoose');

const customerSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  surname: {
    type: String,
    required: true
  },
  contact: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Customer', customerSchema);