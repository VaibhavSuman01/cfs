const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { protect, admin } = require("../middleware/auth");
const { check, validationResult } = require("express-validator");

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post(
  "/login",
  [
    check("identifier", "Please include a valid email or PAN").not().isEmpty(),
    check("password", "Password is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { identifier, password, role } = req.body;

    try {
      // Check if identifier is email or PAN
      const isEmail = identifier.includes('@');
      
      // Find user by email or PAN
      let user;
      if (isEmail) {
        user = await User.findOne({ email: identifier });
      } else {
        // Assuming PAN is stored in uppercase
        user = await User.findOne({ pan: identifier.toUpperCase() });
      }

      if (!user) {
        return res.status(400).json({ message: "Invalid credentials", code: "INVALID_LOGIN" });
      }

      // Check if the user has the required role
      if (role && user.role !== role) {
        return res.status(403).json({ message: "Access denied" });
      }

      // Check if user has a password set
      if (!user.password) {
        return res.status(400).json({ 
          message: "This account has no password set. Please contact support.", 
          code: "NO_PASSWORD_SET" 
        });
      }
      
      // Check password
      const isAuthenticated = await user.comparePassword(password);
      if (!isAuthenticated) {
        return res.status(400).json({ message: "Invalid credentials", code: "INVALID_PASSWORD" });
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
        return res.status(400).json({ message: "Email already in use", code: "EMAIL_IN_USE" });
      }
    }
    
    // Check if PAN is already in use by another user
    if (pan) {
      const existingUserWithPan = await User.findOne({ pan });
      if (
        existingUserWithPan &&
        existingUserWithPan._id.toString() !== req.user._id.toString()
      ) {
        return res.status(400).json({ message: "PAN number already in use", code: "PAN_IN_USE" });
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

    // Update password
    user.password = newPassword;
    
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
      .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/).withMessage("Invalid PAN Card format"),
    check("dob", "Date of Birth is required")
      .not().isEmpty()
      .isISO8601().withMessage("Invalid date format"),
    check("mobile", "Mobile number is required")
      .not().isEmpty()
      .matches(/^[6-9]\d{9}$/).withMessage("Invalid mobile number format"),
    check("aadhaarNo", "Aadhaar number must be 12 digits if provided")
      .optional()
      .matches(/^\d{12}$/).withMessage("Aadhaar number must be 12 digits"),
    check("password", "Please enter a password with 6 or more characters")
      .isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, panCardNo, dob, mobile, aadhaarNo, role = "user" } = req.body;

    try {
      // Check if user exists with the same email or PAN
      let userByEmail = await User.findOne({ email });
      let userByPan = await User.findOne({ pan: panCardNo });

      if (userByEmail) {
        return res.status(400).json({ message: "User with this email already exists", code: "EMAIL_IN_USE" });
      }

      if (userByPan) {
        return res.status(400).json({ message: "User with this PAN number already exists", code: "PAN_IN_USE" });
      }

      // Create user
      user = new User({
        name,
        email,
        password,
        pan: panCardNo,
        dob,
        mobile,
        aadhaar: aadhaarNo,
        role
      });

      // Save user to database
      await user.save();

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

            },
          });
        }
      );
    } catch (err) {
      res.status(500).send("Server error");
    }
  }
);

// Password reset endpoint will be implemented here

module.exports = router;
