import mongoose from "mongoose";
const { Schema } = mongoose;

export interface IContact {
  _id: any;
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  file?: string;
  dateCreated?: Date;
  href?: string;
}

const contactSchema = new Schema<IContact>({
  name: String,
  email: String,
  phone: String,
  file: String,
  message: String,
  dateCreated: Date,
  href: String,
});

mongoose.model("Contact", contactSchema);
