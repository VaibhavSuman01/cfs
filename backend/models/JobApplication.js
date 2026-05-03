const mongoose = require("mongoose");

const EmailLogSchema = new mongoose.Schema(
  {
    subject: { type: String, required: true, trim: true, maxlength: 300 },
    message: { type: String, required: true, trim: true, maxlength: 20000 },
    sentAt: { type: Date, required: true, default: Date.now },
    sentBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { _id: false }
);

const AdminNoteSchema = new mongoose.Schema(
  {
    note: { type: String, required: true, trim: true, maxlength: 5000 },
    addedAt: { type: Date, required: true, default: Date.now },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { _id: false }
);

const ResumeSchema = new mongoose.Schema(
  {
    storage: { type: String, enum: ["mongo"], default: "mongo" },
    originalName: { type: String, trim: true, maxlength: 255 },
    fileName: { type: String, trim: true, maxlength: 255 },
    contentType: { type: String, trim: true, maxlength: 120 },
    size: { type: Number, min: 0 },
    fileData: { type: Buffer }, // MVP: store binary in Mongo
  },
  { _id: false }
);

const JobApplicationSchema = new mongoose.Schema(
  {
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "JobPosting", required: true, index: true },
    fullName: { type: String, required: true, trim: true, maxlength: 200 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254, index: true },
    phone: { type: String, trim: true, maxlength: 30 },
    linkedIn: { type: String, trim: true, maxlength: 500 },
    portfolio: { type: String, trim: true, maxlength: 500 },
    coverLetter: { type: String, trim: true, maxlength: 20000 },
    resume: { type: ResumeSchema, required: true },
    status: {
      type: String,
      enum: ["Applied", "InReview", "Shortlisted", "Rejected", "Hired"],
      default: "Applied",
      index: true,
    },
    adminNotes: { type: [AdminNoteSchema], default: [] },
    emailLog: { type: [EmailLogSchema], default: [] },
  },
  { timestamps: true }
);

JobApplicationSchema.index({ jobId: 1, createdAt: -1 });
JobApplicationSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model("JobApplication", JobApplicationSchema);

