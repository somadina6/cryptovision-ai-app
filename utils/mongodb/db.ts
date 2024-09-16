import mongoose, { ConnectOptions } from "mongoose";

export const options = {
  connectTimeoutMS: 30000,
  maxPoolSize: 40,
};

const connect = async () => {
  if (mongoose.connections[0].readyState === 1) {
    return mongoose.connections[0];
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URI as string, options);
    return db;
  } catch (error) {
    console.log("Error connecting to DB", error);
    throw new Error("Error connecting to Mongoose");
  }
};

export default connect;
