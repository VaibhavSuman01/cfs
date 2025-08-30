
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

const taxFormSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  pan: { type: String, required: true, uppercase: true },
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
  
  documents: [documentSchema],
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

