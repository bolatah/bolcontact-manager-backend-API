const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = (req, res, next) => {
  const token =
    req.body["x-access-token"] ||
    req.query["x-access-token"] ||
    req.headers["x-access-token"];

  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, config.TOKEN_KEY, function (err, decoded) {
      if (err) {
        return res.status(403).send({
          success: false,
          message: "Failed to authenticate token.",
        });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        // the next function is important since it must be called from a middleware for the next middleware to be executed
        //  If this function is not called then none of the other middleware including the controller action will be called.
        next();
      }
    });
  } else {
    // if there is no token, return an error
    res.status(403).send({
      success: false,
      message: "No token provided.",
    });
  }
};

module.exports = verifyToken;
