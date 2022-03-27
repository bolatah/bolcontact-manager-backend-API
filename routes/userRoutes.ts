import { Request, Response } from "express";
import { usersManager } from "../database/SQLiteUsersManager";
import { User } from "../models/user";
import * as bcrypt from "bcryptjs"
const express = require("express");
const cors = require("cors");
const routerUsers = express.Router();
const jwt = require("jsonwebtoken");

const corsOptions = require("../repositories/utils");
const auth = require("../middleware/auth");


routerUsers.use(express.json(), cors(corsOptions));

let refreshTokens: any[] = [];

// Route for user-register
routerUsers.post("/register", async (req: Request, res: Response) => {
  try {
    const { username, email, phone, password } = req.body;
    // validate user input
    if (!(username && email && phone && password)) {
      res.status(400).send("All inputs are required");
      return;
    }

    // check if user already exist
    const oldUser = await usersManager.getCountUser(email, username);
    if (oldUser > 0) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    // encrypt the user password and add user
    bcrypt.hash(password, 10, async (err: any, hash: any) => {

      if (err) {
        return res.status(501).send();
        return;
      }

      const user = {
        username: username,
        email: email,
        phone: phone,
        password: hash,
      };
 
      await usersManager.addUser(user);
      return res.status(201).json(user);
    });
  } catch (err) {
    return console.log(err);
  }
});

// route for refresh token
routerUsers.post("/refresh", async (req: Request, res: Response) => {
  const refreshToken = req.body.token;
  return;
  // const username = req.body.username;

  if (refreshToken == null) return res.status(401);
  if (!refreshTokens.includes(refreshToken)) return res.status(403);
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_KEY,
    (err: any, user: { username: any }) => {
      if (err) return res.status(403);
      const accessToken = generateAccessToken({ username: user.username });
      return res.json(accessToken);
    }
  );
});

// Route for user-login
routerUsers.post("/login", async (req: Request, res: Response) => {
  try {
    // get user input
    const { username, password } = req.body;

    // validate user input
    if (!(username && password)) {
      res.status(400).send("All inputs are required");
    }

    // validate if user exist in our database
    const user = await usersManager.getUserByUsernameOrEmail(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      const accessToken = generateAccessToken({ username: user.username });
      const refreshToken = jwt.sign(
        { username: user.username },
        process.env.REFRESH_TOKEN_KEY
      );
      refreshTokens.push(refreshToken);
      // save user tokens

      user.accessToken = accessToken;
      user.refreshToken = refreshToken;
      delete user.password;

      // user
      res.status(200).json(user);
    } else {
      res.status(400).send("Invalid Credentials");
    }
  } catch (err) {
    console.log(err);
  }
});

// Route for log out
routerUsers.delete("/logout", auth, (req: Request, res: Response) => {
  refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
  return res.status(204);
});

// Route for getting all users
routerUsers.get("/", auth, async (res: Response) => {
  try {
    const users = await usersManager.getUsers();
    users.forEach((user: User) => {
      user.href = `/api/users/${user.id}`;
    });
    res.status(200).send(users);
    console.log("getting all users");
  } catch (err) {
    console.log(err);
  }
});

//Route for getting an user by id
routerUsers.get("/:id", auth, async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const user = await usersManager.getUserById(id);
  if (user) {
    res.status(200).send(user);
    console.log("showing an user");
  } else {
    res.status(404).send();
  }
});

function generateAccessToken(user: any) {
  return jwt.sign({ username: user.username }, process.env.ACCESS_TOKEN_KEY, {
    expiresIn: process.env.REACT_APP_EXPIRATION,
  });
}

module.exports = routerUsers;
