const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

// Import all models
const TaxForm = require("./models/TaxForm");
const ROCForm = require("./models/ROCForm");
const CompanyForm = require("./models/CompanyForm");
const OtherRegistrationForm = require("./models/OtherRegistrationForm");
const ReportsForm = require("./models/ReportsForm");
const TrademarkISOForm = require("./models/TrademarkISOForm");
const AdvisoryForm = require("./models/AdvisoryForm");

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

// Function to sync all model indexes
const syncAllIndexes = async () => {
  const models = [
    { name: 'TaxForm', model: TaxForm },
    { name: 'ROCForm', model: ROCForm },
    { name: 'CompanyForm', model: CompanyForm },
    { name: 'OtherRegistrationForm', model: OtherRegistrationForm },
    { name: 'ReportsForm', model: ReportsForm },
    { name: 'TrademarkISOForm', model: TrademarkISOForm },
    { name: 'AdvisoryForm', model: AdvisoryForm }
  ];

  for (const { name, model } of models) {
    try {
      await model.syncIndexes();
      console.log(`✅ ${name} indexes synced successfully`);
    } catch (err) {
      console.error(`❌ Failed to sync ${name} indexes:`, err.message);
      // Continue with other models even if one fails
    }
  }
};

// Connect to MongoDB with optimized settings
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 10, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    bufferCommands: false, // Disable mongoose buffering
    maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
    family: 4 // Use IPv4, skip trying IPv6
  })
  .then(async () => {
    console.log("Connected to MongoDB");
    
    // Sync all model indexes
    try {
      await syncAllIndexes();
      console.log("All model indexes synced successfully");
    } catch (err) {
      console.error("Error syncing model indexes:", err);
      // Continue server startup even if index syncing fails
    }
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
