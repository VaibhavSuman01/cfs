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

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5001; // Use environment variable or default to 5001

// Trust proxy for Vercel deployment (required for rate limiting and IP detection)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false
}));

// Rate limiting - More user-friendly limits while maintaining security
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // Increased from 100 to 500 requests per 15 minutes for general use
  message: {
    success: false,
    message: "Too many requests from this IP, please try again in a few minutes."
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for health checks and static files
    return req.path === '/api/health' || req.path === '/api/ready' || req.path === '/api/live' || req.path.startsWith('/uploads/');
  }
});

// Stricter rate limiting for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 login attempts per 15 minutes per IP
  message: {
    success: false,
    message: "Too many authentication attempts, please try again later."
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
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/api/forms", formRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authLimiter, authRoutes); // Apply stricter rate limiting to auth routes
app.use("/api/auth", authLimiter, passwordResetRoutes); // Apply stricter rate limiting to password reset

// Error logging middleware
app.use(logger.errorLogger());

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error("Error occurred:", {
    error: err.message,
    stack: err.stack,
    method: req.method,
    url: req.url,
    ip: req.ip
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
    family: 4 // Use IPv4, skip trying IPv6
  })
  .then(async () => {
    logger.info("Connected to MongoDB", { database: process.env.MONGODB_URI?.split('@')[1]?.split('/')[0] });
    
    // Sync all model indexes
    try {
      await syncAllIndexes();
      logger.info("All model indexes synced successfully");
    } catch (err) {
      logger.error("Error syncing model indexes:", { error: err.message, stack: err.stack });
      // Continue server startup even if index syncing fails
    }
  })
  .catch((err) => {
    logger.error("MongoDB connection error:", { error: err.message, stack: err.stack });
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
  logger.error("Unhandled Promise Rejection:", { error: err.message, stack: err.stack });
  process.exit(1);
});

// Start server
const server = app.listen(PORT, () => {
  logger.info(`Server started successfully`, {
    port: PORT,
    environment: process.env.NODE_ENV,
    nodeVersion: process.version,
    platform: process.platform
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
    mongoose.connection.close(false, () => {
      process.exit(0);
    });
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
    mongoose.connection.close(false, () => {
      process.exit(0);
    });
  });
});
