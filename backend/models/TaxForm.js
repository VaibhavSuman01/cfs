
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

const adminDataSchema = new mongoose.Schema({
  reports: [{
    type: { type: String, required: true },
    message: { type: String, required: true },
    sentAt: { type: Date, default: Date.now },
    sentBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    document: {
      fileName: { type: String },
      originalName: { type: String },
      fileType: { type: String },
      fileSize: { type: Number },
      fileData: { type: Buffer },
      contentType: { type: String },
      uploadDate: { type: Date, default: Date.now }
    }
  }],
  documents: [documentSchema],
  notes: [{
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  }]
});

const editHistorySchema = new mongoose.Schema({
  editedAt: { type: Date, default: Date.now },
  editorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const taxFormSchema = new mongoose.Schema({
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
  // Optional finer granularity under service (e.g., GST, ITR). Defaults to service for backward compatibility
  subService: { type: String, default: function () { return this.service; } },
  year: { 
    type: String, 
    required: function() { 
      // Only require year for tax-related services
      return this.service && (this.service.toLowerCase().includes('tax') || 
                             this.service.toLowerCase().includes('itr') || 
                             this.service.toLowerCase().includes('gst'));
    }, 
    default: function() {
      // Provide current year as default for non-tax services
      return this.service && (this.service.toLowerCase().includes('tax') || 
                             this.service.toLowerCase().includes('itr') || 
                             this.service.toLowerCase().includes('gst')) 
        ? new Date().getFullYear().toString() 
        : undefined;
    } 
  },
  
  // Business Information (for all service types)
  businessName: { type: String },
  businessType: { type: String },
  businessAddress: { type: String },
  city: { type: String },
  state: { type: String },
  pincode: { type: String },
  
  // Company Formation specific fields
  companyName: { type: String },
  proposedNames: [{ type: String }],
  authorizedCapital: { type: String },
  paidUpCapital: { type: String },
  businessActivity: { type: String },
  numberOfDirectors: { type: String },
  numberOfShareholders: { type: String },
  
  // Registration specific fields
  registrationType: { type: String },
  industryType: { type: String },
  employeeCount: { type: String },
  annualTurnover: { type: String },
  
  // Advisory specific fields
  consultationType: { type: String },
  projectDuration: { type: String },
  budgetRange: { type: String },
  
  // Additional fields
  additionalRequirements: { type: String },
  preferredContactTime: { type: String },
  urgency: { type: String, default: 'Medium' },
  
  // Tax-specific fields (for backward compatibility)
  hasIncomeTaxLogin: { type: Boolean, default: false },
  incomeTaxLoginId: { type: String },
  incomeTaxLoginPassword: { type: String },
  hasHomeLoan: { type: Boolean, default: false },
  homeLoanSanctionDate: { type: String },
  homeLoanAmount: { type: String },
  homeLoanCurrentDue: { type: String },
  homeLoanTotalInterest: { type: String },
  hasPranNumber: { type: Boolean, default: false },
  pranNumber: { type: String },
  
  // GST Filing specific fields
  gstFilingType: { type: String, enum: ['monthly', 'quarterly'] }, // Monthly or Quarterly filing
  gstFilingMonth: { type: String }, // Month for GST filing (for monthly)
  gstFilingQuarter: { type: String }, // Quarter for GST filing (for quarterly: Q1, Q2, Q3, Q4)
  gstFilingYear: { type: String }, // Year for GST filing
  gstNumber: { type: String },
  selectedMonths: [{ type: String }], // Selected months for quarterly filing
  salesData: { type: String }, // Tally data for sales
  purchaseData: { type: String }, // Tally data for purchases
  bankStatement: { type: String }, // Bank statement data
  
  // TDS Return specific fields
  tdsFilingMonth: { type: String }, // Month for TDS filing
  tdsFilingYear: { type: String }, // Year for TDS filing
  tracesUserId: { type: String }, // TRACES User ID
  tracesPassword: { type: String }, // TRACES Password (text format for admin visibility)
  tanNumber: { type: String }, // TAN number
  incomeTaxUserId: { type: String }, // Income Tax (TAN Base) User ID
  incomeTaxPassword: { type: String }, // Income Tax (TAN Base) Password (text format for admin visibility)
  panNumber: { type: String }, // PAN number for TDS (legacy)
  incomeTaxPanNumber: { type: String }, // Income Tax (PAN No.) - separate PAN field for TDS
  
  // EPFO specific fields
  epfoUserId: { type: String }, // EPFO User ID
  epfoPassword: { type: String }, // EPFO Password (text format for admin visibility)
  wagesReport: { type: String }, // Wages report data
  salarySheet: { type: String }, // Salary sheet data
  
  // ESIC specific fields
  esicUserId: { type: String }, // ESIC User ID
  esicPassword: { type: String }, // ESIC Password (text format for admin visibility)
  esicWagesReport: { type: String }, // ESIC wages report data
  esicSalarySheet: { type: String }, // ESIC salary sheet data
  
  // PT-Tax specific fields
  ptTaxUserId: { type: String }, // PT-Tax User ID
  ptTaxPassword: { type: String }, // PT-Tax Password (text format for admin visibility)
  ptTaxWagesReport: { type: String }, // PT-Tax wages report data
  ptTaxSalarySheet: { type: String }, // PT-Tax salary sheet data
  
  documents: [documentSchema],
  // Admin-specific data section
  adminData: { type: adminDataSchema, default: () => ({}) },
  // Align with admin status values
  status: { type: String, enum: ["Pending", "Reviewed", "Filed"], default: "Pending" },
  reports: [reportSchema],
  editHistory: [editHistorySchema],
}, { timestamps: true });

// Enforce one submission per user+subService+year combination
// Using sparse index to handle cases where year might be null/undefined
taxFormSchema.index({ user: 1, subService: 1, year: 1 }, { 
  unique: true,
  sparse: true
});

module.exports = mongoose.model("TaxForm", taxFormSchema);

