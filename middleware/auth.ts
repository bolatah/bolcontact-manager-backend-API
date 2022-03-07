require("dotenv").config();
import { Request, Response, NextFunction } from "express";

declare module "express" {
  interface Request {
    user?: any;
  }
}

const jwt = require("jsonwebtoken");

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token =
    req.body["access-token"] ||
    req.query["access-token"] ||
    req.headers["access-token"];

  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_KEY,
      function (err: any, user: any) {
        if (err) {
          return res.status(403).send({
            success: false,
            message: "Failed to authenticate token.",
          });
        } else {
          // if everything is good, save the request for use in other routes
          req.user = user;
          // the next function is important since it must be called from a middleware for the next middleware to be executed
          //  If this function is not called then none of the other middleware including the controller action will be called.
          next();
          return;
        }
      }
    );
  } else {
    // if there is no token, return an error
    res.status(403).send({
      success: false,
      message: "No token provided.",
    });
  }
};

module.exports = verifyToken;
