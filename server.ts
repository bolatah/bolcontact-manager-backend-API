import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import passport from "passport";

dotenv.config();

const PORT = process.env.PORT || 8001;

const app = express();

require("./config/database");
require("./models/user");
require("./models/contact");
require("./config/passport")(passport);

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
    allowedHeaders: [
      "Authorization",
      "Content-Type",
      "Origin",
      "Accept",
      " X-Requested-With",
    ],
  })
);
app.use(passport.initialize());
app.use(express.json({ limit: "50mb" }));
app.use(
  express.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);
app.use(express.static("build"));

// Routes
app.use("/api/users", require("./routes/users"));
app.use("/api/contacts", require("./routes/contacts"));

// listen to port
app.listen(PORT, () => {
  console.log(`web service has started`);
});
