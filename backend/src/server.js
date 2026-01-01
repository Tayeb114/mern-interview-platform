import express from "express";
import { ENV } from "./lib/env.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

const frontendDist = path.resolve(__dirname, "../../frontend/dist");
const indexPath = path.join(frontendDist, "index.html");

// 1. API/Health Route
app.get("/health", (req, res) => {
  res.json({ status: "alive" });
});

// 2. Serve Static Files
app.use(express.static(frontendDist));

// 3. THE "CRASH-PROOF" CATCH-ALL
// We do NOT use a path string here. This bypasses the picky library entirely.
app.use((req, res, next) => {
  // Only handle GET requests that aren't for the API/Health
  if (req.method === 'GET' && !req.url.startsWith('/health')) {
    if (fs.existsSync(indexPath)) {
      return res.sendFile(indexPath);
    } else {
      return res.status(404).send("Frontend build not found in dist folder.");
    }
  }
  next();
});

app.listen(ENV.PORT, () => {
  console.log(`🚀 Server running on http://localhost:${ENV.PORT}`);
  console.log(`Serving from: ${frontendDist}`);
});