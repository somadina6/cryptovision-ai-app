import mongoose from "mongoose";
const options = {
  appName: "CrytpoVison AI",
  useNewUrlParser: true,
  useUnifiedTopology: true,
  ssl: true,
  sslValidate: true,
  // sslCA: <path-to-ca-cert>,
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
