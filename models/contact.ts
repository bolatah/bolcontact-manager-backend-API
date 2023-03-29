import mongoose from "mongoose";
import { IUser } from "./user";
const { Schema } = mongoose;

export interface IContact {
  _id?: string;
  name: string;
  author: string | IUser;
  email: string;
  phone: string;
  file: string;
  message: string;
  dateCreated: string;
  href?: string;
}

const contactSchema = new Schema<IContact>({
  name: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  email: String,
  phone: String,
  file: String,
  message: String,
  dateCreated: Date,
});
const Contact = mongoose.model("Contact", contactSchema);
export default Contact;
