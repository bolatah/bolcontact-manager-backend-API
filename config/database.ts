import dotenv = require("dotenv");
import mongoose from "mongoose";

dotenv.config();
// Connect to the correct environment database
/* 
const mongoConfigOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
}; */

mongoose
  .set("strictQuery", true)
  .connect(process.env.DB_STRING)
  .then(() => {
    console.log("Database connected");
  })
  .catch((error) => {
    console.log("Database is not connected", error);
  });

export = mongoose;
