const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const TaxForm = require("./models/TaxForm");

// Import routes
const formRoutes = require("./routes/formRoutes");
const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");
const passwordResetRoutes = require("./routes/passwordResetRoutes");

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5001; // Use environment variable or default to 5001

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      process.env.FRONTEND_URL,
      process.env.FRONTEND_URL_ALT,
    ].filter(Boolean),

    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/api/forms", formRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/auth", passwordResetRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    // Ensure indexes are in sync with the latest schema (create new and drop obsolete)
    TaxForm.syncIndexes()
      .then((res) => {
        console.log("TaxForm indexes synced:", res);
      })
      .catch((err) => {
        console.error("Failed to sync TaxForm indexes:", err);
      });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Basic route for testing
app.get("/", (req, res) => {
  res.send("Com Financial Services API is running");
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is healthy" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
