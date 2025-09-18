const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");
const logger = require("./config/logger");
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
const supportRoutes = require("./routes/supportRoutes");
const PasswordResetToken = require("./models/PasswordResetToken");

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5001; // Use environment variable or default to 5001

// Trust proxy for Vercel deployment (required for rate limiting and IP detection)
app.set("trust proxy", 1);

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

// Rate limiting - More user-friendly limits while maintaining security
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // Increased from 100 to 500 requests per 15 minutes for general use
  message: {
    success: false,
    message:
      "Too many requests from this IP, please try again in a few minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for health checks and static files
    return (
      req.path === "/api/health" ||
      req.path === "/api/ready" ||
      req.path === "/api/live" ||
      req.path.startsWith("/uploads/")
    );
  },
});

// Stricter rate limiting for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 400, // 400 login attempts per 15 minutes per IP
  message: {
    success: false,
    message: "Too many authentication attempts, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// More lenient rate limiting for profile operations
const profileLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 8000, // 8000 profile updates per 15 minutes per IP
  message: {
    success: false,
    message:
      "Too many profile update requests, please try again in a few minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict rate limiting for password reset requests to prevent abuse
const passwordResetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Only 20 password reset requests per 15 minutes per IP
  message: {
    success: false,
    message: "Too many password reset requests, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply general rate limiting to all requests
app.use(generalLimiter);

// Request logging middleware
app.use(logger.requestLogger());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Prevent HTTP Parameter Pollution attacks
app.use(hpp());

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
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/api/forms", formRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/support", supportRoutes);

// Apply profile-specific rate limiting to profile routes
app.use("/api/auth/profile", profileLimiter);
app.use("/api/auth/me", profileLimiter);

// Apply password reset rate limiting to password reset routes
app.use("/api/auth/request-password-reset", passwordResetLimiter);
app.use("/api/auth/reset-password", passwordResetLimiter);

// Apply stricter rate limiting to other auth routes
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/auth", authLimiter, passwordResetRoutes);

// Error logging middleware
app.use(logger.errorLogger());

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error("Error occurred:", {
    error: err.message,
    stack: err.stack,
    method: req.method,
    url: req.url,
    ip: req.ip,
  });

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      errors: errors,
    });
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid ID format",
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: `${field} already exists`,
    });
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Token expired",
    });
  }

  // Default error
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// Function to sync all model indexes
// Cleanup job for expired password reset tokens
const startTokenCleanupJob = () => {
  // Run cleanup every hour
  setInterval(async () => {
    try {
      const result = await PasswordResetToken.deleteMany({
        expiresAt: { $lt: new Date() }
      });
      if (result.deletedCount > 0) {
        logger.info(`Cleaned up ${result.deletedCount} expired password reset tokens`);
      }
    } catch (err) {
      logger.error('Error cleaning up expired password reset tokens:', {
        error: err.message,
        stack: err.stack
      });
    }
  }, 60 * 60 * 1000); // Run every hour

  // Run initial cleanup on startup
  setTimeout(async () => {
    try {
      const result = await PasswordResetToken.deleteMany({
        expiresAt: { $lt: new Date() }
      });
      if (result.deletedCount > 0) {
        logger.info(`Initial cleanup: removed ${result.deletedCount} expired password reset tokens`);
      }
    } catch (err) {
      logger.error('Error in initial password reset token cleanup:', {
        error: err.message,
        stack: err.stack
      });
    }
  }, 5000); // Run after 5 seconds to ensure DB is ready
};

const syncAllIndexes = async () => {
  const models = [
    { name: "TaxForm", model: TaxForm },
    { name: "ROCForm", model: ROCForm },
    { name: "CompanyForm", model: CompanyForm },
    { name: "OtherRegistrationForm", model: OtherRegistrationForm },
    { name: "ReportsForm", model: ReportsForm },
    { name: "TrademarkISOForm", model: TrademarkISOForm },
    { name: "AdvisoryForm", model: AdvisoryForm },
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

// Connect to MongoDB with optimized settings for serverless
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 10, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    bufferCommands: true, // Enable mongoose buffering for serverless environments
    maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
    family: 4, // Use IPv4, skip trying IPv6
  })
  .then(async () => {
    logger.info("Connected to MongoDB", {
      database: process.env.MONGODB_URI?.split("@")[1]?.split("/")[0],
    });

    // Sync all model indexes
    try {
      await syncAllIndexes();
      logger.info("All model indexes synced successfully");
    } catch (err) {
      logger.error("Error syncing model indexes:", {
        error: err.message,
        stack: err.stack,
      });
      // Continue server startup even if index syncing fails
    }

    // Start cleanup job for expired password reset tokens
    startTokenCleanupJob();
    logger.info("Password reset token cleanup job started");
  })
  .catch((err) => {
    logger.error("MongoDB connection error:", {
      error: err.message,
      stack: err.stack,
    });
    process.exit(1);
  });

// Basic route for testing
app.get("/", (req, res) => {
  res.send("Com Financial Services API is running");
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is healthy" });
});

// Global error handling for uncaught exceptions
process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception:", { error: err.message, stack: err.stack });
  process.exit(1);
});

// Global error handling for unhandled promise rejections
process.on("unhandledRejection", (err) => {
  logger.error("Unhandled Promise Rejection:", {
    error: err.message,
    stack: err.stack,
  });
  process.exit(1);
});

// Start server
const server = app.listen(PORT, () => {
  logger.info(`Server started successfully`, {
    port: PORT,
    environment: process.env.NODE_ENV,
    nodeVersion: process.version,
    platform: process.platform,
  });
});

// Graceful shutdown
process.on("SIGTERM", () => {
  logger.info("SIGTERM received, shutting down gracefully");
  server.close(() => {
    logger.info("Process terminated");
    mongoose.connection.close(false, () => {
      process.exit(0);
    });
  });
});

process.on("SIGINT", () => {
  logger.info("SIGINT received, shutting down gracefully");
  server.close(() => {
    logger.info("Process terminated");
    mongoose.connection.close(false, () => {
      process.exit(0);
    });
  });
});
