const jwt = require("jsonwebtoken");
const User = require("../models/User");
const SupportTeam = require("../models/SupportTeam");

// Middleware to protect routes
const protect = async (req, res, next) => {
  let token;
  
  console.log("Auth middleware - Request URL:", req.url);
  console.log("Auth middleware - Headers:", req.headers.authorization);

  // Check if token exists in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];
      console.log("Auth middleware - Token extracted:", token ? "Yes" : "No");

      // Verify token with ignoreExpiration option to handle clock sync issues
      // This will allow us to check the expiration manually
      const decoded = jwt.verify(token, process.env.JWT_SECRET, { ignoreExpiration: true });
      
      // Check if token is expired
      const currentTime = Math.floor(Date.now() / 1000);
      if (decoded.exp && decoded.exp < currentTime) {
        console.log(`Token expired: exp=${decoded.exp}, current=${currentTime}`);
        return res.status(401).json({ message: "Not authorized, token expired" });
      }

      // Check if it's a support team member or regular user
      if (decoded.type === "support") {
        req.user = await SupportTeam.findById(decoded.id).select("-password");
        req.user.type = "support";
      } else {
        req.user = await User.findById(decoded.user?.id || decoded.id).select("-password");
        req.user.type = "user";
      }

      if (!req.user) {
        return res
          .status(401)
          .json({ message: "Not authorized, user not found" });
      }

      next();
    } catch (error) {
      console.error("Auth middleware error:", error);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

// Middleware to check if user is admin
const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as admin" });
  }
};

module.exports = { protect, admin };
