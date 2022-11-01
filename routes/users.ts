import express from "express";

const router = express.Router();

//const auth = require("../middleware/auth");

const UserControllers = require("../controllers/userControllers");

const userControllers = new UserControllers();

router.post("/register", userControllers.handleRegister);

router.post("/login", userControllers.handleLogin);

router.delete("/logout", userControllers.handleLogout);

/* 
router.get("/", userControllers.getAllUsers);

router.get("/:id", userControllers.getUserByID);

router.get("/refresh", userControllers.handleRefreshToken); */

module.exports = router;
