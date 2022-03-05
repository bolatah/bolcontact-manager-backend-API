require("dotenv").config();

const express = require("express");
const cors = require("cors");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const corsOptions = require("../repositories/utils");
const auth = require("../middleware/auth");
const UsersManager = require("../database/SQLiteUsersManager");

const usersManager = new UsersManager();

router.use(express.json(), cors(corsOptions));

let refreshTokens = [];

// Route for user-register
router.post("/register", async (req, res) => {
  try {
    const { username, email, phone, password } = req.body;
    // validate user input
    if (!(username && email && phone && password)) {
      res.status(400).send("All inputs are required");
    }

    // check if user already exist
    const oldUser = await usersManager.getCountUser(email, username);
    if (oldUser > 0) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    // encrypt the user password and add user
    bcrypt.hash(password, 10, async (err, hash) => {
      const user = {
        username: username,
        email: email,
        phone: phone,
        password: hash,
      };
      await usersManager.addUser(user);
      res.status(201).json(user);
    });
  } catch (err) {
    console.log(err);
  }
});

// route for refresh token
router.post("/refresh", async (req, res) => {
  const refreshToken = req.body.token;
  // const username = req.body.username;

  if (refreshToken == null) return res.status(401);
  if (!refreshTokens.includes(refreshToken)) return res.status(403);
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY, (err, user) => {
    if (err) return res.status(403);
    const accessToken = generateAccessToken({ username: user.username });
    res.json(accessToken);
  });
});

// Route for user-login
router.post("/login", async (req, res) => {
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

      // user
      res.status(200).json(user, accessToken, refreshToken);
    } else {
      res.status(400).send("Invalid Credentials");
    }
  } catch (err) {
    console.log(err);
  }
});

// Route for log out
router.delete("/logout", auth, (req, res) => {
  refreshTokens = refreshTokens
    .filter((token) => token !== req.body.token)
    .res.status(204);
});

// Route for getting all users
router.get("/", auth, async (req, res, err) => {
  try {
    const users = await usersManager.getUsers();
    users.forEach((user) => {
      user.href = `/api/users/${user.id}`;
    });
    res.status(200).send(users);
    console.log("getting all users");
  } catch (err) {
    console.log(err);
  }
});

//Route for getting an user by id
router.get("/:id", auth, async (req, res) => {
  const id = parseInt(req.params.id);
  const user = await usersManager.getUserById(id);
  if (user) {
    res.status(200).send(user);
    console.log("showing an user");
  } else {
    res.status(404).send();
  }
});

function generateAccessToken(user) {
  return jwt.sign({ username: user.username }, process.env.ACCESS_TOKEN_KEY, {
    expiresIn: process.env.REACT_APP_EXPIRATION,
  });
}

module.exports = router;
