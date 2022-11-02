import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { IUser } from "../models/user";
const User = mongoose.model<IUser>("User");
const utils = require("../lib/utils");

module.exports = class UserControllers {
  handleLogin = async (req: Request, res: Response) => {
    User.findOne({ username: req.body.username }).then((user) => {
      if (!user) {
        return res
          .status(401)
          .json({ success: false, msg: "could not find user" });
      }
      const isValid = utils.validPassword(
        req.body.password,
        user.hash,
        user.salt
      );
      if (isValid) {
        const tokenObject = utils.issueJWT(user);
        res.status(200).json({
          success: true,
          username: user.username,
          token: tokenObject.token,
          expiresIn: tokenObject.expires,
        });
      } else {
        res
          .status(401)
          .json({ success: false, msg: "you entered the wrong password" });
      }
    });
  };
  handleRegister = async (req: Request, res: Response) => {
    const saltHash = utils.genPassword(req.body.password);
    const salt = saltHash.salt;
    const hash = saltHash.hash;

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      phone: req.body.phone,
      hash: hash,
      salt: salt,
    });

    try {
      newUser.save().then((user: IUser) => {
        res.json({ success: true, user: user });
      });
    } catch (err) {
      res.json({ sucess: false, msg: err });
    }
  };

  /*  handleLogout = async (req: Request, res: Response, next: NextFunction) => {
    req.logout(function (err: Error) {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  }; */

  /*  getAllUsers = async (req: Request, res: Response) => {
    const data = await usersManager.getUsers();
    const users = data.rows;
    users.forEach((user) => {
      user.href = `/api/users/${user.user_id}`;
    });
    res.status(200).send(users);
  }; */
  /*   getUserByID = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const data = await usersManager.getUserById(id);
    const user = data.rows;
    if (user.length > 0) {
      res.status(200).send(user);
      console.log("showing an user");
    } else {
      res.status(404).send();
    }
  }; */
};
