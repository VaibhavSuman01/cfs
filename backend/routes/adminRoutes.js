const express = require("express");
const router = express.Router();
const TaxForm = require("../models/TaxForm");
const Contact = require("../models/Contact");
const User = require("../models/User");
const { protect, admin } = require("../middleware/auth");
const path = require("path");
const fs = require("fs");
const ExcelJS = require("exceljs");
const { validateObjectId } = require("../utils/validation");
const upload = require("../middleware/upload");
const sendEmail = require("../utils/email");
const mongoose = require("mongoose");
const isValidObjectId = mongoose.Types.ObjectId.isValid;

// Apply auth middleware to all admin routes
router.use(protect);
router.use(admin);

// @route   GET /api/admin/forms
// @desc    Get all tax form submissions with optional filters
// @access  Private/Admin
router.get("/forms", async (req, res) => {
  try {
    const {
      pan,
      name,
      startDate,
      endDate,
      status,
      page = 1,
      limit = 10,
      // New filters to align with admin UI
      search,
      service,
    } = req.query;

    // Build filter object
    const filter = {};

    if (pan) filter.pan = { $regex: pan, $options: "i" };
    if (name) filter.fullName = { $regex: name, $options: "i" };
    if (status) filter.status = status;
    if (service) filter.service = service;

    // Unified search across common fields
    if (search) {
      const searchRegex = { $regex: search, $options: "i" };
      filter.$or = [
        { pan: searchRegex },
        { fullName: searchRegex },
        { email: searchRegex },
      ];
    }

    // Date range filter
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    // Pagination
    const skip = (page - 1) * limit;

    // Get forms with pagination
    const forms = await TaxForm.find(filter)
      .select("-documents.fileData") // Exclude file data to reduce payload size
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await TaxForm.countDocuments(filter);

    res.json({
      forms,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get forms error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/admin/forms/:id
// @desc    Get single tax form submission
// @access  Private/Admin
router.get("/forms/:id", validateObjectId(), async (req, res) => {
  try {
    const id = req.params.id;
    
    const form = await TaxForm.findById(id)
      .select("-documents.fileData"); // Exclude file data to reduce payload size

    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    res.json({ data: form });
  } catch (error) {
    console.error("Get form error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/admin/forms/:id/documents/:documentId
// @desc    Download a document from a tax form submission (admin access)
// @access  Private/Admin
router.get("/forms/:id/documents/:documentId", validateObjectId('id'), async (req, res) => {
  try {
    const formId = req.params.id;
    const documentId = req.params.documentId;
    
    // Validate documentId
    if (!isValidObjectId(documentId)) {
      return res.status(400).json({ 
        message: "Invalid document ID format. Must be a 24-character hex string." 
      });
    }
    
    // Find the tax form containing the document
    const taxForm = await TaxForm.findById(formId);
    
    if (!taxForm) {
      return res.status(404).json({ message: "Form not found" });
    }
    
    // Find the specific document in the documents array
    const document = taxForm.documents.find(doc => doc._id.toString() === documentId);
    
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }
    
    // Set response headers
    res.set({
      'Content-Type': document.contentType,
      'Content-Disposition': `attachment; filename="${document.originalName || document.fileName || 'document'}"`
    });
    
    // Send the file data
    res.send(document.fileData);
    
  } catch (error) {
    console.error("Error downloading document:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/admin/forms/:id/send-report
// @desc    Send a report to the user
// @access  Private/Admin
router.post("/forms/:id/send-report", validateObjectId(), upload.single('reportFile'), async (req, res) => {
  try {
    const { reportType, message, attachmentIds } = req.body;
    const id = req.params.id;
    
    // Find the tax form
    const form = await TaxForm.findById(id);
    
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }
    
    // Get user email from the form
    const userEmail = form.email;
    
    // TODO: Implement email sending functionality
    // This would typically involve:
    // 1. Creating an email with the message
    // 2. Attaching any documents specified by attachmentIds
    // 3. Sending the email to the user
    
        let newReportDocument = null;
    if (req.file) {
      newReportDocument = {
        documentType: 'admin-report',
        fileName: req.file.originalname,
        originalName: req.file.originalname,
        fileType: req.file.mimetype,
        fileSize: req.file.size,
        fileData: req.file.buffer,
        contentType: req.file.mimetype,
        uploadedBy: 'admin',
      };
      form.documents.push(newReportDocument);
    }

    // Update the form to record that a report was sent and add the new document
    form.reports.push({
      type: reportType,
      message: message,
      sentAt: new Date(),
      sentBy: req.user._id,
      documentId: newReportDocument ? form.documents[form.documents.length - 1]._id : undefined
    });

    await form.save();

    // Send an email to the user
    try {
      const emailSubject = `A new report has been sent to you: ${reportType}`;
      const emailMessage = `Hello ${form.fullName},\n\nA new report of type '${reportType}' has been sent to you by the admin.\n\nMessage from admin: ${message}\n\nYou can view and download the report from your dashboard.\n\nThank you,\nCom Finserv Team`;

      await sendEmail({
        email: userEmail,
        subject: emailSubject,
        message: emailMessage,
      });

      console.log(`Report email sent to ${userEmail}`);
    } catch (emailError) {
      console.error(`Failed to send report email to ${userEmail}:`, emailError);
      // Don't block the response for email failure, just log it
    }
    
    res.json({ success: true, message: "Report sent successfully" });
  } catch (error) {
    console.error("Send report error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   PUT /api/admin/forms/:id/status
// @desc    Update form status
// @access  Private/Admin
router.put("/forms/:id/status", validateObjectId(), async (req, res) => {
  try {
    const { status } = req.body;
    const id = req.params.id;

    // Validate status
    if (!["Pending", "Reviewed", "Filed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const form = await TaxForm.findById(id);

    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    form.status = status;
    form.updatedAt = Date.now();

    await form.save();

    res.json({
      success: true,
      message: "Form status updated",
      form,
    });
  } catch (error) {
    console.error("Update status error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/admin/stats
// @desc    Get dashboard statistics
// @access  Private/Admin
router.get("/stats", async (req, res) => {
  try {
    // Get counts by status
    const total = await TaxForm.countDocuments();
    const pending = await TaxForm.countDocuments({ status: "Pending" });
    const reviewed = await TaxForm.countDocuments({ status: "Reviewed" });
    const filed = await TaxForm.countDocuments({ status: "Filed" });

    // Get recent submissions
    const recent = await TaxForm.find().sort({ createdAt: -1 }).limit(5);

    // Get contact form count
    const contacts = await Contact.countDocuments();
    
    // Get total users count
    const users = await User.countDocuments({ role: "user" });

    res.json({
      taxForms: {
        total,
        pending,
        reviewed,
        filed,
      },
      contacts,
      users,
      recent,
    });
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/admin/contacts
// @desc    Get all contact form submissions
// @access  Private/Admin
router.get("/contacts", async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const contacts = await Contact.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Contact.countDocuments();

    res.json({
      contacts,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get contacts error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/admin/users
// @desc    Get all registered users
// @access  Private/Admin
router.get("/users", async (req, res) => {
  try {
    const { page = 1, limit = 10, search, startDate, endDate } = req.query;
    const skip = (page - 1) * limit;

    let filter = { role: "user" };

    if (search) {
      const searchRegex = { $regex: search, $options: "i" };
      filter.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { mobile: searchRegex },
        { fatherName: searchRegex },
        { pan: searchRegex },
        { aadhar: searchRegex },
        { address: searchRegex },
      ];
    }

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const users = await User.find(filter)
      .select("name fatherName mobile email address pan createdAt")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(filter);

    res.json({
      users,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/admin/users/download
// @desc    Download all registered users as Excel file
// @access  Private/Admin
router.get("/users/download", async (req, res) => {
  try {
    const { search, startDate, endDate } = req.query;

    let filter = { role: "user" };

    if (search) {
      const searchRegex = { $regex: search, $options: "i" };
      filter.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { mobile: searchRegex },
        { fatherName: searchRegex },
        { pan: searchRegex },
        { aadhar: searchRegex },
        { address: searchRegex },
      ];
    }

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const users = await User.find(filter)
      .select("name fatherName mobile email address pan aadhar dob createdAt")
      .sort({ createdAt: -1 });

    // Create a new Excel workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Registered Users");

    // Define columns
    worksheet.columns = [
      { header: "Name", key: "name", width: 20 },
      { header: "Father's Name", key: "fatherName", width: 20 },
      { header: "Mobile", key: "mobile", width: 15 },
      { header: "Email", key: "email", width: 25 },
      { header: "Address", key: "address", width: 30 },
      { header: "PAN", key: "pan", width: 15 },
      { header: "Date of Birth", key: "dob", width: 15 },
      { header: "Registered On", key: "createdAt", width: 15 }
    ];

    // Style the header row
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };

    // Add rows
    users.forEach(user => {
      worksheet.addRow({
        name: user.name || "N/A",
        fatherName: user.fatherName || "N/A",
        mobile: user.mobile || "N/A",
        email: user.email || "N/A",
        address: user.address || "N/A",
        pan: user.pan || "N/A",
        dob: user.dob ? new Date(user.dob).toLocaleDateString() : "N/A",
        createdAt: new Date(user.createdAt).toLocaleDateString()
      });
    });

    // Generate buffer instead of writing directly to response
    const buffer = await workbook.xlsx.writeBuffer();
    
    // Set response headers
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=registered_users_${new Date().toISOString().split('T')[0]}.xlsx`
    );
    res.setHeader("Content-Length", buffer.length);

    // Send the buffer
    res.send(buffer);
  } catch (error) {
    console.error("Download users error:", error);
    res.status(500).json({ message: "Server error generating Excel file" });
  }
});

// @route   POST /api/admin/contacts/:id/reply
// @desc    Reply to a contact message
// @access  Private/Admin
router.post("/contacts/:id/reply", validateObjectId(), async (req, res) => {
  try {
    const { message } = req.body;
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    try {
      await sendEmail({
        email: contact.email,
        subject: `Re: Your inquiry about ${contact.service}`,
        message: `Dear ${contact.name},\n\nThank you for reaching out to us. Here is the response to your query:\n\n${message}\n\nBest regards,\nThe Com Finserv Team`,
      });

      contact.replied = true;
      await contact.save();

      res.json({ success: true, message: "Reply sent successfully" });
    } catch (emailError) {
      console.error("Send email error:", emailError);
      res.status(500).json({ message: "Failed to send reply email." });
    }
  } catch (error) {
    console.error("Reply to contact error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
