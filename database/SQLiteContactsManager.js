const sqlite3 = require("sqlite3");
require("dotenv").config();
const fs = require("fs");
const db = new sqlite3.Database(process.env.DB);
const { v4: uuidv4 } = require("uuid");
const { Console } = require("console");
module.exports = class SQLiteContactsManager {
  constructor() {
    this.init();
  }
  init() {
    db.run(`
    CREATE TABLE IF NOT EXISTS
        contacts(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE ,
            email TEXT UNIQUE ,
            phone INTEGER UNIQUE  ,
            message TEXT,
            filename TEXT,    
            path TEXT ,                       
            size INTEGER ,
            mimetype TEXT ,                
            dateCreated DATE 
        )`);
  }
  async addContact(contact) {
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT
                INTO contacts(name, email, phone, message, filename, path, size, mimetype, dateCreated)
                VALUES(?,?,?,?,?,?,?,?,?)`,
        [
          contact.name,
          contact.email,
          contact.phone,
          contact.message,
          contact.filename,
          `/home/bolat/projects/contact-manager/backend/images/${contact.name}/${contact.filename}.jpeg`,
          contact.size,
          contact.mimetype,
          new Date(Date.now()).toString(),
        ],
        function () {
          resolve(this.lastID);
        }
      );
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
