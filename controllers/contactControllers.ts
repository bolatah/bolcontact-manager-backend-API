import { Request, Response } from "express";
import mongoose from "mongoose";
import Contact from "../models/contact";

interface IRequest extends Request {
  file?: any;
}

interface IResponse extends Response {
  buffer?: any;
}

module.exports = class ContactControllers {
  handleAddContactWithUpload = async (req: IRequest, res: IResponse) => {
    try {
      const { name, user, email, phone, message, file } = req.body;
      const fileForm = req.file;

      const newContact = new Contact({
        _id: new mongoose.Types.ObjectId(),
        name: name,
        author: user,
        email: email,
        phone: phone,
        message: message,
        dateCreated: new Date().toISOString(),
        file: fileForm ? fileForm.buffer?.toString("base64") : file,
      });

      await newContact.save().then(() => {
        res.status(201).json({ success: true, contact: newContact });
      });
    } catch (err) {
      res.status(404).json({ success: false, msg: err as Error });
    }
  };

  getAllContacts = async (_req: IRequest, res: IResponse) => {
    const contacts = await Contact.find();
    contacts.forEach((contact) => {
      contact.href = `/api/contacts/${contact._id}`;
    });
    res.status(200).send(contacts);
  };

  getContactByID = async (req: IRequest, res: IResponse, err: Error) => {
    const id = req.params.id;
    await Contact.findById({ _id: id }).then((contact) => {
      if (contact) {
        res.status(200).json({
          sucess: true,
          contact: contact,
          href: `/api/contacts/${contact._id}`,
        });
      } else {
        res.status(404).json({ success: false, msg: err });
      }
    });
  };

  handleUpdateContact = async (req: IRequest, res: IResponse) => {
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

  handleDeleteContact = async (req: IRequest, res: IResponse) => {
    const id = req.params.id;
    await Contact.findByIdAndRemove({ _id: id });
    res.status(200).json({ success: true, msg: "deleted" });
  };

  getContactImage = async (req: IRequest, res: IResponse) => {
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
};
