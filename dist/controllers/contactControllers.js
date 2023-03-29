"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactControllers = void 0;
const tslib_1 = require("tslib");
const mongoose_1 = tslib_1.__importDefault(require("mongoose"));
const contact_1 = tslib_1.__importDefault(require("../models/contact"));
class ContactControllers {
    constructor() {
        this.handleAddContactWithUpload = (req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { name, user, email, phone, message, file } = req.body;
                const fileForm = req.file;
                const newContact = new contact_1.default({
                    _id: new mongoose_1.default.Types.ObjectId(),
                    name: name,
                    author: user,
                    email: email,
                    phone: phone,
                    message: message,
                    dateCreated: new Date().toISOString(),
                    file: fileForm ? (_a = fileForm.buffer) === null || _a === void 0 ? void 0 : _a.toString("base64") : file,
                });
                yield newContact.save().then(() => {
                    res.status(201).json({ success: true, contact: newContact });
                });
            }
            catch (err) {
                res.status(404).json({ success: false, msg: err });
            }
        });
        this.getAllContacts = (_req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const contacts = yield contact_1.default.find();
            contacts.forEach((contact) => {
                contact.href = `/api/contacts/${contact._id}`;
            });
            res.status(200).send(contacts);
        });
        this.getContactByID = (req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            yield contact_1.default.findById({ _id: id }).then((contact) => {
                if (contact) {
                    res.status(200).json({
                        sucess: true,
                        contact: contact,
                        href: `/api/contacts/${contact._id}`,
                    });
                }
                else {
                    res.status(404).json({ success: false });
                }
            });
        });
        this.handleUpdateContact = (req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const update = req.body;
                yield contact_1.default.findByIdAndUpdate({ _id: id }, update, { new: true }).then(() => {
                    res.status(201).json({ success: true, update: update });
                });
            }
            catch (error) {
                res.status(500).send(`Server error`);
            }
        });
        this.handleDeleteContact = (req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            yield contact_1.default.findByIdAndRemove({ _id: id });
            res.status(200).json({ success: true, msg: "deleted" });
        });
        this.getContactImage = (req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            // const c = await contactsManager.getContactImage(id);
            yield contact_1.default.findById({ _id: id }).then((contact) => {
                if (contact) {
                    console.log(typeof contact);
                    // res.buffer(Buffer.from(contact.file, "base64"));
                    res.buffer(contact.file);
                    res.send();
                }
                else {
                }
            });
        });
    }
}
exports.ContactControllers = ContactControllers;
//# sourceMappingURL=contactControllers.js.map