import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { Database } from "sqlite3";
import { IUser } from "../interfaces/userInterface";

dotenv.config();

const db = new Database(process.env.USER_DB);
const salt = bcrypt.genSaltSync(10);
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
            password TEXT NOT NULL CHECK(password<>''),
            refreshToken TEXT)`);
  }

  async addUser(user: IUser): Promise<any> {
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT
                INTO users(username, email, phone, password,  refreshToken)
                VALUES(?,?,?,?,?);  select last_insert_rowid();`,
        [
          user.username,
          user.email,
          user.phone,
          user.password,
          user.refreshToken?.toString(),
        ],
        function (err, rows) {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        }
      );
    });
  }
  async updateRefreshToken(id: number, user: IUser): Promise<any> {
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE users SET refreshToken = ? WHERE id = ?`,
        [user.refreshToken?.toString(), id],
        (error: any, row: any) => {
          if (error) {
            reject(error);
          } else {
            resolve(row);
          }
        }
      );
    });
  }
  async getUserByEmail(email: string) {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT * FROM users WHERE email=?`,
        [email],
        (error: any, row: any) => {
          if (error) {
            reject(error);
          } else {
            resolve(row);
          }
        }
      );
    });
  }
  async getCountUser(email: string, username: string): Promise<any> {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT count(*) as count FROM users WHERE email=? or username = ?`,
        [email, username],
        (error: any, row: any) => {
          if (error) {
            reject(error);
          } else {
            resolve(row);
          }
        }
      );
    });
  }
  async getUserByUsername(username: string): Promise<any> {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT * FROM users WHERE username=?`,
        [username],
        (error: any, row: any) => {
          if (error) {
            reject(error);
          } else {
            resolve(row);
          }
        }
      );
    });
  }
  async getUserByRefreshToken(refreshToken: string): Promise<any> {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT * FROM users WHERE refrashToken=?`,
        [refreshToken],
        (error: any, row: any) => {
          if (error) {
            reject(error);
          } else {
            resolve(row);
          }
        }
      );
    });
  }
  async getUserByUsernameOrEmail(usernameOrEmail: any): Promise<any> {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT * FROM users WHERE username=? or email=?`,
        [usernameOrEmail, usernameOrEmail],
        (error: any, row: any) => {
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
      db.get(`SELECT * FROM users WHERE id=?`, [id], (error: any, row: any) => {
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
      db.all("SELECT * FROM users", [], (error: any, rows: unknown) => {
        if (error) {
          reject(error);
        } else {
          resolve(rows);
        }
      });
    });
  }
};
