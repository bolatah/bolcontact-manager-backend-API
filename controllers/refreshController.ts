import { Request, Response } from "express";
import { IUser } from "../interfaces/userInterface";

const jwt = require("jsonwebtoken");
const User = require("../interfaces/userInterface");
const UsersManager = require("../sql_service/userDBService");
const usersManager = new UsersManager();
class RefreshController {
  handleRefreshToken = handleRefreshToken;
}
const handleRefreshToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const cookies = (req as Request).cookies.jwt;

    if (!cookies?.jwt) {
      res.status(401).send("No token found");
    }

    const refreshToken: string = cookies.jwt;

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
          hackedUser.refreshToken = "";
          // await hackedUser.save();
        }
      );
    }

    let newRefreshTokenString = foundUser.refreshToken
      .toString()
      .replace(`${refreshToken}`, "");
    //console.log(`newRefreshTokenString: ${newRefreshTokenString}`);
    // const newRefreshTokenArray = foundUser.refreshToken.filter(
    //   (token) => token !== refreshToken
    // );

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_KEY,
      async (err: any, decoded: any) => {
        if (err) {
          // expired refresh token
          newRefreshTokenString = `${newRefreshTokenString}`;
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
        // req.headers["Authorization"] = `Bear ${accessToken}`;

        const newRefreshToken = jwt.sign(
          { username: decoded.username },
          process.env.REFRESH_TOKEN_KEY,
          {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRATION,
          }
        );
        foundUser.refreshToken = JSON.parse(
          newRefreshTokenString.concat(`${newRefreshToken}`)
        );

        // foundUser.refreshToken = newRefreshTokenString.startsWith("null")
        //   ? newRefreshTokenString
        //       .replace("null", "")
        //       .concat(`${newRefreshToken}`)
        //   : // .concat(`${newRefreshToken}rt_`)
        //     newRefreshTokenString.substring(155).concat(`${newRefreshToken}`);
        // : newRefreshTokenString.split("rt_")[1].concat(`${newRefreshToken}`);
        //console.log(`foundUserRefreshToken: ${foundUser.refreshToken}`);

        const id = parseInt(foundUser.id);

        await usersManager.updateRefreshToken(id, foundUser);

        req.cookies.jwt = newRefreshToken;

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
          .json(accessToken);
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

module.exports = RefreshController;
