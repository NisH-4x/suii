require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const connectDB = require("./config/db");

const postRoutes = require("./routes/postRoutes");
const likeRoutes = require("./routes/likeRoutes");

const app = express();

connectDB();

app.use(express.json());

const normalizeOrigin = (origin) => origin.replace(/\/$/, "");

const allowedOrigins = [
  'http://localhost:5173',
].map(normalizeOrigin);

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    const normalizedOrigin = normalizeOrigin(origin);

    if (allowedOrigins.indexOf(normalizedOrigin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use((req, res, next) => {
  req.userId = req.headers.userid;
  next();
});

// Middleware to check database connection
app.use((req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ 
      message: "Database connection error",
      status: mongoose.connection.readyState 
    });
  }
  next();
});

app.use("/api/posts", postRoutes);
app.use("/api/posts", likeRoutes);

app.use((err, req, res, next) => {
  console.error("Unhandled error:", {
    method: req.method,
    path: req.originalUrl,
    origin: req.headers.origin,
    userId: req.headers.userid,
    message: err?.message,
    stack: err?.stack
  });

  if (err && err.message === "Not allowed by CORS") {
    return res.status(403).json({ message: err.message });
  }

  app.get("/", (_req, res) => {
  res.send("E-Commerce backend running");
});

  return res.status(500).json({
    message: "Server Error",
    error: err?.message || "Unknown error"
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


