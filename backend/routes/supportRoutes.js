const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");
const { protect } = require("../middleware/auth");
const sendEmail = require("../utils/email");

// @route   POST /api/support/contact
// @desc    Send a support message (for blocked users or general support)
// @access  Private
router.post("/contact", protect, async (req, res) => {
  try {
    const { message, type = 'general', userEmail, userName } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ 
        success: false, 
        message: "Message is required" 
      });
    }

    // Create contact record
    const contact = new Contact({
      name: userName || req.user.name || 'Unknown User',
      email: userEmail || req.user.email,
      phone: req.user.phone || 'Not provided',
      service: type === 'account_blocked' ? 'Account Blocked Support' : 'General Support',
      message: message.trim(),
      replied: false
    });

    await contact.save();

    // Send email notification to admin
    try {
      const emailSubject = type === 'account_blocked' 
        ? `URGENT: Account Blocked - Support Request from ${contact.name}`
        : `Support Request from ${contact.name}`;
      
      const emailMessage = `
New support request received:

Type: ${type === 'account_blocked' ? 'Account Blocked Support' : 'General Support'}
Name: ${contact.name}
Email: ${contact.email}
Phone: ${contact.phone}
Message: ${contact.message}

Please respond to this user as soon as possible.

Contact ID: ${contact._id}
Created: ${contact.createdAt}
      `;

      await sendEmail({
        email: process.env.ADMIN_EMAIL || 'admin@comfinserv.com',
        subject: emailSubject,
        message: emailMessage,
      });

      console.log(`Support email sent for contact ID: ${contact._id}`);
    } catch (emailError) {
      console.error('Failed to send support email:', emailError);
      // Don't fail the request if email fails
    }

    res.status(201).json({
      success: true,
      message: "Your message has been sent to our support team. We'll get back to you within 24 hours.",
      contactId: contact._id
    });

  } catch (error) {
    console.error("Error creating support contact:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to send message. Please try again." 
    });
  }
});

// @route   GET /api/support/block-details
// @desc    Get block details for the current user
// @access  Private
router.get("/block-details", protect, async (req, res) => {
  try {
    // This endpoint should return block details if the user is blocked
    // For now, we'll return a basic structure
    // In a real implementation, you'd have a UserBlock model or similar
    
    if (!req.user.isBlocked) {
      return res.status(400).json({ 
        success: false, 
        message: "User is not blocked" 
      });
    }

    // Return block details (you might want to store this in a separate model)
    const blockDetails = {
      blockedAt: req.user.blockedAt || new Date().toISOString(),
      blockReason: req.user.blockReason || "Account suspended due to policy violation",
      blockedBy: {
        name: "Administrator",
        email: "admin@comfinserv.com"
      }
    };

    res.json({
      success: true,
      data: blockDetails
    });

  } catch (error) {
    console.error("Error fetching block details:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch block details" 
    });
  }
});

module.exports = router;
