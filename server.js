import dotenv from "dotenv";
import express, { Express } from "express";
const cors = require("cors");

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
    origin: "https://bolatah-contact-manager.herokuapp.com",
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
app.use(express.static("public"));
/* app.use(
  express.static(
    path.resolve(__dirname, "/home/bolat/projects/contact-manager/client/build")
  )
); */
/* app.get("*", function (_request, response) {
  response.sendFile(
    path.resolve(
      __dirname,
      "/home/bolat/projects/contact-manager/client/build",
      "index.html"
    )
  );
}); */
// Routes
app.use("/api/users", require("./routes/users"));
app.use("/api/contacts", require("./routes/contacts"));

// listen to port
app.listen(PORT, () => {
  console.log(`web service is listening to  http://${HOST}:${PORT}`);
});
