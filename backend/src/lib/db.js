// import mongoose from "mongoose";
// import { ENV } from "./env.js";

// export const connectDB = async () => {
//   try {
//     // If DB_URL is missing, this will catch it before Mongoose tries to use it
//     if (!ENV.DB_URL) {
//       throw new Error("DB_URL is missing! Check your Railway variables.");
//     }

//     const conn = await mongoose.connect(ENV.DB_URL);
//     console.log("✅ Connected to MongoDB: ", conn.connection.host);
//   } catch (error) {
//     console.error("❌ MongoDB Connection Error:", error.message);
//     process.exit(1);
//   }
// };


// backend/src/lib/db.js
import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    // TEMPORARY: Paste your string directly here just for ONE test
    const testUrl = "mongodb+srv://mdtayebbin_db_user:7nJh1HVWPZmCwxfr@cluster0.wzljtpy.mongodb.net/talent_db?retryWrites=true&w=majority&appName=Cluster0";
    
    const conn = await mongoose.connect(testUrl);
    console.log("✅ Hardcoded Connection Success: ", conn.connection.host);
  } catch (error) {
    console.error("❌ Even hardcoded connection failed:", error.message);
  }
};
