import mongoose from "mongoose";

const connect = async () => {
  if (mongoose.connections[0].readyState) return;

  try {
    const db = await mongoose.connect(process.env.MONGO_URI as string, {
      appName: "CrytpoVison AI",
    });
    console.log("Mongoose Connection Successful!");
    return db;
  } catch (error) {
    throw new Error("Error connecting to Mongoose");
  }
};

export default connect;
