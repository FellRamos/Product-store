const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const Customer = require('../models/Customer');

// router.get('/:id', (req, res) => {
//   Customer.findOne({
//     _id: req.params.id
//   })
//     .then(customer => {
//       res.status(200).json(customer);
//     })
//     .catch(error => {
//       res.status(404).json({
//         error: 'Customer not found'
//       });
//     });
// });

// router.put('/:id', (req, res) => {
//   const customer = new Customer({
//     _id: req.params.id,
//     name: req.body.name,
//     surname: req.body.surname,
//     contact: req.body.contact
//   });
//   Customer.updateOne(
//     {
//       _id: req.params.id
//     },
//     customer
//   )
//     .then(() => {
//       res.status(200).json({
//         message: 'Customer updated successfully'
//       });
//     })
//     .catch(error => {
//       res.status(400).json({
//         error: error.message
//       });
//     });
// });

// router.delete('/:id', (req, res) => {
//   Customer.deleteOne({
//     _id: req.params.id
//   })
//     .then(() => {
//       res.status(200).json({
//         message: `Customer deleted`
//       });
//     })
//     .catch(error => {
//       res.status(404).json({
//         error: 'Customer not found'
//       });
//     });
// });

// router.post('/', (req, res) => {
//   const customer = new Customer({
//     name: req.body.name,
//     surname: req.body.surname,
//     contact: req.body.contact
//   })
//     .save()
//     .then(() => {
//       res.status(201).json({
//         message: 'New customer added!'
//       });
//     })
//     .catch(error => {
//       res.status(400).json({
//         error: error.message
//       });
//     });
// });

router.get('/', (req, res) => {
  Customer.find()
    .then(customers => {
      if (customers.length === 0) {
        res.status(200).json({ message: 'There are no customers' });
      } else {
        res.status(200).json(customers);
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
    bcrypt.hash(req.body.password, 10).then(hash => {
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
  });
});

router.post('/login', (req, res) => {
  Customer.findOne({
    username: req.body.username
  })
    .then(customer => {
      if (!customer) {
        return res.status(401).json({
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
            { customerId: customer._id },
            'ultra_secret_token_secret',
            { expiresIn: '24h' }
          );
          res.status(200).json({
            customerId: customer._id,
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
