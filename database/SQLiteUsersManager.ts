import { Database } from "sqlite3";
import { User } from "../models/user";
import { config } from "../server";


const dbUsers = new Database(config.DB);

export class SQLiteUsersManager {
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

  async addUser(user: User): Promise<any> {
    return new Promise((resolve, reject) => {
      dbUsers.run(
        `INSERT
                INTO users(username, email, phone, password)
                VALUES(?,?, ?, ?);  select last_insert_rowid();`,
        [user.username, user.email, user.phone, user.password],
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

  async getUserByEmail(email: string) {
    return new Promise((resolve, reject) => {
      dbUsers.get(
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
      dbUsers.get(
        `SELECT count(*) as c1 FROM users WHERE email=? or username = ?`,
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
      dbUsers.get(
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

  async getUserByUsernameOrEmail(usernameOrEmail: any): Promise<any> {
    return new Promise((resolve, reject) => {
      dbUsers.get(
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
      dbUsers.get(
        `SELECT * FROM users WHERE id=?`,
        [id],
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

  async getUsers(): Promise<Array<any>> {
    return new Promise((resolve, reject) => {
      dbUsers.all("SELECT * FROM users", [], (error: any, rows: Array<any>) => {
        if (error) {
          reject(error);
        } else {
          resolve(rows);
        }
      });
    });
  }
};

export const usersManager = new SQLiteUsersManager();