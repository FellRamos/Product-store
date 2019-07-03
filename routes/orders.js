const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  console.log('Orders route')
  res.status(200).send('Orders route')
})

module.exports = router;