import mongoose from "mongoose";

export const options = {
  connectTimeoutMS: 30000,
  poolSize: 30,
};

const connect = async () => {
  if (mongoose.connections[0].readyState === 1) {
    return mongoose.connections[0];
  }

  try {
    console.log("No Existing Instance. Connecting to Mongoose...");
    const db = await mongoose.connect(process.env.MONGO_URI as string, options);
    console.log("Mongoose Connection Successful!");
    return db;
  } catch (error) {
    console.log("Error connecting to DB", error);
    throw new Error("Error connecting to Mongoose");
  }
};

export default connect;
