import dotenv from "dotenv";

// Only try to load .env file if we are NOT in production
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

export const ENV = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 3000,
  DB_URL: process.env.DB_URL, // Railway will inject this directly
  CLIENT_URL: process.env.CLIENT_URL,
  INNGEST_EVENT_KEY: process.env.INNGEST_EVENT_KEY,
  INNGEST_SIGNING_KEY: process.env.INNGEST_SIGNING_KEY,
  STREAM_API_KEY: process.env.STREAM_API_KEY,
  STREAM_API_SECRET: process.env.STREAM_API_SECRET,
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
};