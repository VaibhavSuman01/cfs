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

const trademarkISOFormSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  pan: { type: String, required: true, uppercase: true },
  service: { type: String, required: true }, // e.g., "Trademark Registration", "ISO 9001", "Copyright Registration"
  subService: { type: String, default: function () { return this.service; } },
  
  // Business Details
  businessName: { type: String, required: true },
  businessType: { type: String, required: true }, // Proprietorship, Partnership, Company, LLP
  businessAddress: { type: String, required: true },
  
  // Trademark Specific Fields
  trademarkName: { type: String },
  trademarkClass: { type: String }, // International Classification of Goods and Services
  trademarkDescription: { type: String },
  firstUseDate: { type: String },
  
  // ISO Certification Specific Fields
  isoStandard: { type: String }, // ISO 9001, ISO 14001, ISO 27001, etc.
  scopeOfCertification: { type: String },
  numberOfEmployees: { type: String },
  industrySector: { type: String },
  
  // Copyright Specific Fields
  workTitle: { type: String },
  workType: { type: String }, // Literary, Artistic, Musical, Software, etc.
  creationDate: { type: String },
  authorName: { type: String },
  
  // Additional Requirements
  requiresSearch: { type: Boolean, default: false },
  requiresObjectionHandling: { type: Boolean, default: false },
  requiresRenewal: { type: Boolean, default: false },
  requiresCompliance: { type: Boolean, default: false },
  
  // Package Selection
  selectedPackage: { type: String, enum: ["Basic", "Standard", "Premium"], default: "Basic" },
  
  documents: [documentSchema],
  status: { type: String, enum: ["Pending", "Reviewed", "In Progress", "Completed"], default: "Pending" },
  reports: [reportSchema],
  editHistory: [editHistorySchema],
}, { timestamps: true });

// Enforce one submission per user+subService
trademarkISOFormSchema.index({ user: 1, subService: 1 }, { unique: true });

module.exports = mongoose.model("TrademarkISOForm", trademarkISOFormSchema);
