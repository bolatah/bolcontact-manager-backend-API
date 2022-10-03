import { Request, Response, NextFunction } from "express";
import { IUser } from "../interfaces/userInterface";

require("dotenv").config();

const jwt = require("jsonwebtoken");

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader =
    (req.headers["Authorization"] as string) || req.headers["authorization"];

  const token = authHeader?.split(" ")[1];
  if (token) {
    // verifies secret and checks exp
    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_KEY,
      function (err: any, user: any) {
        if (err) {
          return res.status(403).send({
            success: false,
            message: "Failed in authenticatazion token.",
          });
        } else {
          // if everything is good, save the request for use in other routes
          req.body.user = user;

          // the next function is important since it must be called from a middleware for the next middleware to be executed
          //  If this function is not called then none of the other middleware including the controller action will be called.
          next();
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
