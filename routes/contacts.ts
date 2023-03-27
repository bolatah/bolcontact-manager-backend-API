const express = require("express");

const router = express.Router();

const ContactControllers = require("../controllers/contactControllers");
const contactControllers = new ContactControllers();

const multer = require("multer");
const passport = require("passport");
const upload = multer({ storage: multer.memoryStorage() });

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  contactControllers.getAllContacts
);

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  upload.single("file"),
  contactControllers.handleAddContactWithUpload
);

router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  contactControllers.handleUpdateContact
);

router.get("/:id", contactControllers.getContactByID);

router.delete("/:id", contactControllers.handleDeleteContact);

/* 

router.get("/img/:id", contactControllers.getContactImage);

 */
module.exports = router;
