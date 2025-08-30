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

const reportsFormSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  pan: { type: String, required: true, uppercase: true },
  service: { type: String, required: true },
  subService: { type: String, default: function () { return this.service; } },
  
  // Business Details
  businessName: { type: String, required: true },
  businessType: { type: String, required: true },
  businessAddress: { type: String, required: true },
  
  // Report Details
  reportPeriod: { type: String, required: true },
  reportPurpose: { type: String, required: true },
  
  // Financial Metrics
  annualTurnover: { type: String },
  netProfit: { type: String },
  totalAssets: { type: String },
  totalLiabilities: { type: String },
  
  // Service-specific fields
  bankName: { type: String },
  accountNumber: { type: String },
  reconciliationPeriod: { type: String },
  loanAmount: { type: String },
  loanPurpose: { type: String },
  projectCost: { type: String },
  debtServiceObligations: { type: String },
  netOperatingIncome: { type: String },
  
  // Additional Requirements
  requiresAudit: { type: Boolean, default: false },
  requiresExpertAnalysis: { type: Boolean, default: false },
  requiresComplianceCheck: { type: Boolean, default: false },
  
  // Package Selection
  selectedPackage: { type: String, enum: ["Basic", "Standard", "Premium"], default: "Basic" },
  
  documents: [documentSchema],
  status: { type: String, enum: ["Pending", "Reviewed", "Filed"], default: "Pending" },
  reports: [reportSchema],
  editHistory: [editHistorySchema],
}, { timestamps: true });

// Enforce one submission per user+subService+reportPeriod
reportsFormSchema.index({ user: 1, subService: 1, reportPeriod: 1 }, { unique: true });

module.exports = mongoose.model("ReportsForm", reportsFormSchema);
