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
    const existingFormWithPAN = await TaxForm.findOne({ pan: pan.toUpperCase() });
    
    return res.status(200).json({
      exists: !!existingFormWithPAN,
      message: existingFormWithPAN ? "A tax form with this PAN already exists" : "PAN is available for submission"
    });
  } catch (error) {
    console.error("Error checking PAN:", error);
    return res.status(500).json({
      message: "Server error while checking PAN",
      error: error.message
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
      console.log(
        "Files received:",
        req.files ? req.files.length : "No files"
      );

      // Check if user already has a tax form submission
      const user = await mongoose.model("User").findById(req.user._id);
      if (user.hasTaxFormSubmission) {
        return res.status(400).json({
          message: "You have already submitted a tax form. Only one submission is allowed per user."
        });
      }

      const {
        fullName,
        email,
        phone,
        pan,
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
      if (!fullName || !email || !phone || !pan) {
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
      
      // Check if a tax form with this PAN already exists
      const existingFormWithPAN = await TaxForm.findOne({ pan: pan.toUpperCase() });
      if (existingFormWithPAN) {
        console.log("Duplicate PAN submission attempt:", pan);
        return res.status(409).json({
          message: "A tax form with this PAN number has already been submitted. Duplicate submissions are not allowed."
        });
      }

      // Validate conditional fields
      if (hasIncomeTaxLogin === "true" && (!incomeTaxLoginId || !incomeTaxLoginPassword)) {
        console.log("Missing income tax login credentials");
        return res
          .status(400)
          .json({ message: "Income tax login credentials are required" });
      }

      if (hasHomeLoan === "true" && (!homeLoanSanctionDate || !homeLoanAmount || !homeLoanCurrentDue || !homeLoanTotalInterest)) {
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
        documents: []
      };
      
      // Get document types from request body
      const documentTypes = {};
      Object.keys(req.body).forEach(key => {
        if (key.startsWith('documentType_')) {
          const fileId = key.replace('documentType_', '');
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
          const docType = documentTypes[fileId] || 'other';
          
          console.log(`Processing file: ${docType}`, {
            originalname: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
            extension: file.originalname.split('.').pop().toLowerCase()
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
            fileData: file.buffer,
            contentType: file.mimetype
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
        $set: { [`documentEditCounts.${taxForm._id}`]: 0 }
      });

      res.status(201).json({
        success: true,
        message: "Tax form submitted successfully",
        formId: taxForm._id,
      });
    } catch (error) {
      console.error("Error in tax form submission:", error);
      res.status(500).json({
        message: "Server error while processing tax form",
        error: error.message,
      });
    }
  }
);

// @route   POST /api/forms/contact
// @desc    Submit contact form
// @access  Public
router.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Create new contact submission
    const contact = new Contact({
      name,
      email,
      message,
    });

    await contact.save();

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
// @desc    Get all tax form submissions for the logged-in user
// @access  Private
router.get("/user-submissions", protect, async (req, res) => {
  try {
    // Get user email from the authenticated user
    const userEmail = req.user.email;

    // Find all tax forms submitted by this user
    const submissions = await TaxForm.find({ email: userEmail })
      .sort({ createdAt: -1 }) // Sort by newest first
      .select("-incomeTaxLoginCredentials -documents.fileData"); // Exclude sensitive data and file data

    res.json(submissions);
  } catch (error) {
    console.error("Error fetching user submissions:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/forms/user-submissions/:id
// @desc    Get a specific tax form submission for the logged-in user
// @access  Private
router.get("/user-submissions/:id", protect, async (req, res) => {
  try {
    const submission = await TaxForm.findById(req.params.id)
      .select("-incomeTaxLoginCredentials -documents.fileData"); // Exclude sensitive data and file data

    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    // Check if the submission belongs to the logged-in user
    if (submission.email !== req.user.email) {
      return res.status(403).json({ message: "Not authorized to view this submission" });
    }
    
    // Process documents by document type for easier frontend access
    const processedSubmission = submission.toObject();
    
    // Create document objects by type for easier frontend access
    if (processedSubmission.documents && processedSubmission.documents.length > 0) {
      processedSubmission.documents.forEach(doc => {
        // Add each document directly to the submission object by its type
        // This makes it accessible as submission.form16, submission.bankStatement, etc.
        processedSubmission[doc.documentType] = doc;
      });
    }

    res.json(processedSubmission);
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
        message: "Invalid document ID format. Must be a 24-character hex string." 
      });
    }
    
    // Find the tax form containing the document
    const taxForm = await TaxForm.findOne(query);
    
    if (!taxForm) {
      return res.status(404).json({ message: "Document not found" });
    }
    
    // Check if the tax form belongs to the logged-in user or if user is admin
    if (taxForm.email !== req.user.email && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to access this document" });
    }
    
    // Find the specific document in the documents array
    const document = taxForm.documents.find(doc => doc._id.toString() === documentId);
    
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }
    
    // Set response headers
    res.set({
      'Content-Type': document.contentType,
      'Content-Disposition': `attachment; filename="${document.originalName}"`
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
        message: "Invalid document ID format. Must be a 24-character hex string." 
      });
    }
    
    // Find the tax form containing the document
    const taxForm = await TaxForm.findOne({ "documents._id": documentId });
    
    if (!taxForm) {
      return res.status(404).json({ message: "Document not found" });
    }
    
    // Check if the tax form belongs to the logged-in user
    if ((taxForm.email !== req.user.email || (taxForm.user && !taxForm.user.equals(req.user._id))) && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this document" });
    }

    // Check edit limit for regular users (not admins)
    if (req.user.role !== "admin") {
      // Get the current user with document edit counts
      const user = await mongoose.model("User").findById(req.user._id);
      
      // Get the edit count for this form
      const editCount = user.documentEditCounts.get(taxForm._id.toString()) || 0;
      
      // Check if edit limit has been reached
      if (editCount >= 2) {
        return res.status(403).json({ 
          message: "You have reached the maximum number of document edits (2) for this submission." 
        });
      }
    }
    
    // Find the document index and type before removing it
    const documentIndex = taxForm.documents.findIndex(doc => doc._id.toString() === documentId);
    
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
        $inc: { [`documentEditCounts.${taxForm._id}`]: 1 }
      });
    }
    
    res.json({ 
      success: true, 
      message: "Document deleted successfully",
      documentType: documentType
    });
    
  } catch (error) {
    console.error("Error deleting document:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/forms/document/:formId
// @desc    Upload a new document to an existing tax form submission
// @access  Private
router.post("/document/:formId", protect, upload.single("document"), handleMulterError, async (req, res) => {
  try {
    const formId = req.params.formId;
    const { documentType } = req.body;
    
    if (!isValidObjectId(formId)) {
      return res.status(400).json({ 
        message: "Invalid form ID format. Must be a 24-character hex string." 
      });
    }
    
    // Find the tax form
    const taxForm = await TaxForm.findById(formId);
    
    if (!taxForm) {
      return res.status(404).json({ message: "Tax form not found" });
    }
    
    // Check if the tax form belongs to the logged-in user
    if ((taxForm.email !== req.user.email || !taxForm.user.equals(req.user._id)) && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to update this form" });
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
          message: "You have reached the maximum number of document edits (2) for this submission." 
        });
      }
    }
    
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    
    // Create new document object
    const newDocument = {
      documentType: documentType || "other",
      fileName: Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(req.file.originalname),
      originalName: req.file.originalname,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      fileData: req.file.buffer,
      contentType: req.file.mimetype,
      isEdited: true // Mark this document as edited since it's being added after initial submission
    };
    
    // Add the new document to the documents array
    taxForm.documents.push(newDocument);
    
    // Save the updated tax form
    await taxForm.save();
    
    // Increment the document edit count for this form (for non-admin users)
    if (req.user.role !== "admin") {
      await mongoose.model("User").findByIdAndUpdate(req.user._id, {
        $inc: { [`documentEditCounts.${formId}`]: 1 }
      });
    }
    
    // Return the new document without the file data
    const responseDocument = {
      _id: taxForm.documents[taxForm.documents.length - 1]._id,
      documentType: newDocument.documentType,
      originalName: newDocument.originalName,
      fileSize: newDocument.fileSize
    };
    
    res.status(201).json({
      success: true,
      message: "Document uploaded successfully",
      document: responseDocument
    });
    
  } catch (error) {
    console.error("Error uploading document:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
