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

// Route for user-register
router.post("/register", async (req, res) => {
  try {
    const { username, email, phone, password } = req.body;
    console.log(req.body);
    // validate user input
    if (!(username && email && phone && password)) {
      res.status(400).send("All inputs are required");
    }

    // check if user already exist
    const oldUser = await usersManager.count(email, username);
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

// Route for user-login
router.post("/login", async (req, res) => {
  try {
    // get user input
    const { username, password } = req.body;

    // validate user input
    if (!(username && password)) {
      res.status(400).send("All inputs are srequired");
    }

    // validate if user exist in our database
    const user = await usersManager.getUserByUsernameOrEmail(username);
    console.log(user);
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { user_id: user.id, email: user.email },
        process.env.TOKEN_KEY,
        {
          expiresIn: process.env.REACT_APP_EXPIRATION,
        }
      );
      console.log(token);
      // save user token
      user.token = token;
      console.log(token);
      // user
      res.status(200).json(user);
    } else {
      res.status(400).send("Invalid Credentials");
    }
  } catch (err) {
    console.log(err);
  }
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

module.exports = router;
