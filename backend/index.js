import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import songRouter from "./routes/songRoutes.js";
import authRouter from "./routes/authRoutes.js";

dotenv.config({ path: new URL('./.env', import.meta.url) });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

app.use("/api/songs", songRouter);
app.use("/api/auth", authRouter);

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
