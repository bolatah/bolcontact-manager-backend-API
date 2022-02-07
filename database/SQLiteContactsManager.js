const sqlite3 = require("sqlite3");
require("dotenv").config();

const db = new sqlite3.Database(process.env.DB);

module.exports = class SQLiteContactsManager {
  constructor() {
    this.init();
  }
  init() {
    db.run(`
    CREATE TABLE IF NOT EXISTS
        contacts(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT,
            message TEXT
        )`);
  }
  async addContact(contact) {
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT
                INTO contacts(name, email, message)
                VALUES(?,?,?)`,
        [contact.name, contact.email, contact.message],
        function () {
          resolve(this.lastID);
        }
      );
    });
  }

  async getContact(id) {
    return new Promise((resolve, reject) => {
      db.get("SELECT * FROM contacts WHERE id=?", [id], (error, row) => {
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
                                message = ?
                            WHERE 
                                id = ?`,
        [contact.name, contact.email, contact.message, id],
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
