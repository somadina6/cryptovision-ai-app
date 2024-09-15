import mongoose from "mongoose";

// Function to disconnect from the database
export const disconnect = async () => {
  try {
    // Check if there are any active connections
    if (mongoose.connections[0].readyState === 1) {
      console.log("Disconnecting from Mongoose...");
      await mongoose.disconnect();
      console.log("Mongoose Disconnected Successfully!");
    } else {
      console.log("No active connection to disconnect.");
    }
  } catch (error) {
    console.error("Error disconnecting from DB", error);
  }
};
