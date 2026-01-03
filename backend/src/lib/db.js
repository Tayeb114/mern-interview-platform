import mongoose from "mongoose";
import { ENV } from "./env.js";

export const connectDB = async () => {
  try {
    if (!ENV.DB_URL) {
      throw new Error("DB_URL is missing from environment variables!");
    }

    const conn = await mongoose.connect(ENV.DB_URL);
    console.log("✅ Connected to MongoDB via ENV: ", conn.connection.host);
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};