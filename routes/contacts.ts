import express from "express";

const router = express.Router();

import { ContactControllers } from "../controllers/contactControllers";
const contactControllers = new ContactControllers();

import multer from "multer";
import passport from "passport";
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
export = router;
