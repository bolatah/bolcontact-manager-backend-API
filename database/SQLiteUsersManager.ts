const sqlite3 = require("sqlite3");
import { User } from "../models/user";

require("dotenv").config();

const dbUsers = new sqlite3.Database(process.env.DB);

module.exports = class SQLiteUsersManager {
  constructor() {
    this.init();
  }
  init() {
    dbUsers.run(`
    CREATE TABLE IF NOT EXISTS
        users(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL CHECK(username<>''),
            email TEXT UNIQUE NOT NULL CHECK(email<>''),
            phone INTEGER UNIQUE NOT NULL CHECK(phone<>''),
            password TEXT NOT NULL CHECK(password<>'')

        )`);
  }
  async addUser(user: User) {
    return new Promise((resolve, _reject) => {
      dbUsers.run(
        `INSERT
                INTO users(username, email, phone, password)
                VALUES(?,?, ?, ?)`,
        [user.username, user.email, user.phone, user.password],
        function () {
          resolve(dbUsers.lastID);
        }
      );
    });
  }

  async getUserByEmail(email: string) {
    return new Promise((resolve, reject) => {
      dbUsers.get(
        `SELECT * FROM users WHERE email=?`,
        [email],
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
  async getCountUser(email: string, username: string) {
    return new Promise((resolve, reject) => {
      dbUsers.get(
        `SELECT count(*) as c1 FROM users WHERE email=? or username = ?`,
        [email, username],
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
  async getUserByUsername(username: string) {
    return new Promise((resolve, reject) => {
      dbUsers.get(
        `SELECT * FROM users WHERE username=?`,
        [username],
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

  async getUserByUsernameOrEmail(usernameOrEmail: any) {
    return new Promise((resolve, reject) => {
      dbUsers.get(
        `SELECT * FROM users WHERE username=? or email=?`,
        [usernameOrEmail, usernameOrEmail],
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

  async getUserById(id: number) {
    return new Promise((resolve, reject) => {
      dbUsers.get(
        `SELECT * FROM users WHERE id=?`,
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

  async getUsers() {
    return new Promise((resolve, reject) => {
      dbUsers.all("SELECT * FROM users", [], (error: any, rows: unknown) => {
        if (error) {
          reject(error);
        } else {
          resolve(rows);
        }
      });
    });
  }
};
