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

const partnershipFormSchema = new mongoose.Schema({
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
  
  // Partnership Firm Details
  businessName: { type: String, required: true },
  businessAddress: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  businessDetails: { type: String, required: true },
  
  // Partners Information
  partners: [{
    name: { type: String, required: true },
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
        message: 'Partner PAN must be in format AAAAA0000A'
      },
      set: function(v) {
        if (!v) return v;
        return v.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
      }
    },
    aadhaar: { 
      type: String, 
      required: true,
      validate: {
        validator: function(v) {
          return /^\d{12}$/.test(v);
        },
        message: 'Partner Aadhaar must be exactly 12 digits'
      },
      set: function(v) {
        if (!v) return v;
        return v.replace(/\D/g, '');
      }
    },
    address: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  }],
  
  // Partnership Deed Details
  partnershipDeedDate: { type: String },
  partnershipDeedNotarized: { type: Boolean, default: false },
  partnershipDeedStampDuty: { type: String },
  
  // Business Address Proof Details
  addressProofType: { type: String, enum: ["rent", "owned"], required: true },
  ownerName: { type: String },
  ownerPan: { 
    type: String,
    uppercase: true,
    validate: {
      validator: function(v) {
        if (!v) return true; // Allow empty if not rented
        return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(v);
      },
      message: 'Owner PAN must be in format AAAAA0000A'
    },
    set: function(v) {
      if (!v) return v;
      return v.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    }
  },
  ownerAadhaar: { 
    type: String,
    validate: {
      validator: function(v) {
        if (!v) return true; // Allow empty if not rented
        return /^\d{12}$/.test(v);
      },
      message: 'Owner Aadhaar must be exactly 12 digits'
    },
    set: function(v) {
      if (!v) return v;
      return v.replace(/\D/g, '');
    }
  },
  
  // Additional Requirements
  requiresGstRegistration: { type: Boolean, default: false },
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
partnershipFormSchema.index({ user: 1, subService: 1 }, { unique: true });

module.exports = mongoose.model("PartnershipForm", partnershipFormSchema);
