import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

// Internal Imports
import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";
import { serve } from "inngest/express";
import { inngest, functions } from "./lib/inngest.js";

const app = express();

// --- Path Setup for Production ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, "../../frontend/dist");

// --- Middleware ---
// Always put express.json() BEFORE your routes
app.use(express.json());

// Configure CORS using the client URL from your environment
app.use(cors({
  origin: ENV.CLIENT_URL,
  credentials: true
}));

// --- Inngest Route ---
// We use Object.values(functions) to ensure Inngest receives an Array
app.use(
  "/api/inngest",
  serve({ 
    client: inngest, 
    functions: Array.isArray(functions) ? functions : Object.values(functions) 
  })
);

// --- Health Check ---
app.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "UP", 
    message: "Backend is running and healthy",
    environment: ENV.NODE_ENV 
  });
});

// --- Production Frontend Handling ---
if (ENV.NODE_ENV === "production") {
  // Serve the static files from the frontend build
  app.use(express.static(distPath));

  // Catch-all route to serve the index.html for Single Page Apps (React/Vite)
  // This MUST be the last route in the file
  app.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

// --- Server Startup ---
const startServer = async () => {
  try {
    // 1. Connect to MongoDB first
    await connectDB();

    // 2. Start listening
    const port = ENV.PORT || 3000;
    
    // NOTE: Listening on "0.0.0.0" is required for Railway to expose the port
    app.listen(port, "0.0.0.0", () => {
      console.log(`🚀 Server is running on port ${port}`);
      console.log(`📡 Inngest path: http://0.0.0.0:${port}/api/inngest`);
    });
  } catch (error) {
    console.error("❌ Fatal error during server startup:", error);
    process.exit(1);
  }
};

startServer();