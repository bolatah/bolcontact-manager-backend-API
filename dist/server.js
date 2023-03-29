"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const dotenv_1 = tslib_1.__importDefault(require("dotenv"));
const express_1 = tslib_1.__importDefault(require("express"));
const cors_1 = tslib_1.__importDefault(require("cors"));
const users_1 = tslib_1.__importDefault(require("./routes/users"));
const contacts_1 = tslib_1.__importDefault(require("./routes/contacts"));
const passport_1 = tslib_1.__importDefault(require("passport"));
dotenv_1.default.config();
const PORT = process.env.PORT || 8001;
const app = (0, express_1.default)();
require("./config/database");
require("./models/user");
require("./models/contact");
require("./config/passport")(passport_1.default);
app.use((0, cors_1.default)({
    credentials: true,
    origin: "http://localhost:3000",
    allowedHeaders: [
        "Authorization",
        "Content-Type",
        "Origin",
        "Accept",
        " X-Requested-With",
    ],
}));
app.use(passport_1.default.initialize());
app.use(express_1.default.json({ limit: "50mb" }));
app.use(express_1.default.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
}));
app.use(express_1.default.static("dist/build"));
// Routes
app.use("/api/users", users_1.default);
app.use("/api/contacts", contacts_1.default);
// listen to port
app.listen(PORT, () => {
    console.log(`web service has started at ${PORT}`);
});
//# sourceMappingURL=server.js.map