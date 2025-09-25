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
const emailTemplates = require("../utils/emailTemplates");
const mongoose = require("mongoose");
const isValidObjectId = mongoose.Types.ObjectId.isValid;
const {
  getFileData,
  cleanupTempFiles,
  generateUniqueFilename,
} = require("../utils/fileHandler");

// Import all the new models
const CompanyForm = require("../models/CompanyForm");
const OtherRegistrationForm = require("../models/OtherRegistrationForm");
const ROCForm = require("../models/ROCForm");
const ReportsForm = require("../models/ReportsForm");
const TrademarkISOForm = require("../models/TrademarkISOForm");
const AdvisoryForm = require("../models/AdvisoryForm");

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

// @route   DELETE /api/admin/service-forms/:id/reports/:reportId
// @desc    Delete a report (and its attached document) for any service form
// @access  Private/Admin
router.delete("/service-forms/:id/reports/:reportId", async (req, res) => {
  try {
    const { id, reportId } = req.params;
    const { service } = req.query;

    // Validate IDs
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid form ID format. Must be a 24-character hex string.",
      });
    }
    if (!isValidObjectId(reportId)) {
      return res.status(400).json({
        message: "Invalid report ID format. Must be a 24-character hex string.",
      });
    }

    // Determine model based on service
    let model;
    if (
      service === "Company Formation" ||
      (service || "").includes("Company")
    ) {
      model = CompanyForm;
    } else if (
      service === "Other Registration" ||
      (service || "").includes("Registration")
    ) {
      model = OtherRegistrationForm;
    } else if (service === "ROC Returns" || (service || "").includes("ROC")) {
      model = ROCForm;
    } else if (service === "Reports" || (service || "").includes("Report")) {
      model = ReportsForm;
    } else if (
      service === "Trademark & ISO" ||
      (service || "").includes("Trademark") ||
      (service || "").includes("ISO")
    ) {
      model = TrademarkISOForm;
    } else if (service === "Advisory" || (service || "").includes("Advisory")) {
      model = AdvisoryForm;
    } else {
      model = TaxForm;
    }

    const form = await model.findById(id);
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    // Find report
    const reportIndex = (form.reports || []).findIndex(
      (r) => r._id.toString() === reportId
    );
    if (reportIndex === -1) {
      return res.status(404).json({ message: "Report not found" });
    }

    const report = form.reports[reportIndex];
    const docId = report.documentId ? report.documentId.toString() : null;

    // Remove report
    form.reports.splice(reportIndex, 1);

    // Remove attached document if present
    let removedDocument = null;
    if (docId && form.documents && form.documents.length) {
      const docIndex = form.documents.findIndex(
        (d) => d._id.toString() === docId
      );
      if (docIndex !== -1) {
        removedDocument = form.documents[docIndex];
        form.documents.splice(docIndex, 1);
      }
    }

    await form.save();

    return res.json({
      success: true,
      message: "Report deleted successfully",
      removedDocumentId: removedDocument ? removedDocument._id : undefined,
    });
  } catch (error) {
    console.error("Error deleting report:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/admin/forms/:id
// @desc    Get single tax form submission
// @access  Private/Admin
router.get("/forms/:id", validateObjectId(), async (req, res) => {
  try {
    const id = req.params.id;

    const form = await TaxForm.findById(id).select("-documents.fileData"); // Exclude file data to reduce payload size

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
router.get(
  "/forms/:id/documents/:documentId",
  validateObjectId("id"),
  async (req, res) => {
    try {
      const formId = req.params.id;
      const documentId = req.params.documentId;

      // Validate documentId
      if (!isValidObjectId(documentId)) {
        return res.status(400).json({
          message:
            "Invalid document ID format. Must be a 24-character hex string.",
        });
      }

      // Find the tax form containing the document
      const taxForm = await TaxForm.findById(formId);

      if (!taxForm) {
        return res.status(404).json({ message: "Form not found" });
      }

      // Find the specific document in the documents array
      const document = taxForm.documents.find(
        (doc) => doc._id.toString() === documentId
      );

      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }

      // Set response headers
      res.set({
        "Content-Type": document.contentType,
        "Content-Disposition": `attachment; filename="${
          document.originalName || document.fileName || "document"
        }"`,
      });

      // Send the file data
      res.send(document.fileData);
    } catch (error) {
      console.error("Error downloading document:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// @route   POST /api/admin/forms/:id/send-report
// @desc    Send a report to the user
// @access  Private/Admin
router.post(
  "/forms/:id/send-report",
  validateObjectId(),
  upload.single("reportFile"),
  async (req, res) => {
    try {
      const { reportType, message, attachmentIds } = req.body;
      const id = req.params.id;

      // Validate required fields
      if (!reportType || !message) {
        return res
          .status(400)
          .json({ message: "Report type and message are required" });
      }

      // Find the form - try different models
      let form = null;
      let formModel = null;

      // Try to find the form in different collections
      const models = [
        { model: TaxForm, name: "TaxForm" },
        { model: CompanyForm, name: "CompanyForm" },
        { model: OtherRegistrationForm, name: "OtherRegistrationForm" },
        { model: ROCForm, name: "ROCForm" },
        { model: ReportsForm, name: "ReportsForm" },
        { model: TrademarkISOForm, name: "TrademarkISOForm" },
        { model: AdvisoryForm, name: "AdvisoryForm" },
      ];

      for (const { model, name } of models) {
        try {
          form = await model.findById(id);
          if (form) {
            formModel = model;
            break;
          }
        } catch (error) {
          // Continue to next model if this one fails
          continue;
        }
      }

      if (!form) {
        return res.status(404).json({ message: "Form not found" });
      }

      // Ensure user is authenticated
      if (!req.user || !req.user._id) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      // Get user email from the form
      const userEmail = form.email;

      // TODO: Implement email sending functionality
      // This would typically involve:
      // 1. Creating an email with the message
      // 2. Attaching any documents specified by attachmentIds
      // 3. Sending the email to the user

      let newReportDocument = null;
      let documentId = undefined;

      if (req.file) {
        // Use getFileData utility to handle both disk and memory storage
        const fileData = getFileData(req.file);

        // Check if this is a TaxForm to store in adminData section
        if (formModel.modelName === "TaxForm") {
          // Initialize adminData if it doesn't exist
          if (!form.adminData) {
            form.adminData = { reports: [], documents: [], notes: [] };
          }

          // Create admin report with embedded document
          const adminReport = {
            type: reportType,
            message: message,
            sentAt: new Date(),
            sentBy: req.user._id,
            document: {
              fileName: req.file.originalname,
              originalName: req.file.originalname,
              fileType: req.file.mimetype,
              fileSize: req.file.size,
              fileData: fileData,
              contentType: req.file.mimetype,
              uploadDate: new Date(),
            },
          };

          form.adminData.reports.push(adminReport);
          documentId =
            form.adminData.reports[form.adminData.reports.length - 1]._id;
        } else {
          // For non-TaxForm models, use the existing documents array approach
          newReportDocument = {
            documentType: "admin-report",
            fileName: req.file.originalname,
            originalName: req.file.originalname,
            fileType: req.file.mimetype,
            fileSize: req.file.size,
            fileData: fileData,
            contentType: req.file.mimetype,
            uploadedBy: "admin",
            reportType: reportType,
            message: message,
            createdAt: new Date(),
          };
          form.documents.push(newReportDocument);
          documentId = form.documents[form.documents.length - 1]._id;
        }

        // Clean up temporary files (only applies to disk storage)
        cleanupTempFiles([req.file]);
      }

      // Update the form to record that a report was sent
      // For TaxForms, the report is already stored in adminData.reports
      // For other forms, we still use the general reports array for tracking
      if (formModel.modelName !== "TaxForm") {
        form.reports.push({
          type: reportType,
          message: message,
          sentAt: new Date(),
          sentBy: req.user._id,
          documentId: documentId,
        });
      }

      await form.save();

      // EMAIL SENDING DISABLED FOR REPORTS
      // Note: Email notifications for report distribution have been disabled
      // The report is still generated and stored in the database
      // Users can access reports through their dashboard
      console.log(
        `Report generated and stored for user ${userEmail} - Email notification disabled`
      );

      res.json({ success: true, message: "Report sent successfully" });
    } catch (error) {
      console.error("Send report error:", error);

      // Handle specific mongoose validation errors
      if (error.name === "ValidationError") {
        const validationErrors = Object.values(error.errors).map(
          (err) => err.message
        );
        return res.status(400).json({
          message: "Validation failed",
          errors: validationErrors,
        });
      }

      // Handle mongoose cast errors (invalid ObjectId)
      if (error.name === "CastError") {
        return res.status(400).json({ message: "Invalid ID format" });
      }

      res.status(500).json({
        message: "Server error",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }
);

// @route   PUT /api/admin/forms/:id/status
// @desc    Update form status
// @access  Private/Admin
router.put("/forms/:id/status", validateObjectId(), async (req, res) => {
  try {
    const { status, comment } = req.body;
    const id = req.params.id;

    // Validate status
    if (!["Pending", "Reviewed", "Filed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    // Validate ObjectId
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid form ID" });
    }

    // Define all form models to search
    const formModels = [
      { model: TaxForm, name: "TaxForm" },
      { model: CompanyForm, name: "CompanyForm" },
      { model: ROCForm, name: "ROCForm" },
      { model: OtherRegistrationForm, name: "OtherRegistrationForm" },
      { model: ReportsForm, name: "ReportsForm" },
      { model: TrademarkISOForm, name: "TrademarkISOForm" },
      { model: AdvisoryForm, name: "AdvisoryForm" },
    ];

    let form = null;
    let formType = null;

    // Search across all form models
    for (const { model, name } of formModels) {
      try {
        form = await model.findById(id);
        if (form) {
          formType = name;
          break;
        }
      } catch (err) {
        // Continue searching other models
        continue;
      }
    }

    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    // Update form status
    form.status = status;
    form.updatedAt = Date.now();

    // Add comment if provided
    if (comment) {
      if (!form.adminComments) {
        form.adminComments = [];
      }
      form.adminComments.push({
        comment,
        createdAt: new Date(),
        createdBy: "admin",
      });
    }

    await form.save();

    res.json({
      success: true,
      message: "Form status updated",
      form,
      formType,
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
    // Get counts by status (current snapshot)
    const total = await TaxForm.countDocuments();
    const pending = await TaxForm.countDocuments({ status: "Pending" });
    const reviewed = await TaxForm.countDocuments({ status: "Reviewed" });
    const filed = await TaxForm.countDocuments({ status: "Filed" });

    // Get recent submissions
    const recent = await TaxForm.find().sort({ createdAt: -1 }).limit(5);

    // Get totals
    const contacts = await Contact.countDocuments();
    const users = await User.countDocuments({ role: "user" });

    // Build last 12 months range
    const now = new Date();
    const months = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const start = new Date(d.getFullYear(), d.getMonth(), 1);
      const end = new Date(d.getFullYear(), d.getMonth() + 1, 1);
      const label = start.toLocaleString("en-US", { month: "short" });
      months.push({
        year: start.getFullYear(),
        month: start.getMonth() + 1,
        start,
        end,
        label,
      });
    }

    // Aggregations
    const usersAgg = await User.aggregate([
      { $match: { role: "user", createdAt: { $gte: months[0].start } } },
      {
        $group: {
          _id: { y: { $year: "$createdAt" }, m: { $month: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
    ]);

    const contactsAgg = await Contact.aggregate([
      { $match: { createdAt: { $gte: months[0].start } } },
      {
        $group: {
          _id: { y: { $year: "$createdAt" }, m: { $month: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
    ]);

    const formsAgg = await TaxForm.aggregate([
      { $match: { createdAt: { $gte: months[0].start } } },
      {
        $group: {
          _id: {
            y: { $year: "$createdAt" },
            m: { $month: "$createdAt" },
            status: "$status",
          },
          count: { $sum: 1 },
        },
      },
    ]);

    // Map aggregations to last-12-month arrays
    const usersMonthly = months.map(({ year, month, label }) => {
      const hit = usersAgg.find((a) => a._id.y === year && a._id.m === month);
      return { month: label, users: hit ? hit.count : 0 };
    });

    const contactsMonthly = months.map(({ year, month, label }) => {
      const hit = contactsAgg.find(
        (a) => a._id.y === year && a._id.m === month
      );
      return { month: label, contacts: hit ? hit.count : 0 };
    });

    const formsTrendMonthly = months.map(({ year, month, label }) => {
      const pendingHit = formsAgg.find(
        (a) =>
          a._id.y === year && a._id.m === month && a._id.status === "Pending"
      );
      const reviewedHit = formsAgg.find(
        (a) =>
          a._id.y === year && a._id.m === month && a._id.status === "Reviewed"
      );
      const filedHit = formsAgg.find(
        (a) => a._id.y === year && a._id.m === month && a._id.status === "Filed"
      );
      return {
        month: label,
        pending: pendingHit ? pendingHit.count : 0,
        reviewed: reviewedHit ? reviewedHit.count : 0,
        filed: filedHit ? filedHit.count : 0,
      };
    });

    res.json({
      taxForms: { total, pending, reviewed, filed },
      contacts,
      users,
      recent,
      // new fields for richer dashboard
      usersMonthly,
      formsTrendMonthly,
      contactsMonthly,
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
        { aadhaar: searchRegex },
        { address: searchRegex },
      ];
    }

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const users = await User.find(filter)
      .select(
        "name fatherName mobile email address pan aadhaar dob createdAt isBlocked blockedAt blockReason blockedBy unblockedAt unblockedBy"
      )
      .populate("blockedBy", "name email")
      .populate("unblockedBy", "name email")
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

// @route   GET /api/admin/users/:id
// @desc    Get user details by ID
// @access  Private/Admin
router.get("/users/:id", validateObjectId(), async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate("blockedBy", "name email")
      .populate("unblockedBy", "name email");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   PUT /api/admin/users/:id
// @desc    Update user profile
// @access  Private/Admin
router.put("/users/:id", validateObjectId(), async (req, res) => {
  try {
    const { name, email, mobile, pan, aadhaar, fatherName, address, dob } =
      req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if email is being changed and if it already exists
    if (email && email !== user.email) {
      const existingUser = await User.findOne({
        email,
        _id: { $ne: req.params.id },
      });
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
      }
    }

    // Update user fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (mobile) user.mobile = mobile;
    if (pan) user.pan = pan;
    if (aadhaar) user.aadhaar = aadhaar;
    if (fatherName) user.fatherName = fatherName;
    if (address) user.address = address;
    if (dob) user.dob = new Date(dob);

    await user.save();

    res.json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("Update user error:", error);

    // Handle specific MongoDB errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        message: `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } already exists`,
      });
    }

    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/admin/users/:id/block
// @desc    Block a user
// @access  Private/Admin
router.post("/users/:id/block", validateObjectId(), async (req, res) => {
  try {
    const { reason } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isBlocked) {
      return res.status(400).json({ message: "User is already blocked" });
    }

    user.isBlocked = true;
    user.blockedAt = new Date();
    user.blockedBy = req.user._id;
    user.blockReason = reason;

    await user.save();

    // Send email notification to user
    try {
      const adminUser = await User.findById(req.user._id).select("name email");
      const emailTemplate = emailTemplates.userBlocked(
        user.name,
        reason,
        adminUser?.name || "Admin"
      );

      await sendEmail({
        email: user.email,
        subject: emailTemplate.subject,
        html: emailTemplate.html,
        text: emailTemplate.text,
      });

      console.log(`Block notification email sent to ${user.email}`);
    } catch (emailError) {
      console.error(
        `Failed to send block notification email to ${user.email}:`,
        emailError
      );
    }

    res.json({ message: "User blocked successfully" });
  } catch (error) {
    console.error("Block user error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/admin/users/:id/unblock
// @desc    Unblock a user
// @access  Private/Admin
router.post("/users/:id/unblock", validateObjectId(), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.isBlocked) {
      return res.status(400).json({ message: "User is not blocked" });
    }

    user.isBlocked = false;
    user.unblockedAt = new Date();
    user.unblockedBy = req.user._id;

    await user.save();

    // Send email notification to user
    try {
      const adminUser = await User.findById(req.user._id).select("name email");
      const emailTemplate = emailTemplates.userUnblocked(
        user.name,
        adminUser?.name || "Admin"
      );

      await sendEmail({
        email: user.email,
        subject: emailTemplate.subject,
        html: emailTemplate.html,
        text: emailTemplate.text,
      });

      console.log(`Unblock notification email sent to ${user.email}`);
    } catch (emailError) {
      console.error(
        `Failed to send unblock notification email to ${user.email}:`,
        emailError
      );
    }

    res.json({ message: "User unblocked successfully" });
  } catch (error) {
    console.error("Unblock user error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete a user
// @access  Private/Admin
router.delete("/users/:id", validateObjectId(), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete user
    await User.findByIdAndDelete(req.params.id);

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
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
        { aadhaar: searchRegex },
        { address: searchRegex },
      ];
    }

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const users = await User.find(filter)
      .select("name fatherName mobile email address pan aadhaar dob createdAt")
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
      { header: "Aadhaar Number", key: "aadhaar", width: 18 },
      { header: "Date of Birth", key: "dob", width: 15 },
      { header: "Registered On", key: "createdAt", width: 15 },
    ];

    // Style the header row
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE0E0E0" },
    };

    // Add rows
    users.forEach((user) => {
      worksheet.addRow({
        name: user.name || "N/A",
        fatherName: user.fatherName || "N/A",
        mobile: user.mobile || "N/A",
        email: user.email || "N/A",
        address: user.address || "N/A",
        pan: user.pan || "N/A",
        aadhaar: user.aadhaar || "N/A",
        dob: user.dob ? new Date(user.dob).toLocaleDateString() : "N/A",
        createdAt: new Date(user.createdAt).toLocaleDateString(),
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
      `attachment; filename=registered_users_${
        new Date().toISOString().split("T")[0]
      }.xlsx`
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
        message: `Dear ${contact.name},\n\nThank you for reaching out to us. Here is the response to your query:\n\n${message}\n\nBest regards,\nThe Com Finance Team`,
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

// @route   GET /api/admin/test-forms
// @desc    Test endpoint to check if forms exist in database
// @access  Private/Admin
router.get("/test-forms", async (req, res) => {
  try {
    // Check all models for forms
    const [
      taxCount,
      companyCount,
      rocCount,
      otherCount,
      reportsCount,
      trademarkCount,
      advisoryCount,
    ] = await Promise.all([
      TaxForm.countDocuments(),
      CompanyForm.countDocuments(),
      ROCForm.countDocuments(),
      OtherRegistrationForm.countDocuments(),
      ReportsForm.countDocuments(),
      TrademarkISOForm.countDocuments(),
      AdvisoryForm.countDocuments(),
    ]);

    res.json({
      message: "Database form counts",
      counts: {
        TaxForm: taxCount,
        CompanyForm: companyCount,
        ROCForm: rocCount,
        OtherRegistrationForm: otherCount,
        ReportsForm: reportsCount,
        TrademarkISOForm: trademarkCount,
        AdvisoryForm: advisoryCount,
      },
      total:
        taxCount +
        companyCount +
        rocCount +
        otherCount +
        reportsCount +
        trademarkCount +
        advisoryCount,
    });
  } catch (error) {
    console.error("Test forms error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/admin/service-forms
// @desc    Get all form submissions from all services with optional filters
// @access  Private/Admin
router.get("/service-forms", async (req, res) => {
  try {
    const {
      search,
      service,
      status,
      startDate,
      endDate,
      page = 1,
      limit = 10,
    } = req.query;

    // Build filter object
    const filter = {};

    if (service && service !== "all") filter.service = service;
    if (status && status !== "all") filter.status = status;

    // Unified search across common fields
    if (search) {
      const searchRegex = { $regex: search, $options: "i" };
      filter.$or = [
        { fullName: searchRegex },
        { email: searchRegex },
        { businessName: searchRegex },
        { companyName: searchRegex },
        { service: searchRegex },
      ];
    }

    // Date range filter
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    // Fetch forms from ALL models
    const [
      taxForms,
      companyForms,
      rocForms,
      otherRegistrationForms,
      reportsForms,
      trademarkISOForms,
      advisoryForms,
    ] = await Promise.all([
      TaxForm.find(filter)
        .select("-documents.fileData")
        .populate("user", "name email mobile pan")
        .sort({ createdAt: -1 }),
      CompanyForm.find(filter)
        .select("-documents.fileData")
        .populate("user", "name email mobile pan")
        .sort({ createdAt: -1 }),
      ROCForm.find(filter)
        .select("-documents.fileData")
        .populate("user", "name email mobile pan")
        .sort({ createdAt: -1 }),
      OtherRegistrationForm.find(filter)
        .select("-documents.fileData")
        .populate("user", "name email mobile pan")
        .sort({ createdAt: -1 }),
      ReportsForm.find(filter)
        .select("-documents.fileData")
        .populate("user", "name email mobile pan")
        .sort({ createdAt: -1 }),
      TrademarkISOForm.find(filter)
        .select("-documents.fileData")
        .populate("user", "name email mobile pan")
        .sort({ createdAt: -1 }),
      AdvisoryForm.find(filter)
        .select("-documents.fileData")
        .populate("user", "name email mobile pan")
        .sort({ createdAt: -1 }),
    ]);

    // Combine all forms and add form type identifier
    const allForms = [
      ...taxForms.map((form) => ({ ...form.toObject(), formType: "TaxForm" })),
      ...companyForms.map((form) => ({
        ...form.toObject(),
        formType: "CompanyForm",
      })),
      ...rocForms.map((form) => ({ ...form.toObject(), formType: "ROCForm" })),
      ...otherRegistrationForms.map((form) => ({
        ...form.toObject(),
        formType: "OtherRegistrationForm",
      })),
      ...reportsForms.map((form) => ({
        ...form.toObject(),
        formType: "ReportsForm",
      })),
      ...trademarkISOForms.map((form) => ({
        ...form.toObject(),
        formType: "TrademarkISOForm",
      })),
      ...advisoryForms.map((form) => ({
        ...form.toObject(),
        formType: "AdvisoryForm",
      })),
    ];

    // Sort all forms by creation date (newest first)
    allForms.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Apply pagination
    const total = allForms.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedForms = allForms.slice(startIndex, endIndex);

    res.json({
      forms: paginatedForms,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get service forms error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get forms by service type for admin panel
router.get("/forms/service", admin, async (req, res) => {
  try {
    const { service, status, search } = req.query;
    let query = {};

    // Filter by service type
    if (service && service !== "all") {
      query.service = service;
    }

    // Filter by status
    if (status && status !== "all") {
      query.status = status;
    }

    // Search functionality
    if (search) {
      const searchRegex = new RegExp(search, "i");
      query.$or = [
        { businessName: searchRegex },
        { companyName: searchRegex },
        { fullName: searchRegex },
        { email: searchRegex },
      ];
    }

    // Determine which model to use based on service category
    let forms = [];
    let model;

    if (service === "Company Formation" || service.includes("Company")) {
      model = CompanyForm;
    } else if (
      service === "Other Registration" ||
      service.includes("Registration")
    ) {
      model = OtherRegistrationForm;
    } else if (service === "ROC Returns" || service.includes("ROC")) {
      model = ROCForm;
    } else if (service === "Reports" || service.includes("Report")) {
      model = ReportsForm;
    } else if (
      service === "Trademark & ISO" ||
      service.includes("Trademark") ||
      service.includes("ISO")
    ) {
      model = TrademarkISOForm;
    } else if (service === "Advisory" || service.includes("Advisory")) {
      model = AdvisoryForm;
    } else {
      // Default to TaxForm for taxation services
      model = TaxForm;
    }

    // Fetch forms with pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    forms = await model
      .find(query)
      .populate("user", "name email mobile pan")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await model.countDocuments(query);

    res.json({
      success: true,
      forms,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching service forms:", error);
    res.status(500).json({ success: false, message: "Failed to fetch forms" });
  }
});

// @route   PUT /api/admin/roc-returns/:id/status
// @desc    Update ROC returns form status and upload completion documents
// @access  Private/Admin
router.put(
  "/roc-returns/:id/status",
  upload.array("completionDocuments", 10),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { status, remarks, completionNotes } = req.body;

      if (!isValidObjectId(id)) {
        return res.status(400).json({ message: "Invalid form ID" });
      }

      if (!status || !["Pending", "Reviewed", "Filed"].includes(status)) {
        return res.status(400).json({
          message: "Invalid status. Must be Pending, Reviewed, or Filed",
        });
      }

      const rocForm = await ROCForm.findById(id);
      if (!rocForm) {
        return res.status(404).json({ message: "ROC returns form not found" });
      }

      const updateData = {
        status,
        updatedAt: new Date(),
      };

      // Add admin remarks if provided
      if (remarks) {
        updateData.remarks = remarks;
      }

      // Add completion notes if status is Filed
      if (status === "Filed" && completionNotes) {
        updateData.completionNotes = completionNotes;
      }

      // Process completion documents if status is Filed
      if (status === "Filed" && req.files && req.files.length > 0) {
        const completionDocs = req.files.map((file, index) => ({
          documentType:
            req.body[`documentType_${index}`] || "Completion Document",
          fileName: generateUniqueFilename(file.originalname),
          originalName: file.originalname,
          fileType: file.mimetype,
          fileSize: file.size,
          fileData: getFileData(file),
          contentType: file.mimetype,
          uploadedBy: "admin",
          isCompletionDocument: true,
        }));

        updateData.completionDocuments = completionDocs;
      }

      const updatedForm = await ROCForm.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      }).select("-documents.fileData -completionDocuments.fileData");

      // Email notification for ROC returns status update disabled
      console.log(
        `ROC returns form status updated to ${status} for ${rocForm.fullName} - email notification disabled`
      );

      res.json({
        success: true,
        message: "ROC returns form status updated successfully",
        data: updatedForm,
      });
    } catch (error) {
      console.error("Error updating ROC returns form status:", error);
      res
        .status(500)
        .json({ message: "Server error while updating form status" });
    }
  }
);

// @route   GET /api/admin/roc-returns/:id
// @desc    Get specific ROC returns form details for admin
// @access  Private/Admin
router.get("/roc-returns/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid form ID" });
    }

    const rocForm = await ROCForm.findById(id)
      .select("-documents.fileData -completionDocuments.fileData")
      .populate("user", "name email mobile pan");

    if (!rocForm) {
      return res.status(404).json({ message: "ROC returns form not found" });
    }

    res.json({
      success: true,
      data: rocForm,
    });
  } catch (error) {
    console.error("Error fetching ROC returns form details:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching form details" });
  }
});

// @route   GET /api/admin/roc-returns/:id/download/:documentId
// @desc    Download document from ROC returns form (admin access)
// @access  Private/Admin
router.get("/roc-returns/:id/download/:documentId", async (req, res) => {
  try {
    const { id, documentId } = req.params;

    if (!isValidObjectId(id) || !isValidObjectId(documentId)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const rocForm = await ROCForm.findById(id);
    if (!rocForm) {
      return res.status(404).json({ message: "ROC returns form not found" });
    }

    // Find document in either documents or completionDocuments array
    let document = rocForm.documents.find(
      (d) => d._id.toString() === documentId
    );
    let isCompletionDoc = false;

    if (!document) {
      document = rocForm.completionDocuments?.find(
        (d) => d._id.toString() === documentId
      );
      isCompletionDoc = true;
    }

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    res.set({
      "Content-Type": document.contentType,
      "Content-Disposition": `attachment; filename="${
        document.originalName || document.fileName || "document"
      }"`,
    });

    res.send(document.fileData);
  } catch (error) {
    console.error("Error downloading ROC returns document:", error);
    res
      .status(500)
      .json({ message: "Server error while downloading document" });
  }
});

// @route   POST /api/admin/send-weekly-report
// @desc    Send weekly admin report to all admins
// @access  Private/Admin
// Weekly admin report functionality removed - email notifications disabled

// @route   POST /api/admin/forms/:formId/reports
// @desc    Create an admin report with documents for a specific form
// @access  Private/Admin
router.post(
  "/forms/:formId/reports",
  upload.array("documents", 10),
  async (req, res) => {
    try {
      const { formId } = req.params;
      const { message, reportType, formType } = req.body;

      if (!message || !reportType) {
        return res
          .status(400)
          .json({ message: "Message and report type are required" });
      }

      // Determine which model to use based on formType
      let Model;
      switch (formType) {
        case "CompanyForm":
          Model = CompanyForm;
          break;
        case "OtherRegistrationForm":
          Model = OtherRegistrationForm;
          break;
        case "ROCForm":
          Model = ROCForm;
          break;
        case "ReportsForm":
          Model = ReportsForm;
          break;
        case "TrademarkISOForm":
          Model = TrademarkISOForm;
          break;
        case "AdvisoryForm":
          Model = AdvisoryForm;
          break;
        case "TaxForm":
          Model = TaxForm;
          break;
        default:
          return res.status(400).json({ message: "Invalid form type" });
      }

      // Find the form
      const form = await Model.findById(formId);
      if (!form) {
        return res.status(404).json({ message: "Form not found" });
      }

      // Process uploaded documents
      const documents = [];
      if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          documents.push({
            documentType: "admin-report",
            fileName: generateUniqueFilename(file.originalname),
            originalName: file.originalname,
            fileType: file.mimetype,
            fileSize: file.size,
            fileData: getFileData(file),
            contentType: file.mimetype,
            uploadedBy: "admin",
            uploadDate: new Date(),
          });
        }
      }

      // Create the report
      const report = {
        message,
        type: reportType,
        documents: documents.map((doc) => doc._id || doc),
        sentAt: new Date(),
        sentBy: req.user.name || req.user.email,
      };

      // Add the report to the form
      if (!form.reports) {
        form.reports = [];
      }
      form.reports.push(report);

      // If documents were uploaded, add them to the form's documents array
      if (documents.length > 0) {
        if (!form.documents) {
          form.documents = [];
        }
        form.documents.push(...documents);
      }

      await form.save();

      res.status(201).json({
        message: "Admin report created successfully",
        reportId: report._id,
        documentsCount: documents.length,
      });
    } catch (error) {
      console.error("Error creating admin report:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
