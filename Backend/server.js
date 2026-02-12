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
  "http://localhost:5173"
].map(normalizeOrigin);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    const normalizedOrigin = normalizeOrigin(origin);

    if (
      allowedOrigins.includes(normalizedOrigin) ||
      normalizedOrigin.endsWith(".vercel.app")
    ) {
      return callback(null, true);
    }

    console.log("Blocked by CORS:", origin);
    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: true
}));

// Handle preflight requests
app.options("*", cors());

app.use((req, res, next) => {
  req.userId = req.headers.userid;
  next();
});

app.get("/", (_req, res) => {
  res.send("Backend running");
});

// Database connection check
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

// Error Handler
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


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
