import express from "express";
import cors from "cors";
import "dotenv/config";
// Cron job removed as per user request

import authRoutes from "./routes/authRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";

import { connectDB } from "./lib/db.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Cron job removed as per user request
app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT} on all interfaces (0.0.0.0)`);
  connectDB();
});
