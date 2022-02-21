const express = require("express");
const router = express.Router();
const cors = require("cors");

const corsOptions = require("../repositories/utils");
const auth = require("../middleware/auth");
router.use(express.json(), cors(corsOptions));

const ContactsManager = require("../database/SQLiteContactsManager");
const contactsManager = new ContactsManager();

// Route for adding contact
router.post("/", auth, async (req, res) => {
  const contact = req.body;
  const id = await contactsManager.addContact(contact);
  contact.href = `/api/contacts/${id}`;
  res.status(201).location(`/api/contacts/${id}`).send(contact);
});

//Route for showing all contacts
router.get("/", auth, async (req, res) => {
  const contacts = await contactsManager.getContacts();
  contacts.forEach((contact) => {
    contact.href = `/api/contacts/${contact.id}`;
  });
  res.status(200).send(contacts);
});

// Route for showing a contact by id
router.get("/:id", auth, async (req, res) => {
  const id = parseInt(req.params.id);
  const contact = await contactsManager.getContact(id);
  if (contact) {
    res.status(200).send(contact);
  } else {
    res.status(404).send();
  }
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
