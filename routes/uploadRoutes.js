const express = require("express");
const cors = require("cors");
const fs = require("fs");
const corsOptions = require("../repositories/utils");
const ContactsManager = require("../database/SQLiteContactsManager");
const contactsManager = new ContactsManager();

const router = express.Router();
router.use(express.json(), cors(corsOptions));

const auth = require("../middleware/auth");

const multer = require("multer");
const upload = multer({ dest: "./images/" }).single("file");
const uploads = multer({ dest: "./images/" }).array("files", 3);
// route for uploading pictures
router.post("/singleFile", auth, async (req, res, err) => {
  try {
    const id = parseInt(req.headers.id);
    let contact = await contactsManager.getContact(id);
    if (contact.length == 0) {
      res.status(404).send("Contact is not Found");
    } else {
      upload(req, res, (err) => {
        let file = req.file;
        if (err) {
          res.status(400).send("Something went wrong!");
        } else {
          contactsManager.uploadSingleFile(id, file);
          contact.push(file);
          res.status(201).send(contact);
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/multipleFiles", auth, async (req, res, err) => {
  try {
    const id = parseInt(req.headers.id);
    let contact = await contactsManager.getContact(id);
    if (contact.length == 0) {
      res.status(404).send("Contact is not Found");
    } else {
      uploads(req, res, (err) => {
        let files = req.files;
        if (err) {
          res.status(400).send("Something went wrong!");
        } else {
          contactsManager.uploadMultipleFiles(id, files);
          contact.push(files);
          res.status(201).send(contact);
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
