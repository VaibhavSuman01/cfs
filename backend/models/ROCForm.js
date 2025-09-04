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
  isCompletionDocument: { type: Boolean, default: false },
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

const rocFormSchema = new mongoose.Schema({
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
  
  // Company Details
  companyName: { type: String, required: true },
  cin: { type: String, required: true },
  companyType: { type: String, required: true },
  registeredOfficeAddress: { type: String, required: true },
  
  // Filing Details
  financialYear: { type: String, required: true },
  boardMeetingDate: { type: String },
  resolutionType: { type: String },
  directorName: { type: String },
  changeType: { type: String },
  lastFilingDate: { type: String },
  pendingCompliances: { type: String },
  
  // Additional Requirements
  requiresAudit: { type: Boolean, default: false },
  requiresDigitalSignature: { type: Boolean, default: false },
  requiresExpertConsultation: { type: Boolean, default: false },
  requiresComplianceSetup: { type: Boolean, default: false },
  
  // Package Selection
  selectedPackage: { type: String, enum: ["Basic", "Standard", "Premium"], default: "Basic" },
  
  // Admin Management
  remarks: { type: String },
  completionNotes: { type: String },
  
  // Documents
  documents: [documentSchema],
  completionDocuments: [documentSchema], // Documents uploaded by admin upon completion
  
  status: { type: String, enum: ["Pending", "Reviewed", "Filed"], default: "Pending" },
  reports: [reportSchema],
  editHistory: [editHistorySchema],
}, { timestamps: true });

// Enforce one submission per user+subService+financialYear
rocFormSchema.index({ user: 1, subService: 1, financialYear: 1 }, { unique: true });

module.exports = mongoose.model("ROCForm", rocFormSchema);
