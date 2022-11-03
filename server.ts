import dotenv from "dotenv";
import express, { Express } from "express";
const cors = require("cors");

const passport = require("passport");

dotenv.config();

const PORT = process.env.PORT;
const HOST = process.env.HOST;

const app = express();
app.use(express.static("public"));
app.use(cors());
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

/* app.use(
  cors({
    credentials: true,
    origin: "https://bolatah-contact-manager.herokuapp.com",
    allowedHeaders: [
      "Authorization",
      "Content-Type",
      "Origin",
      "Accept",
      " X-Requested-With",
    ],
    allowedMethods: ["POST", "OPTIONS", "GET", "PUT", "DELETE"],
  })
); */

/** API Access Policies */
/* app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
}); */

// Routes
app.use("/api/users", require("./routes/users"));
app.use("/api/contacts", require("./routes/contacts"));

// listen to port
app.listen(PORT, () => {
  console.log(`web service is listening to  http://${HOST}:${PORT}`);
});
