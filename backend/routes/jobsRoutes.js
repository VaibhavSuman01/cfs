const express = require("express");
const rateLimit = require("express-rate-limit");
const mongoose = require("mongoose");
const router = express.Router();

const JobPosting = require("../models/JobPosting");
const JobApplication = require("../models/JobApplication");
const resumeUpload = require("../middleware/resumeUpload");
const { isValidObjectId } = require("../utils/validation");
const { getFileData, cleanupTempFiles } = require("../utils/fileHandler");
const sendEmail = require("../utils/email");
const emailTemplates = require("../utils/emailTemplates");

const applyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: {
    success: false,
    message: "Too many applications from this IP. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const normalizeString = (value, { max = 200, lower = false } = {}) => {
  if (typeof value !== "string") return "";
  const trimmed = value.trim();
  const cut = trimmed.length > max ? trimmed.slice(0, max) : trimmed;
  return lower ? cut.toLowerCase() : cut;
};

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || "");

const isValidUrlOrEmpty = (value) => {
  if (!value) return true;
  try {
    // eslint-disable-next-line no-new
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

// @route   GET /api/jobs
// @desc    List published jobs (public)
// @access  Public
router.get("/", async (req, res) => {
  try {
    const {
      department,
      location,
      employmentType,
      experienceLevel,
      sort = "publishedAt",
      order = "desc",
    } = req.query;

    const now = new Date();
    const filter = {
      isPublished: true,
      isArchived: { $ne: true },
      publishedAt: { $lte: now },
      $or: [{ closingDate: { $exists: false } }, { closingDate: null }, { closingDate: { $gte: now } }],
    };

    if (department) filter.department = normalizeString(department, { max: 120 });
    if (location) filter.location = normalizeString(location, { max: 120 });
    if (employmentType) filter.employmentType = normalizeString(employmentType, { max: 80 });
    if (experienceLevel) filter.experienceLevel = normalizeString(experienceLevel, { max: 80 });

    const sortFieldWhitelist = new Set(["publishedAt", "closingDate", "title", "createdAt"]);
    const sortField = sortFieldWhitelist.has(sort) ? sort : "publishedAt";
    const sortDir = order === "asc" ? 1 : -1;

    const jobs = await JobPosting.find(filter)
      .select(
        "title slug department location employmentType experienceLevel publishedAt closingDate createdAt updatedAt"
      )
      .sort({ [sortField]: sortDir });

    return res.json({ success: true, jobs });
  } catch (error) {
    console.error("Public jobs list error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// @route   GET /api/jobs/:slug
// @desc    Get published job detail (public)
// @access  Public
router.get("/:slug", async (req, res) => {
  try {
    const slug = normalizeString(req.params.slug, { max: 200, lower: true });
    const now = new Date();

    const job = await JobPosting.findOne({
      slug,
      isPublished: true,
      isArchived: { $ne: true },
      publishedAt: { $lte: now },
      $or: [{ closingDate: { $exists: false } }, { closingDate: null }, { closingDate: { $gte: now } }],
    }).select(
      "title slug department location employmentType experienceLevel description requirements benefits publishedAt closingDate createdAt updatedAt"
    );

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    return res.json({ success: true, job });
  } catch (error) {
    console.error("Public job detail error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// @route   POST /api/jobs/:jobId/apply
// @desc    Apply to a job (public)
// @access  Public
router.post(
  "/:jobId/apply",
  applyLimiter,
  resumeUpload.single("resume"),
  resumeUpload.handleMulterError,
  async (req, res) => {
    const cleanup = () => {
      if (req.file) cleanupTempFiles([req.file]);
    };

    try {
      const jobId = req.params.jobId;
      if (!isValidObjectId(jobId)) {
        cleanup();
        return res.status(400).json({ success: false, message: "Invalid job ID format" });
      }

      const job = await JobPosting.findOne({
        _id: new mongoose.Types.ObjectId(jobId),
        isPublished: true,
        isArchived: { $ne: true },
      }).select("title slug isPublished publishedAt closingDate");

      if (!job) {
        cleanup();
        return res.status(404).json({ success: false, message: "Job not found" });
      }

      const now = new Date();
      if (!job.isPublished || (job.publishedAt && job.publishedAt > now) || (job.closingDate && job.closingDate < now)) {
        cleanup();
        return res.status(400).json({ success: false, message: "Job is not accepting applications" });
      }

      const fullName = normalizeString(req.body.fullName, { max: 200 });
      const email = normalizeString(req.body.email, { max: 254, lower: true });
      const phone = normalizeString(req.body.phone, { max: 30 });
      const linkedIn = normalizeString(req.body.linkedIn, { max: 500 });
      const portfolio = normalizeString(req.body.portfolio, { max: 500 });
      const coverLetter = normalizeString(req.body.coverLetter, { max: 20000 });

      if (!fullName) {
        cleanup();
        return res.status(400).json({ success: false, message: "Full name is required" });
      }
      if (!email || !isValidEmail(email)) {
        cleanup();
        return res.status(400).json({ success: false, message: "Valid email is required" });
      }
      if (linkedIn && !isValidUrlOrEmpty(linkedIn)) {
        cleanup();
        return res.status(400).json({ success: false, message: "Invalid LinkedIn URL" });
      }
      if (portfolio && !isValidUrlOrEmpty(portfolio)) {
        cleanup();
        return res.status(400).json({ success: false, message: "Invalid portfolio URL" });
      }

      const resumeMeta = req.file
        ? {
            storage: "mongo",
            originalName: normalizeString(req.file.originalname, { max: 255 }),
            fileName: normalizeString(req.file.filename || req.file.originalname, { max: 255 }),
            contentType: normalizeString(req.file.mimetype, { max: 120 }),
            size: req.file.size,
            fileData: getFileData(req.file),
          }
        : undefined;

      const application = await JobApplication.create({
        jobId: job._id,
        fullName,
        email,
        phone: phone || undefined,
        linkedIn: linkedIn || undefined,
        portfolio: portfolio || undefined,
        coverLetter: coverLetter || undefined,
        ...(resumeMeta ? { resume: resumeMeta } : {}),
      });

      // Optional: applicant confirmation email. Failures must not block application.
      try {
        const jobUrlBase = process.env.FRONTEND_URL || process.env.NEXT_PUBLIC_SITE_URL;
        const jobUrl =
          jobUrlBase && job.slug ? `${String(jobUrlBase).replace(/\/$/, "")}/careers/${job.slug}` : undefined;
        const tpl = emailTemplates.jobApplicationConfirmation(fullName, job.title, jobUrl);
        await sendEmail({ email, subject: tpl.subject, html: tpl.html, text: tpl.text });
      } catch (emailError) {
        // Intentionally do not expose details to the client
        console.error("Job application confirmation email failed:", emailError?.message || emailError);
      }

      cleanup();
      return res.status(201).json({
        success: true,
        message: "Application submitted successfully",
        applicationId: application._id,
      });
    } catch (error) {
      cleanup();
      console.error("Job apply error:", error);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }
);

module.exports = router;

