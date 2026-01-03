import mongoose from "mongoose";
import { ENV } from "./env.js";

export const connectDB = async () => {
  try {
    // If DB_URL is missing, this will catch it before Mongoose tries to use it
    if (!ENV.DB_URL) {
      throw new Error("DB_URL is missing! Check your Railway variables.");
    }

    const conn = await mongoose.connect(ENV.DB_URL);
    console.log("✅ Connected to MongoDB: ", conn.connection.host);
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};


