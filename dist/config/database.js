"use strict";
const tslib_1 = require("tslib");
const dotenv = require("dotenv");
const mongoose_1 = tslib_1.__importDefault(require("mongoose"));
dotenv.config();
// Connect to the correct environment database
/*
const mongoConfigOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
}; */
mongoose_1.default
    .set("strictQuery", true)
    .connect(process.env.DB_STRING)
    .then(() => {
    console.log("Database connected");
})
    .catch((error) => {
    console.log("Database is not connected", error);
});
module.exports = mongoose_1.default;
//# sourceMappingURL=database.js.map