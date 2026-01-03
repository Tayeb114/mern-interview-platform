import dotenv from "dotenv";

// On Railway, variables are already in process.env. 
// We only need dotenv for local development.
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

export const ENV = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 3000,
  DB_URL: process.env.DB_URL,
  CLIENT_URL: process.env.CLIENT_URL,
  
  // Make sure these names match exactly what you typed in Railway
  INNGEST_EVENT_KEY: process.env.INNGEST_EVENT_KEY,
  INNGEST_SIGNING_KEY: process.env.INNGEST_SIGNING_KEY,
  
  STREAM_API_KEY: process.env.STREAM_API_KEY,
  STREAM_API_SECRET: process.env.STREAM_API_SECRET,
  
  CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY,
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
};

// Log this to confirm it's working during startup
if (!ENV.DB_URL) {
  console.error("⚠️ ENV.DB_URL is undefined in env.js!");
}