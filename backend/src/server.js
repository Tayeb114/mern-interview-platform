import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import cors from "cors";

// Internal Imports
import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";
import { serve } from "inngest/express";
import { inngest, functions } from "./lib/inngest.js";

const app = express();

// --- 1. Path Setup for Production ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// This logic looks for the 'dist' folder relative to your server.js location
// It covers standard project structures on Railway
const distPath = path.resolve(__dirname, "../../frontend/dist");

// Debugging: This will show up in your Railway logs to help us find the files
console.log("Checking for Frontend at:", distPath);
if (fs.existsSync(distPath)) {
  console.log("✅ Frontend dist folder found!");
} else {
  console.warn("⚠️ Frontend dist folder NOT found at path. Check your build command.");
}

// --- 2. Standard Middleware ---
app.use(express.json()); // Required for Inngest and APIs
app.use(cors({
  origin: ENV.CLIENT_URL,
  credentials: true
}));

// --- 3. Inngest Route (MUST come before the frontend catch-all) ---
app.use(
  "/api/inngest",
  serve({ 
    client: inngest, 
    // Ensure 'functions' is an array even if you exported an object
    functions: Array.isArray(functions) ? functions : Object.values(functions) 
  })
);

// --- 4. Health Check ---
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", env: ENV.NODE_ENV });
});

// --- 5. Production Frontend Handling ---
if (ENV.NODE_ENV === "production") {
  // Serve the static files (JS, CSS, Images)
  app.use(express.static(distPath));

  // The Catch-all: This allows React/Vite routing to work
  // It MUST be the very last route in the file
  app.get(/(.*)/, (req, res) => {
    // Check if index.html exists before trying to send it
    const indexPath = path.join(distPath, "index.html");
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send("Frontend build not found. If this is Railway, check your 'Build Command'.");
    }
  });
}

// --- 6. Server Startup ---
const startServer = async () => {
  try {
    await connectDB();
    const port = ENV.PORT || 3000;
    
    // Listening on "0.0.0.0" is essential for Railway
    app.listen(port, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${port}`);
      console.log(`📡 Inngest Endpoint: /api/inngest`);
    });
  } catch (error) {
    console.error("❌ Fatal Error:", error);
    process.exit(1);
  }
};

startServer();