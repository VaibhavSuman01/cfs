const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { protect, admin } = require("../middleware/auth");
const { check, validationResult } = require("express-validator");
const otpUtils = require("../utils/otpUtils");

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post(
  "/login",
  [
    check("email", "Please include a valid email").isEmail(),
    // Password is not required if OTP is provided
    check("password", "Password is required").optional({ checkFalsy: true }),
    check("otp", "OTP must be 6 digits")
      .optional({ checkFalsy: true })
      .isLength({ min: 6, max: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, otp, role } = req.body;

    try {
      // See if user exists
      let user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ message: "Invalid credentials", code: "INVALID_LOGIN" });
      }

      // Check if the user has the required role
      if (role && user.role !== role) {
        return res.status(403).json({ message: "Access denied" });
      }

      let isAuthenticated = false;

      // Check if user is using OTP authentication
      if (user.canUseOTPAuth()) {
        // If user is using OTP but password was provided
        if (password && !otp) {
          // Check if the user has a password set
          if (!user.password) {
            return res.status(400).json({
              message: "This account uses OTP authentication. Please request an OTP.",
              authMethod: "otp",
              code: "OTP_REQUIRED"
            });
          }
          
          // Check if the password is valid despite OTP being enabled
          // This handles cases where password was reset but useOTP flag wasn't properly updated
          const isPasswordValid = await user.comparePassword(password);
          if (isPasswordValid) {
            // Password is valid, update user to disable OTP authentication
            user.useOTP = false;
            await user.save();
            isAuthenticated = true;
          } else {
            return res.status(400).json({
              message:
                "This account uses OTP authentication. Please request an OTP.",
              authMethod: "otp",
              code: "OTP_REQUIRED"
            });
          }
        }

        // Verify OTP
        if (otp) {
          isAuthenticated = await otpUtils.verifyOTP(email, otp);
          console.log("OTP verification result:", { isAuthenticated });
          if (!isAuthenticated) {
            return res.status(400).json({ message: "Invalid or expired OTP", code: "INVALID_OTP" });
          }
        } else {
          console.log("Login failed: OTP required but not provided");
          return res.status(400).json({ message: "OTP is required", code: "OTP_REQUIRED" });
        }
      } else {
        // User is using password authentication
        // Verify user can authenticate with password
        if (!user.canUsePasswordAuth()) {
          console.log("Login failed: User cannot use password authentication");
          return res.status(400).json({ 
            message: "This account has no password set. Please use OTP authentication.", 
            code: "NO_PASSWORD_SET",
            authMethod: "otp"
          });
        }
        // If user is using password but OTP was provided
        if (otp && !password) {
          return res.status(400).json({
            message:
              "This account uses password authentication. Please provide your password.",
            authMethod: "password",
            code: "PASSWORD_REQUIRED"
          });
        }

        // Check if user has a password set
        if (!user.password) {
          return res.status(400).json({ 
            message: "This account has no password set. Please contact support.", 
            code: "NO_PASSWORD_SET" 
          });
        }
        
        // Check password
        if (password) {
          isAuthenticated = await user.comparePassword(password);
          if (!isAuthenticated) {
            return res.status(400).json({ message: "Invalid credentials", code: "INVALID_PASSWORD" });
          }
        } else {
          return res.status(400).json({ message: "Password is required" });
        }
      }

      // Return jsonwebtoken
      const payload = {
        user: {
          id: user.id,
          role: user.role,
        },
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: "5 days" },
        (err, token) => {
          if (err) {
            throw err;
          }
          res.json({
            token,
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              pan: user.pan,
              dob: user.dob,
              mobile: user.mobile,
              aadhaar: user.aadhaar,
              role: user.role,
              useOTP: user.useOTP,
            },
          });
        }
      );
    } catch (err) {
      res.status(500).send("Server error");
    }
  }
);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get("/me", protect, async (req, res) => {
  try {
    // Use findOne instead of findById to ensure we get the latest data
    // and add a timestamp to prevent caching
    const user = await User.findOne(
      { _id: req.user._id },
      "-password"
    ).lean();
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Return complete user object with all fields
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put("/profile", protect, async (req, res) => {
  try {
    const { name, email, pan, dob, mobile, aadhaar, fatherName, address } = req.body;

    // Build profile object
    const profileFields = {};
    if (name) profileFields.name = name;
    if (email) profileFields.email = email;
    
    // Always set these fields even if they're empty strings or null
    // This ensures they're always updated
    profileFields.pan = pan;
    profileFields.dob = dob;
    profileFields.mobile = mobile;
    profileFields.aadhaar = aadhaar;
    profileFields.fatherName = fatherName;
    profileFields.address = address;

    // Check if email is already in use by another user
    if (email) {
      const existingUser = await User.findOne({ email });
      if (
        existingUser &&
        existingUser._id.toString() !== req.user._id.toString()
      ) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    // Update user
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: profileFields },
      { new: true }
    ).lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    // Log error but don't expose details to client
    console.error("Error in update profile");
    res.status(500).json({ message: "Server error" });
  }
});

// @route   PUT /api/auth/password
// @desc    Update user password
// @access  Private
router.put("/password", protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Check if all required fields are provided
    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    // Get user with password
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if current password matches
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Update password and disable OTP
    try {
      user.disableOTPAuth(newPassword);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
    
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post(
  "/register",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("panCardNo", "PAN Card Number is required")
      .not().isEmpty()
      .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN Card format"),
    check("dob", "Date of Birth is required")
      .not().isEmpty()
      .isISO8601().withMessage("Invalid date format"),
    check("mobile", "Mobile number is required")
      .not().isEmpty()
      .matches(/^[6-9]\d{9}$/, "Invalid mobile number format"),
    check("aadhaarNo", "Aadhaar number is required")
      .not().isEmpty()
      .matches(/^\d{12}$/, "Aadhaar number must be 12 digits"),
    check("password", "Please enter a password with 6 or more characters")
      .optional({ checkFalsy: true }) // Password is optional if using OTP
      .isLength({ min: 6 }),
    check("useOTP", "useOTP must be a boolean").optional().isBoolean(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, panCardNo, dob, mobile, aadhaarNo, role = "user", useOTP = false } = req.body;

    try {
      // See if user exists
      let user = await User.findOne({ email });

      if (user) {
        return res.status(400).json({ message: "User already exists", code: "EMAIL_IN_USE" });
      }

      // Validate that password is provided if not using OTP
      if (!useOTP && !password) {
        return res.status(400).json({
          message: "Password is required when not using OTP authentication",
        });
      }

      // Create user
      user = new User({
        name,
        email,
        pan: panCardNo,
        dob,
        mobile,
        aadhaar: aadhaarNo,
        role
      });
      
      // Set authentication method
      if (useOTP) {
        user.enableOTPAuth();
      } else {
        // For non-OTP users, set password directly
        user.password = password;
        user.useOTP = false;
      }

      // Save user to database
      await user.save();

      // If using OTP, generate and send one
      if (useOTP) {
        await otpUtils.generateAndSaveOTP(email);
      }

      // Return jsonwebtoken
      const payload = {
        user: {
          id: user.id,
          role: user.role,
        },
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: "5 days" },
        (err, token) => {
          if (err) throw err;
          res.json({
            token,
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              pan: user.pan,
              dob: user.dob,
              mobile: user.mobile,
              aadhaar: user.aadhaar,
              role: user.role,
              useOTP: user.useOTP,
            },
          });
        }
      );
    } catch (err) {
      res.status(500).send("Server error");
    }
  }
);

// @route   POST /api/auth/request-otp
// @desc    Request a new OTP for login
// @access  Public
router.post("/request-otp", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    // Check if user exists
    const user = await User.findOne({ email });

    // If user doesn't exist, return success anyway to prevent email enumeration
    if (!user) {
      // For security reasons, don't reveal that the user doesn't exist
      return res.status(200).json({
        message: "If your email is registered, you will receive an OTP",
      });
    }
    
    // Check if user can use OTP authentication
    if (!user.canUseOTPAuth()) {
      // For security reasons, don't reveal that the user doesn't use OTP
      return res.status(200).json({
        message: "If your email is registered, you will receive an OTP",
      });
    }

    // Generate and save OTP
    try {
      await otpUtils.generateAndSaveOTP(email);
    } catch (otpError) {
      return res.status(500).json({
        message: "Error processing your request. Please try again later.",
      });
    }

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/auth/verify-otp
// @desc    Verify OTP without login
// @access  Public
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required" });
  }

  try {
    // Verify OTP
    const isValid = await otpUtils.verifyOTP(email, otp);

    if (!isValid) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Find the user to include in the response
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Check if user can use OTP authentication
    if (!user.canUseOTPAuth()) {
      return res.status(400).json({ message: "This account does not use OTP authentication" });
    }

    // Create a temporary token for password reset
    const tempPayload = {
      user: {
        id: user.id,
        role: user.role,
        temp: true, // Mark as temporary token
      },
    };

    const tempToken = jwt.sign(
      tempPayload,
      process.env.JWT_SECRET,
      { expiresIn: "15m" } // Short expiration for security
    );

    res.status(200).json({ 
      message: "OTP verified successfully",
      tempToken
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/auth/toggle-otp
// @desc    Toggle OTP authentication for a user
// @access  Private
router.post("/toggle-otp", protect, async (req, res) => {
  try {
    // Get user
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if this is a password reset request (from a temporary token)
    const isPasswordReset = req.user.temp === true;

    if (isPasswordReset) {
      // This is a password reset request
      if (!req.body.password) {
        return res.status(400).json({ message: "New password is required" });
      }

      // Set the new password and disable OTP
      try {
        user.disableOTPAuth(req.body.password);
      } catch (error) {
        return res.status(400).json({ message: error.message });
      }

      await user.save();

      return res.json({
        message: "Password reset successfully",
        useOTP: user.useOTP,
      });
    } else {
      // Regular toggle OTP functionality
      try {
        if (user.canUseOTPAuth()) {
          // Currently using OTP, switch to password
          if (!req.body.password) {
            return res
              .status(400)
              .json({ message: "Password is required when disabling OTP" });
          }
          user.disableOTPAuth(req.body.password);
        } else {
          // Currently using password, switch to OTP
          user.enableOTPAuth();
          // Generate and send OTP
          await otpUtils.generateAndSaveOTP(user.email);
        }
      } catch (error) {
        return res.status(400).json({ message: error.message });
      }

      await user.save();

      return res.json({
        message: user.useOTP
          ? "OTP authentication enabled"
          : "OTP authentication disabled",
        useOTP: user.useOTP,
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
