import express from "express";

const router = express.Router();

//const auth = require("../middleware/auth");

const passport = require("passport");

const UserControllers = require("../controllers/userControllers");

const userControllers = new UserControllers();

router.post("/register", userControllers.handleRegister);

router.post("/login", userControllers.handleLogin);

//router.delete("/logout", userControllers.handleLogout);

router.get(
  "/:id",

  passport.authenticate("jwt", { session: false }),

  userControllers.getUserByID
);

router.get("/", userControllers.getAllUsers);
/* 




router.get("/refresh", userControllers.handleRefreshToken); */

module.exports = router;
