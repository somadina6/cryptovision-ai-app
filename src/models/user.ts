import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

export interface IUser extends mongoose.Document {
  email: string;
  password: string;
  name: string;
  _id?: string;
  image?: string;
}

const userSchema = new Schema<IUser>(
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
  },
  { timestamps: true }
);

const userModel = models.User || model("User", userSchema);
export default userModel;
