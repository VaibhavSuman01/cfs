const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");
const SupportTeam = require("../models/SupportTeam");
const { protect, admin } = require("../middleware/auth");
const sendEmail = require("../utils/email");

// Helper function to map service to support role
const mapServiceToRole = (service) => {
  if (!service) return "live_support";
  
  const serviceLower = service.toLowerCase();
  
  if (serviceLower.includes("company information") || serviceLower.includes("company")) {
    return "company_information_support";
  } else if (serviceLower.includes("taxation") || serviceLower.includes("tax") || serviceLower.includes("gst") || serviceLower.includes("income tax") || serviceLower.includes("tds")) {
    return "taxation_support";
  } else if (serviceLower.includes("roc returns") || serviceLower.includes("roc")) {
    return "roc_returns_support";
  } else if (serviceLower.includes("other registration") || serviceLower.includes("registration") || serviceLower.includes("partnership")) {
    return "other_registration_support";
  } else if (serviceLower.includes("advisory")) {
    return "advisory_support";
  } else if (serviceLower.includes("report")) {
    return "reports_support";
  } else {
    return "live_support";
  }
};

// Helper function to check if user has a specific role
const hasRole = (userRoles, targetRole) => {
  if (!userRoles || !Array.isArray(userRoles)) {
    // Backward compatibility: if roles is not an array, treat as single role
    return userRoles === targetRole;
  }
  return userRoles.includes(targetRole);
};

// Helper function to check if user has live_support role
const hasLiveSupportRole = (userRoles) => {
  return hasRole(userRoles, "live_support");
};

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

// @route   GET /api/support/contacts
// @desc    Get all contact form submissions (for support team/admin) - filtered by role
// @access  Private/Support or Admin
router.get("/contacts", protect, async (req, res) => {
  // Allow support team or admin
  if (req.user.type !== "support" && req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied",
    });
  }
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get support team member's roles if they are support team
    let supportMemberRoles = null;
    if (req.user.type === "support") {
      const supportMember = await SupportTeam.findById(req.user.id);
      if (supportMember) {
        supportMemberRoles = supportMember.roles || (supportMember.role ? [supportMember.role] : []);
      }
    }

    // Build query
    const query = {};
    if (status === 'replied') {
      query.replied = true;
    } else if (status === 'pending') {
      query.replied = false;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { service: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } }
      ];
    }

    // STRICT ROLE-BASED FILTERING: Each role sees only their department
    let contacts = [];
    let total = 0;

    if (req.user.role === "admin") {
      // Admin can see all contacts
      contacts = await Contact.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));
      total = await Contact.countDocuments(query);
    } else if (supportMemberRoles && supportMemberRoles.length > 0) {
      // Support team member: Fetch all contacts and filter by their roles
      // If user has multiple roles (e.g., live_support + company_information_support),
      // they should see contacts matching ANY of their roles
      const allContacts = await Contact.find(query).sort({ createdAt: -1 });
      
      // Filter contacts that match one of this member's roles
      const filteredContacts = allContacts.filter((contact) => {
        const contactRole = mapServiceToRole(contact.service);
        return hasRole(supportMemberRoles, contactRole);
      });
      
      total = filteredContacts.length;
      contacts = filteredContacts.slice(skip, skip + parseInt(limit));
    } else {
      // No role found - return empty
      contacts = [];
      total = 0;
    }

    res.json({
      success: true,
      data: contacts,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch contacts" 
    });
  }
});

// @route   GET /api/support/contacts/:id
// @desc    Get a specific contact by ID (with role-based access control)
// @access  Private/Support or Admin
router.get("/contacts/:id", protect, async (req, res) => {
  if (req.user.type !== "support" && req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied",
    });
  }
  try {
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({ 
        success: false, 
        message: "Contact not found" 
      });
    }

    // STRICT ROLE-BASED ACCESS: Check if user can access this contact
    if (req.user.type === "support" && req.user.role !== "admin") {
      const supportMember = await SupportTeam.findById(req.user.id);
      if (supportMember) {
        const contactRole = mapServiceToRole(contact.service);
        const userRoles = supportMember.roles || (supportMember.role ? [supportMember.role] : []);
        
        // Check if user has the role that matches this contact's service
        // If user has multiple roles, they can access contacts matching ANY of their roles
        if (!hasRole(userRoles, contactRole)) {
          return res.status(403).json({
            success: false,
            message: "Access denied. This contact belongs to a different department.",
          });
        }
      }
    }

    res.json({
      success: true,
      data: contact
    });
  } catch (error) {
    console.error("Error fetching contact:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch contact" 
    });
  }
});

// @route   PUT /api/support/contacts/:id/reply
// @desc    Mark contact as replied and send email response
// @access  Private/Admin
router.put("/contacts/:id/reply", protect, admin, async (req, res) => {
  try {
    const { replyMessage } = req.body;
    
    if (!replyMessage || !replyMessage.trim()) {
      return res.status(400).json({ 
        success: false, 
        message: "Reply message is required" 
      });
    }

    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({ 
        success: false, 
        message: "Contact not found" 
      });
    }

    // Update contact as replied
    contact.replied = true;
    contact.repliedAt = new Date();
    contact.repliedBy = req.user._id;
    contact.replyMessage = replyMessage.trim();
    await contact.save();

    // Send email reply to user
    try {
      await sendEmail({
        email: contact.email,
        subject: `Re: ${contact.service} - Response from Com Financial Services`,
        message: `
Dear ${contact.name},

Thank you for contacting Com Financial Services.

${replyMessage}

If you have any further questions, please don't hesitate to contact us.

Best regards,
Com Financial Services Support Team
        `
      });
    } catch (emailError) {
      console.error('Failed to send reply email:', emailError);
      // Don't fail the request if email fails
    }

    res.json({
      success: true,
      message: "Reply sent successfully",
      data: contact
    });
  } catch (error) {
    console.error("Error replying to contact:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to send reply" 
    });
  }
});

// @route   PUT /api/support/contacts/:id/mark-replied
// @desc    Mark contact as replied without sending email (with role-based access control)
// @access  Private/Support or Admin
router.put("/contacts/:id/mark-replied", protect, async (req, res) => {
  if (req.user.type !== "support" && req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied",
    });
  }
  try {
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({ 
        success: false, 
        message: "Contact not found" 
      });
    }

    // STRICT ROLE-BASED ACCESS: Check if user can access this contact
    if (req.user.type === "support" && req.user.role !== "admin") {
      const supportMember = await SupportTeam.findById(req.user.id);
      if (supportMember) {
        const contactRole = mapServiceToRole(contact.service);
        const userRoles = supportMember.roles || (supportMember.role ? [supportMember.role] : []);
        
        // Check if user has the role that matches this contact's service
        // If user has multiple roles, they can access contacts matching ANY of their roles
        if (!hasRole(userRoles, contactRole)) {
          return res.status(403).json({
            success: false,
            message: "Access denied. This contact belongs to a different department.",
          });
        }
      }
    }

    contact.replied = true;
    contact.repliedAt = new Date();
    contact.repliedBy = req.user._id;
    await contact.save();

    res.json({
      success: true,
      message: "Contact marked as replied",
      data: contact
    });
  } catch (error) {
    console.error("Error marking contact as replied:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to update contact" 
    });
  }
});

// @route   DELETE /api/support/contacts/:id
// @desc    Delete a contact submission
// @access  Private/Support or Admin
router.delete("/contacts/:id", protect, async (req, res) => {
  if (req.user.type !== "support" && req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied",
    });
  }
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    
    if (!contact) {
      return res.status(404).json({ 
        success: false, 
        message: "Contact not found" 
      });
    }

    res.json({
      success: true,
      message: "Contact deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting contact:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to delete contact" 
    });
  }
});

module.exports = router;
