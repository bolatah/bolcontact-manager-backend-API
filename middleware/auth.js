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
        console.log(token);
        console.log(config.TOKEN_KEY);

        return res.status(403).send({
          success: false,
          message: "Failed to authenticate token.",
        });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;

        next();
      }
    });
  } else {
    // if there is no token, return an error
    return res.status(403).send({
      success: false,
      message: "No token provided.",
    });
  }
};

module.exports = verifyToken;
