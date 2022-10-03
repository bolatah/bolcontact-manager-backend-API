import express from "express";

const userRoutes = express.Router();

const auth = require("../middleware/auth");

const UserControllers = require("../controllers/userControllers");

const userControllers = new UserControllers();

userRoutes.post("/register", userControllers.handleRegister);

userRoutes.post("/login", userControllers.handleLogin);

userRoutes.delete("/logout", auth, userControllers.handleLogout);

userRoutes.get("/", auth, userControllers.getAllUsers);

userRoutes.get("/:id", auth, userControllers.getUserByID);

userRoutes.get("/refresh", auth, userControllers.handleRefreshToken);

module.exports = userRoutes;
