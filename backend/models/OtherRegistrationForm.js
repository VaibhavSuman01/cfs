const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
  documentType: { type: String, required: true },
  fileName: { type: String, required: true },
  originalName: { type: String, required: true },
  fileType: { type: String, required: true },
  fileSize: { type: Number, required: true },
  fileData: { type: Buffer, required: true },
  contentType: { type: String, required: true },
  uploadedBy: { type: String, enum: ["user", "admin"], default: "user" },
  uploadDate: { type: Date, default: Date.now },
});

const reportSchema = new mongoose.Schema({
  type: { type: String, required: true },
  message: { type: String, required: true },
  sentAt: { type: Date, default: Date.now },
  sentBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  documentId: { type: mongoose.Schema.Types.ObjectId },
});

const editHistorySchema = new mongoose.Schema({
  editedAt: { type: Date, default: Date.now },
  editorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const otherRegistrationFormSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  pan: { 
    type: String, 
    required: true, 
    uppercase: true,
    validate: {
      validator: function(v) {
        return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(v);
      },
      message: 'PAN must be in format AAAAA0000A'
    },
    set: function(v) {
      if (!v) return v;
      return v.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    }
  },
  service: { type: String, required: true },
  subService: { type: String, default: function () { return this.service; } },
  
  // Business Details
  businessName: { type: String, required: true },
  businessType: { type: String, required: true },
  businessAddress: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  
  // Service-specific fields
  turnover: { type: String },
  employeeCount: { type: String },
  businessCategory: { type: String },
  foodBusinessType: { type: String },
  importExportCode: { type: String },
  
  // Additional document fields for different registration types
  bankStatement: { type: String }, // Bank statement / Cancel check
  gstNumber: { type: String }, // GST number if available
  electricityBill: { type: String }, // Electricity bill
  rentAgreement: { type: String }, // Rent agreement
  businessRegistrationCertificate: { type: String }, // Business registration certificate
  
  // Partnership specific fields (if applicable)
  partnershipDeed: { type: String },
  partnerDetails: [{
    name: { type: String },
    pan: { type: String },
    aadhaar: { type: String },
    email: { type: String },
    phone: { type: String },
    address: { type: String }
  }],
  
  // LLP specific fields (if applicable)
  llpAgreement: { type: String },
  designatedPartnerDetails: [{
    name: { type: String },
    din: { type: String },
    pan: { type: String },
    aadhaar: { type: String },
    email: { type: String },
    phone: { type: String },
    address: { type: String }
  }],
  
  // Applicant Details
  applicantName: { type: String, required: true },
  applicantPan: { 
    type: String, 
    required: true,
    uppercase: true,
    validate: {
      validator: function(v) {
        return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(v);
      },
      message: 'Applicant PAN must be in format AAAAA0000A'
    },
    set: function(v) {
      if (!v) return v;
      return v.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    }
  },
  applicantAadhaar: { 
    type: String, 
    required: true,
    validate: {
      validator: function(v) {
        return /^\d{12}$/.test(v);
      },
      message: 'Applicant Aadhaar must be exactly 12 digits'
    },
    set: function(v) {
      if (!v) return v;
      return v.replace(/\D/g, '');
    }
  },
  applicantAddress: { type: String, required: true },
  
  // Additional Requirements
  requiresDigitalSignature: { type: Boolean, default: false },
  requiresBankAccount: { type: Boolean, default: false },
  requiresCompliance: { type: Boolean, default: false },
  
  // Package Selection
  selectedPackage: { type: String, enum: ["Basic", "Standard", "Premium"], default: "Basic" },
  
  documents: [documentSchema],
  status: { type: String, enum: ["Pending", "Reviewed", "Filed"], default: "Pending" },
  reports: [reportSchema],
  editHistory: [editHistorySchema],
}, { timestamps: true });

// Enforce one submission per user+subService
otherRegistrationFormSchema.index({ user: 1, subService: 1 }, { unique: true });

module.exports = mongoose.model("OtherRegistrationForm", otherRegistrationFormSchema);
