const sqlite3 = require("sqlite3");
require("dotenv").config();
const fs = require("fs");
const { resolve } = require("path/posix");
const db = new sqlite3.Database(process.env.DB);
const { v4: uuidv4 } = require("uuid");
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
            message TEXT,
        )`);

    db.run(`
        CREATE TABLE IF NOT EXISTS
          contactImages(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            contactId INTEGER,                         
            mimetype TEXT,                         
            filename TEXT,                         
            size INTEGER,                         
            dateCreated DATE
          )
        `);
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

  async uploadSingleFile(contactId, file) {
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO contactImages (contactId, filename, mimetype, size, dateCreated) VALUES (?,?,?,?,?)`,
        [contactId, file.filename, file.mimetype, file.size, Date("now")],
        function () {
          resolve(this.lastID);
          const dir = `./images/${contactId}/`;
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }

          const oldPath = `./images/${file.filename}`;
          const newPath = `./images/${contactId}/${file.filename}.jpg`;

          fs.rename(oldPath, newPath, function (err) {
            if (err) {
              console.error(err);
            }
            console.log("Successfully Moved File");
          });
        }
      );
    });
  }

  async uploadMultipleFiles(contactId, files) {
    return new Promise((resolve, reject) => {
      const dir = `./images/${contactId}/`;

      files.forEach((file) => {
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        const newFileName = `${uuidv4()}`;
        const newPath = `./images/${contactId}/${newFileName}.jpg`;
        const imageBinary = Buffer.from(file.filename);
        console.log(imageBinary);
        fs.writeFile(newPath, imageBinary, "base64", function (err) {
          if (err) {
            console.error(err);
          }
          console.log("Successfully Moved File");
        });
      });
      db.run(
        `INSERT INTO contactImages (contactId, filename, mimetype, size, dateCreated) VALUES (?,?,?,?,?)`,
        [contactId, files.filename, files.mimetype, files.size, Date("now")],
        function () {
          resolve(this.lastID);
        }
      );
    });
  }
};
