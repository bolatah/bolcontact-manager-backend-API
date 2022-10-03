//import dotenv from "dotenv";
import dotenv from "dotenv";
import { Pool } from "pg";
import { IUser, IRefreshToken } from "../interfaces/userInterface";
import { Contact } from "../interfaces/contactInterface";
dotenv.config();

module.exports = class DBService {
  // constructor() {
  //   this.init();
  // }
  // init() {
  //   pool.query(
  //     `CREATE TABLE IF NOT EXISTS users (
  //         user_id SERIAL PRIMARY KEY,
  //         username TEXT  UNIQUE NOT NULL,
  //         email TEXT UNIQUE NOT NULL,
  //         phone TEXT UNIQUE NOT NULL,
  //         password TEXT NOT NULL,
  //         refreshToken TEXT
  //         );
  //         CREATE TABLE IF NOT EXISTS contacts(
  //           contact_id SERIAL PRIMARY KEY,
  //           name TEXT ,
  //           email TEXT ,
  //           phone INTEGER,
  //           message TEXT,
  //           img TEXT,
  //           dateCreated DATE
  //           );
  //         `,
  //     (err, _res) => {
  //       if (err) {
  //         throw err;
  //       }
  //       console.log("Table created");
  //     }
  //   );
  // }
  pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT) || 5432,
  });
  client = this.pool.connect();
  // select last_insert_rowid();
  async addUser(user: IUser, token: IRefreshToken["token"]): Promise<any> {
    return new Promise(async (resolve, reject) => {
      (await this.client).query(
        `INSERT
                INTO users(username, email, phone, password, refresh_token)
                VALUES($1,$2,$3,$4, ARRAY[$5]::jsonb[]);`,
        [
          user.username,
          user.email,
          user.phone,
          user.password,
          user.refresh_token === undefined
            ? { index: 0, token: "" }
            : user.refresh_token?.map((item: IRefreshToken, index) => {
                (index = item.index), (token = item.token);
              }),
        ],
        function (err: Error, rows: any) {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        }
      );
    });
  }
  async updateRefreshToken(user: IUser, user_id: number): Promise<any> {
    return new Promise(async (resolve, reject) => {
      (await this.client).query(
        `UPDATE users SET 
          refresh_token = $1::jsonb[]
              WHERE user_id=$2;`,
        [user.refresh_token, user_id],
        (error: Error, row: any) => {
          if (error) {
            reject(error);
          }
          resolve(row);
        }
      );
    });
  }

  async deleteRefreshToken(user_id: number): Promise<any> {
    return new Promise(async (resolve, reject) => {
      (await this.client).query(
        `UPDATE users SET 
          refresh_token = NULL
              WHERE user_id=$1;`,
        [user_id],
        (error: Error, row: any) => {
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
    return new Promise(async (resolve, reject) => {
      (await this.client).query(
        `SELECT * FROM users WHERE email=$1;`,
        [email],
        (error: Error, row: any) => {
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
    return new Promise(async (resolve, reject) => {
      (await this.client).query(
        `SELECT count(*) as count FROM users WHERE email= $1 or username = $2`,
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
    return new Promise(async (resolve, reject) => {
      (await this.client).query(
        `SELECT * FROM users WHERE username= $1;`,
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
  async getUserByRefreshToken(refresh_token: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      (await this.client).query(
        `SELECT * FROM users WHERE refresh_token=$1::jsonb[];`,
        [refresh_token, console.log(refresh_token)],
        (error: Error, row: any) => {
          if (error) {
            reject(error);
            console.log(error);
          } else {
            resolve(row);
            console.log(row);
          }
        }
      );
    });
  }
  async getUserByUsernameOrEmail(usernameOrEmail: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      (await this.client).query(
        `SELECT * FROM users WHERE username= $1 or email= $2;`,
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

  async getUserById(user_id: number) {
    return new Promise(async (resolve, reject) => {
      (await this.client).query(
        `SELECT * FROM users WHERE user_id=$1;`,
        [user_id],
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

  async getUsers() {
    return new Promise(async (resolve, reject) => {
      (await this.client).query(
        "SELECT * FROM users;",
        [],
        (error: Error, rows: unknown) => {
          if (error) {
            reject(error);
          } else {
            resolve(rows);
          }
        }
      );
    });
  }

  async addContact(contact: Contact, imgBase64: any) {
    return new Promise<void>(async (resolve, reject) => {
      (await this.client).query(
        `INSERT
              INTO contacts(name, email, phone, message, img, dateCreated)
              VALUES($1,$2,$3,$4,$5,$6); select last_insert_rowid();`,
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

  async getCountContact(email: string, username: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      (await this.client).query(
        "SELECT COUNT(*) as count FROM contacts WHERE email= $1 or name=$2;",
        [email, username],
        (error: any, row: unknown) => {
          if (error) {
            reject(error);
          }
          resolve(row);
        }
      );
    });
  }
  async getContactImage(id: number) {
    return new Promise(async (resolve, reject) => {
      (await this.client).query(
        "SELECT img FROM contacts WHERE id=$1;",
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
    return new Promise(async (resolve, reject) => {
      (await this.client).query(
        "SELECT * FROM contacts WHERE id=$1;",
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
    return new Promise(async (resolve, reject) => {
      (await this.client).query(
        `UPDATE contacts SET
                              name = $1,
                              email = $2,
                              phone = $3,
                              message = $4, 
                              img = $5,
                              dateCreated= $6
                          WHERE 
                              id = $1;`,
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
    return new Promise(async (resolve, reject) => {
      (await this.client).query(
        "DELETE FROM contacts WHERE id = $1;",
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
    return new Promise(async (resolve, reject) => {
      (await this.client).query(
        "SELECT * FROM contacts;",
        [],
        (error: any, rows: unknown) => {
          if (error) {
            reject(error);
          } else {
            resolve(rows);
          }
        }
      );
    });
  }
};
