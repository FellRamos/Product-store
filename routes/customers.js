const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const Customer = require('../models/Customer');

router.get('/', (req, res) => {
  Customer.find()
    .then(customers => {
      if (customers.length === 0) {
        res.status(200).json({ message: 'There are no customers' });
      } else {
        const customersInfo = [];
        customers.forEach(customer => {
          customersInfo.push({
            name: customer.name,
            surname: customer.surname,
            contact: customer.contact
          });
        });

        res.status(200).json(customersInfo);
      }
    })
    .catch(error => {
      res.status(400).json({
        error: error
      });
    });
});

router.post('/signup', (req, res) => {
  Customer.findOne({
    username: req.body.username
  }).then(customer => {
    if (customer) {
      return res.status(409).json({
        error: 'Customer already exists'
      });
    }
    try {
      bcrypt.hash(req.body.password, 10, (error, hash) => {
        const customer = new Customer({
          username: req.body.username,
          password: hash,
          name: req.body.name,
          surname: req.body.surname,
          contact: req.body.contact
        })
          .save()
          .then(() => {
            res.status(201).json({
              message: 'Customer added successfully'
            });
          })
          .catch(error => {
            res.status(500).json({
              error: error.message
            });
          });
      });
    } catch {
      res.status(400).json({
        error: error
      });
    }
  });
});

router.post('/login', (req, res) => {
  Customer.findOne({
    username: req.body.username
  })
    .then(customer => {
      if (!customer) {
        return res.status(404).json({
          error: 'Customer not found'
        });
      }
      bcrypt
        .compare(req.body.password, customer.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({
              error: 'Incorrect password!'
            });
          }
          const token = jwt.sign(
            { username: customer.username },
            'token_secret',
            { expiresIn: '24h' }
          );
          res.status(200).json({
            username: customer.username,
            token: token
          });
        })
        .catch(error => {
          res.status(500).json({
            error: error.message
          });
        });
    })
    .catch(error => {
      res.status(500).json({
        error: error.message
      });
    });
});

module.exports = router;
