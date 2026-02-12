require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const connectDB = require("./config/db");

const postRoutes = require("./routes/postRoutes");
const likeRoutes = require("./routes/likeRoutes");

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(express.json());

/* ================= CORS SETUP ================= */
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests without origin (Postman, server-to-server)
    if (!origin) return callback(null, true);

    // Allow local development
    if (origin === "http://localhost:5173") {
      return callback(null, true);
    }

    // Allow all Vercel deployments (production + preview)
    if (origin.endsWith(".vercel.app")) {
      return callback(null, true);
    }

    console.log("Blocked by CORS:", origin);
    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: true,
  optionsSuccessStatus: 200
};

// Apply CORS globally
app.use(cors(corsOptions));

// Handle preflight (Express 5 safe way)
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});
/* ============================================== */


// User ID middleware
app.use((req, res, next) => {
  req.userId = req.headers.userid;
  next();
});

// Health check route (for Render)
app.get("/", (_req, res) => {
  res.send("Backend running");
});

// Check MongoDB connection
app.use((req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      message: "Database connection error",
      status: mongoose.connection.readyState
    });
  }
  next();
});

// Routes
app.use("/api/posts", postRoutes);
app.use("/api/posts", likeRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Error:", err.message);

  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({ message: err.message });
  }

  res.status(500).json({
    message: "Server Error",
    error: err.message || "Unknown error"
  });
});

// Start Server (Render compatible)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
