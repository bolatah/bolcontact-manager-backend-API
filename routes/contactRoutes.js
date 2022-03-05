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
const { resolve } = require("path");
const upload = multer({ dest: "./images/" }).single("file");
const uploads = multer({ dest: "./images/" }).array("files", 3);

// Route for adding contact with file upload
router.post("/", auth, upload, async (req, res) => {
  try {
    const textForm = req.body;
    const fileForm = req.file;
    const contact = Object.assign(textForm, fileForm);
    const id = await contactsManager.addContact(contact);
    const dir = `./images/${contact.name}/`;

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    // const oldPath = `./images/${contact.filename}`;
    // const newFileName = `${uuidv4()}`;
    const newPath = `${dir}/${contact.filename}.jpg`;
    const imageBinary = Buffer.from(`${contact.filename}`, "base64");
    fs.writeFile(newPath, imageBinary, "base64", function (err) {
      if (err) {
        console.error(err);
      }
      console.log("Successfully Moved File");
    });
    contact.href = `/api/contacts/${id}`;
    res.status(201).location(`/api/contacts/${id}`).send(contact);
  } catch (err) {
    console.log(err);
  }
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
