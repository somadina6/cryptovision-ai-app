import { MongoClient, Db, ServerApiVersion } from "mongodb";

// MongoDB URI from environment variables
const URI = process.env.MONGO_URI || "";
if (!URI) {
  throw new Error("Please define the MONGO_URI environment variable");
}

const DB_NAME = process.env.DB_NAME || "";
if (!DB_NAME) {
  throw new Error("Please define the DB_NAME environment variable");
}

// Create a new MongoClient with proper configuration
const client = new MongoClient(URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let db: Db | null = null;

// Function to connect to the MongoDB client and get the database
export async function connectToDatabase(): Promise<Db> {
  if (db) {
    return db; // Return existing connection if already connected
  }

  try {
    // Connect the client to the MongoDB server
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Successfully connected to MongoDB!");

    // Set and return the specific database
    db = client.db(DB_NAME);
    return db;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw new Error("Could not connect to MongoDB");
  }
}

// Function to close the MongoDB connection (useful for cleanup)
export async function closeConnection(): Promise<void> {
  try {
    await client.close();
    console.log("MongoDB connection closed");
  } catch (error) {
    console.error("Error closing MongoDB connection:", error);
  }
}

export default connectToDatabase;
