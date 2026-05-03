const mongoose = require("mongoose");

const JobPostingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, required: true, trim: true, lowercase: true, unique: true, index: true },
    department: { type: String, trim: true, maxlength: 120 },
    location: { type: String, trim: true, maxlength: 120 },
    employmentType: { type: String, trim: true, maxlength: 80 },
    experienceLevel: { type: String, trim: true, maxlength: 80 },
    description: { type: String, trim: true, maxlength: 50000 }, // markdown / rich text stored as string
    requirements: [{ type: String, trim: true, maxlength: 500 }],
    benefits: [{ type: String, trim: true, maxlength: 500 }],
    isPublished: { type: Boolean, default: false, index: true },
    publishedAt: { type: Date, index: true },
    closingDate: { type: Date },
    isArchived: { type: Boolean, default: false, index: true },
    archivedAt: { type: Date },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

JobPostingSchema.index({ isPublished: 1, publishedAt: -1 });

module.exports = mongoose.model("JobPosting", JobPostingSchema);

