const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  console.log(req.body);
  res.status(201).send(req.body.name)

})


router.get('/', (req, res) => {
  const customer = {
    id: 1,
    name: 'John2',
    surname: "doe",
    contact: {
      phone: 993098938,
      mail: 'john@gmail.com'
    }
  }
  res.status(200).send(customer)
})

module.exports = router;