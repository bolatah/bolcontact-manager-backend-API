"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserControllers = void 0;
const tslib_1 = require("tslib");
const mongoose_1 = tslib_1.__importDefault(require("mongoose"));
const user_1 = tslib_1.__importDefault(require("../models/user"));
const utils_1 = tslib_1.__importDefault(require("../lib/utils"));
class UserControllers {
    constructor() {
        this.handleLogin = (req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            user_1.default.findOne({ username: req.body.username }).then((user) => {
                if (!user) {
                    return res
                        .status(401)
                        .json({ success: false, msg: "could not find user" });
                }
                const isValid = utils_1.default.validPassword(req.body.password, user.hash, user.salt);
                if (isValid) {
                    const tokenObject = utils_1.default.issueJWT(user);
                    res.status(200).json({
                        success: true,
                        username: user.username,
                        token: tokenObject.token,
                        expiresIn: tokenObject.expires,
                    });
                }
                else {
                    res
                        .status(401)
                        .json({ success: false, msg: "you entered the wrong password" });
                }
            });
        });
        this.handleRegister = (req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const saltHash = utils_1.default.genPassword(req.body.password);
            const salt = saltHash.salt;
            const hash = saltHash.hash;
            const newUser = new user_1.default({
                _id: new mongoose_1.default.Types.ObjectId(),
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
            }
            catch (err) {
                res.json({ sucess: false, msg: err });
            }
        });
        /*  handleLogout = async (req: Request, res: Response, next: NextFunction) => {
          req.logout(function (err: Error) {
            if (err) {
              return next(err);
            }
            res.redirect("/");
          });
        }; */
        this.getAllUsers = (_req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const users = yield user_1.default.find();
            users.forEach((user) => {
                user.href = `/api/users/${user._id}`;
            });
            res.status(200).send(users);
        });
        this.getUserByID = (req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            //const data = await usersManager.getUserById(id);
            const user = yield user_1.default.findById({ _id: id });
            if (user) {
                res.status(200).json({ success: true, user: user });
                console.log("showing an user");
            }
            else {
                res.status(404).json({ success: false });
            }
        });
    }
}
exports.UserControllers = UserControllers;
//# sourceMappingURL=userControllers.js.map