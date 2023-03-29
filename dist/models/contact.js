"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongoose_1 = tslib_1.__importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const contactSchema = new Schema({
    name: String,
    author: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
    email: String,
    phone: String,
    file: String,
    message: String,
    dateCreated: Date,
});
const Contact = mongoose_1.default.model("Contact", contactSchema);
exports.default = Contact;
//# sourceMappingURL=contact.js.map