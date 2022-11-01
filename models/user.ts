import mongoose from "mongoose";
const { Schema } = mongoose;

export interface IUser {
  username: string;
  email: string;
  phone: number;
  password: string;
  hash: string;
  salt: string;
}

const userSchema = new Schema<IUser>({
  username: { type: String, unique: true, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: Number, unique: true, required: true },
  password: { type: String },
  hash: { type: String, required: true },
  salt: { type: String, required: true },
});

mongoose.model<IUser>("User", userSchema);
