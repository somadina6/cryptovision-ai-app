import mongoose from "mongoose";

export const options = {
  connectTimeoutMS: 30000,
  maxPoolSize: 10,
};

const connect = async () => {
  if (mongoose.connections[0].readyState === 1) {
    console.debug("Using existing connection");
    return mongoose.connections[0];
  }

  try {
    await mongoose.connect(process.env.MONGO_URI as string, options);
  } catch (error) {
    console.log("Error connecting to DB", error);
    throw new Error("Error connecting to Mongoose");
  }
};

export default connect;
