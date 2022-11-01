import { NextFunction, Request, Response } from "express";
import mongoose, { Model } from "mongoose";
import { Multer } from "multer";
import { IContact } from "../models/contact";
const Contact = mongoose.model<IContact>("Contact");
const passport = require("passport");
const utils = require("../lib/utils");

declare module "express" {
  interface Request {
    file?: any;
  }
}

declare module "express" {
  interface Response {
    buffer?: any;
  }
}

module.exports = class ContactControllers {
  handleAddContactWithUpload = async (req: Request, res: Response) => {
    try {
      const { id, name, email, phone, message, file } = req.body;
      console.log(name, email, file);
      const fileForm = req.file;

      const newContact = new Contact<IContact>({
        _id: id,
        name: name,
        email: email,
        phone: phone,
        message: message,
        file: fileForm ? fileForm.buffer?.toString("base64") : file,
      });

      await newContact.save().then(() => {
        res.status(201).json({ success: true, contact: newContact });
      });
    } catch (err) {
      res.status(404).json({ success: false, msg: err as Error });
    }
  };
  getAllContacts = async (_req: Request, res: Response) => {
    const contacts = await Contact.find();
    contacts.forEach((contact: IContact) => {
      contact.href = `/api/contacts/${contact._id}`;
    });
    res.status(200).send(contacts);
  };

  getContactByID = async (req: Request, res: Response, err: Error) => {
    const id = req.params.id;
    await Contact.findById({ _id: id }).then((contact) => {
      if (contact) {
        res.status(200).json({ sucess: true, contact: contact });
      } else {
        res.status(404).json({ success: false, msg: err });
      }
    });
  };

  handleUpdateContact = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const update = req.body;
      await Contact.findByIdAndUpdate({ _id: id }, update, { new: true }).then(
        () => {
          res.status(201).json({ success: true, update: update });
        }
      );
    } catch (error) {
      res.status(500).send(`Server error`);
    }
  };
  handleDeleteContact = async (req: Request, res: Response) => {
    const id = req.params.id;
    await Contact.findByIdAndRemove({ _id: id });
    res.status(200).json({ success: true, msg: "deleted" });
  };
  getContactImage = async (req: Request, res: Response) => {
    const id = req.params.id;
    // const c = await contactsManager.getContactImage(id);
    await Contact.findById({ _id: id }).then((contact) => {
      if (contact) {
        console.log(typeof contact);
        // res.buffer(Buffer.from(contact.file, "base64"));
        res.buffer(contact.file);
        res.send();
      } else {
      }
    });
  };
  /*   

  const id = req.params.id;
    const contact = req.body;
    console.log(id);
    Contact.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      { new: true, runValidators: true },
      function (err) {
        if (err) {
          res.status(500).send(err);
        } else {
          res.status(201).json({ success: true, contact: contact });
        }
      }
    );
     .exec()
      .then((err) => {
        if (err) {
          res.status(500).send(err as Error);
        } else {
          res.status(201).json({ success: true, contact: contact });
        }
      }); 

    /*   if (existingContact) {
      const contact = req.body;
      await contactsManager.updateContact(id, contact);
      res.status(200).send();
    } else {
      const contact = req.body;
      const id = await contactsManager.addContact(contact);
      res.status(200).location(`/api/contacts/${id}`).send();
    } */
  /* 
  getContactImage = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const c = await contactsManager.getContactImage(id);
    res.buffer(Buffer.from(c.img, "base64"));
    res.send();
  };

  handleDeleteContact = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    await contactsManager.deleteContact(id);
    res.status(200).send();
  }; */
};
