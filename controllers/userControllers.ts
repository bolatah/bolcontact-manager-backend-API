import { NextFunction, Request, Response } from "express";
import { IRefreshToken, IUser } from "../interfaces/userInterface";
import bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";

const User = require("../interfaces/userInterface");
const UsersManager = require("../sql_service/DBService");
const usersManager = new UsersManager();

module.exports = class UserControllers {
  handleLogin = async (req: Request, res: Response) => {
    const cookies = req.cookies;
    const { username, password } = req.body;
    try {
      if (!(username && password)) {
        res.status(400).send("All inputs are required");
      }

      // validate if user exist in our database
      const data = await usersManager.getUserByUsernameOrEmail(username);
      const foundUser = data.rows[0];
      const match = await bcrypt.compare(password, foundUser.password);
      if (foundUser && match) {
        const accessToken = jwt.sign(
          { username: foundUser.username },
          process.env.ACCESS_TOKEN_KEY,
          {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRATION,
          }
        );
        const newRefreshToken = jwt.sign(
          { username: foundUser.username },
          process.env.REFRESH_TOKEN_KEY,
          {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRATION,
          }
        );

        let newRefreshTokenArray: IRefreshToken[] = !cookies.jwt
          ? foundUser.refresh_token.token == ""
            ? []
            : foundUser.refresh_token
          : foundUser.refresh_token.filter((rt) => rt["token"] !== cookies.jwt);

        // console.log(`newRefreshTokenArray: ${newRefreshTokenArray}`);

        if (cookies?.jwt) {
          const jwtToken = cookies.jwt;
          const foundTokenCheck = foundUser.refresh_token.some(
            (token) => token.token === jwtToken
          );

          if (foundTokenCheck === false) {
            newRefreshTokenArray = [];
          }
          res.clearCookie("jwt", {
            httpOnly: true,
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            secure: process.env.NODE_ENV === "production" ? true : false,
          });
        }
        console.log(`newRefreshTokenArray: ${newRefreshTokenArray.length}`);

        for (let i = 1; i < newRefreshTokenArray.length; i++) {
          foundUser.refresh_token = [
            ...newRefreshTokenArray,
            { index: i, token: newRefreshToken },
          ];

          console.log(`foundUser.refresh_token: ${foundUser.refresh_token}`);

          const x = await usersManager.updateRefreshToken(
            foundUser,
            foundUser.user_id
          );
        }

        res
          .status(200)
          .cookie("jwt", newRefreshToken, {
            httpOnly: true,
            expires: new Date(
              Date.now() +
                parseInt(process.env.REFRESH_TOKEN_EXPIRATION) * 60 * 1000
            ),
            maxAge: parseInt(process.env.REFRESH_TOKEN_EXPIRATION) * 60 * 1000,

            secure: process.env.NODE_ENV === "production" ? true : false,
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
          })
          .cookie("logged_in", true, {
            httpOnly: false,
            expires: new Date(
              Date.now() +
                parseInt(process.env.ACCESS_TOKEN_EXPIRATION) * 60 * 1000
            ),
            maxAge: parseInt(process.env.ACCESS_TOKEN_EXPIRATION) * 60 * 1000,
            secure: process.env.NODE_ENV === "production" ? true : false,
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
          })
          .json({ user: foundUser, accessToken: accessToken });
        cookies.jwt = newRefreshToken;
      }
    } catch (err) {
      res.status(401).send("Invalid Credentials");
    }
  };
  handleRegister = async (req: Request, res: Response) => {
    try {
      const { username, email, phone, password } = req.body;
      // validate user input
      if (!(username && email && phone && password)) {
        return res.status(400).send("All inputs are required");
      }

      // check if user already exists
      const oldUser = await usersManager.getCountUser(email, username);

      if (oldUser.count > 0) {
        return res.status(409).send("User already exists");
      }

      bcrypt.hash(password as string, 10, async (err: Error, hash: string) => {
        if (err) {
          return res.status(401).send("Wrong password");
        }

        const user = {
          username: username,
          email: email,
          phone: phone,
          password: hash,
        };

        await usersManager.addUser(user);
        return res.status(201).json(user);
      });
    } catch (err) {
      return console.log(err);
    }
  };

  handleLogout = async (req: Request, res: Response, err: Error) => {
    try {
      res.cookie("jwt", "", { maxAge: 1 });
      res
        .cookie("logged_in", "", {
          maxAge: 1,
        })
        .json({
          message: "User logged out",
        });
    } catch (err) {
      return console.log(err);
    }
  };

  getAllUsers = async (req: Request, res: Response) => {
    const data = await usersManager.getUsers();
    const users = data.rows;
    users.forEach((user) => {
      user.href = `/api/users/${user.user_id}`;
    });
    res.status(200).send(users);
  };
  getUserByID = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const data = await usersManager.getUserById(id);
    const user = data.rows;
    if (user.length > 0) {
      res.status(200).send(user);
      console.log("showing an user");
    } else {
      res.status(404).send();
    }
  };

  handleRefreshToken = async (req: Request, res: Response): Promise<void> => {
    const cookies = req.cookies;
    console.log(cookies);
    try {
      if (!cookies?.jwt) {
        res.status(401).send("No token as cookie found");
      }
      const refreshTokenFromCookie = cookies.jwt;
      console.log(`refresh_token: ${refreshTokenFromCookie}`);

      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        secure: process.env.NODE_ENV === "production" ? true : false,
      });

      const foundUserData = await usersManager.getUserByRefreshToken(
        refreshTokenFromCookie
      );
      const foundUser: IUser = foundUserData.rows[0];

      console.log(foundUserData);

      if (!foundUser) {
        jwt.verify(
          refreshTokenFromCookie,
          process.env.REFRESH_TOKEN_KEY,
          async (err: any, decoded: any) => {
            if (err) {
              return res.status(403).send("Not authorized");
            }
            const hackedUser = await usersManager.getUserByUsernameOrEmail(
              decoded.username
            );
            hackedUser.refresh_token = [];
            // await hackedUser.save();
          }
        );
      }

      const newRefreshTokenArray = foundUser.refresh_token.filter(
        (rt) => rt.token !== refreshTokenFromCookie
      );

      jwt.verify(
        refreshTokenFromCookie,
        process.env.REFRESH_TOKEN_KEY,
        async (err: Error, decoded: IUser) => {
          if (err) {
            // expired refresh token
            foundUser.refresh_token = [...newRefreshTokenArray];
            await usersManager.updateRefreshToken(foundUser, foundUser.user_id);
          }
          if (err || decoded.username !== foundUser.username) {
            return res.status(403).send("Forbidden");
          }

          // refresh token is valid
          const accessToken = jwt.sign(
            { username: decoded.username },
            process.env.ACCESS_TOKEN_KEY,
            {
              expiresIn: process.env.ACCESS_TOKEN_EXPIRATION,
            }
          );

          const newRefreshToken = JSON.stringify({
            token: jwt.sign(
              { username: foundUser.username },
              process.env.REFRESH_TOKEN_KEY,
              {
                expiresIn: process.env.REFRESH_TOKEN_EXPIRATION,
              }
            ),
          });
          for (let i = 1; i < newRefreshTokenArray.length; ) {
            foundUser.refresh_token = [
              ...newRefreshTokenArray,
              { index: i, token: newRefreshToken },
            ];

            const x = await usersManager.updateRefreshToken(
              foundUser,
              foundUser.user_id
            );
            console.log(x);
          }

          cookies.jwt = newRefreshToken;

          res
            .status(200)
            .cookie("jwt", newRefreshToken, {
              httpOnly: true,
              expires: new Date(
                Date.now() +
                  parseInt(process.env.REFRESH_TOKEN_EXPIRATION) * 60 * 1000
              ),
              sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
              secure: process.env.NODE_ENV === "production" ? true : false,
            })
            .json({ accessToken });
        }
      );
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  };
};
