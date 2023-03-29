import express from "express";
import passport from "passport";

const router = express.Router();

import { UserControllers } from "../controllers/userControllers";

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

export = router;
