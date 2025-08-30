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

const companyFormSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  pan: { type: String, required: true, uppercase: true },
  service: { type: String, required: true },
  subService: { type: String, default: function () { return this.service; } },
  
  // Company Details
  companyName: { type: String, required: true },
  businessActivity: { type: String, required: true },
  proposedCapital: { type: String, required: true },
  registeredOfficeAddress: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  
  // Director Information
  directors: [{
    name: { type: String, required: true },
    pan: { type: String, required: false }, // Made optional for new directors
    aadhaar: { type: String, required: false }, // Made optional for new directors
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    nationality: { type: String, default: 'Indian' },
    isResident: { type: Boolean, default: true },
    din: { type: String },
  }],
  
  // Additional Requirements
  hasDigitalSignature: { type: Boolean, default: false },
  hasBankAccount: { type: Boolean, default: false },
  requiresGstRegistration: { type: Boolean, default: false },
  requiresCompliance: { type: Boolean, default: false },
  
  // Package Selection
  selectedPackage: { type: String, enum: ["Basic", "Standard", "Premium"], default: "Basic" },
  
  documents: [documentSchema],
  status: { type: String, enum: ["Pending", "Reviewed", "Filed"], default: "Pending" },
  reports: [reportSchema],
  editHistory: [editHistorySchema],
}, { timestamps: true });

// Enforce one submission per user+subService
companyFormSchema.index({ user: 1, subService: 1 }, { unique: true });

module.exports = mongoose.model("CompanyForm", companyFormSchema);
