import { Contact } from "../models/contact";

const sqlite3Users = require("sqlite3");
require("dotenv").config();

const db = new sqlite3Users.Database(process.env.DB);

module.exports = class SQLiteContactsManager {
  constructor() {
    this.init();
  }
  init() {
    db.run(`
    CREATE TABLE IF NOT EXISTS
        contacts(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT ,
            email TEXT ,
            phone INTEGER  ,
            message TEXT,
            img TEXT,                    
            dateCreated DATE 
        )`);
  }
  async addContact(contact: Contact, imgBase64: any) {
    return new Promise<void>((resolve, reject) => {
      db.run(
        `INSERT
                INTO contacts(name, email, phone, message, img, dateCreated)
                VALUES(?,?,?,?,?,?); select last_insert_rowid();`,
        [
          contact.name,
          contact.email,
          contact.phone,
          contact.message,
          imgBase64,
          new Date(Date.now()).toString(),
        ],
        function (err: any) {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }

  async getContactImage(id: number) {
    return new Promise((resolve, reject) => {
      db.all(
        "SELECT img FROM contacts WHERE id=?",
        [id],
        (error: any, row: unknown) => {
          if (error) {
            reject(error);
          } else {
            resolve(row);
          }
        }
      );
    });
  }

  async getContact(id: number) {
    return new Promise((resolve, reject) => {
      db.all(
        "SELECT * FROM contacts WHERE id=?",
        [id],
        (error: any, row: unknown) => {
          if (error) {
            reject(error);
          } else {
            resolve(row);
          }
        }
      );
    });
  }

  async updateContact(id: number, contact: Contact) {
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE contacts SET
                                name = ?,
                                email = ?,
                                phone = ?,
                                message = ?, 
                                img = ?,
                                dateCreated= ?
                            WHERE 
                                id = ?`,
        [contact.name, contact.email, contact.phone, contact.message, id],
        (error: any, row: unknown) => {
          if (error) {
            reject(error);
          } else {
            resolve(row);
          }
        }
      );
    });
  }

  async deleteContact(id: number) {
    return new Promise((resolve, reject) => {
      db.run(
        "DELETE FROM contacts WHERE id = ?",
        [id],
        (error: any, row: unknown) => {
          if (error) {
            reject(error);
          } else {
            resolve(row);
          }
        }
      );
    });
  }

  async getContacts() {
    return new Promise((resolve, reject) => {
      db.all("SELECT * FROM contacts", [], (error: any, rows: unknown) => {
        if (error) {
          reject(error);
        } else {
          resolve(rows);
        }
      });
    });
  }
};
