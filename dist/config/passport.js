"use strict";
const tslib_1 = require("tslib");
const passport_jwt_1 = require("passport-jwt");
const fs_1 = tslib_1.__importDefault(require("fs"));
const path_1 = tslib_1.__importDefault(require("path"));
const user_1 = tslib_1.__importDefault(require("../models/user"));
const pathToKey = path_1.default.join(__dirname, "../../", "id_rsa_pub.pem");
const PUB_KEY = fs_1.default.readFileSync(pathToKey, "utf8");
// At a minimum, you must pass the `jwtFromRequest` and `secretOrKey` properties
const options = {
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: PUB_KEY,
    algorithms: ["RS256"],
};
module.exports = (passport) => {
    // The JWT payload is passed into the verify callback
    passport.use(new passport_jwt_1.Strategy(options, function (jwt_payload, done) {
        console.log(jwt_payload);
        // We will assign the `sub` property on the JWT to the database ID of user
        user_1.default.findOne({ _id: jwt_payload.sub }, function (err, user) {
            // This flow look familiar?  It is the same as when we implemented
            // the `passport-local` strategy
            if (err) {
                return done(err, false);
            }
            if (user) {
                return done(null, user);
            }
            else {
                return done(null, false);
            }
        });
    }));
};
//# sourceMappingURL=passport.js.map