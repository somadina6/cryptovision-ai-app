import { MongoOptions } from "mongodb";
import mongoose, { MongooseOptions } from "mongoose";

export const options = {
  tls: false,
  tlsInsecure: true,
};

const connect = async () => {
  if (mongoose.connections[0].readyState) return;

  try {
    const db = await mongoose.connect(process.env.MONGO_URI as string, options);
    console.log("Mongoose Connection Successful!");
    return db;
  } catch (error) {
    console.log(error);
    throw new Error("Error connecting to Mongoose");
  }
};

export default connect;
