"use strict";
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const router = express_1.default.Router();
const contactControllers_1 = require("../controllers/contactControllers");
const contactControllers = new contactControllers_1.ContactControllers();
const multer_1 = tslib_1.__importDefault(require("multer"));
const passport_1 = tslib_1.__importDefault(require("passport"));
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
router.get("/", passport_1.default.authenticate("jwt", { session: false }), contactControllers.getAllContacts);
router.post("/", passport_1.default.authenticate("jwt", { session: false }), upload.single("file"), contactControllers.handleAddContactWithUpload);
router.put("/:id", passport_1.default.authenticate("jwt", { session: false }), contactControllers.handleUpdateContact);
router.get("/:id", contactControllers.getContactByID);
router.delete("/:id", contactControllers.handleDeleteContact);
module.exports = router;
//# sourceMappingURL=contacts.js.map