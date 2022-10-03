import { Request, Response } from "express";
import { IUser } from "../interfaces/userInterface";

const jwt = require("jsonwebtoken");

const User = require("../interfaces/userInterface");
const UsersManager = require("../sql_service/DBService");
const usersManager = new UsersManager();

class RefreshController {
  handleRefreshToken = async (req: Request, res: Response): Promise<void> => {
    const cookies = req.cookies.jwt;
    try {
      if (!cookies?.jwt) {
        res.status(401).send("No token found");
      }

      const refreshToken = cookies.jwt;
      console.log(`refreshToken: ${refreshToken}`);
      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "none",
        secure: process.env.NODE_ENV === "production" ? true : false,
      });

      //const foundUser = usersManager.getUserByRefreshToken(refreshToken);
      const foundUser: IUser = await usersManager.getUserByRefreshToken(
        refreshToken
      );

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
            hackedUser.refreshToken = [];
            // await hackedUser.save();
          }
        );
      }

      const newRefreshTokenArray = foundUser.refreshToken.filter(
        (rt) => rt !== refreshToken
      );

      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_KEY,
        async (err: any, decoded: any) => {
          if (err) {
            // expired refresh token
            foundUser.refreshToken = [...newRefreshTokenArray];
            // await foundUser.save();
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

          const newRefreshToken = jwt.sign(
            { username: decoded.username },
            process.env.REFRESH_TOKEN_KEY,
            {
              expiresIn: process.env.REFRESH_TOKEN_EXPIRATION,
            }
          );
          foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];

          const id = parseInt(foundUser.id);

          await usersManager.updateRefreshToken(id, foundUser);

          cookies.jwt = newRefreshToken;

          res
            .status(200)
            .cookie("jwt", newRefreshToken, {
              httpOnly: true,
              expires: new Date(
                Date.now() +
                  parseInt(process.env.REFRESH_TOKEN_EXPIRATION) * 60 * 1000
              ),
              sameSite: "none",
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
}

module.exports = RefreshController;
