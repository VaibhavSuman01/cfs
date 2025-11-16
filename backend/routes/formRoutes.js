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
const PartnershipForm = require("../models/PartnershipForm");

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
  upload.fields([
    { name: 'documents', maxCount: 10 },
    { name: 'aadhaarFile', maxCount: 1 },
    { name: 'salesDataFile', maxCount: 1 },
    { name: 'purchaseDataFile', maxCount: 1 },
    { name: 'bankStatementFile', maxCount: 1 },
    { name: 'tdsDataFile', maxCount: 1 },
    { name: 'wagesReportFile', maxCount: 1 },
    { name: 'salarySheetFile', maxCount: 1 }
  ]),
  handleMulterError,
  async (req, res) => {
    try {
      console.log("Tax form submission received");
      console.log("Request body:", req.body);
      console.log("Files received:", req.files ? Object.keys(req.files).length + " field(s)" : "No files");

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
        // GST Filing specific fields
        gstFilingType,
        gstFilingMonth,
        gstFilingQuarter,
        gstFilingYear,
        gstNumber,
        selectedMonths,
        // TDS Return specific fields
        tdsFilingMonth,
        tdsFilingYear,
        tracesUserId,
        tracesPassword,
        tanNumber,
        incomeTaxUserId,
        incomeTaxPassword,
        incomeTaxPanNumber,
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

      // Validate TDS Returns specific fields
      if (service === 'TDS Returns') {
        if (!tdsFilingMonth || !tdsFilingYear) {
          return res.status(400).json({ message: "TDS filing month and year are required" });
        }
        if (!tracesUserId || !tracesPassword) {
          return res.status(400).json({ message: "TRACES User ID and Password are required" });
        }
        if (!incomeTaxUserId || !incomeTaxPassword) {
          return res.status(400).json({ message: "Income Tax (TAN Base) User ID and Password are required" });
        }
        if (!incomeTaxPanNumber) {
          return res.status(400).json({ message: "Income Tax (PAN No.) is required" });
        }
        // Validate Income Tax PAN format
        if (incomeTaxPanNumber && !panRegex.test(incomeTaxPanNumber)) {
          return res.status(400).json({ message: "Invalid Income Tax PAN format" });
        }
      }

      // Process uploaded files
      // For GST Filing, use gstFilingYear if provided, otherwise use year
      // For TDS Returns, use tdsFilingYear if provided, otherwise use year
      const finalYear = (service === 'GST Filing' && gstFilingYear) 
        ? gstFilingYear 
        : (service === 'TDS Returns' && tdsFilingYear) 
          ? tdsFilingYear 
          : year;
      
      const formData = {
        user: req.user._id, // Associate form with user
        fullName,
        email,
        phone,
        pan,
        service,
        subService: subService || service,
        year: finalYear,
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
        // GST Filing specific fields
        gstFilingType: gstFilingType || undefined,
        gstFilingMonth: gstFilingMonth || undefined,
        gstFilingQuarter: gstFilingQuarter || undefined,
        gstFilingYear: gstFilingYear || undefined,
        gstNumber: gstNumber || undefined,
        selectedMonths: selectedMonths ? (typeof selectedMonths === 'string' ? JSON.parse(selectedMonths) : selectedMonths) : undefined,
        // TDS Return specific fields
        tdsFilingMonth: tdsFilingMonth || undefined,
        tdsFilingYear: tdsFilingYear || undefined,
        tracesUserId: tracesUserId || undefined,
        tracesPassword: tracesPassword || undefined,
        tanNumber: tanNumber || undefined,
        incomeTaxUserId: incomeTaxUserId || undefined,
        incomeTaxPassword: incomeTaxPassword || undefined,
        incomeTaxPanNumber: incomeTaxPanNumber ? incomeTaxPanNumber.toUpperCase() : undefined,
        status: "Pending",
        documents: [],
      };

      // Get document types from request body
      const documentTypes = {};
      Object.keys(req.body).forEach((key) => {
        if (key.startsWith("documentType_")) {
          const fileId = key.replace("documentType_", "");
          documentTypes[fileId] = req.body[key];
        }
      });

      // Process uploaded files from different field names
      if (req.files) {
        try {
          // Process specific document types
          const fileFields = [
            { field: 'aadhaarFile', type: 'Aadhaar Card' },
            { field: 'salesDataFile', type: 'Sales Data' },
            { field: 'purchaseDataFile', type: 'Purchase Data' },
            { field: 'bankStatementFile', type: 'Bank Statement' },
            { field: 'tdsDataFile', type: 'TDS Data' },
            { field: 'wagesReportFile', type: 'Wages Report' },
            { field: 'salarySheetFile', type: 'Salary Sheet' }
          ];

          // Process specific document files
          fileFields.forEach(({ field, type }) => {
            if (req.files[field] && req.files[field].length > 0) {
              const file = req.files[field][0];
              console.log(`Processing ${field}:`, {
                originalName: file.originalname,
                mimetype: file.mimetype,
                size: file.size
              });

              formData.documents.push({
                documentType: type,
                fileName: file.filename || `file_${Date.now()}_${field}`,
                originalName: file.originalname,
                fileType: file.mimetype,
                fileSize: file.size,
                fileData: getFileData(file),
                contentType: file.mimetype,
                uploadedBy: 'user',
              });
            }
          });

          // Process general documents
          if (req.files['documents'] && req.files['documents'].length > 0) {
            req.files['documents'].forEach((file, index) => {
              console.log(`Processing general document ${index}:`, {
                originalName: file.originalname,
                mimetype: file.mimetype,
                size: file.size
              });
              
              formData.documents.push({
                documentType: req.body[`documentType_${index}`] || "Additional Document",
                fileName: file.filename || `file_${Date.now()}_${index}`,
                originalName: file.originalname,
                fileType: file.mimetype,
                fileSize: file.size,
                fileData: getFileData(file),
                contentType: file.mimetype,
                uploadedBy: 'user',
              });
            });
          }

          console.log("Documents processed:", formData.documents.length);
        } catch (fileError) {
          console.error("Error processing files:", fileError);
          return res.status(400).json({ message: "Error processing uploaded files" });
        }
      } else {
        console.log("No files were uploaded");
      }

      // Check for duplicate submissions (custom validation for GST Filing and TDS Returns)
      // GST Filing and TDS Returns allow multiple submissions per year (quarterly/monthly)
      let duplicateCheck = {};
      
      if (service === 'GST Filing') {
        // For GST Filing, check based on filing type (monthly or quarterly)
        // GST Filing allows multiple submissions per year (quarterly/monthly)
        const gstYear = gstFilingYear || year;
        
        if (gstFilingType === 'quarterly' && gstFilingQuarter && gstYear) {
          // Quarterly filing: check for duplicate quarter
          duplicateCheck = {
            user: req.user._id,
            subService: subService || service,
            year: gstYear,
            gstFilingQuarter: gstFilingQuarter
          };
        } else if ((gstFilingType === 'monthly' || gstFilingMonth) && gstYear) {
          // Monthly filing: check for duplicate month
          // If gstFilingType is not provided but gstFilingMonth is, treat as monthly
          duplicateCheck = {
            user: req.user._id,
            subService: subService || service,
            year: gstYear,
            gstFilingMonth: gstFilingMonth
          };
        } else if (gstYear) {
          // Fallback to year-based check if filing type/month/quarter not specified
          // This allows only one submission per year if no month/quarter specified
          duplicateCheck = {
            user: req.user._id,
            subService: subService || service,
            year: gstYear
          };
        }
      } else if (service === 'TDS Returns') {
        // For TDS Returns, check based on month
        const tdsYear = tdsFilingYear || year;
        
        if (tdsFilingMonth && tdsYear) {
          duplicateCheck = {
            user: req.user._id,
            subService: subService || service,
            year: tdsYear,
            tdsFilingMonth: tdsFilingMonth
          };
        } else if (tdsYear) {
          duplicateCheck = {
            user: req.user._id,
            subService: subService || service,
            year: tdsYear
          };
        }
      } else {
        // For other services, check based on user + subService + year
        if (year) {
          duplicateCheck = {
            user: req.user._id,
            subService: subService || service,
            year: year
          };
        }
      }

      // Check if duplicate exists (only if duplicateCheck is not empty)
      if (Object.keys(duplicateCheck).length > 0) {
        const existingForm = await TaxForm.findOne(duplicateCheck);
        if (existingForm) {
          let duplicateMessage = '';
          if (service === 'GST Filing') {
            const gstYear = gstFilingYear || year || finalYear;
            if (gstFilingType === 'quarterly' && gstFilingQuarter) {
              duplicateMessage = `You have already submitted a GST Filing form for Quarter ${gstFilingQuarter} of ${gstYear}.`;
            } else if ((gstFilingType === 'monthly' || gstFilingMonth) && gstFilingMonth) {
              // Treat as monthly if gstFilingMonth is provided (even if gstFilingType is not set)
              const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
              const monthName = monthNames[parseInt(gstFilingMonth) - 1] || gstFilingMonth;
              duplicateMessage = `You have already submitted a GST Filing form for ${monthName} ${gstYear}.`;
            } else {
              duplicateMessage = `You have already submitted a form for GST Filing for the year ${gstYear}.`;
            }
          } else if (service === 'TDS Returns') {
            const tdsYear = tdsFilingYear || year || finalYear;
            if (tdsFilingMonth) {
              const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
              const monthName = monthNames[parseInt(tdsFilingMonth) - 1] || tdsFilingMonth;
              duplicateMessage = `You have already submitted a TDS Returns form for ${monthName} ${tdsYear}.`;
            } else {
              duplicateMessage = `You have already submitted a TDS Returns form for the year ${tdsYear}.`;
            }
          } else {
            duplicateMessage = `You have already submitted a form for this sub-service (${subService || service}) for the year ${finalYear || year}. You can only submit one form per sub-service each year.`;
          }
          
          return res.status(409).json({
            message: duplicateMessage,
          });
        }
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
      // Handle duplicate key error (should not happen with custom validation, but keep as fallback)
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
    // Get file data (works for both disk and memory storage)
    const fileData = getFileData(req.file);
    
    const newDoc = {
      documentType: documentType || "other",
      fileName: generateUniqueFilename(req.file.originalname),
      originalName: req.file.originalname,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      fileData: fileData,
      contentType: req.file.mimetype,
      isEdited: true,
      uploadedBy: req.user.role === "admin" ? "admin" : "user",
    };
    
    // Clean up temporary files (only applies to disk storage)
    cleanupTempFiles([req.file]);
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
router.put("/roc-returns/:id", protect, upload.fields([
    { name: 'documents', maxCount: 10 },
    { name: 'aadhaarFile', maxCount: 1 }
  ]), handleMulterError, async (req, res) => {
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
    if (req.files) {
      try {
        // Process specific document types
        const fileFields = [
          { field: 'aadhaarFile', type: 'Aadhaar Card' }
        ];

        // Process specific document files
        fileFields.forEach(({ field, type }) => {
          if (req.files[field] && req.files[field].length > 0) {
            const file = req.files[field][0];
            newDocs.push({
              documentType: type,
              fileName: file.filename || `file_${Date.now()}_${field}`,
              originalName: file.originalname,
              fileType: file.mimetype,
              fileSize: file.size,
              fileData: getFileData(file),
              contentType: file.mimetype,
              isEdited: true,
              uploadedBy: req.user.role === "admin" ? "admin" : "user",
            });
          }
        });

        // Process general documents
        if (req.files['documents'] && req.files['documents'].length > 0) {
          req.files['documents'].forEach((file, index) => {
            newDocs.push({
        documentType: req.body[`documentType_${index}`] || "General Document",
              fileName: file.filename || `file_${Date.now()}_${index}`,
        originalName: file.originalname,
        fileType: file.mimetype,
        fileSize: file.size,
        fileData: getFileData(file),
        contentType: file.mimetype,
        isEdited: true,
        uploadedBy: req.user.role === "admin" ? "admin" : "user",
            });
          });
        }
      } catch (fileError) {
        console.error("Error processing files:", fileError);
        return res.status(400).json({ message: "Error processing uploaded files" });
      }
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
    
    // Get file data (works for both disk and memory storage)
    const fileData = getFileData(req.file);
    
    const newDoc = {
      documentType: documentType || "other",
      fileName: generateUniqueFilename(req.file.originalname),
      originalName: req.file.originalname,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      fileData: fileData,
      contentType: req.file.mimetype,
      isEdited: true,
      uploadedBy: req.user.role === "admin" ? "admin" : "user",
    };
    
    // Clean up temporary files (only applies to disk storage)
    cleanupTempFiles([req.file]);
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
router.put("/other-registration/:id", protect, upload.fields([
    { name: 'documents', maxCount: 10 },
    { name: 'aadhaarFile', maxCount: 1 },
    { name: 'panFile', maxCount: 1 },
    { name: 'addressProofFile', maxCount: 1 },
    { name: 'businessAddressProofFile', maxCount: 1 },
    { name: 'identityProofFile', maxCount: 1 },
    { name: 'partnershipDeedFile', maxCount: 1 },
    { name: 'mouFile', maxCount: 1 },
    { name: 'bankAccountFile', maxCount: 1 },
    { name: 'businessRegistrationFile', maxCount: 1 },
    { name: 'cancelCheckFile', maxCount: 1 },
    { name: 'gstFile', maxCount: 1 },
    { name: 'electricityBillFile', maxCount: 1 },
    { name: 'rentAgreementFile', maxCount: 1 }
  ]), handleMulterError, async (req, res) => {
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
    if (req.files) {
      try {
        // Process specific document types
        const fileFields = [
          { field: 'aadhaarFile', type: 'Aadhaar Card' },
          { field: 'panFile', type: 'PAN Card' },
          { field: 'addressProofFile', type: 'Address Proof' },
          { field: 'businessAddressProofFile', type: 'Business Address Proof' },
          { field: 'identityProofFile', type: 'Identity Proof' },
          { field: 'partnershipDeedFile', type: 'Partnership Deed' },
          { field: 'mouFile', type: 'MOU' },
          { field: 'bankAccountFile', type: 'Bank Account' },
          { field: 'businessRegistrationFile', type: 'Business Registration' }
        ];

        // Process specific document files
        fileFields.forEach(({ field, type }) => {
          if (req.files[field] && req.files[field].length > 0) {
            const file = req.files[field][0];
            newDocs.push({
              documentType: type,
              fileName: file.filename || `file_${Date.now()}_${field}`,
              originalName: file.originalname,
              fileType: file.mimetype,
              fileSize: file.size,
              fileData: getFileData(file),
              contentType: file.mimetype,
              isEdited: true,
              uploadedBy: req.user.role === "admin" ? "admin" : "user",
            });
          }
        });

        // Process general documents
        if (req.files['documents'] && req.files['documents'].length > 0) {
          req.files['documents'].forEach((file, index) => {
            newDocs.push({
        documentType: req.body[`documentType_${index}`] || "General Document",
              fileName: file.filename || `file_${Date.now()}_${index}`,
        originalName: file.originalname,
        fileType: file.mimetype,
        fileSize: file.size,
        fileData: getFileData(file),
        contentType: file.mimetype,
        isEdited: true,
        uploadedBy: req.user.role === "admin" ? "admin" : "user",
            });
          });
        }
      } catch (fileError) {
        console.error("Error processing files:", fileError);
        return res.status(400).json({ message: "Error processing uploaded files" });
      }
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

// @route   GET /api/forms/company-information/user-submissions
// @desc    Get all Company Information submissions for the logged-in user
// @access  Private
router.get("/company-information/user-submissions", protect, async (req, res) => {
  try {
    const submissions = await CompanyForm.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .select("-documents.fileData");

    res.json({ data: submissions });
  } catch (error) {
    console.error("Error fetching Company Information submissions:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/forms/company-information/:id
// @desc    Get a specific Company Information submission for the logged-in user
// @access  Private
router.get("/company-information/:id", protect, async (req, res) => {
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
    console.error("Error fetching Company Information submission details:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/forms/company-information/download/:documentId
// @desc    Download a document from a Company Information submission
// @access  Private
router.get("/company-information/download/:documentId", protect, async (req, res) => {
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
    console.error("Error downloading Company Information document:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   DELETE /api/forms/company-information/document/:documentId
// @desc    Delete a document from a Company Information submission (disabled for users)
// @access  Private
router.delete("/company-information/document/:documentId", protect, async (req, res) => {
  return res.status(403).json({ message: "Document deletion by users is disabled. Please contact admin." });
});

// @route   POST /api/forms/company-information/document/:formId
// @desc    Upload a new document to an existing Company Information submission
// @access  Private
router.post(
  "/company-information/document/:formId",
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
        return res.status(404).json({ message: "Company Information form not found" });
      }

      const ownsByUser = form.user && form.user.equals(req.user._id);
      if ((!ownsByUser && form.email !== req.user.email) && req.user.role !== "admin") {
        return res.status(403).json({ message: "Not authorized to update this form" });
      }

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Read file data using fileHandler utility (handles both disk and memory storage)
      const fileData = getFileData(req.file);
      
      const newDoc = {
        documentType: documentType || "other",
        fileName: generateUniqueFilename(req.file.originalname),
        originalName: req.file.originalname,
        fileType: req.file.mimetype,
        fileSize: req.file.size,
        fileData: fileData,
        contentType: req.file.mimetype,
        isEdited: true,
        uploadedBy: req.user.role === "admin" ? "admin" : "user",
      };
      
      // Clean up temporary files using fileHandler utility
      cleanupTempFiles([req.file]);

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
      console.error("Error uploading Company Information document:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// @route   PUT /api/forms/company-information/:id
// @desc    Update a Company Information submission and optionally add new documents
// @access  Private
router.put(
  "/company-information/:id",
  protect,
  upload.fields([
    { name: 'documents', maxCount: 10 },
    { name: 'aadhaarFile', maxCount: 1 },
    { name: 'panFile', maxCount: 1 },
    { name: 'addressProofFile', maxCount: 1 },
    { name: 'directorPhotosFile', maxCount: 1 },
    { name: 'moaFile', maxCount: 1 },
    { name: 'aoaFile', maxCount: 1 },
    { name: 'dinFile', maxCount: 1 },
    { name: 'dscFile', maxCount: 1 }
  ]),
  handleMulterError,
  async (req, res) => {
    try {
      const { id } = req.params;
      if (!isValidObjectId(id)) {
        return res.status(400).json({ message: "Invalid form ID" });
      }

      const form = await CompanyForm.findById(id);
      if (!form) {
        return res.status(404).json({ message: "Company Information form not found" });
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
      if (req.files) {
        try {
          // Process specific document types
          const fileFields = [
            { field: 'aadhaarFile', type: 'Aadhaar Card' },
            { field: 'panFile', type: 'PAN Card' },
            { field: 'addressProofFile', type: 'Address Proof' },
            { field: 'directorPhotosFile', type: 'Director Photos' },
            { field: 'moaFile', type: 'Memorandum of Association' },
            { field: 'aoaFile', type: 'Articles of Association' },
            { field: 'dinFile', type: 'DIN Application' },
            { field: 'dscFile', type: 'Digital Signature Certificate' }
          ];

          // Process specific document files
          fileFields.forEach(({ field, type }) => {
            if (req.files[field] && req.files[field].length > 0) {
              const file = req.files[field][0];
              newDocs.push({
                documentType: type,
                fileName: file.filename || `file_${Date.now()}_${field}`,
                originalName: file.originalname,
                fileType: file.mimetype,
                fileSize: file.size,
                fileData: getFileData(file),
                contentType: file.mimetype,
                isEdited: true,
                uploadedBy: req.user.role === "admin" ? "admin" : "user",
              });
            }
          });

          // Process general documents
          if (req.files['documents'] && req.files['documents'].length > 0) {
            req.files['documents'].forEach((file, index) => {
              newDocs.push({
          documentType: req.body[`documentType_${index}`] || "General Document",
                fileName: file.filename || `file_${Date.now()}_${index}`,
          originalName: file.originalname,
          fileType: file.mimetype,
          fileSize: file.size,
          fileData: getFileData(file),
          contentType: file.mimetype,
          isEdited: true,
          uploadedBy: req.user.role === "admin" ? "admin" : "user",
              });
            });
          }
        } catch (fileError) {
          console.error("Error processing files:", fileError);
          return res.status(400).json({ message: "Error processing uploaded files" });
        }
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

      res.status(200).json({ message: "Company Information form updated successfully", data: updated });
    } catch (error) {
      console.error("Error updating Company Information form:", error);
      if (error.name === "ValidationError") {
        const validationErrors = Object.values(error.errors).map((err) => err.message);
        return res.status(400).json({ message: "Validation failed", errors: validationErrors });
      }
      res.status(500).json({ message: "Server error while updating Company Information form", error: error.message });
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
      ...taxForms.map(form => {
        const formObj = form.toObject();
        // Normalize TaxForm reports from adminData.reports to reports array
        if (formObj.adminData && formObj.adminData.reports) {
          formObj.reports = formObj.adminData.reports.map(report => ({
            type: report.type,
            message: report.message,
            sentAt: report.sentAt,
            sentBy: report.sentBy,
            documentId: report.document ? report.document._id : null
          }));
        }
        return { ...formObj, formType: 'TaxForm' };
      }),
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
    console.log(`Attempting to download document: ${documentId} for user: ${req.user.email}`);

    // Find documents that match the document ID string
    // This approach avoids ObjectId casting errors
    let query;

    if (isValidObjectId(documentId)) {
      // If it's a valid ObjectId, we can use it directly
      // For TaxForm, we need to search in adminData.reports.document._id
      // For other forms, we search in documents._id
      query = { 
        $or: [
          { "documents._id": documentId },
          { "adminData.reports.document._id": documentId }
        ]
      };
    } else {
      // If it's not a valid ObjectId, we need to use string comparison
      // This is a fallback and should be avoided in production
      // by ensuring all document IDs are valid ObjectIds
      return res.status(400).json({
        message:
          "Invalid document ID format. Must be a 24-character hex string.",
      });
    }

    // Search across all form models
    const models = [
      { model: TaxForm, name: 'TaxForm' },
      { model: CompanyForm, name: 'CompanyForm' },
      { model: ROCForm, name: 'ROCForm' },
      { model: OtherRegistrationForm, name: 'OtherRegistrationForm' },
      { model: ReportsForm, name: 'ReportsForm' },
      { model: TrademarkISOForm, name: 'TrademarkISOForm' },
      { model: AdvisoryForm, name: 'AdvisoryForm' }
    ];

    let form = null;
    let document = null;

    // Search each model for the document
    for (const { model, name } of models) {
      try {
        console.log(`Searching in ${name} model for document: ${documentId}`);
        const foundForm = await model.findOne(query);
        if (foundForm) {
          console.log(`Found form in ${name} model:`, foundForm._id);
          // Check if the form belongs to the logged-in user or if user is admin
          if (foundForm.email !== req.user.email && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Not authorized to access this document" });
    }

          // For TaxForm, check adminData.reports for embedded documents
          if (name === 'TaxForm' && foundForm.adminData && foundForm.adminData.reports) {
            for (const report of foundForm.adminData.reports) {
              if (report.document && report.document._id.toString() === documentId) {
                console.log(`Found document in TaxForm adminData.reports:`, report.document._id, report.document.originalName);
                form = foundForm;
                document = report.document;
                break;
              }
            }
            if (document) break;
          }

          // Find the specific document in the documents array (for non-TaxForm or fallback)
          if (!document) {
            const foundDocument = foundForm.documents.find(
      (doc) => doc._id.toString() === documentId
    );

            if (foundDocument) {
              console.log(`Found document in ${name} model:`, foundDocument._id, foundDocument.originalName);
              form = foundForm;
              document = foundDocument;
              break;
            } else {
              console.log(`Document not found in ${name} model documents array`);
            }
          }
        }
      } catch (err) {
        // Continue searching in other models if this one fails
        continue;
      }
    }

    if (!form || !document) {
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

// @route   GET /api/forms/download-admin-report/:formId/:reportId
// @desc    Download a document from an admin report in adminData
// @access  Private
router.get("/download-admin-report/:formId/:reportId", protect, async (req, res) => {
  try {
    const { formId, reportId } = req.params;

    // Validate IDs
    if (!isValidObjectId(formId) || !isValidObjectId(reportId)) {
      return res.status(400).json({
        message: "Invalid ID format. Must be a 24-character hex string.",
      });
    }

    // Find the tax form
    const taxForm = await TaxForm.findById(formId);

    if (!taxForm) {
      return res.status(404).json({ message: "Form not found" });
    }

    // Check if the tax form belongs to the logged-in user or if user is admin
    if (taxForm.email !== req.user.email && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Not authorized to access this document" });
    }

    // Find the specific report in adminData.reports
    const report = taxForm.adminData?.reports?.find(
      (rep) => rep._id.toString() === reportId
    );

    if (!report || !report.document) {
      return res.status(404).json({ message: "Report document not found" });
    }

    // Set response headers
    res.set({
      "Content-Type": report.document.contentType,
      "Content-Disposition": `attachment; filename="${report.document.originalName || report.document.fileName}"`,
    });

    // Send the file data
    res.send(report.document.fileData);
  } catch (error) {
    console.error("Error downloading admin report document:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/forms/download-all/:formId
// @desc    Download all documents from a form as a ZIP file
// @access  Private
router.post("/download-all/:formId", protect, async (req, res) => {
  try {
    const { formId } = req.params;
    const { formType, documents } = req.body;

    // Validate form ID
    if (!isValidObjectId(formId)) {
      return res.status(400).json({
        message: "Invalid form ID format. Must be a 24-character hex string.",
      });
    }

    // Determine which model to use based on form type
    let FormModel;
    switch (formType) {
      case 'TaxForm':
        FormModel = TaxForm;
        break;
      case 'CompanyForm':
        FormModel = CompanyForm;
        break;
      case 'ROCForm':
        FormModel = ROCForm;
        break;
      case 'OtherRegistrationForm':
        FormModel = OtherRegistrationForm;
        break;
      case 'ReportsForm':
        FormModel = ReportsForm;
        break;
      case 'TrademarkISOForm':
        FormModel = TrademarkISOForm;
        break;
      case 'AdvisoryForm':
        FormModel = AdvisoryForm;
        break;
      default:
        return res.status(400).json({ message: "Invalid form type" });
    }

    // Find the form
    const form = await FormModel.findById(formId);
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    // Check authorization
    if (form.email !== req.user.email && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to access this form" });
    }

    // Check if there are documents
    if (!form.documents || form.documents.length === 0) {
      return res.status(404).json({ message: "No documents found" });
    }

    // Create ZIP file
    const archiver = require('archiver');
    const archive = archiver('zip', { zlib: { level: 9 } });

    // Set response headers
    res.set({
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${formType}_${formId}_documents.zip"`
    });

    // Pipe archive to response
    archive.pipe(res);

    // Add each document to the ZIP
    for (const doc of form.documents) {
      if (doc.fileData) {
        const fileName = doc.originalName || doc.fileName || `document_${doc._id}`;
        archive.append(doc.fileData, { name: fileName });
      }
    }

    // Finalize the archive
    await archive.finalize();

  } catch (error) {
    console.error("Error creating ZIP file:", error);
    if (!res.headersSent) {
      res.status(500).json({ message: "Server error" });
    }
  }
});

// @route   POST /api/forms/download-all-reports/:formId
// @desc    Download all admin reports from a form as a ZIP file
// @access  Private
router.post("/download-all-reports/:formId", protect, async (req, res) => {
  try {
    const { formId } = req.params;
    const { formType } = req.body;

    // Validate form ID
    if (!isValidObjectId(formId)) {
      return res.status(400).json({
        message: "Invalid form ID format. Must be a 24-character hex string.",
      });
    }

    // Determine which model to use based on form type
    let FormModel;
    switch (formType) {
      case 'TaxForm':
        FormModel = TaxForm;
        break;
      case 'CompanyForm':
        FormModel = CompanyForm;
        break;
      case 'ROCForm':
        FormModel = ROCForm;
        break;
      case 'OtherRegistrationForm':
        FormModel = OtherRegistrationForm;
        break;
      case 'ReportsForm':
        FormModel = ReportsForm;
        break;
      case 'TrademarkISOForm':
        FormModel = TrademarkISOForm;
        break;
      case 'AdvisoryForm':
        FormModel = AdvisoryForm;
        break;
      default:
        return res.status(400).json({ message: "Invalid form type" });
    }

    // Find the form
    const form = await FormModel.findById(formId);
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    // Check authorization
    if (form.email !== req.user.email && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to access this form" });
    }

    // Get admin reports (reports with documentId)
    const adminReports = (form.reports || []).filter(report => report.documentId);
    
    if (adminReports.length === 0) {
      return res.status(404).json({ message: "No admin reports found" });
    }

    // Create ZIP file
    const archiver = require('archiver');
    const archive = archiver('zip', { zlib: { level: 9 } });

    // Set response headers
    res.set({
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${formType}_${formId}_admin_reports.zip"`
    });

    // Pipe archive to response
    archive.pipe(res);

    // Add each admin report document to the ZIP
    for (const report of adminReports) {
      // Find the document in the documents array
      const document = form.documents.find(doc => doc._id.toString() === report.documentId.toString());
      
      if (document && document.fileData) {
        const fileName = `${report.type || 'report'}_${report.sentAt ? new Date(report.sentAt).toISOString().split('T')[0] : 'unknown'}_${document.originalName || document.fileName || `document_${document._id}`}`;
        archive.append(document.fileData, { name: fileName });
      }
    }

    // Finalize the archive
    await archive.finalize();

  } catch (error) {
    console.error("Error creating admin reports ZIP file:", error);
    if (!res.headersSent) {
      res.status(500).json({ message: "Server error" });
    }
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

      // Read file data using fileHandler utility (handles both disk and memory storage)
      const fileData = getFileData(req.file);
      
      // Create new document object
      const newDocument = {
        documentType: documentType || "other",
        fileName: generateUniqueFilename(req.file.originalname),
        originalName: req.file.originalname,
        fileType: req.file.mimetype,
        fileSize: req.file.size,
        fileData: fileData,
        contentType: req.file.mimetype,
        isEdited: true, // Mark this document as edited since it's being added after initial submission
        uploadedBy: req.user.role === 'admin' ? 'admin' : 'user',
      };
      
      // Clean up temporary files using fileHandler utility
      cleanupTempFiles([req.file]);

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
  upload.fields([
    { name: 'documents', maxCount: 10 },
    { name: 'aadhaarFile', maxCount: 1 },
    { name: 'salesDataFile', maxCount: 1 },
    { name: 'purchaseDataFile', maxCount: 1 },
    { name: 'bankStatementFile', maxCount: 1 },
    { name: 'tdsDataFile', maxCount: 1 },
    { name: 'wagesReportFile', maxCount: 1 },
    { name: 'salarySheetFile', maxCount: 1 }
  ]),
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
      if (req.files) {
        try {
          // Process specific document types
          const fileFields = [
            { field: 'aadhaarFile', type: 'Aadhaar Card' },
            { field: 'salesDataFile', type: 'Sales Data' },
            { field: 'purchaseDataFile', type: 'Purchase Data' },
            { field: 'bankStatementFile', type: 'Bank Statement' },
            { field: 'tdsDataFile', type: 'TDS Data' },
            { field: 'wagesReportFile', type: 'Wages Report' },
            { field: 'salarySheetFile', type: 'Salary Sheet' }
          ];

          // Process specific document files
          fileFields.forEach(({ field, type }) => {
            if (req.files[field] && req.files[field].length > 0) {
              const file = req.files[field][0];
              newDocuments.push({
                documentType: type,
                fileName: file.filename || `file_${Date.now()}_${field}`,
                originalName: file.originalname,
                fileType: file.mimetype,
                fileSize: file.size,
                fileData: getFileData(file),
                contentType: file.mimetype,
                uploadedBy: 'user',
                uploadDate: new Date(),
              });
            }
          });

          // Process general documents
          if (req.files['documents'] && req.files['documents'].length > 0) {
            req.files['documents'].forEach((file, index) => {
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
        } catch (fileError) {
          console.error("Error processing files:", fileError);
          return res.status(400).json({ message: "Error processing uploaded files" });
        }
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

// @route   POST /api/forms/company-information
// @desc    Submit Company Information form with documents
// @access  Private
router.post(
  "/company-information",
  protect,
  (() => {
    const fields = [
      { name: 'documents', maxCount: 10 },
      { name: 'aadhaarFile', maxCount: 1 },
      { name: 'panFile', maxCount: 1 },
      { name: 'addressProofFile', maxCount: 1 },
      { name: 'directorPhotosFile', maxCount: 1 },
      { name: 'moaFile', maxCount: 1 },
      { name: 'aoaFile', maxCount: 1 },
      { name: 'dinFile', maxCount: 1 },
      { name: 'dscFile', maxCount: 1 },
      // Company address documents
      { name: 'rentAgreement', maxCount: 1 },
      { name: 'electricityBill', maxCount: 1 },
      { name: 'ownerPanAadhaar', maxCount: 1 },
      { name: 'municipalTaxReceipt', maxCount: 1 }
    ];
    
    // Director documents (support up to 10 directors, indexed 0-9)
    for (let i = 0; i < 10; i++) {
      fields.push(
        { name: `directorPhoto_${i}`, maxCount: 10 },
        { name: `directorSignature_${i}`, maxCount: 10 },
        { name: `directorAadhaar_${i}`, maxCount: 10 },
        { name: `directorPan_${i}`, maxCount: 10 },
        { name: `directorVoterId_${i}`, maxCount: 10 },
        { name: `directorDrivingLicense_${i}`, maxCount: 10 },
        { name: `directorBankStatement_${i}`, maxCount: 1 }
      );
    }
    
    return upload.fields(fields);
  })(),
  handleMulterError,
  async (req, res) => {
    try {
      console.log("Company Information form submission received");
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
        proposedName1,
        proposedName2,
        proposedNames,
        businessActivity,
        businessDetails,
        proposedCapital,
        registeredOfficeAddress,
        city,
        state,
        pincode,
        directors,
        addressProofType,
        ownerName,
        ownerPan,
        ownerAadhaar,
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
      });

      // Use proposedName1 if companyName is not provided (for backward compatibility)
      const finalCompanyName = companyName || proposedName1;
      const finalProposedNames = proposedNames ? (typeof proposedNames === 'string' ? JSON.parse(proposedNames) : proposedNames) : [proposedName1, proposedName2].filter(Boolean);
      
      if (!fullName || !email || !phone || !pan || !service || !finalCompanyName || !businessActivity || !businessDetails || !proposedCapital || !registeredOfficeAddress || !city || !state || !pincode || !addressProofType) {
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
        companyName: finalCompanyName,
        proposedNames: finalProposedNames,
        businessActivity,
        businessDetails,
        proposedCapital,
        registeredOfficeAddress,
        city,
        state,
        pincode,
        directors: parsedDirectors.map(dir => ({
          name: dir.name,
          email: dir.email,
          phone: dir.phone,
          pan: dir.pan ? dir.pan.toUpperCase() : undefined,
          aadhaar: dir.aadhaar ? dir.aadhaar.replace(/\D/g, '') : undefined,
          voterId: dir.voterId || undefined,
          drivingLicense: dir.drivingLicense || undefined,
          address: dir.address,
        })),
        addressProofType,
        ownerName: ownerName || undefined,
        ownerPan: ownerPan ? ownerPan.toUpperCase() : undefined,
        ownerAadhaar: ownerAadhaar ? ownerAadhaar.replace(/\D/g, '') : undefined,
        documents: [],
      };

      console.log("Final form data:", JSON.stringify(formData, null, 2));

      // Process uploaded files from different field names
      formData.documents = [];
      
      if (req.files) {
        try {
          // Create fileMap for easier access
          const fileMap = req.files;

          // Process specific document types
          const fileFields = [
            { field: 'aadhaarFile', type: 'Aadhaar Card' },
            { field: 'panFile', type: 'PAN Card' },
            { field: 'addressProofFile', type: 'Address Proof' },
            { field: 'directorPhotosFile', type: 'Director Photos' },
            { field: 'moaFile', type: 'Memorandum of Association' },
            { field: 'aoaFile', type: 'Articles of Association' },
            { field: 'dinFile', type: 'DIN Application' },
            { field: 'dscFile', type: 'Digital Signature Certificate' }
          ];

          // Process specific document files
          fileFields.forEach(({ field, type }) => {
            if (fileMap[field] && fileMap[field].length > 0) {
              const file = fileMap[field][0];
              console.log(`Processing ${field}:`, {
                originalName: file.originalname,
                mimetype: file.mimetype,
                size: file.size
              });
              
              formData.documents.push({
                documentType: type,
                fileName: file.filename || generateUniqueFilename(file.originalname),
                originalName: file.originalname,
                fileType: file.mimetype,
                fileSize: file.size,
                fileData: getFileData(file),
                contentType: file.mimetype,
                uploadedBy: 'user',
              });
            }
          });

          // Process director documents (indexed fields)
          for (let i = 0; i < 10; i++) {
            // Director Photos
            if (fileMap[`directorPhoto_${i}`] && fileMap[`directorPhoto_${i}`].length > 0) {
              fileMap[`directorPhoto_${i}`].forEach((file) => {
                formData.documents.push({
                  documentType: `Director ${i + 1} Photo`,
                  fileName: generateUniqueFilename(file.originalname),
                  originalName: file.originalname,
                  fileType: file.mimetype,
                  fileSize: file.size,
                  fileData: getFileData(file),
                  contentType: file.mimetype,
                  uploadedBy: 'user',
                });
              });
            }
            // Director Signatures
            if (fileMap[`directorSignature_${i}`] && fileMap[`directorSignature_${i}`].length > 0) {
              fileMap[`directorSignature_${i}`].forEach((file) => {
                formData.documents.push({
                  documentType: `Director ${i + 1} Signature`,
                  fileName: generateUniqueFilename(file.originalname),
                  originalName: file.originalname,
                  fileType: file.mimetype,
                  fileSize: file.size,
                  fileData: getFileData(file),
                  contentType: file.mimetype,
                  uploadedBy: 'user',
                });
              });
            }
            // Director Aadhaar Cards
            if (fileMap[`directorAadhaar_${i}`] && fileMap[`directorAadhaar_${i}`].length > 0) {
              fileMap[`directorAadhaar_${i}`].forEach((file) => {
                formData.documents.push({
                  documentType: `Director ${i + 1} Aadhaar Card`,
                  fileName: generateUniqueFilename(file.originalname),
                  originalName: file.originalname,
                  fileType: file.mimetype,
                  fileSize: file.size,
                  fileData: getFileData(file),
                  contentType: file.mimetype,
                  uploadedBy: 'user',
                });
              });
            }
            // Director PAN Cards
            if (fileMap[`directorPan_${i}`] && fileMap[`directorPan_${i}`].length > 0) {
              fileMap[`directorPan_${i}`].forEach((file) => {
                formData.documents.push({
                  documentType: `Director ${i + 1} PAN Card`,
                  fileName: generateUniqueFilename(file.originalname),
                  originalName: file.originalname,
                  fileType: file.mimetype,
                  fileSize: file.size,
                  fileData: getFileData(file),
                  contentType: file.mimetype,
                  uploadedBy: 'user',
                });
              });
            }
            // Director Voter IDs
            if (fileMap[`directorVoterId_${i}`] && fileMap[`directorVoterId_${i}`].length > 0) {
              fileMap[`directorVoterId_${i}`].forEach((file) => {
                formData.documents.push({
                  documentType: `Director ${i + 1} Voter ID`,
                  fileName: generateUniqueFilename(file.originalname),
                  originalName: file.originalname,
                  fileType: file.mimetype,
                  fileSize: file.size,
                  fileData: getFileData(file),
                  contentType: file.mimetype,
                  uploadedBy: 'user',
                });
              });
            }
            // Director Driving Licenses
            if (fileMap[`directorDrivingLicense_${i}`] && fileMap[`directorDrivingLicense_${i}`].length > 0) {
              fileMap[`directorDrivingLicense_${i}`].forEach((file) => {
                formData.documents.push({
                  documentType: `Director ${i + 1} Driving License`,
                  fileName: generateUniqueFilename(file.originalname),
                  originalName: file.originalname,
                  fileType: file.mimetype,
                  fileSize: file.size,
                  fileData: getFileData(file),
                  contentType: file.mimetype,
                  uploadedBy: 'user',
                });
              });
            }
            // Director Bank Statements
            if (fileMap[`directorBankStatement_${i}`] && fileMap[`directorBankStatement_${i}`].length > 0) {
              const file = fileMap[`directorBankStatement_${i}`][0];
              formData.documents.push({
                documentType: `Director ${i + 1} Bank Statement`,
                fileName: generateUniqueFilename(file.originalname),
                originalName: file.originalname,
                fileType: file.mimetype,
                fileSize: file.size,
                fileData: getFileData(file),
                contentType: file.mimetype,
                uploadedBy: 'user',
              });
            }
          }

          // Process company address documents
          if (fileMap['rentAgreement'] && fileMap['rentAgreement'].length > 0) {
            const file = fileMap['rentAgreement'][0];
            formData.documents.push({
              documentType: "Rent Agreement",
              fileName: generateUniqueFilename(file.originalname),
              originalName: file.originalname,
              fileType: file.mimetype,
              fileSize: file.size,
              fileData: getFileData(file),
              contentType: file.mimetype,
              uploadedBy: 'user',
            });
          }

          if (fileMap['electricityBill'] && fileMap['electricityBill'].length > 0) {
            const file = fileMap['electricityBill'][0];
            formData.documents.push({
              documentType: "Electricity Bill",
              fileName: generateUniqueFilename(file.originalname),
              originalName: file.originalname,
              fileType: file.mimetype,
              fileSize: file.size,
              fileData: getFileData(file),
              contentType: file.mimetype,
              uploadedBy: 'user',
            });
          }

          if (fileMap['ownerPanAadhaar'] && fileMap['ownerPanAadhaar'].length > 0) {
            const file = fileMap['ownerPanAadhaar'][0];
            formData.documents.push({
              documentType: "Owner PAN/Aadhaar Card",
              fileName: generateUniqueFilename(file.originalname),
              originalName: file.originalname,
              fileType: file.mimetype,
              fileSize: file.size,
              fileData: getFileData(file),
              contentType: file.mimetype,
              uploadedBy: 'user',
            });
          }

          if (fileMap['municipalTaxReceipt'] && fileMap['municipalTaxReceipt'].length > 0) {
            const file = fileMap['municipalTaxReceipt'][0];
            formData.documents.push({
              documentType: "Municipal Tax Receipt",
              fileName: generateUniqueFilename(file.originalname),
              originalName: file.originalname,
              fileType: file.mimetype,
              fileSize: file.size,
              fileData: getFileData(file),
              contentType: file.mimetype,
              uploadedBy: 'user',
            });
          }

          // Process general documents
          if (fileMap['documents'] && fileMap['documents'].length > 0) {
            fileMap['documents'].forEach((file, index) => {
              console.log(`Processing general document ${index}:`, {
                originalName: file.originalname,
                mimetype: file.mimetype,
                size: file.size
              });
              
              formData.documents.push({
                documentType: req.body[`documentType_${index}`] || "Additional Document",
                fileName: generateUniqueFilename(file.originalname),
                originalName: file.originalname,
                fileType: file.mimetype,
                fileSize: file.size,
                fileData: getFileData(file),
                contentType: file.mimetype,
                uploadedBy: 'user',
              });
            });
          }

          console.log("Documents processed:", formData.documents.length);
        } catch (fileError) {
          console.error("Error processing files:", fileError);
          return res.status(400).json({ message: "Error processing uploaded files" });
        }
      }

      console.log("Final form data:", JSON.stringify({ ...formData, documents: formData.documents.length }, null, 2));

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
            message: "A Company Information form for this service already exists. You can only submit one form per service." 
          });
        }
        throw saveError; // Re-throw to be caught by outer catch block
      }

      res.status(201).json({
        message: "Company Information form submitted successfully",
        formId: companyForm._id,
      });
    } catch (error) {
      console.error("Error submitting Company Information form:", error);
      console.error("Error stack:", error.stack);
      res.status(500).json({
        message: "Server error while submitting Company Information form",
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
  upload.fields([
    { name: 'aadhaarFile', maxCount: 1 },
    { name: 'panFile', maxCount: 1 },
    { name: 'addressProofFile', maxCount: 1 },
    { name: 'businessAddressProofFile', maxCount: 1 },
    { name: 'identityProofFile', maxCount: 1 },
    { name: 'partnershipDeedFile', maxCount: 1 },
    { name: 'mouFile', maxCount: 1 },
    { name: 'bankAccountFile', maxCount: 1 },
    { name: 'businessRegistrationFile', maxCount: 1 },
    { name: 'documents', maxCount: 10 },
    { name: 'cancelCheckFile', maxCount: 1 },
    { name: 'gstFile', maxCount: 1 },
    { name: 'electricityBillFile', maxCount: 1 },
    { name: 'rentAgreementFile', maxCount: 1 }
  ]),
  handleMulterError,
  async (req, res) => {
    try {
      console.log("Other registration form submission received (first route)");
      console.log("Request body keys:", Object.keys(req.body || {}));
      console.log("Request body:", JSON.stringify(req.body, null, 2));
      console.log("Files received:", req.files ? Object.keys(req.files) : "No files");
      
      const {
        fullName,
        email,
        phone,
        pan,
        aadhaar,
        registrationType,
        businessName,
        businessActivity,
        businessAddress,
        city,
        state,
        pincode,
        registrationPurpose,
        description,
        businessDetails,
        // Legacy fields for backward compatibility
        service,
        subService,
        businessType,
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

      // Map frontend fields to backend expectations
      const mappedService = service || "Other Registration";
      const mappedSubService = subService || registrationType;
      const mappedBusinessType = businessType || businessActivity || 'Individual';
      const mappedApplicantAadhaar = aadhaar || applicantAadhaar;
      const mappedBusinessAddress = businessAddress || businessDetails || 'Not Provided';
      
      // Log parsed fields for debugging
      console.log("Parsed form data:", {
        fullName: fullName || 'MISSING',
        email: email || 'MISSING',
        phone: phone || 'MISSING',
        pan: pan || 'MISSING',
        service: mappedService || 'MISSING',
        subService: mappedSubService || 'MISSING',
        registrationType: registrationType || 'MISSING',
        businessName: businessName || 'MISSING',
        businessType: mappedBusinessType || 'MISSING',
        businessAddress: mappedBusinessAddress || 'MISSING',
        businessDetails: businessDetails || 'MISSING',
      });

      // Validate core required fields (frontend sends these)
      const missingFields = [];
      if (!email) missingFields.push('email');
      if (!mappedService) missingFields.push('service');
      if (!businessName) missingFields.push('businessName');
      if (!registrationType && !mappedSubService) missingFields.push('registrationType or subService');
      
      if (missingFields.length > 0) {
        console.error("Missing required fields:", missingFields);
        console.error("Full request body:", req.body);
        return res.status(400).json({ 
          message: `Missing required fields: ${missingFields.join(', ')}` 
        });
      }

      // Handle optional fields with defaults
      const finalFullName = fullName || req.user?.name || 'Not Provided';
      const finalPhone = phone || req.user?.mobile || 'Not Provided';
      const finalPan = pan || req.user?.pan || 'NOTPR0000N'; // Valid PAN format placeholder
      const finalCity = city || 'Not Provided';
      const finalState = state || 'Not Provided';
      const finalPincode = pincode || '000000';

      // Validate PAN only if provided (skip validation for placeholder)
      if (finalPan && finalPan.trim() !== '' && finalPan !== 'NOTPR0000N') {
        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
        if (!panRegex.test(finalPan)) {
          return res.status(400).json({ message: "Invalid PAN format" });
        }
      }

      const formData = {
        user: req.user._id,
        fullName: finalFullName,
        email,
        phone: finalPhone,
        pan: finalPan.toUpperCase(),
        aadhaar: mappedApplicantAadhaar || undefined,
        service: mappedService,
        subService: mappedSubService,
        businessName,
        businessType: mappedBusinessType,
        businessAddress: mappedBusinessAddress,
        city: finalCity,
        state: finalState,
        pincode: finalPincode,
        registrationType: registrationType || mappedSubService,
        registrationPurpose: registrationPurpose || undefined,
        description: description || businessDetails || "",
        // Legacy fields for backward compatibility
        turnover: turnover || "",
        employeeCount: employeeCount || "",
        businessCategory: businessCategory || "",
        foodBusinessType: foodBusinessType || "",
        importExportCode: importExportCode || "",
        applicantName: applicantName || finalFullName,
        applicantPan: applicantPan ? applicantPan.toUpperCase() : finalPan.toUpperCase(),
        applicantAadhaar: mappedApplicantAadhaar && mappedApplicantAadhaar.trim() !== '' 
          ? mappedApplicantAadhaar.replace(/\D/g, '') 
          : (req.user?.aadhaar ? req.user.aadhaar.replace(/\D/g, '') : '000000000000'), // 12 digit placeholder
        applicantAddress: (applicantAddress && applicantAddress.trim() !== '') 
          ? applicantAddress.trim() 
          : mappedBusinessAddress,
        requiresDigitalSignature: requiresDigitalSignature === 'true',
        requiresBankAccount: requiresBankAccount === 'true',
        requiresCompliance: requiresCompliance === 'true',
        selectedPackage: selectedPackage || "Basic",
      };

      // Handle file uploads
      const documents = [];
      
      // Process specific document files
      const fileFields = [
        { field: 'aadhaarFile', type: 'Aadhaar Card' },
        { field: 'panFile', type: 'PAN Card' },
        { field: 'addressProofFile', type: 'Address Proof' },
        { field: 'businessAddressProofFile', type: 'Business Address Proof' },
        { field: 'identityProofFile', type: 'Identity Proof' },
        { field: 'partnershipDeedFile', type: 'Partnership Deed' },
        { field: 'mouFile', type: 'MOU' },
        { field: 'bankAccountFile', type: 'Bank Account' },
        { field: 'businessRegistrationFile', type: 'Business Registration' },
        { field: 'cancelCheckFile', type: 'Cancel Check / Bank Statement' },
        { field: 'gstFile', type: 'GST Certificate' },
        { field: 'electricityBillFile', type: 'Electricity Bill' },
        { field: 'rentAgreementFile', type: 'Rent Agreement' }
      ];
      
      fileFields.forEach(({ field, type }) => {
        if (req.files[field] && req.files[field].length > 0) {
          const file = req.files[field][0];
          console.log(`Processing ${field}:`, {
            originalName: file.originalname,
            mimetype: file.mimetype,
            size: file.size
          });
          documents.push({
            documentType: type,
            fileName: generateUniqueFilename(file.originalname),
            originalName: file.originalname,
            fileType: file.mimetype,
            fileSize: file.size,
            fileData: getFileData(file),
            contentType: file.mimetype,
            uploadedBy: 'user',
          });
        }
      });
      
      // Process additional documents
      if (req.files['documents'] && req.files['documents'].length > 0) {
        req.files['documents'].forEach((file, index) => {
          console.log(`Processing general document ${index}:`, {
            originalName: file.originalname,
            mimetype: file.mimetype,
            size: file.size
          });
          documents.push({
            documentType: req.body[`documentType_${index}`] || "Additional Document",
            fileName: generateUniqueFilename(file.originalname),
            originalName: file.originalname,
            fileType: file.mimetype,
            fileSize: file.size,
            fileData: getFileData(file),
            contentType: file.mimetype,
            uploadedBy: 'user',
          });
        });
      }
      
      console.log("Documents processed:", documents.length);
      
      if (documents.length > 0) {
        formData.documents = documents;
      }

      console.log("Final form data:", JSON.stringify({ ...formData, documents: formData.documents?.length || 0 }, null, 2));
      console.log("Creating OtherRegistrationForm instance...");
      
      const otherRegistrationForm = new OtherRegistrationForm(formData);
      console.log("OtherRegistrationForm instance created, saving...");
      
      try {
        await otherRegistrationForm.save();
        console.log("OtherRegistrationForm saved successfully with ID:", otherRegistrationForm._id);
      } catch (saveError) {
        console.error("Error saving OtherRegistrationForm:", saveError);
        if (saveError.code === 11000) {
          return res.status(400).json({ 
            message: "A form for this service already exists. You can only submit one form per service." 
          });
        }
        throw saveError;
      }

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

// @route   POST /api/forms/partnership-firm
// @desc    Submit partnership firm registration form with documents
// @access  Private
router.post(
  "/partnership-firm",
  protect,
  upload.any(),
  handleMulterError,
  async (req, res) => {
    try {
      console.log("Partnership firm form submission received");
      console.log("Request body:", req.body);
      console.log("Files received:", req.files ? Object.keys(req.files).length : "No files");
      
      const {
        fullName,
        email,
        phone,
        pan,
        businessName,
        businessAddress,
        city,
        state,
        pincode,
        businessDetails,
        addressProofType,
        ownerName,
        ownerPan,
        ownerAadhaar,
        partnershipDeedDate,
        partnershipDeedNotarized,
        partnershipDeedStampDuty,
        requiresGstRegistration,
        requiresBankAccount,
        requiresCompliance,
        selectedPackage,
        partners,
        service = "Other Registration",
        subService = "Partnership Firm",
      } = req.body;

      // Validate required fields
      if (!fullName || !email || !phone || !pan || !businessName || !businessAddress || !city || !state || !pincode || !businessDetails || !addressProofType) {
        return res.status(400).json({ message: "All required fields must be provided" });
      }

      // Validate PAN format
      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
      if (!panRegex.test(pan)) {
        return res.status(400).json({ message: "Invalid PAN format" });
      }

      // Parse partners data
      let parsedPartners = [];
      try {
        if (partners) {
          parsedPartners = typeof partners === 'string' ? JSON.parse(partners) : partners;
        }
      } catch (parseError) {
        console.error("Error parsing partners:", parseError);
        return res.status(400).json({ message: "Invalid partners data format" });
      }

      // Validate partners data
      if (!parsedPartners || parsedPartners.length === 0) {
        return res.status(400).json({ message: "At least one partner is required" });
      }

      // Validate each partner
      for (const partner of parsedPartners) {
        if (!partner.name || !partner.email || !partner.phone || !partner.pan || !partner.aadhaar || !partner.address) {
          return res.status(400).json({ message: "All partner fields are required" });
        }
        if (!panRegex.test(partner.pan)) {
          return res.status(400).json({ message: `Invalid PAN format for partner: ${partner.name}` });
        }
        if (!/^\d{12}$/.test(partner.aadhaar)) {
          return res.status(400).json({ message: `Invalid Aadhaar format for partner: ${partner.name}` });
        }
      }

      // Build form data
      const formData = {
        user: req.user._id,
        fullName,
        email,
        phone,
        pan: pan.toUpperCase(),
        service,
        subService,
        businessName,
        businessAddress,
        city,
        state,
        pincode,
        businessDetails,
        addressProofType,
        partners: parsedPartners.map(partner => ({
          name: partner.name,
          email: partner.email,
          phone: partner.phone,
          pan: partner.pan.toUpperCase(),
          aadhaar: partner.aadhaar.replace(/\D/g, ''),
          address: partner.address,
          isActive: true,
        })),
        partnershipDeedDate: partnershipDeedDate || undefined,
        partnershipDeedNotarized: partnershipDeedNotarized === 'true' || partnershipDeedNotarized === true,
        partnershipDeedStampDuty: partnershipDeedStampDuty || undefined,
        ownerName: ownerName || undefined,
        ownerPan: ownerPan ? ownerPan.toUpperCase() : undefined,
        ownerAadhaar: ownerAadhaar ? ownerAadhaar.replace(/\D/g, '') : undefined,
        requiresGstRegistration: requiresGstRegistration === 'true' || requiresGstRegistration === true,
        requiresBankAccount: requiresBankAccount === 'true' || requiresBankAccount === true,
        requiresCompliance: requiresCompliance === 'true' || requiresCompliance === true,
        selectedPackage: selectedPackage || "Basic",
        documents: [],
        status: "Pending",
      };

      // Process uploaded files
      if (req.files && req.files.length > 0) {
        const documents = [];
        const fileMap = {};

        // Group files by fieldname
        req.files.forEach((file) => {
          if (!fileMap[file.fieldname]) {
            fileMap[file.fieldname] = [];
          }
          fileMap[file.fieldname].push(file);
        });

        // Process partner photos (partnerPhoto_0, partnerPhoto_1, etc.)
        Object.keys(fileMap).forEach((fieldName) => {
          if (fieldName.startsWith('partnerPhoto_')) {
            fileMap[fieldName].forEach((file, index) => {
              const partnerIndex = fieldName.split('_')[1] || '0';
              documents.push({
                documentType: `Partner ${parseInt(partnerIndex) + 1} Photo`,
                fileName: generateUniqueFilename(file.originalname),
                originalName: file.originalname,
                fileType: file.mimetype,
                fileSize: file.size,
                fileData: getFileData(file),
                contentType: file.mimetype,
                uploadedBy: 'user',
              });
            });
          }
        });

        // Process partner signatures (partnerSignature_0, partnerSignature_1, etc.)
        Object.keys(fileMap).forEach((fieldName) => {
          if (fieldName.startsWith('partnerSignature_')) {
            fileMap[fieldName].forEach((file, index) => {
              const partnerIndex = fieldName.split('_')[1] || '0';
              documents.push({
                documentType: `Partner ${parseInt(partnerIndex) + 1} Signature`,
                fileName: generateUniqueFilename(file.originalname),
                originalName: file.originalname,
                fileType: file.mimetype,
                fileSize: file.size,
                fileData: getFileData(file),
                contentType: file.mimetype,
                uploadedBy: 'user',
              });
            });
          }
        });

        // Process partner Aadhaar cards (partnerAadhaar_0, partnerAadhaar_1, etc.)
        Object.keys(fileMap).forEach((fieldName) => {
          if (fieldName.startsWith('partnerAadhaar_')) {
            fileMap[fieldName].forEach((file, index) => {
              const partnerIndex = fieldName.split('_')[1] || '0';
              documents.push({
                documentType: `Partner ${parseInt(partnerIndex) + 1} Aadhaar Card`,
                fileName: generateUniqueFilename(file.originalname),
                originalName: file.originalname,
                fileType: file.mimetype,
                fileSize: file.size,
                fileData: getFileData(file),
                contentType: file.mimetype,
                uploadedBy: 'user',
              });
            });
          }
        });

        // Process partner PAN cards (partnerPan_0, partnerPan_1, etc.)
        Object.keys(fileMap).forEach((fieldName) => {
          if (fieldName.startsWith('partnerPan_')) {
            fileMap[fieldName].forEach((file, index) => {
              const partnerIndex = fieldName.split('_')[1] || '0';
              documents.push({
                documentType: `Partner ${parseInt(partnerIndex) + 1} PAN Card`,
                fileName: generateUniqueFilename(file.originalname),
                originalName: file.originalname,
                fileType: file.mimetype,
                fileSize: file.size,
                fileData: getFileData(file),
                contentType: file.mimetype,
                uploadedBy: 'user',
              });
            });
          }
        });

        // Process rent agreement
        if (fileMap['rentAgreement']) {
          fileMap['rentAgreement'].forEach((file) => {
            documents.push({
              documentType: "Rent Agreement",
              fileName: generateUniqueFilename(file.originalname),
              originalName: file.originalname,
              fileType: file.mimetype,
              fileSize: file.size,
              fileData: getFileData(file),
              contentType: file.mimetype,
              uploadedBy: 'user',
            });
          });
        }

        // Process electricity bill
        if (fileMap['electricityBill']) {
          fileMap['electricityBill'].forEach((file) => {
            documents.push({
              documentType: "Electricity Bill",
              fileName: generateUniqueFilename(file.originalname),
              originalName: file.originalname,
              fileType: file.mimetype,
              fileSize: file.size,
              fileData: getFileData(file),
              contentType: file.mimetype,
              uploadedBy: 'user',
            });
          });
        }

        // Process owner PAN/Aadhaar
        if (fileMap['ownerPanAadhaar']) {
          fileMap['ownerPanAadhaar'].forEach((file) => {
            documents.push({
              documentType: "Owner PAN/Aadhaar Card",
              fileName: generateUniqueFilename(file.originalname),
              originalName: file.originalname,
              fileType: file.mimetype,
              fileSize: file.size,
              fileData: getFileData(file),
              contentType: file.mimetype,
              uploadedBy: 'user',
            });
          });
        }

        // Process municipal tax receipt
        if (fileMap['municipalTaxReceipt']) {
          fileMap['municipalTaxReceipt'].forEach((file) => {
            documents.push({
              documentType: "Municipal Tax Receipt",
              fileName: generateUniqueFilename(file.originalname),
              originalName: file.originalname,
              fileType: file.mimetype,
              fileSize: file.size,
              fileData: getFileData(file),
              contentType: file.mimetype,
              uploadedBy: 'user',
            });
          });
        }

        // Process custom documents
        Object.keys(fileMap).forEach((fieldName) => {
          if (fieldName.startsWith('customDoc_')) {
            fileMap[fieldName].forEach((file) => {
              const docIndex = fieldName.split('_')[1];
              const docTitle = req.body[`customDocTitle_${docIndex}`] || "Custom Document";
              documents.push({
                documentType: docTitle,
                fileName: generateUniqueFilename(file.originalname),
                originalName: file.originalname,
                fileType: file.mimetype,
                fileSize: file.size,
                fileData: getFileData(file),
                contentType: file.mimetype,
                uploadedBy: 'user',
              });
            });
          }
        });

        // Process other documents
        if (fileMap['documents']) {
          fileMap['documents'].forEach((file) => {
            documents.push({
              documentType: "Additional Document",
              fileName: generateUniqueFilename(file.originalname),
              originalName: file.originalname,
              fileType: file.mimetype,
              fileSize: file.size,
              fileData: getFileData(file),
              contentType: file.mimetype,
              uploadedBy: 'user',
            });
          });
        }

        formData.documents = documents;
      }

      console.log("Final form data:", JSON.stringify({ ...formData, documents: formData.documents.length }, null, 2));

      // Create partnership form
      const partnershipForm = new PartnershipForm(formData);
      await partnershipForm.save();

      console.log("Partnership firm form saved successfully with ID:", partnershipForm._id);

      res.status(201).json({
        message: "Partnership firm registration form submitted successfully",
        formId: partnershipForm._id,
      });
    } catch (error) {
      console.error("Error submitting partnership firm form:", error);
      
      // Handle duplicate key error
      if (error.code === 11000) {
        return res.status(409).json({
          message: "You have already submitted a partnership firm registration form. You can only submit one form per service.",
        });
      }
      
      res.status(500).json({
        message: "Server error while submitting partnership firm form",
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
  upload.fields([
    { name: 'documents', maxCount: 10 },
    { name: 'aadhaarFile', maxCount: 1 }
  ]),
  handleMulterError,
  async (req, res) => {
    try {
      console.log("ROC returns form submission received");
      console.log("Request body:", req.body);
      console.log("Files received:", req.files ? Object.keys(req.files).length : "No files");
      
      const {
        fullName,
        email,
        phone,
        pan,
        service,
        subService,
        companyName,
        cin,
        cinNumber, // Handle both cin and cinNumber
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

      // Use cin or cinNumber, whichever is provided
      const finalCin = cin || cinNumber;
      
      // Handle companyType if it comes as an array
      let cleanCompanyType = companyType;
      if (Array.isArray(companyType)) {
        cleanCompanyType = companyType.length > 0 ? companyType[0] : '';
      } else if (companyType && typeof companyType === 'string') {
        // Remove any appended fields that might have gotten concatenated
        cleanCompanyType = companyType.split('  ')[0].trim();
        cleanCompanyType = cleanCompanyType.split(' subService:')[0].trim();
      }
      
      // Handle registeredOfficeAddress if it comes as an array
      let cleanRegisteredOfficeAddress = registeredOfficeAddress;
      if (Array.isArray(registeredOfficeAddress)) {
        cleanRegisteredOfficeAddress = registeredOfficeAddress.length > 0 ? registeredOfficeAddress[0] : '';
      }

      if (!fullName || !email || !phone || !pan || !service || !companyName || !finalCin || !cleanCompanyType || !cleanRegisteredOfficeAddress || !financialYear) {
        console.log("Missing required fields", {
          fullName: !!fullName,
          email: !!email,
          phone: !!phone,
          pan: !!pan,
          service: !!service,
          companyName: !!companyName,
          cin: !!finalCin,
          companyType: !!cleanCompanyType,
          registeredOfficeAddress: !!registeredOfficeAddress,
          financialYear: !!financialYear
        });
        return res.status(400).json({ 
          message: "All required fields must be provided",
          details: "Please ensure all mandatory fields are filled correctly."
        });
      }

      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
      if (!panRegex.test(pan)) {
        console.log("Invalid PAN format:", pan);
        return res.status(400).json({ message: "Invalid PAN format" });
      }

      const formData = {
        user: req.user._id,
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        pan: pan.toUpperCase().trim(),
        service: service.trim(),
        subService: (subService || service).trim(),
        companyName: companyName.trim(),
        cin: finalCin.trim(),
        companyType: String(cleanCompanyType).trim(),
        registeredOfficeAddress: String(cleanRegisteredOfficeAddress).trim(),
        financialYear: financialYear.trim(),
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

      // Process uploaded files from different field names
      if (req.files) {
        try {
          // Process specific document types
          const fileFields = [
            { field: 'aadhaarFile', type: 'Aadhaar Card' }
          ];

          // Process specific document files
          fileFields.forEach(({ field, type }) => {
            if (req.files[field] && req.files[field].length > 0) {
              const file = req.files[field][0];
              console.log(`Processing ${field}:`, {
                originalName: file.originalname,
            mimetype: file.mimetype,
                size: file.size
              });
              
              formData.documents.push({
                documentType: type,
                fileName: file.filename || `file_${Date.now()}_${field}`,
                originalName: file.originalname,
                fileType: file.mimetype,
                fileSize: file.size,
                fileData: getFileData(file),
                contentType: file.mimetype,
                uploadedBy: 'user',
              });
            }
          });

          // Process general documents
          if (req.files['documents'] && req.files['documents'].length > 0) {
            req.files['documents'].forEach((file, index) => {
              console.log(`Processing general document ${index}:`, {
                originalName: file.originalname,
                mimetype: file.mimetype,
                size: file.size
              });
              
          formData.documents.push({
                documentType: req.body[`documentType_${index}`] || "General Document",
                fileName: file.filename || `file_${Date.now()}_${index}`,
            originalName: file.originalname,
            fileType: file.mimetype,
            fileSize: file.size,
            fileData: getFileData(file),
            contentType: file.mimetype,
                uploadedBy: 'user',
          });
        });
          }

          console.log("Documents processed:", formData.documents.length);
        } catch (fileError) {
          console.error("Error processing files:", fileError);
          return res.status(400).json({ message: "Error processing uploaded files" });
        }
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
  upload.fields([
    { name: 'documents', maxCount: 10 },
    { name: 'aadhaarFile', maxCount: 1 }
  ]),
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

      // Handle businessType if it comes as an array
      let processedBusinessType = businessType;
      if (Array.isArray(businessType)) {
        // If it's an array, join with comma or take first value
        processedBusinessType = businessType.length > 0 ? businessType[0] : '';
      }
      if (!processedBusinessType || processedBusinessType.trim() === '') {
        return res.status(400).json({ message: "Business type is required" });
      }

      if (!fullName || !email || !phone || !pan || !service || !businessName || !businessAddress || !reportPeriod || !reportPurpose) {
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
        businessType: String(processedBusinessType).trim(),
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

      // Process uploaded files from different field names
      if (req.files) {
        try {
          formData.documents = [];
          
          // Process specific document types
          const fileFields = [
            { field: 'aadhaarFile', type: 'Aadhaar Card' }
          ];

          // Process specific document files
          fileFields.forEach(({ field, type }) => {
            if (req.files[field] && req.files[field].length > 0) {
              const file = req.files[field][0];
              formData.documents.push({
                documentType: type,
                fileName: file.filename || `file_${Date.now()}_${field}`,
                originalName: file.originalname,
                fileType: file.mimetype,
                fileSize: file.size,
                fileData: getFileData(file),
                contentType: file.mimetype,
              });
            }
          });

          // Process general documents
          if (req.files['documents'] && req.files['documents'].length > 0) {
            req.files['documents'].forEach((file, index) => {
              formData.documents.push({
          documentType: req.body[`documentType_${index}`] || "General Document",
                fileName: file.filename || `file_${Date.now()}_${index}`,
          originalName: file.originalname,
          fileType: file.mimetype,
          fileSize: file.size,
          fileData: getFileData(file),
          contentType: file.mimetype,
              });
            });
          }
        } catch (fileError) {
          console.error("Error processing files:", fileError);
          return res.status(400).json({ message: "Error processing uploaded files" });
        }
      }

      const reportsForm = new ReportsForm(formData);
      await reportsForm.save();

      res.status(201).json({
        message: "Reports form submitted successfully",
        formId: reportsForm._id,
      });
    } catch (error) {
      // Handle duplicate key error for the compound index (user, subService, reportPeriod)
      if (error.code === 11000) {
        return res.status(409).json({
          message: `Already submitted for this Year. You have already submitted a form for this sub-service (${req.body?.subService || req.body?.service || "selected"}) for the report period ${req.body?.reportPeriod || "the selected period"}. You can only submit one form per sub-service each period.`,
        });
      }
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
  upload.fields([
    { name: 'documents', maxCount: 10 },
    { name: 'aadhaarFile', maxCount: 1 }
  ]),
  handleMulterError,
  async (req, res) => {
    try {
      console.log("Trademark & ISO form submission received");
      console.log("Request body:", req.body);
      console.log("Files received:", req.files ? Object.keys(req.files).length : "No files");
      
      const {
        fullName,
        email,
        phone,
        pan,
        service,
        subService,
        serviceType,
        trademarkName,
        trademarkClass,
        applicantName,
        applicationType,
        businessName,
        businessType,
        description,
        priorityDate,
        businessAddress,
        aadhaar,
      } = req.body;

      // Log parsed fields for debugging
      console.log("Parsed form data:", {
        fullName,
        email,
        phone,
        pan,
        service,
        subService,
        serviceType,
        trademarkName,
        trademarkClass,
        applicantName,
        applicationType,
        businessName,
        businessType,
        businessAddress,
      });

      // Determine subService - use serviceType if subService is not provided
      const finalSubService = subService || serviceType;
      
      // Validate required fields with detailed error message
      const missingFields = [];
      if (!fullName) missingFields.push('fullName');
      if (!email) missingFields.push('email');
      if (!service) missingFields.push('service');
      if (!finalSubService) missingFields.push('subService or serviceType');
      if (!trademarkName) missingFields.push('trademarkName');
      if (!trademarkClass) missingFields.push('trademarkClass');
      if (!applicantName) missingFields.push('applicantName');
      if (!applicationType) missingFields.push('applicationType');

      if (missingFields.length > 0) {
        console.error("Missing required fields:", missingFields);
        return res.status(400).json({ 
          message: `Missing required fields: ${missingFields.join(', ')}` 
        });
      }

      // Validate PAN only if provided (it might be empty from user profile)
      // Skip validation for placeholder values
      if (pan && pan.trim() !== '' && pan.trim() !== 'NOTPR0000N') {
        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
        if (!panRegex.test(pan)) {
          return res.status(400).json({ message: "Invalid PAN format" });
        }
      }

      // Map frontend fields to schema fields
      // Use businessName and businessType if provided, otherwise fallback to applicantName/applicationType
      // Ensure we always have values for required schema fields
      const finalBusinessName = (businessName && businessName.trim() !== '') 
        ? businessName.trim() 
        : ((applicantName && applicantName.trim() !== '') 
          ? applicantName.trim() 
          : (fullName && fullName.trim() !== '' ? fullName.trim() : 'Not Provided'));
      const finalBusinessType = (businessType && businessType.trim() !== '') 
        ? businessType.trim() 
        : ((applicationType && applicationType.trim() !== '') 
          ? applicationType.trim() 
          : 'Individual');
      const finalBusinessAddress = (businessAddress && businessAddress.trim() !== '') 
        ? businessAddress.trim() 
        : 'Not Provided';
      
      console.log("Mapped business fields:", { businessName: finalBusinessName, businessType: finalBusinessType, finalBusinessAddress });
      
      // Handle phone and pan - schema requires them but they might be empty from user profile
      // Use defaults if not provided
      // Note: PAN must match format AAAAA0000A for schema validation
      const finalPhone = phone && phone.trim() !== '' ? phone : 'Not Provided';
      const finalPan = pan && pan.trim() !== '' ? pan.toUpperCase() : 'NOTPR0000N'; // Valid format placeholder

      const formData = {
        user: req.user._id,
        fullName,
        email,
        phone: finalPhone,
        pan: finalPan,
        service,
        subService: finalSubService,
        serviceType: serviceType || finalSubService,
        // Business Details (required by schema) - MUST be included
        businessName: finalBusinessName,
        businessType: finalBusinessType,
        businessAddress: finalBusinessAddress,
        // Trademark fields
        trademarkName,
        trademarkClass,
        trademarkDescription: description || undefined,
        firstUseDate: priorityDate || undefined,
        // Additional fields
        applicantName,
        applicationType,
        aadhaar: aadhaar || undefined,
        documents: [],
      };

      // Process uploaded files
      if (req.files) {
        try {
          formData.documents = [];
          
          // Create fileMap for easier access
          const fileMap = req.files;

          // Process Aadhaar file
          if (fileMap['aadhaarFile'] && fileMap['aadhaarFile'].length > 0) {
            const file = fileMap['aadhaarFile'][0];
            console.log(`Processing aadhaarFile:`, {
              originalName: file.originalname,
              mimetype: file.mimetype,
              size: file.size
            });
            
            formData.documents.push({
              documentType: 'Aadhaar Card',
              fileName: generateUniqueFilename(file.originalname),
              originalName: file.originalname,
              fileType: file.mimetype,
              fileSize: file.size,
              fileData: getFileData(file),
              contentType: file.mimetype,
              uploadedBy: 'user',
            });
          }

          // Process general documents
          if (fileMap['documents'] && fileMap['documents'].length > 0) {
            fileMap['documents'].forEach((file, index) => {
              console.log(`Processing document ${index}:`, {
                originalName: file.originalname,
                mimetype: file.mimetype,
                size: file.size
              });
              
              formData.documents.push({
                documentType: req.body[`documentType_${index}`] || "Additional Document",
                fileName: generateUniqueFilename(file.originalname),
                originalName: file.originalname,
                fileType: file.mimetype,
                fileSize: file.size,
                fileData: getFileData(file),
                contentType: file.mimetype,
                uploadedBy: 'user',
              });
            });
          }

          console.log("Documents processed:", formData.documents.length);
        } catch (fileError) {
          console.error("Error processing files:", fileError);
          return res.status(400).json({ message: "Error processing uploaded files" });
        }
      }

      console.log("Final form data:", JSON.stringify({ ...formData, documents: formData.documents.length }, null, 2));
      
      // Verify required fields are present before creating model
      console.log("Required fields check:", {
        businessName: formData.businessName,
        businessType: formData.businessType,
        businessAddress: formData.businessAddress,
        phone: formData.phone,
        pan: formData.pan
      });

      const trademarkISOForm = new TrademarkISOForm(formData);
      console.log("Model created, attempting save...");
      await trademarkISOForm.save();

      res.status(201).json({
        message: "Trademark & ISO form submitted successfully",
        formId: trademarkISOForm._id,
      });
    } catch (error) {
      // Handle duplicate key error for the compound index (user, subService)
      if (error.code === 11000) {
        return res.status(409).json({
          message: `Already submitted for this Year. You have already submitted a form for this sub-service (${req.body?.subService || req.body?.service || "selected"}). You can only submit one form per sub-service.`,
        });
      }
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
  upload.fields([
    { name: 'documents', maxCount: 10 },
    { name: 'aadhaarFile', maxCount: 1 }
  ]),
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

      // Process uploaded files from different field names
      if (req.files) {
        try {
          formData.documents = [];
          
          // Process specific document types
          const fileFields = [
            { field: 'aadhaarFile', type: 'Aadhaar Card' }
          ];

          // Process specific document files
          fileFields.forEach(({ field, type }) => {
            if (req.files[field] && req.files[field].length > 0) {
              const file = req.files[field][0];
              formData.documents.push({
                documentType: type,
                fileName: file.filename || `file_${Date.now()}_${field}`,
                originalName: file.originalname,
                fileType: file.mimetype,
                fileSize: file.size,
                fileData: getFileData(file),
                contentType: file.mimetype,
              });
            }
          });

          // Process general documents
          if (req.files['documents'] && req.files['documents'].length > 0) {
            req.files['documents'].forEach((file, index) => {
              formData.documents.push({
          documentType: req.body[`documentType_${index}`] || "General Document",
                fileName: file.filename || `file_${Date.now()}_${index}`,
          originalName: file.originalname,
          fileType: file.mimetype,
          fileSize: file.size,
          fileData: getFileData(file),
          contentType: file.mimetype,
              });
            });
          }
        } catch (fileError) {
          console.error("Error processing files:", fileError);
          return res.status(400).json({ message: "Error processing uploaded files" });
        }
      }

      const advisoryForm = new AdvisoryForm(formData);
      await advisoryForm.save();

      res.status(201).json({
        message: "Advisory form submitted successfully",
        formId: advisoryForm._id,
      });
    } catch (error) {
      // Handle duplicate key error for the compound index (user, subService)
      if (error.code === 11000) {
        return res.status(409).json({
          message: `Already submitted for this Year. You have already submitted a form for this sub-service (${req.body?.subService || req.body?.service || "selected"}). You can only submit one form per sub-service.`,
        });
      }
      console.error("Error submitting advisory form:", error);
      res.status(500).json({
        message: "Server error while submitting advisory form",
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
  upload.fields([
    { name: 'documents', maxCount: 10 },
    { name: 'aadhaarFile', maxCount: 1 },
    { name: 'panFile', maxCount: 1 },
    { name: 'addressProofFile', maxCount: 1 },
    { name: 'businessProofFile', maxCount: 1 },
    { name: 'partnershipDeedFile', maxCount: 1 },
    { name: 'llpAgreementFile', maxCount: 1 },
    { name: 'cancelCheckFile', maxCount: 1 },
    { name: 'gstFile', maxCount: 1 },
    { name: 'electricityBillFile', maxCount: 1 },
    { name: 'rentAgreementFile', maxCount: 1 }
  ]),
  handleMulterError,
  async (req, res) => {
    try {
      console.log("Other registration form submission received");
      console.log("Request body keys:", Object.keys(req.body || {}));
      console.log("Request body:", JSON.stringify(req.body, null, 2));
      console.log("Files received:", req.files ? Object.keys(req.files) : "No files");
      
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
        registrationType,
        businessActivity,
        partners,
        authorizedCapital,
        paidUpCapital,
        numberOfPartners,
        numberOfDirectors,
        businessStage,
        industry,
        expectedRevenue,
        hasGstNumber,
        gstNumber,
        hasBankAccount,
        bankName,
        accountNumber,
        ifscCode,
        hasDigitalSignature,
        requiresCompliance,
        selectedPackage,
        description,
      } = req.body;

      // Log parsed fields for debugging
      console.log("Parsed form data:", {
        fullName: fullName || 'MISSING',
        email: email || 'MISSING',
        phone: phone || 'MISSING',
        pan: pan || 'MISSING',
        service: service || 'MISSING',
        subService: subService || 'MISSING',
        registrationType: registrationType || 'MISSING',
        businessName: businessName || 'MISSING',
        businessType: businessType || 'MISSING',
        businessAddress: businessAddress || 'MISSING',
        city: city || 'MISSING',
        state: state || 'MISSING',
        pincode: pincode || 'MISSING',
        businessDetails: req.body.businessDetails || 'MISSING',
      });

      // Validate core required fields (frontend sends these)
      const missingFields = [];
      if (!email) missingFields.push('email');
      if (!service) missingFields.push('service');
      if (!businessName) missingFields.push('businessName');
      if (!registrationType) missingFields.push('registrationType');
      
      if (missingFields.length > 0) {
        console.error("Missing required fields:", missingFields);
        console.error("Full request body:", req.body);
        return res.status(400).json({ 
          message: `Missing required fields: ${missingFields.join(', ')}` 
        });
      }

      // Handle optional fields with defaults
      const finalFullName = fullName || req.user?.name || 'Not Provided';
      const finalPhone = phone || req.user?.mobile || 'Not Provided';
      const finalPan = pan || req.user?.pan || 'NOTPR0000N'; // Valid PAN format placeholder
      const finalBusinessType = businessType || 'Individual';
      const finalBusinessAddress = businessAddress || req.body.businessDetails || 'Not Provided';
      const finalCity = city || 'Not Provided';
      const finalState = state || 'Not Provided';
      const finalPincode = pincode || '000000';

      // Parse partners safely if provided
      let parsedPartners = [];
      if (partners) {
        try {
          parsedPartners = JSON.parse(partners);
        } catch (parseError) {
          console.error("Error parsing partners:", parseError);
          return res.status(400).json({ message: "Invalid partners data format" });
        }
      }

      // Validate PAN only if provided (skip validation for placeholder)
      if (finalPan && finalPan.trim() !== '' && finalPan !== 'NOTPR0000N') {
        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
        if (!panRegex.test(finalPan)) {
          return res.status(400).json({ message: "Invalid PAN format" });
        }
      }

      // Handle applicant fields - required by schema
      const finalApplicantAadhaar = (req.body.aadhaar && req.body.aadhaar.trim() !== '') 
        ? req.body.aadhaar.replace(/\D/g, '') 
        : (req.user?.aadhaar ? req.user.aadhaar.replace(/\D/g, '') : '000000000000'); // 12 digit placeholder
      const finalApplicantAddress = (req.body.applicantAddress && req.body.applicantAddress.trim() !== '') 
        ? req.body.applicantAddress.trim() 
        : finalBusinessAddress;

      const formData = {
        user: req.user._id,
        fullName: finalFullName,
        email,
        phone: finalPhone,
        pan: finalPan.toUpperCase(),
        service,
        subService: subService || registrationType,
        businessName,
        businessType: finalBusinessType,
        businessAddress: finalBusinessAddress,
        city: finalCity,
        state: finalState,
        pincode: finalPincode,
        registrationType,
        businessActivity: businessActivity || req.body.businessDetails || "",
        partners: parsedPartners,
        // Applicant fields (required by schema)
        applicantName: finalFullName,
        applicantPan: finalPan.toUpperCase(),
        applicantAadhaar: finalApplicantAadhaar,
        applicantAddress: finalApplicantAddress,
        authorizedCapital: authorizedCapital || "",
        paidUpCapital: paidUpCapital || "",
        numberOfPartners: numberOfPartners || "",
        numberOfDirectors: numberOfDirectors || "",
        businessStage: businessStage || "",
        industry: industry || "",
        expectedRevenue: expectedRevenue || "",
        hasGstNumber: hasGstNumber === 'true',
        gstNumber: gstNumber || "",
        hasBankAccount: hasBankAccount === 'true',
        bankName: bankName || "",
        accountNumber: accountNumber || "",
        ifscCode: ifscCode || "",
        hasDigitalSignature: hasDigitalSignature === 'true',
        requiresCompliance: requiresCompliance === 'true',
        selectedPackage: selectedPackage || "Basic",
        description: description || req.body.businessDetails || "",
        status: "Pending",
        documents: [],
      };

      // Process uploaded files from different field names
      if (req.files) {
        try {
          // Process specific document types
          const fileFields = [
            { field: 'aadhaarFile', type: 'Aadhaar Card' },
            { field: 'panFile', type: 'PAN Card' },
            { field: 'addressProofFile', type: 'Address Proof' },
            { field: 'businessProofFile', type: 'Business Proof' },
            { field: 'partnershipDeedFile', type: 'Partnership Deed' },
            { field: 'llpAgreementFile', type: 'LLP Agreement' },
            { field: 'cancelCheckFile', type: 'Cancel Check / Bank Statement' },
            { field: 'gstFile', type: 'GST Certificate' },
            { field: 'electricityBillFile', type: 'Electricity Bill' },
            { field: 'rentAgreementFile', type: 'Rent Agreement' }
          ];

          // Process specific document files
          fileFields.forEach(({ field, type }) => {
            if (req.files[field] && req.files[field].length > 0) {
              const file = req.files[field][0];
              console.log(`Processing ${field}:`, {
                originalName: file.originalname,
                mimetype: file.mimetype,
                size: file.size
              });
              
              formData.documents.push({
                documentType: type,
                fileName: generateUniqueFilename(file.originalname),
                originalName: file.originalname,
                fileType: file.mimetype,
                fileSize: file.size,
                fileData: getFileData(file),
                contentType: file.mimetype,
                uploadedBy: 'user',
              });
            }
          });

          // Process general documents
          if (req.files['documents'] && req.files['documents'].length > 0) {
            req.files['documents'].forEach((file, index) => {
              console.log(`Processing general document ${index}:`, {
                originalName: file.originalname,
                mimetype: file.mimetype,
                size: file.size
              });
              
              formData.documents.push({
                documentType: req.body[`documentType_${index}`] || "Additional Document",
                fileName: generateUniqueFilename(file.originalname),
                originalName: file.originalname,
                fileType: file.mimetype,
                fileSize: file.size,
                fileData: getFileData(file),
                contentType: file.mimetype,
                uploadedBy: 'user',
              });
            });
          }

          console.log("Documents processed:", formData.documents.length);
        } catch (fileError) {
          console.error("Error processing files:", fileError);
          return res.status(400).json({ message: "Error processing uploaded files" });
        }
      }

      console.log("Creating OtherRegistrationForm instance...");
      const otherRegistrationForm = new OtherRegistrationForm(formData);
      console.log("OtherRegistrationForm instance created, saving...");
      
      try {
        await otherRegistrationForm.save();
        console.log("OtherRegistrationForm saved successfully with ID:", otherRegistrationForm._id);
      } catch (saveError) {
        console.error("Error saving OtherRegistrationForm:", saveError);
        if (saveError.code === 11000) {
          return res.status(400).json({ 
            message: "A form for this service already exists. You can only submit one form per service." 
          });
        }
        throw saveError;
      }

      res.status(201).json({
        success: true,
        message: "Other registration form submitted successfully",
        formId: otherRegistrationForm._id,
        documents: formData.documents.length,
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

// @route   POST /api/forms/partnership-firm
// @desc    Submit partnership firm form with documents
// @access  Private
router.post(
  "/partnership-firm",
  protect,
  upload.fields([
    { name: 'documents', maxCount: 10 },
    { name: 'aadhaarFile', maxCount: 1 },
    { name: 'panFile', maxCount: 1 },
    { name: 'addressProofFile', maxCount: 1 },
    { name: 'businessAddressProofFile', maxCount: 1 },
    { name: 'partnershipDeedFile', maxCount: 1 },
    { name: 'municipalTaxReceipt', maxCount: 1 }
  ]),
  handleMulterError,
  async (req, res) => {
    try {
      console.log("Partnership firm form submission received");
      console.log("Request body:", req.body);
      console.log("Files received:", req.files ? Object.keys(req.files).length : "No files");
      
      const {
        fullName,
        email,
        phone,
        pan,
        service,
        subService,
        businessName,
        businessAddress,
        city,
        state,
        pincode,
        businessDetails,
        partners,
        partnershipDeedDate,
        partnershipDeedNotarized,
        partnershipDeedStampDuty,
        addressProofType,
        ownerName,
        ownerPan,
        ownerAadhaar,
        requiresGstRegistration,
        requiresBankAccount,
        requiresCompliance,
        selectedPackage,
      } = req.body;

      if (!fullName || !email || !phone || !pan || !service || !businessName || !businessAddress || !city || !state || !pincode || !businessDetails) {
        return res.status(400).json({ message: "All required fields must be provided" });
      }

      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
      if (!panRegex.test(pan)) {
        return res.status(400).json({ message: "Invalid PAN format" });
      }

      // Parse partners data if it's a string
      let parsedPartners = [];
      if (partners) {
        try {
          parsedPartners = typeof partners === 'string' ? JSON.parse(partners) : partners;
        } catch (e) {
          console.error("Error parsing partners:", e);
          return res.status(400).json({ message: "Invalid partners data format" });
        }
      }

      const formData = {
        user: req.user._id,
        fullName,
        email,
        phone,
        pan,
        service,
        subService: subService || service,
        businessName,
        businessAddress,
        city,
        state,
        pincode,
        businessDetails,
        partners: parsedPartners,
        partnershipDeedDate,
        partnershipDeedNotarized: partnershipDeedNotarized === 'true',
        partnershipDeedStampDuty,
        addressProofType,
        ownerName,
        ownerPan,
        ownerAadhaar,
        requiresGstRegistration: requiresGstRegistration === 'true',
        requiresBankAccount: requiresBankAccount === 'true',
        requiresCompliance: requiresCompliance === 'true',
        selectedPackage: selectedPackage || "Basic",
        documents: [],
      };

      // Process uploaded files
      if (req.files) {
        try {
          // Process specific document types
          const fileFields = [
            { field: 'aadhaarFile', type: 'Aadhaar Card' },
            { field: 'panFile', type: 'PAN Card' },
            { field: 'addressProofFile', type: 'Address Proof' },
            { field: 'businessAddressProofFile', type: 'Business Address Proof' },
            { field: 'partnershipDeedFile', type: 'Partnership Deed' },
            { field: 'municipalTaxReceipt', type: 'Municipal Tax Receipt' }
          ];

          // Process specific document files
          fileFields.forEach(({ field, type }) => {
            if (req.files[field] && req.files[field].length > 0) {
              const file = req.files[field][0];
              formData.documents.push({
                documentType: type,
                fileName: file.filename || `file_${Date.now()}_${field}`,
                originalName: file.originalname,
                fileType: file.mimetype,
                fileSize: file.size,
                fileData: getFileData(file),
                contentType: file.mimetype,
                uploadedBy: 'user',
              });
            }
          });

          // Process general documents
          if (req.files['documents'] && req.files['documents'].length > 0) {
            req.files['documents'].forEach((file, index) => {
              formData.documents.push({
                documentType: req.body[`documentType_${index}`] || "Additional Document",
                fileName: file.filename || `file_${Date.now()}_${index}`,
                originalName: file.originalname,
                fileType: file.mimetype,
                fileSize: file.size,
                fileData: getFileData(file),
                contentType: file.mimetype,
                uploadedBy: 'user',
              });
            });
          }

          console.log("Documents processed:", formData.documents.length);
        } catch (fileError) {
          console.error("Error processing files:", fileError);
          return res.status(400).json({ message: "Error processing uploaded files" });
        }
      }

      console.log("Creating PartnershipForm instance...");
      const partnershipForm = new PartnershipForm(formData);
      console.log("PartnershipForm instance created, saving...");
      
      try {
        await partnershipForm.save();
        console.log("PartnershipForm saved successfully with ID:", partnershipForm._id);
      } catch (saveError) {
        console.error("Error saving PartnershipForm:", saveError);
        if (saveError.code === 11000) {
          return res.status(409).json({ 
            message: `Already submitted for this Year. You have already submitted a form for this sub-service (${req.body?.subService || req.body?.service || "selected"}). You can only submit one form per sub-service.`
          });
        }
        throw saveError;
      }

      res.status(201).json({
        success: true,
        message: "Partnership firm form submitted successfully",
        formId: partnershipForm._id,
      });
    } catch (error) {
      console.error("Error submitting partnership firm form:", error);
      res.status(500).json({
        message: "Server error while submitting partnership firm form",
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
  upload.fields([
    { name: 'documents', maxCount: 10 },
    { name: 'aadhaarFile', maxCount: 1 }
  ]),
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
        // Company Information specific fields
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
        console.log('Selected CompanyForm model for Company Information service');
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
      if (req.files) {
        try {
          formData.documents = [];
          
          // Process specific document types
          const fileFields = [
            { field: 'aadhaarFile', type: 'Aadhaar Card' }
          ];

          // Process specific document files
          fileFields.forEach(({ field, type }) => {
            if (req.files[field] && req.files[field].length > 0) {
              const file = req.files[field][0];
              formData.documents.push({
                documentType: type,
                fileName: file.filename || `file_${Date.now()}_${field}`,
                originalName: file.originalname,
                fileType: file.mimetype,
                fileSize: file.size,
                fileData: getFileData(file),
                contentType: file.mimetype,
              });
            }
          });

          // Process general documents
          if (req.files['documents'] && req.files['documents'].length > 0) {
            req.files['documents'].forEach((file, index) => {
              formData.documents.push({
          documentType: req.body[`documentType_file_${index}`] || "General Document",
                fileName: file.filename || `file_${Date.now()}_${index}`,
          originalName: file.originalname,
          fileType: file.mimetype,
          fileSize: file.size,
          fileData: getFileData(file),
          contentType: file.mimetype,
              });
            });
          }
        } catch (fileError) {
          console.error("Error processing files:", fileError);
          return res.status(400).json({ message: "Error processing uploaded files" });
        }
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
