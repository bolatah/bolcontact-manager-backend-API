import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import User from "../models/user";
import utils from "../lib/utils";

export class UserControllers {
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
      _id: new mongoose.Types.ObjectId(),
      username: req.body.username,
      email: req.body.email,
      phone: req.body.phone,
      hash: hash,
      salt: salt,
    });

    try {
      newUser.save().then((user) => {
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

  getAllUsers = async (_req: Request, res: Response) => {
    const users = await User.find();
    users.forEach((user) => {
      user.href = `/api/users/${user._id}`;
    });
    res.status(200).send(users);
  };

  getUserByID = async (req: Request, res: Response) => {
    const id = req.params.id;
    //const data = await usersManager.getUserById(id);
    const user = await User.findById({ _id: id });
    if (user) {
      res.status(200).json({ success: true, user: user });
      console.log("showing an user");
    } else {
      res.status(404).json({ success: false });
    }
  };
}
