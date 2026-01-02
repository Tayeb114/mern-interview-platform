import express from "express";
import { ENV } from "./lib/env.js";
import path from "path";
import { fileURLToPath } from "url";
import { connect } from "http2";
import { connectDB } from "./lib/db.js";

const app = express();

// Modern __dirname setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, "../../frontend/dist");

app.get("/health", (req, res) => {
  res.status(200).json({ msg: "success from backend" });
});

if (ENV.NODE_ENV === "production") {
  // 1. Serve static files
  app.use(express.static(distPath));

  // 2. THE FIX: Use a Regex /(.*)/ instead of "*"
  // This tells Express: "Match everything" without using the strict string parser.
  app.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

// app.listen(ENV.PORT, () => {
//   console.log(`🚀 Server is running on port ${ENV.PORT}`);
//   connectDB();
// });


const startServer = async () => {
  try{
    await connectDB();
    app.listen(ENV.PORT, () => console.log("Server is running on port ", ENV.PORT));
  } catch(error){
    console.log("Error starting the server", error);
  }
}

startServer();