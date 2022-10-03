import dotenv from "dotenv";
import express, { Express } from "express";
import cookieParser from "cookie-parser";
dotenv.config();
const cors = require("cors");
const PORT = process.env.PORT || 8000;
const HOST = process.env.HOST || "localhost";

const userRoutes = require("./routes/userRoutes");
const contactRoutes = require("./routes/contactRoutes");
//const refreshRoute = require("./routes/refreshRoute");

const app = express();
app.use(cookieParser());
app.use(express.json());

app.use(
  cors({
    credentials: true,
    // methods: ["GET", "POST", "PUT", "DELETE"],
    origin: process.env.ORIGIN_URL || "http://localhost:3500",
    // allowedHeaders: [
    //   "Content-Type",
    //   "Authorization",
    //   "X-Requested-With",
    //   "Origin",
    //   "Accept",
    // ],
  })
);

// Routes
app.use("/api/users", userRoutes);
app.use("/api/contacts", contactRoutes);

// Error Handling
app.use((req, res, next) => {
  const error = new Error("Not Found");
  return res.status(404).json({
    message: error.message,
  });
});

// listen to port
app.listen(PORT, () => {
  console.log(`web service is listening to  http://${HOST}:${PORT}`);
});
