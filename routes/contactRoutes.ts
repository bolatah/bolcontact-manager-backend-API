import express from "express";

const contactRoutes = express.Router();

const auth = require("../middleware/auth");
const ContactControllers = require("../controllers/contactControllers");
const contactControllers = new ContactControllers();

const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

contactRoutes.post(
  "/",
  auth,
  upload.single("file"),
  contactControllers.handleAddContactWithUpload
);

contactRoutes.get("/", auth, contactControllers.getAllContacts);

contactRoutes.get("/:id", auth, contactControllers.getContactByID);

contactRoutes.get("/img/:id", auth, contactControllers.getContactImage);

contactRoutes.put("/:id", auth, contactControllers.handleUpdateContact);

contactRoutes.delete("/:id", auth, contactControllers.handleDeleteContact);

module.exports = contactRoutes;
