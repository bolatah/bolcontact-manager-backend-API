import dotenv from "dotenv";
import express from "express";
//import cors from "cors";
import userRoutes from "./routes/users";
import contactRoutes from "./routes/contacts";
import passport from "passport";

dotenv.config();

const PORT = process.env.PORT || 8001;

const app = express();

require("./config/database");
require("./models/user");
require("./models/contact");
require("./config/passport")(passport);

/* const corsOptions = {
  credentials: true,
  origin: "https://bolatah-contact-manager.herokuapp.com/",
  allowedHeaders: [
    "Authorization",
    "Content-Type",
    "Origin",
    "Accept",
    " X-Requested-With",
  ],
};

app.use(cors(corsOptions)); */
app.use(passport.initialize());
app.use(express.json({ limit: "50mb" }));
app.use(
  express.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);

app.use(express.static("dist/build"));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/contacts", contactRoutes);

// listen to port
app.listen(PORT, () => {
  console.log(`web service has started at ${PORT}`);
});
