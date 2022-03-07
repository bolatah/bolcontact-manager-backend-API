const sqlite3 = require("sqlite3");
require("dotenv").config();
const fs = require("fs");

const db = new sqlite3.Database(process.env.DB);
// const { v4: uuidv4 } = require("uuid");

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
  async addContact(contact, imgBase64) {
    return new Promise((resolve, reject) => {
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
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }

  async getContactImage(id) {
    return new Promise((resolve, reject) => {
      db.all("SELECT img FROM contacts WHERE id=?", [id], (error, row) => {
        if (error) {
          reject(error);
        } else {
          resolve(row);
        }
      });
    });
  }

  async getContact(id) {
    return new Promise((resolve, reject) => {
      db.all("SELECT * FROM contacts WHERE id=?", [id], (error, row) => {
        if (error) {
          reject(error);
        } else {
          resolve(row);
        }
      });
    });
  }

  async updateContact(id, contact) {
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE contacts SET
                                name = ?,
                                email = ?,
                                phone = ?,
                                message = ?
                            WHERE 
                                id = ?`,
        [contact.name, contact.email, contact.phone, contact.message, id],
        (error, row) => {
          if (error) {
            reject(error);
          } else {
            resolve(row);
          }
        }
      );
    });
  }

  async deleteContact(id) {
    return new Promise((resolve, reject) => {
      db.run("DELETE FROM contacts WHERE id = ?", [id], (error, row) => {
        if (error) {
          reject(error);
        } else {
          resolve(row);
        }
      });
    });
  }

  async getContacts() {
    return new Promise((resolve, reject) => {
      db.all("SELECT * FROM contacts", [], (error, rows) => {
        if (error) {
          reject(error);
        } else {
          resolve(rows);
        }
      });
    });
  }
};
