require("dotenv").config(); // MUST be first

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// ── CORS (allow frontend on any port) ──
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000", "http://localhost:5174"],
  credentials: true,
}));

// ── Body parser ──
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// ── MongoDB connection ──
mongoose.connect(process.env.MONGO_URI, { family: 4 })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// ── Routes ──
const authRoutes = require("./routes/authRoutes");
const jobRoutes  = require("./routes/jobRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);

// ── Health check ──
app.get("/", (req, res) => res.json({ message: "✅ EligiTrack API is running" }));

// ── 404 handler ──
app.use((req, res) => res.status(404).json({ message: `Route ${req.method} ${req.url} not found` }));

// ── Start server ──
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));