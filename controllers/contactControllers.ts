import { Request, Response } from "express";
import { Contact } from "../interfaces/contactInterface";

const ContactsManager = require("../sql_service/contactDBService");
const contactsManager = new ContactsManager();

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
      const { name, email, phone, message } = req.body;
      const fileForm = req.file;
      // check if contact already exists
      const oldContact = await contactsManager.getCountContact(email, name);

      if (oldContact.count > 0) {
        return res.status(409).send("Contact already exists");
      }
      const contact = {
        name: name,
        email: email,
        phone: phone,
        message: message,
      };

      let imgBase64 = fileForm.buffer?.toString("base64") ?? "";

      let newContact = await contactsManager.addContact(contact, imgBase64);

      res.status(201).location(`/api/contacts`).send(newContact);
    } catch (err) {
      return console.log(err);
    }
  };

  getAllContacts = async (_req: Request, res: Response) => {
    const contacts = await contactsManager.getContacts();
    contacts.forEach((contact: Contact) => {
      contact.href = `/api/contacts/${contact.id}`;
    });
    res.status(200).send(contacts);
  };

  getContactByID = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const contact = await contactsManager.getContact(id);
    if (contact) {
      res.status(200).send(contact);
    } else {
      res.status(404).send();
    }
  };

  getContactImage = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const c = await contactsManager.getContactImage(id);
    res.buffer(Buffer.from(c.img, "base64"));
    res.send();
  };

  handleUpdateContact = async (req: Request, res: Response) => {
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
  };

  handleDeleteContact = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    await contactsManager.deleteContact(id);
    res.status(200).send();
  };
};
