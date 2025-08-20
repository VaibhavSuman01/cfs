
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
  year: { type: String, required: true },
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

// Enforce one submission per user+subService+year
// Note: subService defaults to service to maintain compatibility with existing submissions
taxFormSchema.index({ user: 1, subService: 1, year: 1 }, { unique: true });

module.exports = mongoose.model("TaxForm", taxFormSchema);

