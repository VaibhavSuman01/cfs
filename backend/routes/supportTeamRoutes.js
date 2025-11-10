const express = require("express");
const router = express.Router();
const SupportTeam = require("../models/SupportTeam");
const SupportChat = require("../models/SupportChat");
const Contact = require("../models/Contact");
const User = require("../models/User");
const SupportTeamPasswordResetToken = require("../models/SupportTeamPasswordResetToken");
const { protect, admin } = require("../middleware/auth");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/email");

// @route   POST /api/support-team/register
// @desc    Register a new support team member (Admin only)
// @access  Private/Admin
router.post("/register", protect, admin, async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required",
      });
    }

    // Check if support team member already exists
    const existingMember = await SupportTeam.findOne({ email });
    if (existingMember) {
      return res.status(400).json({
        success: false,
        message: "Support team member with this email already exists",
      });
    }

    const supportMember = new SupportTeam({
      name,
      email,
      password,
      phone: phone || "",
      role: role || "support",
      createdBy: req.user._id,
    });

    await supportMember.save();

    res.status(201).json({
      success: true,
      message: "Support team member created successfully",
      data: {
        _id: supportMember._id,
        name: supportMember.name,
        email: supportMember.email,
        role: supportMember.role,
      },
    });
  } catch (error) {
    console.error("Support team registration error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   POST /api/support-team/login
// @desc    Login support team member
// @access  Public
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const supportMember = await SupportTeam.findOne({ email: email.toLowerCase() });

    if (!supportMember) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (!supportMember.isActive) {
      return res.status(401).json({
        success: false,
        message: "Your account has been deactivated. Please contact administrator.",
      });
    }

    const isMatch = await supportMember.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Update last login
    supportMember.lastLogin = new Date();
    await supportMember.save();

    const token = jwt.sign(
      {
        id: supportMember._id,
        email: supportMember.email,
        role: supportMember.role,
        type: "support",
      },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token,
      data: {
        _id: supportMember._id,
        name: supportMember.name,
        email: supportMember.email,
        role: supportMember.role,
        phone: supportMember.phone,
        avatar: supportMember.avatar,
      },
    });
  } catch (error) {
    console.error("Support team login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   GET /api/support-team/profile
// @desc    Get support team member profile
// @access  Private/Support
router.get("/profile", protect, async (req, res) => {
  try {
    // Check if user is support team member
    if (req.user.type !== "support") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const supportMember = await SupportTeam.findById(req.user.id).select("-password");

    if (!supportMember) {
      return res.status(404).json({
        success: false,
        message: "Support team member not found",
      });
    }

    res.json({
      success: true,
      data: supportMember,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   PUT /api/support-team/profile
// @desc    Update support team member profile
// @access  Private/Support
router.put("/profile", protect, async (req, res) => {
  try {
    if (req.user.type !== "support") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const { name, phone, avatar } = req.body;

    const supportMember = await SupportTeam.findById(req.user.id);

    if (!supportMember) {
      return res.status(404).json({
        success: false,
        message: "Support team member not found",
      });
    }

    if (name) supportMember.name = name;
    if (phone) supportMember.phone = phone;
    if (avatar) supportMember.avatar = avatar;

    await supportMember.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: {
        _id: supportMember._id,
        name: supportMember.name,
        email: supportMember.email,
        phone: supportMember.phone,
        avatar: supportMember.avatar,
        role: supportMember.role,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   POST /api/support-team/forgot-password
// @desc    Request password reset OTP
// @access  Public
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const supportMember = await SupportTeam.findOne({
      email: email.toLowerCase(),
    });

    if (!supportMember) {
      // Don't reveal if email exists for security
      return res.json({
        success: true,
        message: "If the email exists, an OTP has been sent",
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Delete any existing OTPs for this user
    await SupportTeamPasswordResetToken.deleteMany({
      supportTeamId: supportMember._id,
    });

    // Create new OTP token (expires in 10 minutes)
    const resetToken = new SupportTeamPasswordResetToken({
      supportTeamId: supportMember._id,
      otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    });

    await resetToken.save();

    // Send OTP email
    try {
      await sendEmail({
        email: supportMember.email,
        subject: "Password Reset OTP - Support Team",
        message: `
Hello ${supportMember.name},

You have requested to reset your password. Please use the following OTP to reset your password:

OTP: ${otp}

This OTP will expire in 10 minutes.

If you did not request this, please ignore this email.

Best regards,
Com Financial Services Support Team
        `,
      });
    } catch (emailError) {
      console.error("Failed to send email:", emailError);
      return res.status(500).json({
        success: false,
        message: "Failed to send OTP email",
      });
    }

    res.json({
      success: true,
      message: "OTP has been sent to your email",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   POST /api/support-team/verify-otp
// @desc    Verify OTP for password reset
// @access  Public
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const supportMember = await SupportTeam.findOne({
      email: email.toLowerCase(),
    });

    if (!supportMember) {
      return res.status(404).json({
        success: false,
        message: "Support team member not found",
      });
    }

    const resetToken = await SupportTeamPasswordResetToken.findOne({
      supportTeamId: supportMember._id,
      otp,
      used: false,
    });

    if (!resetToken) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    if (!resetToken.isValid()) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one",
      });
    }

    // Mark OTP as used
    resetToken.used = true;
    await resetToken.save();

    // Generate temporary token for password reset (valid for 15 minutes)
    const tempToken = jwt.sign(
      {
        id: supportMember._id,
        email: supportMember.email,
        type: "support_password_reset",
      },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "15m" }
    );

    res.json({
      success: true,
      message: "OTP verified successfully",
      token: tempToken,
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   POST /api/support-team/reset-password
// @desc    Reset password using temporary token
// @access  Public (with token)
router.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword, confirmPassword } = req.body;

    if (!token || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Token, new password, and confirm password are required",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "your-secret-key"
      );
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    if (decoded.type !== "support_password_reset") {
      return res.status(400).json({
        success: false,
        message: "Invalid token type",
      });
    }

    const supportMember = await SupportTeam.findById(decoded.id);

    if (!supportMember) {
      return res.status(404).json({
        success: false,
        message: "Support team member not found",
      });
    }

    // Update password
    supportMember.password = newPassword;
    await supportMember.save();

    res.json({
      success: true,
      message: "Password reset successfully. Please login with your new password",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   PUT /api/support-team/change-password
// @desc    Change support team member password
// @access  Private/Support
router.put("/change-password", protect, async (req, res) => {
  try {
    if (req.user.type !== "support") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required",
      });
    }

    const supportMember = await SupportTeam.findById(req.user.id);

    if (!supportMember) {
      return res.status(404).json({
        success: false,
        message: "Support team member not found",
      });
    }

    const isMatch = await supportMember.matchPassword(currentPassword);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    supportMember.password = newPassword;
    await supportMember.save();

    res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   GET /api/support-team/members
// @desc    Get all support team members (Admin only)
// @access  Private/Admin
router.get("/members", protect, admin, async (req, res) => {
  try {
    const members = await SupportTeam.find()
      .select("-password")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: members,
    });
  } catch (error) {
    console.error("Get members error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   PUT /api/support-team/members/:id
// @desc    Update support team member (Admin only)
// @access  Private/Admin
router.put("/members/:id", protect, admin, async (req, res) => {
  try {
    const { name, email, phone, role, isActive } = req.body;

    const member = await SupportTeam.findById(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Support team member not found",
      });
    }

    if (name) member.name = name;
    if (email) member.email = email;
    if (phone !== undefined) member.phone = phone;
    if (role) member.role = role;
    if (isActive !== undefined) member.isActive = isActive;

    await member.save();

    res.json({
      success: true,
      message: "Support team member updated successfully",
      data: {
        _id: member._id,
        name: member.name,
        email: member.email,
        phone: member.phone,
        role: member.role,
        isActive: member.isActive,
      },
    });
  } catch (error) {
    console.error("Update member error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   DELETE /api/support-team/members/:id
// @desc    Delete support team member (Admin only)
// @access  Private/Admin
router.delete("/members/:id", protect, admin, async (req, res) => {
  try {
    const member = await SupportTeam.findById(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Support team member not found",
      });
    }

    await SupportTeam.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Support team member deleted successfully",
    });
  } catch (error) {
    console.error("Delete member error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   POST /api/support-team/send-email
// @desc    Send email to contact form user
// @access  Private/Support
router.post("/send-email", protect, async (req, res) => {
  try {
    if (req.user.type !== "support") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const { contactId, subject, message } = req.body;

    if (!contactId || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Contact ID, subject, and message are required",
      });
    }

    const contact = await Contact.findById(contactId);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    // Send email
    await sendEmail({
      email: contact.email,
      subject: subject,
      message: `
Dear ${contact.name},

${message}

Best regards,
Com Financial Services Support Team
      `,
    });

    // Update contact as replied
    contact.replied = true;
    contact.repliedAt = new Date();
    contact.repliedBy = req.user.id;
    contact.replyMessage = message;
    await contact.save();

    res.json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    console.error("Send email error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send email",
    });
  }
});

// @route   GET /api/support-team/chats
// @desc    Get all support chats
// @access  Private/Support
router.get("/chats", protect, async (req, res) => {
  try {
    if (req.user.type !== "support") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const chats = await SupportChat.find({
      $or: [
        { supportTeam: req.user.id },
        { user: { $exists: true } },
      ],
    })
      .populate("user", "name email")
      .populate("supportTeam", "name email")
      .sort({ lastMessageAt: -1 });

    res.json({
      success: true,
      data: chats,
    });
  } catch (error) {
    console.error("Get chats error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   GET /api/support-team/chats/:chatId
// @desc    Get specific chat
// @access  Private/Support
router.get("/chats/:chatId", protect, async (req, res) => {
  try {
    if (req.user.type !== "support") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const chat = await SupportChat.findById(req.params.chatId)
      .populate("user", "name email")
      .populate("supportTeam", "name email");

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    res.json({
      success: true,
      data: chat,
    });
  } catch (error) {
    console.error("Get chat error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   POST /api/support-team/chats/:chatId/messages
// @desc    Send message in chat
// @access  Private/Support
router.post("/chats/:chatId/messages", protect, async (req, res) => {
  try {
    if (req.user.type !== "support") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const chat = await SupportChat.findById(req.params.chatId);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    chat.messages.push({
      sender: "support",
      message: message.trim(),
      read: false,
    });

    chat.lastMessageAt = new Date();
    await chat.save();

    res.json({
      success: true,
      message: "Message sent successfully",
      data: chat,
    });
  } catch (error) {
    console.error("Send message error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   POST /api/support-team/chats
// @desc    Create new chat with user
// @access  Private/Support
router.post("/chats", protect, async (req, res) => {
  try {
    if (req.user.type !== "support") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const { userId, subject, initialMessage } = req.body;

    if (!userId || !subject || !initialMessage) {
      return res.status(400).json({
        success: false,
        message: "User ID, subject, and initial message are required",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const chat = new SupportChat({
      user: userId,
      supportTeam: req.user.id,
      subject,
      messages: [
        {
          sender: "support",
          message: initialMessage.trim(),
          read: false,
        },
      ],
      status: "open",
    });

    await chat.save();

    res.status(201).json({
      success: true,
      message: "Chat created successfully",
      data: chat,
    });
  } catch (error) {
    console.error("Create chat error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   PUT /api/support-team/chats/:chatId/status
// @desc    Update chat status (support team only)
// @access  Private/Support
router.put("/chats/:chatId/status", protect, async (req, res) => {
  try {
    if (req.user.type !== "support") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const { status } = req.body;

    if (!["open", "resolved", "closed"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be open, resolved, or closed",
      });
    }

    const chat = await SupportChat.findById(req.params.chatId);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    chat.status = status;
    await chat.save();

    res.json({
      success: true,
      message: "Chat status updated successfully",
      data: chat,
    });
  } catch (error) {
    console.error("Update chat status error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   POST /api/support-team/user-chat
// @desc    User creates a chat request
// @access  Private/User
router.post("/user-chat", protect, async (req, res) => {
  try {
    // Only allow regular users, not support team
    if (req.user.type === "support") {
      return res.status(403).json({
        success: false,
        message: "Support team members cannot create user chats",
      });
    }

    const { subject, message } = req.body;

    if (!subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Subject and message are required",
      });
    }

    // Find an available support team member (preferably manager)
    const supportMember = await SupportTeam.findOne({
      isActive: true,
      role: "support_manager",
    }) || await SupportTeam.findOne({ isActive: true });

    if (!supportMember) {
      return res.status(503).json({
        success: false,
        message: "No support team member available at the moment",
      });
    }

    const chat = new SupportChat({
      user: req.user._id || req.user.id,
      supportTeam: supportMember._id,
      subject,
      messages: [
        {
          sender: "user",
          message: message.trim(),
          read: false,
        },
      ],
      status: "open",
    });

    await chat.save();

    res.status(201).json({
      success: true,
      message: "Chat request created successfully",
      data: chat,
    });
  } catch (error) {
    console.error("Create user chat error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   GET /api/support-team/user-chats
// @desc    Get user's chats
// @access  Private/User
router.get("/user-chats", protect, async (req, res) => {
  try {
    // Only allow regular users
    if (req.user.type === "support") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const chats = await SupportChat.find({
      user: req.user._id || req.user.id,
    })
      .populate("supportTeam", "name email")
      .sort({ lastMessageAt: -1 });

    res.json({
      success: true,
      data: chats,
    });
  } catch (error) {
    console.error("Get user chats error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   POST /api/support-team/user-chats/:chatId/messages
// @desc    User sends a message in chat
// @access  Private/User
router.post("/user-chats/:chatId/messages", protect, async (req, res) => {
  try {
    // Only allow regular users
    if (req.user.type === "support") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const chat = await SupportChat.findById(req.params.chatId);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    // Verify chat belongs to user
    const userId = req.user._id || req.user.id;
    if (chat.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    chat.messages.push({
      sender: "user",
      message: message.trim(),
      read: false,
    });

    chat.lastMessageAt = new Date();
    await chat.save();

    res.json({
      success: true,
      message: "Message sent successfully",
      data: chat,
    });
  } catch (error) {
    console.error("Send user message error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

module.exports = router;

