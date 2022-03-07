const express = require("express");
const router = express.Router();
const cors = require("cors");
const fs = require("fs");
// const { v4: uuidv4 } = require("uuid");

const corsOptions = require("../repositories/utils");
const auth = require("../middleware/auth");
router.use(express.json(), cors(corsOptions));

const ContactsManager = require("../database/SQLiteContactsManager");
const contactsManager = new ContactsManager();

const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

// Route for adding contact with file upload
router.post("/", auth, upload.single("file"), async (req, res) => {
  const contact = req.body;
  const fileForm = req.file;
  let imgBase64 = fileForm.buffer?.toString("base64") ?? "";
  let newContact = await contactsManager.addContact(contact, imgBase64);
  res.status(201).location(`/api/contacts`).send(newContact);
});

//Route for showing all contacts
router.get("/", async (req, res) => {
  const contacts = await contactsManager.getContacts();
  contacts.forEach((contact) => {
    contact.href = `/api/contacts/${contact.id}`;
  });
  res.status(200).send(contacts);
});

// Route for showing a contact by id
router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const contact = await contactsManager.getContact(id);
  if (contact) {
    res.status(200).send(contact);
  } else {
    res.status(404).send();
  }
});

router.get("/img/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const c = await contactsManager.getContactImage(id);
  res.buffer(Buffer.from(c.img, "base64"));
  res.send();
});

// Route for updating a contact
router.put("/:id", auth, async (req, res) => {
  const id = parseInt(req.params.id);
  const existingContact = await contactsManager.getContact(id);
  if (existingContact) {
    const contact = req.body;
    await contactsManager.updateContact(id, contact);
    res.status(200).send();
  } else {
    const contact = req.body;
    const id = await contactsManager.addContact(contact);
    res.status(200).location(`/api/contacts/${id}`).send();
  }
});

// Route for deleting a contact
router.delete("/:id", auth, async (req, res) => {
  const id = parseInt(req.params.id);
  await contactsManager.deleteContact(id);
  res.status(200).send();
});

module.exports = router;
