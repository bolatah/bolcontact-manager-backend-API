"use strict";
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const passport_1 = tslib_1.__importDefault(require("passport"));
const router = express_1.default.Router();
const userControllers_1 = require("../controllers/userControllers");
const userControllers = new userControllers_1.UserControllers();
router.post("/register", userControllers.handleRegister);
router.post("/login", userControllers.handleLogin);
//router.delete("/logout", userControllers.handleLogout);
router.get("/:id", passport_1.default.authenticate("jwt", { session: false }), userControllers.getUserByID);
router.get("/", userControllers.getAllUsers);
module.exports = router;
//# sourceMappingURL=users.js.map