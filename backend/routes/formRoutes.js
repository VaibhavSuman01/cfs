const express = require("express");
const router = express.Router();
const path = require("path");
const mongoose = require("mongoose");
const TaxForm = require("../models/TaxForm");
const Contact = require("../models/Contact");
const upload = require("../middleware/upload");
const { handleMulterError } = require("../middleware/upload");
const { protect } = require("../middleware/auth");
const { isValidObjectId } = require("../utils/validation");
const { validate, validateObjectId } = require("../utils/validation");
const { getFileData, cleanupTempFiles, generateUniqueFilename } = require("../utils/fileHandler");

// Import all the new models
const CompanyForm = require("../models/CompanyForm");
const OtherRegistrationForm = require("../models/OtherRegistrationForm");
const ROCForm = require("../models/ROCForm");
const ReportsForm = require("../models/ReportsForm");
const TrademarkISOForm = require("../models/TrademarkISOForm");
const AdvisoryForm = require("../models/AdvisoryForm");

// @route   GET /api/forms/check-pan/:pan
// @desc    Check if a PAN number already exists in the system
// @access  Private
router.get("/check-pan/:pan", protect, async (req, res) => {
  try {
    const { pan } = req.params;

    // Validate PAN format
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panRegex.test(pan)) {
      return res.status(400).json({ message: "Invalid PAN format" });
    }

    // Check if a tax form with this PAN already exists
    const existingFormWithPAN = await TaxForm.findOne({
      pan: pan.toUpperCase(),
    });

    return res.status(200).json({
      exists: !!existingFormWithPAN,
      message: existingFormWithPAN
        ? "A tax form with this PAN already exists"
        : "PAN is available for submission",
    });
  } catch (error) {
    console.error("Error checking PAN:", error);
    return res.status(500).json({
      message: "Server error while checking PAN",
      error: error.message,
    });
  }
});

// @route   POST /api/forms/tax
// @desc    Submit tax filing form with documents
// @access  Private
router.post(
  "/tax",
  protect, // Require authentication
  (req, res, next) => {
    console.log("Processing tax form upload request");
    next();
  },
  upload.array("documents", 10), // Allow up to 10 documents with a single field
  handleMulterError,
  async (req, res) => {
    try {
      console.log("Tax form submission received");
      console.log("Request body:", req.body);
      console.log("Files received:", req.files ? req.files.length : "No files");

      const {
        fullName,
        email,
        phone,
        pan,
        service,
        subService,
        year,
        hasIncomeTaxLogin,
        incomeTaxLoginId,
        incomeTaxLoginPassword,
        hasHomeLoan,
        homeLoanSanctionDate,
        homeLoanAmount,
        homeLoanCurrentDue,
        homeLoanTotalInterest,
        hasPranNumber,
        pranNumber,
      } = req.body;

      // Validate required fields
      if (!fullName || !email || !phone || !pan || !service) {
        console.log("Missing required fields");
        return res
          .status(400)
          .json({ message: "All required fields must be provided" });
      }

      // Validate PAN format (AAAAA0000A)
      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
      if (!panRegex.test(pan)) {
        console.log("Invalid PAN format:", pan);
        return res.status(400).json({ message: "Invalid PAN format" });
      }

      // Validate conditional fields
      if (
        hasIncomeTaxLogin === "true" &&
        (!incomeTaxLoginId || !incomeTaxLoginPassword)
      ) {
        console.log("Missing income tax login credentials");
        return res
          .status(400)
          .json({ message: "Income tax login credentials are required" });
      }

      if (
        hasHomeLoan === "true" &&
        (!homeLoanSanctionDate ||
          !homeLoanAmount ||
          !homeLoanCurrentDue ||
          !homeLoanTotalInterest)
      ) {
        console.log("Missing home loan details");
        return res
          .status(400)
          .json({ message: "Home loan details are required" });
      }

      if (hasPranNumber === "true" && !pranNumber) {
        console.log("Missing PRAN number");
        return res.status(400).json({ message: "PRAN number is required" });
      }

      // Process uploaded files
      const formData = {
        user: req.user._id, // Associate form with user
        fullName,
        email,
        phone,
        pan,
        service,
        subService: subService || service,
        year,
        hasIncomeTaxLogin: hasIncomeTaxLogin === "true",
        incomeTaxLoginId: incomeTaxLoginId || "",
        incomeTaxLoginPassword: incomeTaxLoginPassword || "",
        hasHomeLoan: hasHomeLoan === "true",
        homeLoanSanctionDate: homeLoanSanctionDate || "",
        homeLoanAmount: homeLoanAmount || "",
        homeLoanCurrentDue: homeLoanCurrentDue || "",
        homeLoanTotalInterest: homeLoanTotalInterest || "",
        hasPranNumber: hasPranNumber === "true",
        pranNumber: pranNumber || "",
        status: "Pending",
        documents: [],
      };

      // Get document types from request body
      const documentTypes = {};
      Object.keys(req.body).forEach((key) => {
        if (key.startsWith("documentType_")) {
          const fileId = key.replace("documentType_", "");
          documentTypes[fileId] = req.body[key];
          // Remove these fields from formData
          delete formData[key];
        }
      });

      // Process each file with its document type
      if (req.files && req.files.length > 0) {
        console.log(`Processing ${req.files.length} uploaded files`);

        req.files.forEach((file, index) => {
          const fileId = req.body[`fileId_${index}`] || `file_${index}`;
          const docType = documentTypes[fileId] || "other";

          console.log(`Processing file: ${docType}`, {
            originalname: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
            extension: file.originalname.split(".").pop().toLowerCase(),
          });

          // Generate a unique filename
          const fileName = generateUniqueFilename(file.originalname);

          // Add to documents array with file data
          formData.documents.push({
            documentType: docType,
            fileName: fileName,
            originalName: file.originalname,
            fileType: file.mimetype,
            fileSize: file.size,
            fileData: getFileData(file),
            contentType: file.mimetype,
            uploadedBy: 'user', // submissions here are always by the user
          });

          // Remove the fileId field
          delete formData[`fileId_${index}`];
        });
      } else {
        console.log("No files were uploaded");
      }

      // Create new tax form submission
      const taxForm = new TaxForm(formData);

      await taxForm.save();
      console.log("Tax form saved successfully with ID:", taxForm._id);

      // Update user to mark that they have submitted a tax form
      await mongoose.model("User").findByIdAndUpdate(req.user._id, {
        hasTaxFormSubmission: true,
        // Initialize document edit count for this form
        $set: { [`documentEditCounts.${taxForm._id}`]: 0 },
      });

      res.status(201).json({
        success: true,
        message: "Tax form submitted successfully",
        formId: taxForm._id,
      });
    } catch (error) {
      // Handle duplicate key error for the compound index (user, subService, year)
      if (error.code === 11000) {
        return res.status(409).json({
          message: `You have already submitted a form for this sub-service (${req.body?.subService || req.body?.service || "selected"}) for the year ${req.body?.year || "the selected year"}. You can only submit one form per sub-service each year.`,
        });
      }
      console.error("Error in tax form submission:", error);
      res.status(500).json({
        message: "Server error while processing tax form",
        error: error.message,
      });
    }
  }
);

// ========== ROC Returns: User CRUD & Documents ==========
// @route   GET /api/forms/roc-returns/user-submissions
// @desc    Get all ROC returns submissions for the logged-in user
// @access  Private
router.get("/roc-returns/user-submissions", protect, async (req, res) => {
  try {
    const submissions = await ROCForm.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .select("-documents.fileData");
    res.json({ data: submissions });
  } catch (error) {
    console.error("Error fetching ROC returns submissions:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/forms/roc-returns/:id
// @desc    Get specific ROC returns submission
// @access  Private
router.get("/roc-returns/:id", protect, async (req, res) => {
  try {
    const id = req.params.id;
    if (!isValidObjectId(id)) return res.status(400).json({ message: "Invalid form ID" });
    const submission = await ROCForm.findById(id).select("-documents.fileData");
    if (!submission) return res.status(404).json({ message: "Submission not found" });
    const ownsByUser = submission.user && submission.user.equals(req.user._id);
    if (!ownsByUser && submission.email !== req.user.email) {
      return res.status(403).json({ message: "Not authorized to view this submission" });
    }
    const processed = submission.toObject();
    if (processed.documents?.length) {
      processed.documents.forEach((doc) => { processed[doc.documentType] = doc; });
    }
    res.json({ data: processed });
  } catch (error) {
    console.error("Error fetching ROC returns details:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/forms/roc-returns/download/:documentId
// @desc    Download document from ROC returns submission
// @access  Private
router.get("/roc-returns/download/:documentId", protect, async (req, res) => {
  try {
    const { documentId } = req.params;
    if (!isValidObjectId(documentId)) return res.status(400).json({ message: "Invalid document ID format. Must be a 24-character hex string." });
    const form = await ROCForm.findOne({ "documents._id": documentId });
    if (!form) return res.status(404).json({ message: "Document not found" });
    const ownsByUser = form.user && form.user.equals(req.user._id);
    if (form.email !== req.user.email && !ownsByUser && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to access this document" });
    }
    const document = form.documents.find((d) => d._id.toString() === documentId);
    if (!document) return res.status(404).json({ message: "Document not found" });
    res.set({
      "Content-Type": document.contentType,
      "Content-Disposition": `attachment; filename="${document.originalName || document.fileName || "document"}"`,
    });
    res.send(document.fileData);
  } catch (error) {
    console.error("Error downloading ROC returns document:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   DELETE /api/forms/roc-returns/document/:documentId
// @desc    Delete a document from ROC returns submission (disabled for users)
// @access  Private
router.delete("/roc-returns/document/:documentId", protect, async (req, res) => {
  return res.status(403).json({ message: "Document deletion by users is disabled. Please contact admin." });
});

// @route   POST /api/forms/roc-returns/document/:formId
// @desc    Upload a new document to ROC returns submission
// @access  Private
router.post("/roc-returns/document/:formId", protect, upload.single("document"), handleMulterError, async (req, res) => {
  try {
    const { formId } = req.params;
    const { documentType } = req.body;
    if (!isValidObjectId(formId)) return res.status(400).json({ message: "Invalid form ID format. Must be a 24-character hex string." });
    const form = await ROCForm.findById(formId);
    if (!form) return res.status(404).json({ message: "ROC returns form not found" });
    const ownsByUser = form.user && form.user.equals(req.user._id);
    if ((!ownsByUser && form.email !== req.user.email) && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to update this form" });
    }
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    // Read file data from disk since we're using disk storage
    const fileData = require('fs').readFileSync(req.file.path);
    
    const newDoc = {
      documentType: documentType || "other",
      fileName: Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(req.file.originalname),
      originalName: req.file.originalname,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      fileData: fileData,
      contentType: req.file.mimetype,
      isEdited: true,
      uploadedBy: req.user.role === "admin" ? "admin" : "user",
    };
    
    // Clean up the temporary file after reading it
    try {
      require('fs').unlinkSync(req.file.path);
    } catch (cleanupError) {
      console.warn('Failed to cleanup temporary file:', cleanupError);
    }
    form.documents.push(newDoc);
    await form.save();
    const responseDocument = {
      _id: form.documents[form.documents.length - 1]._id,
      documentType: newDoc.documentType,
      originalName: newDoc.originalName,
      fileSize: newDoc.fileSize,
    };
    if (req.user.role !== "admin") {
      await mongoose.model("User").findByIdAndUpdate(req.user._id, { $inc: { [`documentEditCounts.${formId}`]: 1 } });
    }
    res.status(201).json({ success: true, message: "Document uploaded successfully", document: responseDocument });
  } catch (error) {
    console.error("Error uploading ROC returns document:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   PUT /api/forms/roc-returns/:id
// @desc    Update a ROC returns submission
// @access  Private
router.put("/roc-returns/:id", protect, upload.array("documents", 10), handleMulterError, async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ message: "Invalid form ID" });
    const form = await ROCForm.findById(id);
    if (!form) return res.status(404).json({ message: "ROC returns form not found" });
    const ownsByUser = form.user && form.user.equals(req.user._id);
    if ((!ownsByUser && form.email !== req.user.email) && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to update this form" });
    }
    const {
      fullName, email, phone, pan, service, subService, companyName, cin, companyType, registeredOfficeAddress,
      financialYear, boardMeetingDate, resolutionType, directorName, changeType, lastFilingDate, pendingCompliances,
      requiresAudit, requiresDigitalSignature, requiresExpertConsultation, requiresComplianceSetup, selectedPackage,
      existingDocuments,
    } = req.body;
    if (!fullName || !email || !phone || !pan || !service || !companyName || !cin || !companyType || !registeredOfficeAddress) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    let docsToKeep = form.documents || [];
    if (existingDocuments) {
      const keepIds = Array.isArray(existingDocuments) ? existingDocuments : [existingDocuments];
      docsToKeep = form.documents.filter((d) => keepIds.includes(d._id.toString()));
    }
    let newDocs = [];
    if (req.files?.length) {
      newDocs = req.files.map((file, index) => ({
        documentType: req.body[`documentType_${index}`] || "General Document",
        fileName: generateUniqueFilename(file.originalname),
        originalName: file.originalname,
        fileType: file.mimetype,
        fileSize: file.size,
        fileData: getFileData(file),
        contentType: file.mimetype,
        isEdited: true,
        uploadedBy: req.user.role === "admin" ? "admin" : "user",
      }));
    }
    const updated = await ROCForm.findByIdAndUpdate(
      id,
      {
        fullName,
        email,
        phone,
        pan: pan.toUpperCase(),
        service,
        subService: subService || service,
        companyName,
        cin,
        companyType,
        registeredOfficeAddress,
        financialYear,
        boardMeetingDate,
        resolutionType,
        directorName,
        changeType,
        lastFilingDate,
        pendingCompliances,
        requiresAudit: requiresAudit === "true",
        requiresDigitalSignature: requiresDigitalSignature === "true",
        requiresExpertConsultation: requiresExpertConsultation === "true",
        requiresComplianceSetup: requiresComplianceSetup === "true",
        selectedPackage: selectedPackage || form.selectedPackage,
        documents: [...docsToKeep, ...newDocs],
        updatedAt: new Date(),
      },
      { new: true, runValidators: true }
    ).select("-documents.fileData");
    if (req.user.role !== "admin" && (newDocs.length > 0 || (form.documents.length !== docsToKeep.length))) {
      await mongoose.model("User").findByIdAndUpdate(req.user._id, { $inc: { [`documentEditCounts.${id}`]: 1 } });
    }
    res.status(200).json({ message: "ROC returns form updated successfully", data: updated });
  } catch (error) {
    console.error("Error updating ROC returns form:", error);
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: "Validation failed", errors: validationErrors });
    }
    res.status(500).json({ message: "Server error while updating ROC returns form", error: error.message });
  }
});

// ========== Other Registration: User CRUD & Documents ==========
// @route   GET /api/forms/other-registration/user-submissions
// @desc    Get all other registration submissions for the logged-in user
// @access  Private
router.get("/other-registration/user-submissions", protect, async (req, res) => {
  try {
    const submissions = await OtherRegistrationForm.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .select("-documents.fileData");
    res.json({ data: submissions });
  } catch (error) {
    console.error("Error fetching other registration submissions:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/forms/other-registration/:id
// @desc    Get specific other registration submission
// @access  Private
router.get("/other-registration/:id", protect, async (req, res) => {
  try {
    const id = req.params.id;
    if (!isValidObjectId(id)) return res.status(400).json({ message: "Invalid form ID" });
    const submission = await OtherRegistrationForm.findById(id).select("-documents.fileData");
    if (!submission) return res.status(404).json({ message: "Submission not found" });
    const ownsByUser = submission.user && submission.user.equals(req.user._id);
    if (!ownsByUser && submission.email !== req.user.email) {
      return res.status(403).json({ message: "Not authorized to view this submission" });
    }
    const processed = submission.toObject();
    if (processed.documents?.length) {
      processed.documents.forEach((doc) => { processed[doc.documentType] = doc; });
    }
    res.json({ data: processed });
  } catch (error) {
    console.error("Error fetching other registration details:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/forms/other-registration/download/:documentId
// @desc    Download document from other registration submission
// @access  Private
router.get("/other-registration/download/:documentId", protect, async (req, res) => {
  try {
    const { documentId } = req.params;
    if (!isValidObjectId(documentId)) return res.status(400).json({ message: "Invalid document ID format. Must be a 24-character hex string." });
    const form = await OtherRegistrationForm.findOne({ "documents._id": documentId });
    if (!form) return res.status(404).json({ message: "Document not found" });
    const ownsByUser = form.user && form.user.equals(req.user._id);
    if (form.email !== req.user.email && !ownsByUser && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to access this document" });
    }
    const document = form.documents.find((d) => d._id.toString() === documentId);
    if (!document) return res.status(404).json({ message: "Document not found" });
    res.set({
      "Content-Type": document.contentType,
      "Content-Disposition": `attachment; filename="${document.originalName || document.fileName || "document"}"`,
    });
    res.send(document.fileData);
  } catch (error) {
    console.error("Error downloading other registration document:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   DELETE /api/forms/other-registration/document/:documentId
// @desc    Delete a document from other registration submission (disabled for users)
// @access  Private
router.delete("/other-registration/document/:documentId", protect, async (req, res) => {
  return res.status(403).json({ message: "Document deletion by users is disabled. Please contact admin." });
});

// @route   POST /api/forms/other-registration/document/:formId
// @desc    Upload a new document to other registration submission
// @access  Private
router.post("/other-registration/document/:formId", protect, upload.single("document"), handleMulterError, async (req, res) => {
  try {
    const { formId } = req.params;
    const { documentType } = req.body;
    if (!isValidObjectId(formId)) return res.status(400).json({ message: "Invalid form ID format. Must be a 24-character hex string." });
    const form = await OtherRegistrationForm.findById(formId);
    if (!form) return res.status(404).json({ message: "Other registration form not found" });
    const ownsByUser = form.user && form.user.equals(req.user._id);
    if ((!ownsByUser && form.email !== req.user.email) && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to update this form" });
    }
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    
    // Read file data from disk since we're using disk storage
    const fileData = require('fs').readFileSync(req.file.path);
    
    const newDoc = {
      documentType: documentType || "other",
      fileName: Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(req.file.originalname),
      originalName: req.file.originalname,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      fileData: fileData,
      contentType: req.file.mimetype,
      isEdited: true,
      uploadedBy: req.user.role === "admin" ? "admin" : "user",
    };
    
    // Clean up the temporary file after reading it
    try {
      require('fs').unlinkSync(req.file.path);
    } catch (cleanupError) {
      console.warn('Failed to cleanup temporary file:', cleanupError);
    }
    form.documents.push(newDoc);
    await form.save();
    const responseDocument = {
      _id: form.documents[form.documents.length - 1]._id,
      documentType: newDoc.documentType,
      originalName: newDoc.originalName,
      fileSize: newDoc.fileSize,
    };
    if (req.user.role !== "admin") {
      await mongoose.model("User").findByIdAndUpdate(req.user._id, { $inc: { [`documentEditCounts.${formId}`]: 1 } });
    }
    res.status(201).json({ success: true, message: "Document uploaded successfully", document: responseDocument });
  } catch (error) {
    console.error("Error uploading other registration document:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   PUT /api/forms/other-registration/:id
// @desc    Update an other registration submission
// @access  Private
router.put("/other-registration/:id", protect, upload.array("documents", 10), handleMulterError, async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ message: "Invalid form ID" });
    const form = await OtherRegistrationForm.findById(id);
    if (!form) return res.status(404).json({ message: "Other registration form not found" });
    const ownsByUser = form.user && form.user.equals(req.user._id);
    if ((!ownsByUser && form.email !== req.user.email) && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to update this form" });
    }
    const {
      fullName, email, phone, pan, service, subService, businessName, businessType, businessAddress, city, state, pincode,
      turnover, employeeCount, businessCategory, foodBusinessType, importExportCode, applicantName, applicantPan, applicantAadhaar, applicantAddress,
      requiresDigitalSignature, requiresBankAccount, requiresCompliance, selectedPackage, existingDocuments,
    } = req.body;
    if (!fullName || !email || !phone || !pan || !service || !businessName || !businessType || !businessAddress || !city || !state || !pincode || !applicantName || !applicantPan || !applicantAadhaar || !applicantAddress) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    let docsToKeep = form.documents || [];
    if (existingDocuments) {
      const keepIds = Array.isArray(existingDocuments) ? existingDocuments : [existingDocuments];
      docsToKeep = form.documents.filter((d) => keepIds.includes(d._id.toString()));
    }
    let newDocs = [];
    if (req.files?.length) {
      newDocs = req.files.map((file, index) => ({
        documentType: req.body[`documentType_${index}`] || "General Document",
        fileName: generateUniqueFilename(file.originalname),
        originalName: file.originalname,
        fileType: file.mimetype,
        fileSize: file.size,
        fileData: getFileData(file),
        contentType: file.mimetype,
        isEdited: true,
        uploadedBy: req.user.role === "admin" ? "admin" : "user",
      }));
    }
    const updated = await OtherRegistrationForm.findByIdAndUpdate(
      id,
      {
        fullName,
        email,
        phone,
        pan: pan.toUpperCase(),
        service,
        subService: subService || service,
        businessName,
        businessType,
        businessAddress,
        city,
        state,
        pincode,
        turnover,
        employeeCount,
        businessCategory,
        foodBusinessType,
        importExportCode,
        applicantName,
        applicantPan: applicantPan.toUpperCase(),
        applicantAadhaar,
        applicantAddress,
        requiresDigitalSignature: requiresDigitalSignature === "true",
        requiresBankAccount: requiresBankAccount === "true",
        requiresCompliance: requiresCompliance === "true",
        selectedPackage: selectedPackage || form.selectedPackage,
        documents: [...docsToKeep, ...newDocs],
        updatedAt: new Date(),
      },
      { new: true, runValidators: true }
    ).select("-documents.fileData");
    if (req.user.role !== "admin" && (newDocs.length > 0 || (form.documents.length !== docsToKeep.length))) {
      await mongoose.model("User").findByIdAndUpdate(req.user._id, { $inc: { [`documentEditCounts.${id}`]: 1 } });
    }
    res.status(200).json({ message: "Other registration form updated successfully", data: updated });
  } catch (error) {
    console.error("Error updating other registration form:", error);
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: "Validation failed", errors: validationErrors });
    }
    res.status(500).json({ message: "Server error while updating other registration form", error: error.message });
  }
});

// @route   GET /api/forms/company-formation/user-submissions
// @desc    Get all company formation submissions for the logged-in user
// @access  Private
router.get("/company-formation/user-submissions", protect, async (req, res) => {
  try {
    const submissions = await CompanyForm.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .select("-documents.fileData");

    res.json({ data: submissions });
  } catch (error) {
    console.error("Error fetching company formation submissions:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/forms/company-formation/:id
// @desc    Get a specific company formation submission for the logged-in user
// @access  Private
router.get("/company-formation/:id", protect, async (req, res) => {
  try {
    const id = req.params.id;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid form ID" });
    }

    const submission = await CompanyForm.findById(id).select("-documents.fileData");
    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    // Check ownership by user field or email match
    const ownsByUser = submission.user && submission.user.equals(req.user._id);
    if (!ownsByUser && submission.email !== req.user.email) {
      return res.status(403).json({ message: "Not authorized to view this submission" });
    }

    const processed = submission.toObject();
    if (processed.documents && processed.documents.length > 0) {
      processed.documents.forEach((doc) => {
        processed[doc.documentType] = doc;
      });
    }

    res.json({ data: processed });
  } catch (error) {
    console.error("Error fetching company formation submission details:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/forms/company-formation/download/:documentId
// @desc    Download a document from a company formation submission
// @access  Private
router.get("/company-formation/download/:documentId", protect, async (req, res) => {
  try {
    const documentId = req.params.documentId;
    if (!isValidObjectId(documentId)) {
      return res.status(400).json({ message: "Invalid document ID format. Must be a 24-character hex string." });
    }

    const form = await CompanyForm.findOne({ "documents._id": documentId });
    if (!form) {
      return res.status(404).json({ message: "Document not found" });
    }

    // Ownership or admin
    const ownsByUser = form.user && form.user.equals(req.user._id);
    if (form.email !== req.user.email && !ownsByUser && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to access this document" });
    }

    const document = form.documents.find((d) => d._id.toString() === documentId);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    res.set({
      "Content-Type": document.contentType,
      "Content-Disposition": `attachment; filename="${document.originalName || document.fileName || "document"}"`,
    });
    res.send(document.fileData);
  } catch (error) {
    console.error("Error downloading company formation document:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   DELETE /api/forms/company-formation/document/:documentId
// @desc    Delete a document from a company formation submission (disabled for users)
// @access  Private
router.delete("/company-formation/document/:documentId", protect, async (req, res) => {
  return res.status(403).json({ message: "Document deletion by users is disabled. Please contact admin." });
});

// @route   POST /api/forms/company-formation/document/:formId
// @desc    Upload a new document to an existing company formation submission
// @access  Private
router.post(
  "/company-formation/document/:formId",
  protect,
  upload.single("document"),
  handleMulterError,
  async (req, res) => {
    try {
      const formId = req.params.formId;
      const { documentType } = req.body;

      if (!isValidObjectId(formId)) {
        return res.status(400).json({ message: "Invalid form ID format. Must be a 24-character hex string." });
      }

      const form = await CompanyForm.findById(formId);
      if (!form) {
        return res.status(404).json({ message: "Company formation form not found" });
      }

      const ownsByUser = form.user && form.user.equals(req.user._id);
      if ((!ownsByUser && form.email !== req.user.email) && req.user.role !== "admin") {
        return res.status(403).json({ message: "Not authorized to update this form" });
      }

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Read file data from disk since we're using disk storage
      const fileData = require('fs').readFileSync(req.file.path);
      
      const newDoc = {
        documentType: documentType || "other",
        fileName: Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(req.file.originalname),
        originalName: req.file.originalname,
        fileType: req.file.mimetype,
        fileSize: req.file.size,
        fileData: fileData,
        contentType: req.file.mimetype,
        isEdited: true,
        uploadedBy: req.user.role === "admin" ? "admin" : "user",
      };
      
      // Clean up the temporary file after reading it
      try {
        require('fs').unlinkSync(req.file.path);
      } catch (cleanupError) {
        console.warn('Failed to cleanup temporary file:', cleanupError);
      }

      form.documents.push(newDoc);
      await form.save();

      const responseDocument = {
        _id: form.documents[form.documents.length - 1]._id,
        documentType: newDoc.documentType,
        originalName: newDoc.originalName,
        fileSize: newDoc.fileSize,
      };

      if (req.user.role !== "admin") {
        await mongoose.model("User").findByIdAndUpdate(req.user._id, {
          $inc: { [`documentEditCounts.${formId}`]: 1 },
        });
      }

      res.status(201).json({ success: true, message: "Document uploaded successfully", document: responseDocument });
    } catch (error) {
      console.error("Error uploading company formation document:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// @route   PUT /api/forms/company-formation/:id
// @desc    Update a company formation submission and optionally add new documents
// @access  Private
router.put(
  "/company-formation/:id",
  protect,
  upload.array("documents", 10),
  handleMulterError,
  async (req, res) => {
    try {
      const { id } = req.params;
      if (!isValidObjectId(id)) {
        return res.status(400).json({ message: "Invalid form ID" });
      }

      const form = await CompanyForm.findById(id);
      if (!form) {
        return res.status(404).json({ message: "Company formation form not found" });
      }

      const ownsByUser = form.user && form.user.equals(req.user._id);
      if ((!ownsByUser && form.email !== req.user.email) && req.user.role !== "admin") {
        return res.status(403).json({ message: "Not authorized to update this form" });
      }

      const {
        fullName,
        email,
        phone,
        pan,
        service,
        subService,
        companyName,
        businessActivity,
        proposedCapital,
        registeredOfficeAddress,
        city,
        state,
        pincode,
        directors,
        hasDigitalSignature,
        hasBankAccount,
        requiresGstRegistration,
        requiresCompliance,
        selectedPackage,
      } = req.body;

      // Basic validation of required fields
      if (!fullName || !email || !phone || !pan || !service || !companyName || !businessActivity || !proposedCapital || !registeredOfficeAddress || !city || !state || !pincode) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Keep selected existing documents
      let docsToKeep = form.documents || [];
      if (existingDocuments) {
        const keepIds = Array.isArray(existingDocuments) ? existingDocuments : [existingDocuments];
        docsToKeep = form.documents.filter((d) => keepIds.includes(d._id.toString()));
      }

      // Prepare new documents from uploads
      let newDocs = [];
      if (req.files && req.files.length > 0) {
        newDocs = req.files.map((file, index) => ({
          documentType: req.body[`documentType_${index}`] || "General Document",
          fileName: Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname),
          originalName: file.originalname,
          fileType: file.mimetype,
          fileSize: file.size,
          fileData: getFileData(file),
          contentType: file.mimetype,
          isEdited: true,
          uploadedBy: req.user.role === "admin" ? "admin" : "user",
        }));
      }

      const updated = await CompanyForm.findByIdAndUpdate(
        id,
        {
          fullName,
          email,
          phone,
          pan: pan.toUpperCase(),
          service,
          subService: subService || service,
          companyName,
          businessActivity,
          proposedCapital,
          registeredOfficeAddress,
          city,
          state,
          pincode,
          directors: directors ? JSON.parse(directors) : form.directors,
          hasDigitalSignature: hasDigitalSignature === "true",
          hasBankAccount: hasBankAccount === "true",
          requiresGstRegistration: requiresGstRegistration === "true",
          requiresCompliance: requiresCompliance === "true",
          selectedPackage: selectedPackage || form.selectedPackage,
          documents: [...docsToKeep, ...newDocs],
          updatedAt: new Date(),
        },
        { new: true, runValidators: true }
      ).select("-documents.fileData");

      // Increment edit count for non-admin users
      if (req.user.role !== "admin" && (newDocs.length > 0 || (form.documents.length !== docsToKeep.length))) {
        await mongoose.model("User").findByIdAndUpdate(req.user._id, {
          $inc: { [`documentEditCounts.${id}`]: 1 },
        });
      }

      res.status(200).json({ message: "Company formation form updated successfully", data: updated });
    } catch (error) {
      console.error("Error updating company formation form:", error);
      if (error.name === "ValidationError") {
        const validationErrors = Object.values(error.errors).map((err) => err.message);
        return res.status(400).json({ message: "Validation failed", errors: validationErrors });
      }
      res.status(500).json({ message: "Server error while updating company formation form", error: error.message });
    }
  }
);

// @route   POST /api/forms/contact
// @desc    Submit contact form
// @access  Public
router.post("/contact", async (req, res) => {
  try {
    const { name, email, phone, service, message } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !service || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Create new contact submission
    const newContact = new Contact({
      name,
      email,
      phone,
      service,
      message,
    });

    await newContact.save();

    res.status(201).json({
      success: true,
      message: "Contact form submitted successfully",
    });
  } catch (error) {
    console.error("Contact form submission error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/forms/user-submissions
// @desc    Get all form submissions for the logged-in user across all services
// @access  Private
router.get("/user-submissions", protect, async (req, res) => {
  try {
    // Get user ID from the authenticated user
    const userId = req.user._id;
    const userEmail = req.user.email;

    // Fetch forms from all models
    const [taxForms, companyForms, rocForms, otherRegistrationForms, reportsForms, trademarkISOForms, advisoryForms] = await Promise.all([
      TaxForm.find({ user: userId }).select("-documents.fileData").sort({ createdAt: -1 }),
      CompanyForm.find({ user: userId }).select("-documents.fileData").sort({ createdAt: -1 }),
      ROCForm.find({ user: userId }).select("-documents.fileData").sort({ createdAt: -1 }),
      OtherRegistrationForm.find({ user: userId }).select("-documents.fileData").sort({ createdAt: -1 }),
      ReportsForm.find({ user: userId }).select("-documents.fileData").sort({ createdAt: -1 }),
      TrademarkISOForm.find({ user: userId }).select("-documents.fileData").sort({ createdAt: -1 }),
      AdvisoryForm.find({ user: userId }).select("-documents.fileData").sort({ createdAt: -1 })
    ]);

    // Combine all forms and add a type field to identify the source
    const allSubmissions = [
      ...taxForms.map(form => ({ ...form.toObject(), formType: 'TaxForm' })),
      ...companyForms.map(form => ({ ...form.toObject(), formType: 'CompanyForm' })),
      ...rocForms.map(form => ({ ...form.toObject(), formType: 'ROCForm' })),
      ...otherRegistrationForms.map(form => ({ ...form.toObject(), formType: 'OtherRegistrationForm' })),
      ...reportsForms.map(form => ({ ...form.toObject(), formType: 'ReportsForm' })),
      ...trademarkISOForms.map(form => ({ ...form.toObject(), formType: 'TrademarkISOForm' })),
      ...advisoryForms.map(form => ({ ...form.toObject(), formType: 'AdvisoryForm' }))
    ];

    // Sort all submissions by creation date (newest first)
    allSubmissions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({ data: allSubmissions });
  } catch (error) {
    console.error("Error fetching user submissions:", error);
    res.status(500).json({ message: "Server error" });
  }
 });

// @route   GET /api/forms/user-submissions/:id
// @desc    Get a specific form submission for the logged-in user across all form types
// @access  Private
router.get("/user-submissions/:id", protect, async (req, res) => {
  try {
    const formId = req.params.id;
    const userId = req.user._id;
    const userEmail = req.user.email;

    if (!isValidObjectId(formId)) {
      return res.status(400).json({ message: "Invalid form ID" });
    }

    // Search across all form models
    const models = [
      { model: TaxForm, type: 'TaxForm', selectFields: '-incomeTaxLoginCredentials -documents.fileData' },
      { model: CompanyForm, type: 'CompanyForm', selectFields: '-documents.fileData' },
      { model: ROCForm, type: 'ROCForm', selectFields: '-documents.fileData' },
      { model: OtherRegistrationForm, type: 'OtherRegistrationForm', selectFields: '-documents.fileData' },
      { model: ReportsForm, type: 'ReportsForm', selectFields: '-documents.fileData' },
      { model: TrademarkISOForm, type: 'TrademarkISOForm', selectFields: '-documents.fileData' },
      { model: AdvisoryForm, type: 'AdvisoryForm', selectFields: '-documents.fileData' }
    ];

    let submission = null;
    let formType = null;

    // Search each model for the form ID
    for (const { model, type, selectFields } of models) {
      try {
        const found = await model.findById(formId).select(selectFields);
        if (found) {
          // Check if the submission belongs to the logged-in user
          const ownsByUser = found.user && found.user.equals(userId);
          if (!ownsByUser && found.email !== userEmail) {
            return res.status(403).json({ message: "Not authorized to view this submission" });
          }
          submission = found;
          formType = type;
          break;
        }
      } catch (err) {
        // Continue searching in other models if this one fails
        continue;
      }
    }

    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    // Process documents by document type for easier frontend access
    const processedSubmission = submission.toObject();
    processedSubmission.formType = formType;

    // Create document objects by type for easier frontend access
    if (
      processedSubmission.documents &&
      processedSubmission.documents.length > 0
    ) {
      processedSubmission.documents.forEach((doc) => {
        // Add each document directly to the submission object by its type
        // This makes it accessible as submission.form16, submission.bankStatement, etc.
        processedSubmission[doc.documentType] = doc;
      });
    }

    res.json({ data: processedSubmission });
  } catch (error) {
    console.error("Error fetching submission details:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/forms/download/:documentId
// @desc    Download a document from a tax form submission
// @access  Private
router.get("/download/:documentId", protect, async (req, res) => {
  try {
    const documentId = req.params.documentId;

    // Find documents that match the document ID string
    // This approach avoids ObjectId casting errors
    let query;

    if (isValidObjectId(documentId)) {
      // If it's a valid ObjectId, we can use it directly
      query = { "documents._id": documentId };
    } else {
      // If it's not a valid ObjectId, we need to use string comparison
      // This is a fallback and should be avoided in production
      // by ensuring all document IDs are valid ObjectIds
      return res.status(400).json({
        message:
          "Invalid document ID format. Must be a 24-character hex string.",
      });
    }

    // Find the tax form containing the document
    const taxForm = await TaxForm.findOne(query);

    if (!taxForm) {
      return res.status(404).json({ message: "Document not found" });
    }

    // Check if the tax form belongs to the logged-in user or if user is admin
    if (taxForm.email !== req.user.email && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Not authorized to access this document" });
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
      "Content-Disposition": `attachment; filename="${document.originalName}"`,
    });

    // Send the file data
    res.send(document.fileData);
  } catch (error) {
    console.error("Error downloading document:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   DELETE /api/forms/document/:documentId
// @desc    Delete a document from a tax form submission
// @access  Private
router.delete("/document/:documentId", protect, async (req, res) => {
  try {
    const documentId = req.params.documentId;

    if (!isValidObjectId(documentId)) {
      return res.status(400).json({
        message:
          "Invalid document ID format. Must be a 24-character hex string.",
      });
    }

    // Find the tax form containing the document
    const taxForm = await TaxForm.findOne({ "documents._id": documentId });

    if (!taxForm) {
      return res.status(404).json({ message: "Document not found" });
    }

    // Check if the tax form belongs to the logged-in user
    if (
      (taxForm.email !== req.user.email ||
        (taxForm.user && !taxForm.user.equals(req.user._id))) &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this document" });
    }

    // Check edit limit for regular users (not admins)
    if (req.user.role !== "admin") {
      // Get the current user with document edit counts
      const user = await mongoose.model("User").findById(req.user._id);

      // Get the edit count for this form
      const editCount =
        user.documentEditCounts.get(taxForm._id.toString()) || 0;

      // Check if edit limit has been reached
      if (editCount >= 2) {
        return res.status(403).json({
          message:
            "You have reached the maximum number of document edits (2) for this submission.",
        });
      }
    }

    // Find the document index and type before removing it
    const documentIndex = taxForm.documents.findIndex(
      (doc) => doc._id.toString() === documentId
    );

    if (documentIndex === -1) {
      return res.status(404).json({ message: "Document not found" });
    }

    const documentType = taxForm.documents[documentIndex].documentType;

    // Remove the document from the array
    taxForm.documents.splice(documentIndex, 1);

    // Save the updated tax form
    await taxForm.save();

    // Increment the document edit count for this form (for non-admin users)
    if (req.user.role !== "admin") {
      await mongoose.model("User").findByIdAndUpdate(req.user._id, {
        $inc: { [`documentEditCounts.${taxForm._id}`]: 1 },
      });
    }

    res.json({
      success: true,
      message: "Document deleted successfully",
      documentType: documentType,
    });
  } catch (error) {
    console.error("Error deleting document:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/forms/document/:formId
// @desc    Upload a new document to an existing tax form submission
// @access  Private
router.post(
  "/document/:formId",
  protect,
  upload.single("document"),
  handleMulterError,
  async (req, res) => {
    try {
      const formId = req.params.formId;
      const { documentType } = req.body;

      if (!isValidObjectId(formId)) {
        return res.status(400).json({
          message: "Invalid form ID format. Must be a 24-character hex string.",
        });
      }

      // Find the tax form
      const taxForm = await TaxForm.findById(formId);

      if (!taxForm) {
        return res.status(404).json({ message: "Tax form not found" });
      }

      // Check if the tax form belongs to the logged-in user
      if (
        (taxForm.email !== req.user.email ||
          !taxForm.user.equals(req.user._id)) &&
        req.user.role !== "admin"
      ) {
        return res
          .status(403)
          .json({ message: "Not authorized to update this form" });
      }

      // Check edit limit for regular users (not admins)
      if (req.user.role !== "admin") {
        // Get the current user with document edit counts
        const user = await mongoose.model("User").findById(req.user._id);

        // Get the edit count for this form
        const editCount = user.documentEditCounts.get(formId.toString()) || 0;

        // Check if edit limit has been reached
        if (editCount >= 2) {
          return res.status(403).json({
            message:
              "You have reached the maximum number of document edits (2) for this submission.",
          });
        }
      }

      // Check if file was uploaded
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Read file data from disk since we're using disk storage
      const fileData = require('fs').readFileSync(req.file.path);
      
      // Create new document object
      const newDocument = {
        documentType: documentType || "other",
        fileName:
          Date.now() +
          "-" +
          Math.round(Math.random() * 1e9) +
          path.extname(req.file.originalname),
        originalName: req.file.originalname,
        fileType: req.file.mimetype,
        fileSize: req.file.size,
        fileData: fileData,
        contentType: req.file.mimetype,
        isEdited: true, // Mark this document as edited since it's being added after initial submission
        uploadedBy: req.user.role === 'admin' ? 'admin' : 'user',
      };
      
      // Clean up the temporary file after reading it
      try {
        require('fs').unlinkSync(req.file.path);
      } catch (cleanupError) {
        console.warn('Failed to cleanup temporary file:', cleanupError);
      }

      // Add the new document to the documents array
      taxForm.documents.push(newDocument);

      // Save the updated tax form
      await taxForm.save();

      // Increment the document edit count for this form (for non-admin users)
      if (req.user.role !== "admin") {
        await mongoose.model("User").findByIdAndUpdate(req.user._id, {
          $inc: { [`documentEditCounts.${formId}`]: 1 },
        });
      }

      // Return the new document without the file data
      const responseDocument = {
        _id: taxForm.documents[taxForm.documents.length - 1]._id,
        documentType: newDocument.documentType,
        originalName: newDocument.originalName,
        fileSize: newDocument.fileSize,
      };

      res.status(201).json({
        success: true,
        message: "Document uploaded successfully",
        document: responseDocument,
      });
    } catch (error) {
      console.error("Error uploading document:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// @route   PUT /api/forms/tax/:id
// @desc    Update tax filing form with documents
// @access  Private
router.put(
  "/tax/:id",
  protect,
  (req, res, next) => {
    console.log("Processing tax form update request for ID:", req.params.id);
    next();
  },
  upload.array("documents", 10),
  handleMulterError,
  async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user._id;

      // Validate ObjectId
      if (!isValidObjectId(id)) {
        return res.status(400).json({ message: "Invalid form ID" });
      }

      // Find the existing form and verify ownership
      const existingForm = await TaxForm.findOne({ _id: id, user: userId });
      if (!existingForm) {
        return res
          .status(404)
          .json({ message: "Tax form not found or access denied" });
      }

      // Extract form data
      const {
        fullName,
        email,
        phone,
        pan,
        service,
        year,
        hasIncomeTaxLogin,
        incomeTaxLoginId,
        incomeTaxLoginPassword,
        hasHomeLoan,
        homeLoanSanctionDate,
        homeLoanAmount,
        homeLoanCurrentDue,
        homeLoanTotalInterest,
        hasPranNumber,
        pranNumber,
        existingDocuments,
      } = req.body;

      // Validate required fields
      if (!fullName || !email || !phone || !pan || !service || !year) {
        return res.status(400).json({
          message:
            "Missing required fields: fullName, email, phone, pan, service, year",
        });
      }

      // Handle existing documents to keep
      let documentsToKeep = [];
      if (existingDocuments) {
        const existingDocIds = Array.isArray(existingDocuments)
          ? existingDocuments
          : [existingDocuments];

        documentsToKeep = existingForm.documents.filter((doc) =>
          existingDocIds.includes(doc._id.toString())
        );
      }

      // Get document types from request body
      const documentTypes = {};
      Object.keys(req.body).forEach((key) => {
        if (key.startsWith("documentType_")) {
          const fileId = key.replace("documentType_", "");
          documentTypes[fileId] = req.body[key];
        }
      });

      // Handle new uploaded files
      let newDocuments = [];
      if (req.files && req.files.length > 0) {
        req.files.forEach((file, index) => {
          const fileId = req.body[`fileId_${index}`] || `file_${index}`;
          const docType = documentTypes[fileId] || "other";

          // Generate a unique filename
          const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
          const ext = path.extname(file.originalname);
          const fileName = uniqueSuffix + ext;

          newDocuments.push({
            documentType: docType,
            fileName: fileName,
            originalName: file.originalname,
            fileType: file.mimetype,
            fileSize: file.size,
            fileData: getFileData(file),
            contentType: file.mimetype,
            uploadedBy: 'user',
            uploadDate: new Date(),
          });
        });
      }

      // Combine existing and new documents
      const allDocuments = [...documentsToKeep, ...newDocuments];

      // Update the form
      const updatedForm = await TaxForm.findByIdAndUpdate(
        id,
        {
          fullName: fullName.trim(),
          email: email.toLowerCase().trim(),
          phone: phone.trim(),
          pan: pan.toUpperCase().trim(),
          service: service.trim(),
          year: year.trim(),
          hasIncomeTaxLogin: hasIncomeTaxLogin === "true",
          incomeTaxLoginId:
            hasIncomeTaxLogin === "true" ? incomeTaxLoginId?.trim() : undefined,
          incomeTaxLoginPassword:
            hasIncomeTaxLogin === "true"
              ? incomeTaxLoginPassword?.trim()
              : undefined,
          hasHomeLoan: hasHomeLoan === "true",
          homeLoanSanctionDate:
            hasHomeLoan === "true" ? homeLoanSanctionDate : undefined,
          homeLoanAmount:
            hasHomeLoan === "true" ? homeLoanAmount?.trim() : undefined,
          homeLoanCurrentDue:
            hasHomeLoan === "true" ? homeLoanCurrentDue?.trim() : undefined,
          homeLoanTotalInterest:
            hasHomeLoan === "true" ? homeLoanTotalInterest?.trim() : undefined,
          hasPranNumber: hasPranNumber === "true",
          pranNumber: hasPranNumber === "true" ? pranNumber?.trim() : undefined,
          documents: allDocuments,
          updatedAt: new Date(),
        },
        { new: true, runValidators: true }
      );

      console.log("Tax form updated successfully:", updatedForm._id);

      res.status(200).json({
        message: "Tax form updated successfully",
        formId: updatedForm._id,
        documentsCount: allDocuments.length,
      });
    } catch (error) {
      console.error("Error updating tax form:", error);

      if (error.name === "ValidationError") {
        const validationErrors = Object.values(error.errors).map(
          (err) => err.message
        );
        return res.status(400).json({
          message: "Validation failed",
          errors: validationErrors,
        });
      }

      if (error.code === 11000) {
        return res.status(409).json({
          message:
            "A tax form with this PAN already exists for the selected year",
        });
      }

      res.status(500).json({
        message: "Server error while updating tax form",
        error: error.message,
      });
    }
  }
);

// @route   POST /api/forms/company-formation
// @desc    Submit company formation form with documents
// @access  Private
router.post(
  "/company-formation",
  protect,
  upload.array("documents", 10),
  handleMulterError,
  async (req, res) => {
    try {
      console.log("Company formation form submission received");
      console.log("Request body:", req.body);
      console.log("Files received:", req.files ? req.files.length : "No files");
      
      const {
        fullName,
        email,
        phone,
        pan,
        service,
        subService,
        companyName,
        businessActivity,
        proposedCapital,
        registeredOfficeAddress,
        city,
        state,
        pincode,
        directors,
        hasDigitalSignature,
        hasBankAccount,
        requiresGstRegistration,
        requiresCompliance,
        selectedPackage,
      } = req.body;

      console.log("Parsed form data:", {
        fullName,
        email,
        phone,
        pan,
        service,
        subService,
        companyName,
        businessActivity,
        proposedCapital,
        registeredOfficeAddress,
        city,
        state,
        pincode,
        directors,
        hasDigitalSignature,
        hasBankAccount,
        requiresGstRegistration,
        requiresCompliance,
        selectedPackage,
      });

      if (!fullName || !email || !phone || !pan || !service || !companyName || !businessActivity || !proposedCapital || !registeredOfficeAddress || !city || !state || !pincode) {
        return res.status(400).json({ message: "All required fields must be provided" });
      }

      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
      if (!panRegex.test(pan)) {
        return res.status(400).json({ message: "Invalid PAN format" });
      }

      // Parse directors safely
      let parsedDirectors = [];
      try {
        if (directors) {
          parsedDirectors = JSON.parse(directors);
          console.log("Parsed directors:", parsedDirectors);
          
          // Validate directors data
          if (Array.isArray(parsedDirectors)) {
            for (let i = 0; i < parsedDirectors.length; i++) {
              const director = parsedDirectors[i];
              // Only require essential fields: name, email, phone, address
              // PAN and Aadhaar are optional for new directors
              if (!director.name || !director.email || !director.phone || !director.address) {
                console.error(`Director ${i + 1} missing required fields:`, director);
                return res.status(400).json({ 
                  message: `Director ${i + 1} is missing required fields. All directors must have name, email, phone, and address. PAN and Aadhaar are optional for new directors.` 
                });
              }
            }
          } else {
            console.error("Directors is not an array:", parsedDirectors);
            return res.status(400).json({ message: "Directors must be an array" });
          }
        }
      } catch (parseError) {
        console.error("Error parsing directors:", parseError);
        return res.status(400).json({ message: "Invalid directors data format" });
      }

      const formData = {
        user: req.user._id,
        fullName,
        email,
        phone,
        pan: pan.toUpperCase(),
        service,
        subService: subService || service,
        companyName,
        businessActivity,
        proposedCapital,
        registeredOfficeAddress,
        city,
        state,
        pincode,
        directors: parsedDirectors,
        hasDigitalSignature: hasDigitalSignature === 'true',
        hasBankAccount: hasBankAccount === 'true',
        requiresGstRegistration: requiresGstRegistration === 'true',
        requiresCompliance: requiresCompliance === 'true',
        selectedPackage: selectedPackage || "Basic",
      };

      console.log("Final form data:", JSON.stringify(formData, null, 2));

      if (req.files && req.files.length > 0) {
        try {
          formData.documents = req.files.map((file, index) => {
            console.log(`Processing file ${index}:`, {
              originalName: file.originalname,
              mimetype: file.mimetype,
              size: file.size,
              hasBuffer: !!file.buffer
            });
            
            return {
              documentType: req.body[`documentType_${index}`] || "General Document",
              fileName: file.filename || `file_${Date.now()}_${index}`,
              originalName: file.originalname,
              fileType: file.mimetype,
              fileSize: file.size,
              fileData: getFileData(file),
              contentType: file.mimetype,
            };
          });
          console.log("Documents processed:", formData.documents.length);
        } catch (fileError) {
          console.error("Error processing files:", fileError);
          return res.status(400).json({ message: "Error processing uploaded files" });
        }
      }

      console.log("Creating CompanyForm instance...");
      const companyForm = new CompanyForm(formData);
      console.log("CompanyForm instance created, saving...");
      
      try {
        await companyForm.save();
        console.log("CompanyForm saved successfully with ID:", companyForm._id);
      } catch (saveError) {
        console.error("Error saving CompanyForm:", saveError);
        if (saveError.code === 11000) {
          return res.status(400).json({ 
            message: "A company formation form for this service already exists. You can only submit one form per service." 
          });
        }
        throw saveError; // Re-throw to be caught by outer catch block
      }

      res.status(201).json({
        message: "Company formation form submitted successfully",
        formId: companyForm._id,
      });
    } catch (error) {
      console.error("Error submitting company formation form:", error);
      console.error("Error stack:", error.stack);
      res.status(500).json({
        message: "Server error while submitting company formation form",
        error: error.message,
      });
    }
  }
);

// @route   POST /api/forms/other-registration
// @desc    Submit other registration form with documents
// @access  Private
router.post(
  "/other-registration",
  protect,
  upload.array("documents", 10),
  handleMulterError,
  async (req, res) => {
    try {
      
      const {
        fullName,
        email,
        phone,
        pan,
        service,
        subService,
        businessName,
        businessType,
        businessAddress,
        city,
        state,
        pincode,
        turnover,
        employeeCount,
        businessCategory,
        foodBusinessType,
        importExportCode,
        applicantName,
        applicantPan,
        applicantAadhaar,
        applicantAddress,
        requiresDigitalSignature,
        requiresBankAccount,
        requiresCompliance,
        selectedPackage,
      } = req.body;

      if (!fullName || !email || !phone || !pan || !service || !businessName || !businessType || !businessAddress || !city || !state || !pincode || !applicantName || !applicantPan || !applicantAadhaar || !applicantAddress) {
        return res.status(400).json({ message: "All required fields must be provided" });
      }

      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
      if (!panRegex.test(pan)) {
        return res.status(400).json({ message: "Invalid PAN format" });
      }

      const formData = {
        user: req.user._id,
        fullName,
        email,
        phone,
        pan: pan.toUpperCase(),
        service,
        subService: subService || service,
        businessName,
        businessType,
        businessAddress,
        city,
        state,
        pincode,
        turnover,
        employeeCount,
        businessCategory,
        foodBusinessType,
        importExportCode,
        applicantName,
        applicantPan: applicantPan.toUpperCase(),
        applicantAadhaar,
        applicantAddress,
        requiresDigitalSignature: requiresDigitalSignature === 'true',
        requiresBankAccount: requiresBankAccount === 'true',
        requiresCompliance: requiresCompliance === 'true',
        selectedPackage: selectedPackage || "Basic",
      };

      if (req.files && req.files.length > 0) {
        formData.documents = req.files.map((file, index) => ({
          documentType: req.body[`documentType_${index}`] || "General Document",
          fileName: file.filename,
          originalName: file.originalname,
          fileType: file.mimetype,
          fileSize: file.size,
          fileData: getFileData(file),
          contentType: file.mimetype,
        }));
      }

      const otherRegistrationForm = new OtherRegistrationForm(formData);
      await otherRegistrationForm.save();

      res.status(201).json({
        message: "Other registration form submitted successfully",
        formId: otherRegistrationForm._id,
      });
    } catch (error) {
      console.error("Error submitting other registration form:", error);
      res.status(500).json({
        message: "Server error while submitting other registration form",
        error: error.message,
      });
    }
  }
);

// @route   POST /api/forms/roc-returns
// @desc    Submit ROC returns form with documents
// @access  Private
router.post(
  "/roc-returns",
  protect,
  upload.array("documents", 10),
  handleMulterError,
  async (req, res) => {
    try {
      console.log("ROC returns form submission received");
      console.log("Request body:", req.body);
      console.log("Files received:", req.files ? req.files.length : "No files");
      
      const {
        fullName,
        email,
        phone,
        pan,
        service,
        subService,
        companyName,
        cin,
        companyType,
        registeredOfficeAddress,
        financialYear,
        boardMeetingDate,
        resolutionType,
        directorName,
        changeType,
        lastFilingDate,
        pendingCompliances,
        requiresAudit,
        requiresDigitalSignature,
        requiresExpertConsultation,
        requiresComplianceSetup,
        selectedPackage,
      } = req.body;

      if (!fullName || !email || !phone || !pan || !service || !companyName || !cin || !companyType || !registeredOfficeAddress || !financialYear) {
        console.log("Missing required fields");
        return res.status(400).json({ message: "All required fields must be provided" });
      }

      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
      if (!panRegex.test(pan)) {
        console.log("Invalid PAN format:", pan);
        return res.status(400).json({ message: "Invalid PAN format" });
      }

      const formData = {
        user: req.user._id,
        fullName,
        email,
        phone,
        pan: pan.toUpperCase(),
        service,
        subService: subService || service,
        companyName,
        cin,
        companyType,
        registeredOfficeAddress,
        financialYear,
        boardMeetingDate,
        resolutionType,
        directorName,
        changeType,
        lastFilingDate,
        pendingCompliances,
        requiresAudit: requiresAudit === 'true',
        requiresDigitalSignature: requiresDigitalSignature === 'true',
        requiresExpertConsultation: requiresExpertConsultation === 'true',
        requiresComplianceSetup: requiresComplianceSetup === 'true',
        selectedPackage: selectedPackage || "Basic",
        status: "Pending",
        documents: [],
      };

      // Process uploaded files
      if (req.files && req.files.length > 0) {
        console.log(`Processing ${req.files.length} uploaded files`);

        req.files.forEach((file, index) => {
          const docType = req.body[`documentType_${index}`] || "General Document";

          console.log(`Processing file: ${docType}`, {
            originalname: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
            extension: file.originalname.split(".").pop().toLowerCase(),
          });

          // Generate a unique filename
          const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
          const ext = path.extname(file.originalname);
          const fileName = uniqueSuffix + ext;

          // Add to documents array with file data stored in Buffer
          formData.documents.push({
            documentType: docType,
            fileName: fileName,
            originalName: file.originalname,
            fileType: file.mimetype,
            fileSize: file.size,
            fileData: getFileData(file),
            contentType: file.mimetype,
            uploadedBy: 'user', // submissions here are always by the user
          });
        });
      } else {
        console.log("No files were uploaded");
        return res.status(400).json({ message: "At least one document is required" });
      }

      // Create new ROC form submission
      const rocForm = new ROCForm(formData);

      await rocForm.save();
      console.log("ROC returns form saved successfully with ID:", rocForm._id);

      // Update user to mark that they have submitted a ROC returns form
      await mongoose.model("User").findByIdAndUpdate(req.user._id, {
        hasROCFormSubmission: true,
        // Initialize document edit count for this form
        $set: { [`documentEditCounts.${rocForm._id}`]: 0 },
      });

      res.status(201).json({
        success: true,
        message: "ROC returns form submitted successfully",
        formId: rocForm._id,
      });
    } catch (error) {
      // Handle duplicate key error for the compound index (user, subService, financialYear)
      if (error.code === 11000) {
        return res.status(409).json({
          message: `You have already submitted a form for this sub-service (${req.body?.subService || req.body?.service || "selected"}) for the financial year ${req.body?.financialYear || "the selected year"}. You can only submit one form per sub-service each year.`,
        });
      }
      console.error("Error in ROC returns form submission:", error);
      res.status(500).json({
        message: "Server error while processing ROC returns form",
        error: error.message,
      });
    }
  }
);

// @route   POST /api/forms/reports
// @desc    Submit reports form with documents
// @access  Private
router.post(
  "/reports",
  protect,
  upload.array("documents", 10),
  handleMulterError,
  async (req, res) => {
    try {
      
      const {
        fullName,
        email,
        phone,
        pan,
        service,
        subService,
        businessName,
        businessType,
        businessAddress,
        reportPeriod,
        reportPurpose,
        annualTurnover,
        netProfit,
        totalAssets,
        totalLiabilities,
        bankName,
        accountNumber,
        reconciliationPeriod,
        loanAmount,
        loanPurpose,
        projectCost,
        debtServiceObligations,
        netOperatingIncome,
        requiresAudit,
        requiresExpertAnalysis,
        requiresComplianceCheck,
        selectedPackage,
      } = req.body;

      if (!fullName || !email || !phone || !pan || !service || !businessName || !businessType || !businessAddress || !reportPeriod || !reportPurpose) {
        return res.status(400).json({ message: "All required fields must be provided" });
      }

      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
      if (!panRegex.test(pan)) {
        return res.status(400).json({ message: "Invalid PAN format" });
      }

      const formData = {
        user: req.user._id,
        fullName,
        email,
        phone,
        pan: pan.toUpperCase(),
        service,
        subService: subService || service,
        businessName,
        businessType,
        businessAddress,
        reportPeriod,
        reportPurpose,
        annualTurnover,
        netProfit,
        totalAssets,
        totalLiabilities,
        bankName,
        accountNumber,
        reconciliationPeriod,
        loanAmount,
        loanPurpose,
        projectCost,
        debtServiceObligations,
        netOperatingIncome,
        requiresAudit: requiresAudit === 'true',
        requiresExpertAnalysis: requiresExpertAnalysis === 'true',
        requiresComplianceCheck: requiresComplianceCheck === 'true',
        selectedPackage: selectedPackage || "Basic",
      };

      if (req.files && req.files.length > 0) {
        formData.documents = req.files.map((file, index) => ({
          documentType: req.body[`documentType_${index}`] || "General Document",
          fileName: file.filename,
          originalName: file.originalname,
          fileType: file.mimetype,
          fileSize: file.size,
          fileData: getFileData(file),
          contentType: file.mimetype,
        }));
      }

      const reportsForm = new ReportsForm(formData);
      await reportsForm.save();

      res.status(201).json({
        message: "Reports form submitted successfully",
        formId: reportsForm._id,
      });
    } catch (error) {
      console.error("Error submitting reports form:", error);
      res.status(500).json({
        message: "Server error while submitting reports form",
        error: error.message,
      });
    }
  }
);

// @route   POST /api/forms/trademark-iso
// @desc    Submit trademark & ISO form with documents
// @access  Private
router.post(
  "/trademark-iso",
  protect,
  upload.array("documents", 10),
  handleMulterError,
  async (req, res) => {
    try {
      
      const {
        fullName,
        email,
        phone,
        pan,
        service,
        subService,
        businessName,
        businessType,
        businessAddress,
        trademarkName,
        trademarkClass,
        trademarkDescription,
        firstUseDate,
        isoStandard,
        scopeOfCertification,
        numberOfEmployees,
        industrySector,
        workTitle,
        workType,
        creationDate,
        authorName,
        requiresSearch,
        requiresObjectionHandling,
        requiresRenewal,
        requiresCompliance,
        selectedPackage,
      } = req.body;

      if (!fullName || !email || !phone || !pan || !service || !businessName || !businessType || !businessAddress) {
        return res.status(400).json({ message: "All required fields must be provided" });
      }

      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
      if (!panRegex.test(pan)) {
        return res.status(400).json({ message: "Invalid PAN format" });
      }

      const formData = {
        user: req.user._id,
        fullName,
        email,
        phone,
        pan: pan.toUpperCase(),
        service,
        subService: subService || service,
        businessName,
        businessType,
        businessAddress,
        trademarkName,
        trademarkClass,
        trademarkDescription,
        firstUseDate,
        isoStandard,
        scopeOfCertification,
        numberOfEmployees,
        industrySector,
        workTitle,
        workType,
        creationDate,
        authorName,
        requiresSearch: requiresSearch === 'true',
        requiresObjectionHandling: requiresObjectionHandling === 'true',
        requiresRenewal: requiresRenewal === 'true',
        requiresCompliance: requiresCompliance === 'true',
        selectedPackage: selectedPackage || "Basic",
      };

      if (req.files && req.files.length > 0) {
        formData.documents = req.files.map((file, index) => ({
          documentType: req.body[`documentType_${index}`] || "General Document",
          fileName: file.filename,
          originalName: file.originalname,
          fileType: file.mimetype,
          fileSize: file.size,
          fileData: getFileData(file),
          contentType: file.mimetype,
        }));
      }

      const trademarkISOForm = new TrademarkISOForm(formData);
      await trademarkISOForm.save();

      res.status(201).json({
        message: "Trademark & ISO form submitted successfully",
        formId: trademarkISOForm._id,
      });
    } catch (error) {
      console.error("Error submitting trademark & ISO form:", error);
      res.status(500).json({
        message: "Server error while submitting trademark & ISO form",
        error: error.message,
      });
    }
  }
);

// @route   POST /api/forms/advisory
// @desc    Submit advisory form with documents
// @access  Private
router.post(
  "/advisory",
  protect,
  upload.array("documents", 10),
  handleMulterError,
  async (req, res) => {
    try {
      
      const {
        fullName,
        email,
        phone,
        pan,
        service,
        subService,
        businessName,
        businessType,
        businessAddress,
        industry,
        businessStage,
        advisoryArea,
        currentChallenges,
        expectedOutcomes,
        annualTurnover,
        numberOfEmployees,
        yearsInBusiness,
        requiresStrategy,
        requiresFinancialPlanning,
        requiresHRConsulting,
        requiresLegalCompliance,
        requiresDigitalTransformation,
        requiresStartupMentoring,
        projectTimeline,
        budgetRange,
        requiresOngoingSupport,
        requiresImplementation,
        requiresTraining,
        selectedPackage,
      } = req.body;

      if (!fullName || !email || !phone || !pan || !service || !businessName || !businessType || !businessAddress || !industry || !businessStage || !advisoryArea || !currentChallenges || !expectedOutcomes || !projectTimeline || !budgetRange) {
        return res.status(400).json({ message: "All required fields must be provided" });
      }

      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
      if (!panRegex.test(pan)) {
        return res.status(400).json({ message: "Invalid PAN format" });
      }

      const formData = {
        user: req.user._id,
        fullName,
        email,
        phone,
        pan: pan.toUpperCase(),
        service,
        subService: subService || service,
        businessName,
        businessType,
        businessAddress,
        industry,
        businessStage,
        advisoryArea,
        currentChallenges,
        expectedOutcomes,
        annualTurnover,
        numberOfEmployees,
        yearsInBusiness,
        requiresStrategy: requiresStrategy === 'true',
        requiresFinancialPlanning: requiresFinancialPlanning === 'true',
        requiresHRConsulting: requiresHRConsulting === 'true',
        requiresLegalCompliance: requiresLegalCompliance === 'true',
        requiresDigitalTransformation: requiresDigitalTransformation === 'true',
        requiresStartupMentoring: requiresStartupMentoring === 'true',
        projectTimeline,
        budgetRange,
        requiresOngoingSupport: requiresOngoingSupport === 'true',
        requiresImplementation: requiresImplementation === 'true',
        requiresTraining: requiresTraining === 'true',
        selectedPackage: selectedPackage || "Basic",
      };

      if (req.files && req.files.length > 0) {
        formData.documents = req.files.map((file, index) => ({
          documentType: req.body[`documentType_${index}`] || "General Document",
          fileName: file.filename,
          originalName: file.originalname,
          fileType: file.mimetype,
          fileSize: file.size,
          fileData: getFileData(file),
          contentType: file.mimetype,
        }));
      }

      const advisoryForm = new AdvisoryForm(formData);
      await advisoryForm.save();

      res.status(201).json({
        message: "Advisory form submitted successfully",
        formId: advisoryForm._id,
      });
    } catch (error) {
      console.error("Error submitting advisory form:", error);
      res.status(500).json({
        message: "Server error while submitting advisory form",
        error: error.message,
      });
    }
  }
);

// @route   POST /api/forms/service
// @desc    Submit generic service form with documents
// @access  Private
router.post(
  "/service",
  protect,
  upload.array("documents", 10),
  handleMulterError,
  async (req, res) => {
    try {
      const {
        fullName,
        email,
        phone,
        pan,
        service,
        subService,
        businessName,
        businessType,
        businessAddress,
        city,
        state,
        pincode,
        // Company formation specific fields
        companyName,
        proposedNames,
        authorizedCapital,
        paidUpCapital,
        businessActivity,
        numberOfDirectors,
        numberOfShareholders,
        // Registration specific fields
        registrationType,
        industryType,
        employeeCount,
        annualTurnover,
        // Advisory specific fields
        consultationType,
        projectDuration,
        budgetRange,
        // Additional fields
        additionalRequirements,
        preferredContactTime,
        urgency,
      } = req.body;

      if (!fullName || !email || !phone || !pan || !service) {
        return res.status(400).json({ message: "All required fields must be provided" });
      }

      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
      if (!panRegex.test(pan)) {
        return res.status(400).json({ message: "Invalid PAN format" });
      }

      // Determine which model to use based on service type
      let Model;
      let formData = {
        user: req.user._id,
        fullName,
        email,
        phone,
        pan: pan.toUpperCase(),
        service,
        subService: subService || service,
        businessName,
        businessType,
        businessAddress,
        city,
        state,
        pincode,
        companyName,
        proposedNames: proposedNames ? JSON.parse(proposedNames) : [],
        authorizedCapital,
        paidUpCapital,
        businessActivity,
        numberOfDirectors,
        numberOfShareholders,
        registrationType,
        industryType,
        employeeCount,
        annualTurnover,
        consultationType,
        projectDuration,
        budgetRange,
        additionalRequirements,
        preferredContactTime,
        urgency: urgency || 'Medium',
      };

      // Select appropriate model based on service type
      const serviceLower = service.toLowerCase();
      console.log(`Service type: ${service}, selecting model...`);
      
      if (serviceLower.includes('tax') || serviceLower.includes('itr') || serviceLower.includes('gst')) {
        Model = TaxForm;
        // Add year field for tax-related services
        formData.year = new Date().getFullYear().toString();
        console.log('Selected TaxForm model for tax service');
      } else if (serviceLower.includes('company') || serviceLower.includes('formation')) {
        Model = CompanyForm;
        console.log('Selected CompanyForm model for company formation service');
      } else if (serviceLower.includes('roc') || serviceLower.includes('returns')) {
        Model = ROCForm;
        console.log('Selected ROCForm model for ROC returns service');
      } else if (serviceLower.includes('advisory') || serviceLower.includes('consulting')) {
        Model = AdvisoryForm;
        console.log('Selected AdvisoryForm model for advisory service');
      } else if (serviceLower.includes('trademark') || serviceLower.includes('iso')) {
        Model = TrademarkISOForm;
        console.log('Selected TrademarkISOForm model for trademark/ISO service');
      } else if (serviceLower.includes('report') || serviceLower.includes('audit')) {
        Model = ReportsForm;
        console.log('Selected ReportsForm model for reports/audit service');
      } else if (serviceLower.includes('registration') || serviceLower.includes('license')) {
        Model = OtherRegistrationForm;
        console.log('Selected OtherRegistrationForm model for registration service');
      } else {
        // Default to TaxForm for unknown services, but ensure year is provided
        Model = TaxForm;
        formData.year = new Date().getFullYear().toString();
        console.log('Selected TaxForm model as default (unknown service)');
      }

      console.log('Final form data:', JSON.stringify(formData, null, 2));
      console.log('Selected model:', Model.modelName);

      // Handle file uploads
      if (req.files && req.files.length > 0) {
        formData.documents = req.files.map((file, index) => ({
          documentType: req.body[`documentType_file_${index}`] || "General Document",
          fileName: file.filename,
          originalName: file.originalname,
          fileType: file.mimetype,
          fileSize: file.size,
          fileData: getFileData(file),
          contentType: file.mimetype,
        }));
      }

      // Save to appropriate model
      const serviceForm = new Model(formData);
      await serviceForm.save();

      res.status(201).json({
        message: "Service form submitted successfully",
        formId: serviceForm._id,
      });
    } catch (error) {
      console.error("Error submitting service form:", error);
      res.status(500).json({
        message: "Server error while submitting service form",
        error: error.message,
      });
    }
  }
);

module.exports = router;
