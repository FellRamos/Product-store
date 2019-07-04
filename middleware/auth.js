const jwt = require('jsonwebtoken');

// module.exports = (req, res, next) => {
//   try {
//     const token = req.headers.authorization.split(' ')[1];
//     const decoded = jwt.verify(token, 'ultra_secret_token_secret');
//     const customerId = decoded.customerId;
//     if (req.body.customerId && req.body.customerId !== customerId) {
//       throw 'Invalid customer ID';
//     } else {
//       next();
//     }
//   } catch {
//     res.status(401).json({
//       error: 'Invalid Request'
//     });
//   }
// };

module.exports = (req, res, next) => {

  const bearerHeader = req.headers['authorization'];

  if (typeof bearerHeader !== 'undefined') {

    const token = bearerHeader.split(' ')[1];

    jwt.verify(token, 'token_secret', (error, authData) => {
      if (error) {
        res.status(403).json({
          error: "Not authorized! Wrong credentials"
        });
      } else {
        req.username = authData.username
      }
    })

    next()

  } else {
    res.status(403).json({
      error: "Not authorized! No credentials sent"
    });
  }

}
