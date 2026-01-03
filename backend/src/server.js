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
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In Railway, backend is in /backend and frontend is in /frontend. 
// This path moves from backend/src to root, then to frontend/dist.
const distPath = path.resolve(__dirname, "../../frontend/dist");

app.use(express.json());
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));

// --- 1. Inngest Route (MUST BE BEFORE CATCH-ALL) ---
app.use(
  "/api/inngest",
  serve({ 
    client: inngest, 
    functions: Array.isArray(functions) ? functions : Object.values(functions) 
  })
);

// --- 2. Health Check (To verify the train has arrived!) ---
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is alive" });
});

// --- 3. Frontend Production Logic ---
if (process.env.NODE_ENV === "production") {
  app.use(express.static(distPath));

  app.get("*", (req, res) => {
    const indexPath = path.join(distPath, "index.html");
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      // This helps you see why the UI is missing in the browser
      res.status(404).send(`Frontend dist folder not found at: ${distPath}`);
    }
  });
}

// --- 4. Startup Logic (Non-Crashing) ---
const startServer = async () => {
  // We call connectDB but don't 'await' it to prevent the server from 
  // failing to start if MongoDB is being slow or has an IP block.
  connectDB().catch(err => console.error("Delayed MongoDB Connection Error:", err));

  // Railway provides the PORT variable automatically
  const port = process.env.PORT || 3000;
  
  app.listen(port, "0.0.0.0", () => {
    console.log(`🚀 Server listening on port ${port}`);
    console.log(`📡 Inngest Endpoint ready at /api/inngest`);
  });
};

startServer();