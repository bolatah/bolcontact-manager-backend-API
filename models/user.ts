import mongoose from "mongoose";
const { Schema } = mongoose;

export interface IUser extends mongoose.Document {
  username: string;
  email: string;
  phone: string;
  password: string;
  hash: string;
  salt: string;
  href: string;
}

const userSchema = new Schema<IUser>({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  phone: { type: String, unique: true, required: true },
  password: { type: String },
  hash: { type: String, required: true },
  salt: { type: String, required: true },
  href: { type: String },
});

const User = mongoose.model("User", userSchema);
export default User;
