import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

export interface IUser {
  email: string;
  password: string;
  name: string;
  _id?: string;
  image?: string;
  lastSignIn?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  emailVerified?: boolean | null;
}

const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: false,
    },
    name: {
      type: String,
      required: false,
    },
    image: {
      type: String,
    },
    lastSignIn: {
      type: Date,
    },
  },
  { timestamps: true }
);

const userModel = models.User || model("User", userSchema);
// const userModel = model("User", userSchema);
export default userModel;
