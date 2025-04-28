import mongoose from "mongoose";

const connection = { isConnected: 0 };

const MONGODB_URI = process.env.MONGODB_URI ||'';

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable.");
}

export async function dbconnect() {
  if (connection.isConnected) {
    console.log("✅ Using existing database connection");
    return;
  }

  try {
    const db = await mongoose.connect(MONGODB_URI);

    connection.isConnected = db.connections[0].readyState;

    if (connection.isConnected) {
      console.log("✅ Database connected successfully");
    } else {
      console.log("❌ Database connection failed");
    }
  } catch (error) {
    console.error("❌ DB connection error:", error);
    throw new Error("Failed to connect to the database");
  }
}
