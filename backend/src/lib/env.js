import dotenv from "dotenv";
import path from "path";

// Ensure dotenv is called before anything else
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

export const ENV = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 3000,
  DB_URL: process.env.DB_URL,
};