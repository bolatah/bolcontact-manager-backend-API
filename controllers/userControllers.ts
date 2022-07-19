import { NextFunction, Request, Response } from "express";
import { IUser } from "../interfaces/userInterface";
import bcrypt from "bcryptjs";

const jwt = require("jsonwebtoken");
const User = require("../interfaces/userInterface");
const UsersManager = require("../sql_service/userDBService");
const usersManager = new UsersManager();

module.exports = class UserControllers {
  handleLogin = async (req: Request, res: Response) => {
    try {
      const cookies = req.cookies;
      const { username, password } = req.body;
      if (!(username && password)) {
        res.status(400).send("All inputs are required");
      }

      // validate if user exist in our database
      const foundUser = await usersManager.getUserByUsernameOrEmail(username);
      const match = await bcrypt.compare(password, foundUser.password);
      // console.log(foundUser);
      if (foundUser && match) {
        const accessToken = await jwt.sign(
          { username: foundUser.username },
          process.env.ACCESS_TOKEN_KEY,
          {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRATION,
          }
        );
        const newRefreshToken = await jwt.sign(
          { username: foundUser.username },
          process.env.REFRESH_TOKEN_KEY,
          {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRATION,
          }
        );

        // console.log(`accessToken: ${accessToken}`);
        // console.log(`accessTokenLength: ${accessToken.length}`);
        // console.log(`newRefreshToken: ${newRefreshToken}`);
        // console.log(`newRefreshTokenLength: ${newRefreshToken.length}`);

        let newRefreshTokenString = !`${cookies?.jwt}`
          ? `${foundUser.refreshToken}` // if no cookie, use the old refresh token
          : `${foundUser.refreshToken}`.replace(`${cookies?.jwt}`, ""); // if cookie, use the new refresh token
        //foundUser.refreshToken.filter((rt) => rt !== cookies.jwt);

        // console.log(`refreshToken: ${foundUser.refreshToken}`);
        // console.log(`newRefreshTokenString: ${newRefreshTokenString}`);
        // console.log(`cookies: ${JSON.stringify(cookies)}`);

        if (cookies?.jwt) {
          // if cookie, delete the old refresh token
          const refreshToken = `${cookies.jwt}`;
          const foundTokenCheck = foundUser.refreshToken.includes(refreshToken);

          if (foundTokenCheck === false) {
            // if the old refresh token is not in the database, delete it
            newRefreshTokenString = "";
          }
          res.clearCookie("jwt", {
            httpOnly: true,
            sameSite: "none",
            secure: process.env.NODE_ENV === "production" ? true : false,
          });
        }
        // console.log(
        //   `foundUserRefreshToken: ${foundUser.refreshToken}`,
        //   `newRefreshTokenString: ${newRefreshTokenString}`
        // );

        // saving resfresh token to user
        foundUser.refreshToken = newRefreshTokenString.startsWith("null")
          ? newRefreshTokenString
              .replace("null", "")
              .concat(`${newRefreshToken}`)
          : // .concat(`${newRefreshToken}rt_`)
            newRefreshTokenString.substring(155).concat(`${newRefreshToken}`);
        // : newRefreshTokenString.split("rt_")[1].concat(`${newRefreshToken}`);
        // console.log(`foundUserRefreshToken: ${foundUser.refreshToken}`);

        const id = parseInt(foundUser.id);

        const handleUpdateRefreshToken = await usersManager.updateRefreshToken(
          id,
          foundUser
        );
        // console.log(foundUser);
        // console.log(`handleUpdateRefreshToken: ${handleUpdateRefreshToken}`);

        res
          .status(200)
          .cookie("jwt", newRefreshToken, {
            httpOnly: true,
            expires: new Date(
              Date.now() +
                parseInt(process.env.REFRESH_TOKEN_EXPIRATION) * 60 * 1000
            ),
            maxAge: parseInt(process.env.REFRESH_TOKEN_EXPIRATION) * 60 * 1000,
            sameSite: "none",
            secure: process.env.NODE_ENV === "production" ? true : false,
          })
          .cookie("logged_in", true, {
            httpOnly: false,
            expires: new Date(
              Date.now() +
                parseInt(process.env.ACCESS_TOKEN_EXPIRATION) * 60 * 1000
            ),
            maxAge: parseInt(process.env.ACCESS_TOKEN_EXPIRATION) * 60 * 1000,
            secure: process.env.NODE_ENV === "production" ? true : false,
            sameSite: "none",
          })
          .json({ user: foundUser, accessToken: accessToken });
        // console.log(res.cookie);
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

      bcrypt.hash(password, 10, async (err: any, hash: any) => {
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
      res.cookie("accessToken", "", { maxAge: 1 });
      res.cookie("refreshToken", "", { maxAge: 1 });
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
    const users = await usersManager.getUsers();
    users.forEach((user: IUser) => {
      user.href = `/api/users/${user.id}`;
    });
    res.status(200).send(users);
  };
  handleTest = (req: Request, res: Response) => {
    res.status(200).json({ test: "test" });
  };

  getUserByID = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const user = await usersManager.getUserById(id);
    if (user) {
      res.status(200).send(user);
      console.log("showing an user");
    } else {
      res.status(404).send();
    }
  };

  handleRefreshToken = (req: Request, res: Response) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
      return res.status(401).send("No token found");
    }
    console.log(`cookies: ${JSON.stringify(cookies.jwt)}`);
    const refreshToken = cookies.jwt;
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "none",
      secure: process.env.NODE_ENV === "production" ? true : false,
    });

    //const foundUser = usersManager.getUserByRefreshToken(refreshToken);
    const foundUser = usersManager.getUserByRefreshToken(refreshToken);

    if (!foundUser) {
      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_KEY,
        async (err: any, decoded: any) => {
          if (err) {
            return res.status(403).send("Forbidden");
          }
          const hackedUser = await usersManager.getUserByUsernameOrEmail(
            decoded.username
          );
          hackedUser.refreshToken = "";
          // await hackedUser.save();
        }
      );
    }

    const newRefreshTokenString = JSON.stringify(
      foundUser.refreshToken.replace(`${refreshToken}`, "")
    );
    console.log(`newRefreshTokenString: ${newRefreshTokenString}`);
    // const newRefreshTokenArray = foundUser.refreshToken.filter(
    //   (token) => token !== refreshToken
    // );

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_KEY,
      async (err: any, decoded: any) => {
        if (err) {
          // expired refresh token
          foundUser.refreshToken = newRefreshTokenString;
          // await foundUser.save();
        }
        if (err || decoded.username !== foundUser.username) {
          return res.status(403).send("Forbidden refresh token");
        }

        // refresh token is valid
        const accessToken = jwt.sign(
          { username: decoded.username },
          process.env.ACCESS_TOKEN_KEY,
          {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRATION,
          }
        );
        // req.headers["Authorization"] = `Bear ${accessToken}`;

        const newRefreshToken = jwt.sign(
          { username: decoded.username },
          process.env.REFRESH_TOKEN_KEY,
          {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRATION,
          }
        );

        foundUser.refreshToken = newRefreshTokenString.startsWith("null")
          ? newRefreshTokenString
              .replace("null", "")
              .concat(`${newRefreshToken}`)
          : // .concat(`${newRefreshToken}rt_`)
            newRefreshTokenString.substring(155).concat(`${newRefreshToken}`);
        // : newRefreshTokenString.split("rt_")[1].concat(`${newRefreshToken}`);
        console.log(`foundUserRefreshToken: ${foundUser.refreshToken}`);

        const id = parseInt(foundUser.id);

        await usersManager.updateRefreshToken(id, foundUser);

        cookies.jwt = newRefreshToken;

        res
          .cookie("jwt", newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production" ? true : false,
            sameSite: "none",
            maxAge: 24 * 60 * 60 * 1000,
          })
          .status(200)
          .json(accessToken);
      }
    );
  };
};
