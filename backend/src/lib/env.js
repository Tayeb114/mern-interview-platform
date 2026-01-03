import dotenv from "dotenv";
import path from "path";

// Ensure dotenv is called before anything else
dotenv.config({ path: path.resolve(process.cwd(), ".env")});

export const ENV = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 3000,
  DB_URL: process.env.DB_URL,
  CLIENT_URL : process.env. CLIENT_URL,
  INGEST_EVENT_KEY : process.env.INGEST_EVENT_KEY,

INGEST_SIGNING_KEY: process.env.INGEST_SIGNING_KEY, 
STREAM_API_KEY: process.env.INGEST_STREAM_API_KEY,
STREAM_API_SECRET: process.env.INGEST_STREAM_API_SECRET,
};