import { Express } from "express";
import * as dotenv from "dotenv";
const express = require("express");

export const config = dotenv.config()?.parsed as any;

const app: Express = express();
const PORT = process.env.PORT || 8000;
const HOST = process.env.HOST || "localhost";

const userRoute = require("./routes/userRoutes");
const contactRoute = require("./routes/contactRoutes");

app.use("/api/users", userRoute);
app.use("/api/contacts", contactRoute);

app.listen(PORT, () => {
  console.log(`web service laueft unter http://${HOST}:${PORT}`);
});
