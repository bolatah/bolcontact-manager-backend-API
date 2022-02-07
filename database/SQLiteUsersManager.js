const sqlite3 = require("sqlite3");
require("dotenv").config();

const db = new sqlite3.Database(process.env.DBUsers);

module.exports = class SQLiteUsersManager {
  constructor() {
    this.init();
  }
  init() {
    db.run(`
    CREATE TABLE IF NOT EXISTS
        users(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL CHECK(username<>''),
            email TEXT UNIQUE NOT NULL CHECK(email<>''),
            phone INTEGER UNIQUE NOT NULL CHECK(phone<>''),
            password TEXT NOT NULL CHECK(password<>'')

        )`);
  }
  async addUser(user) {
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT
                INTO users(username, email, phone, password)
                VALUES(?,?, ?, ?)`,
        [user.username, user.email, user.phone, user.password],
        function () {
          resolve(this.lastID);
        }
      );
    });
  }

  async getUserByEmail(email) {
    return new Promise((resolve, reject) => {
      db.get(`SELECT * FROM users WHERE email=?`, [email], (error, row) => {
        if (error) {
          reject(error);
        } else {
          resolve(row);
        }
      });
    });
  }

  async getUserByUsername(username) {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT * FROM users WHERE username=?`,
        [username],
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

  async getUserById(id) {
    return new Promise((resolve, reject) => {
      db.get(`SELECT * FROM users WHERE id=?`, [id], (error, row) => {
        if (error) {
          reject(error);
        } else {
          resolve(row);
        }
      });
    });
  }

  async getUsers() {
    return new Promise((resolve, reject) => {
      db.all("SELECT * FROM users", [], (error, rows) => {
        if (error) {
          reject(error);
        } else {
          resolve(rows);
        }
      });
    });
  }
};
