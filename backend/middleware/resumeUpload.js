const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Keep consistent with existing upload.js disk/memory fallback
const uploadsDir = path.join(__dirname, "../uploads");
let canCreateUploadsDir = true;

try {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
} catch (error) {
  canCreateUploadsDir = false;
  console.warn(
    "Cannot create uploads directory (read-only filesystem). Switching to memory storage."
  );
}

const storage = canCreateUploadsDir
  ? multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, uploadsDir);
      },
      filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, "resume-" + uniqueSuffix + path.extname(file.originalname));
      },
    })
  : multer.memoryStorage();

const ALLOWED_EXTENSIONS = [".pdf", ".doc", ".docx"];
const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname || "").toLowerCase();
  const mime = (file.mimetype || "").toLowerCase();

  if (!ALLOWED_EXTENSIONS.includes(ext) || !ALLOWED_MIME_TYPES.includes(mime)) {
    return cb(
      new Error("Invalid resume file. Only PDF, DOC, and DOCX are allowed."),
      false
    );
  }

  return cb(null, true);
};

const resumeUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 1,
  },
});

const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "Resume too large. Maximum size is 10MB.",
      });
    }
    return res.status(400).json({
      success: false,
      message: `Upload error: ${err.message}`,
    });
  }

  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  next();
};

module.exports = resumeUpload;
module.exports.handleMulterError = handleMulterError;

