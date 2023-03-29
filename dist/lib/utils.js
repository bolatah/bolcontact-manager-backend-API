"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const crypto_1 = tslib_1.__importDefault(require("crypto"));
const jsonwebtoken_1 = tslib_1.__importDefault(require("jsonwebtoken"));
const fs_1 = tslib_1.__importDefault(require("fs"));
const path_1 = tslib_1.__importDefault(require("path"));
const pathToKey = path_1.default.join(__dirname, "..", "id_rsa_priv.pem");
const PRIV_KEY = fs_1.default.readFileSync(pathToKey, "utf8");
/**
 * -------------- HELPER FUNCTIONS ----------------
 */
/**
 *
 * @param {*} password - The plain text password
 * @param {*} hash - The hash stored in the database
 * @param {*} salt - The salt stored in the database
 *
 * This function uses the crypto library to decrypt the hash using the salt and then compares
 * the decrypted hash/salt with the password that the user provided at login
 */
function validPassword(password, hash, salt) {
    var hashVerify = crypto_1.default
        .pbkdf2Sync(password, salt, 10000, 64, "sha512")
        .toString("hex");
    return hash === hashVerify;
}
/**
 *
 * @param {*} password - The password string that the user inputs to the password field in the register form
 *
 * This function takes a plain text password and creates a salt and hash out of it.  Instead of storing the plaintext
 * password in the database, the salt and hash are stored for security
 *
 * ALTERNATIVE: It would also be acceptable to just use a hashing algorithm to make a hash of the plain text password.
 * You would then store the hashed password in the database and then re-hash it to verify later (similar to what we do here)
 */
function genPassword(password) {
    var salt = crypto_1.default.randomBytes(32).toString("hex");
    var genHash = crypto_1.default
        .pbkdf2Sync(password, salt, 10000, 64, "sha512")
        .toString("hex");
    return {
        salt: salt,
        hash: genHash,
    };
}
/**
 * @param {*} user - The user object.  We need this to set the JWT `sub` payload property to the MongoDB user ID
 */
function issueJWT(user) {
    const _id = user._id;
    const expiresIn = "1d";
    const payload = {
        sub: _id,
        iat: Date.now(),
    };
    const signedToken = jsonwebtoken_1.default.sign(payload, PRIV_KEY, {
        expiresIn: expiresIn,
        algorithm: "RS256",
    });
    return {
        token: "Bearer " + signedToken,
        expires: expiresIn,
    };
}
exports.default = { validPassword, genPassword, issueJWT };
/* module.exports.validPassword = validPassword;
module.exports.genPassword = genPassword;
module.exports.issueJWT = issueJWT; */
//# sourceMappingURL=utils.js.map