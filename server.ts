import dotenv from "dotenv";
import express, { Express } from "express";
const cors = require("cors");
const path = require("path");

const passport = require("passport");

dotenv.config();

const PORT = process.env.PORT || 8000;
const HOST = process.env.HOST || "localhost";

const app = express();

require("./config/database");
require("./models/user");
require("./models/contact");
require("./config/passport")(passport);

app.use(passport.initialize());
app.use(express.json({ limit: "50mb" }));
app.use(
  express.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);
app.use(
  cors({
    credentials: true,
    origin: process.env.REACT_APP_ORIGIN || "http://localhost:3000",
    allowedHeaders: [
      "Authorization",
      "Content-Type",
      "Origin",
      "Accept",
      " X-Requested-Wit",
    ],
    allowedMethods: ["POST", "OPTIONS", "GET", "PUT", "DELETE"],
  })
);

// Routes
app.use("/api/users", require("./routes/users"));
app.use("/api/contacts", require("./routes/contacts"));

// Error Handling
/* app.use((req, res, next) => {
  const error = new Error("Not Found");
  return res.status(404).json({
    message: error.message,
  });
}); */

// listen to port
app.listen(PORT, () => {
  console.log(`web service is listening to  http://${HOST}:${PORT}`);
});
