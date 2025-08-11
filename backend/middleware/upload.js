const multer = require("multer");
const path = require("path");

// Use memory storage instead of disk storage
const storage = multer.memoryStorage();

console.log("Using memory storage for file uploads");

// File filter function
const fileFilter = (req, file, cb) => {
  // Define allowed file extensions
  const allowedExtensions = ['.csv', '.xlsx', '.xls', '.pdf', '.jpg', '.jpeg', '.png', '.zip'];
  const ext = path.extname(file.originalname).toLowerCase();
  console.log(`Checking file: ${file.originalname}, extension: ${ext}`);

  if (allowedExtensions.includes(ext)) {
    console.log(`File accepted: ${file.originalname}`);
    cb(null, true);
  } else {
    console.log(`File rejected: ${file.originalname}. Invalid type.`);
    cb(new Error('Invalid file type. Only Excel, PDF, JPG, PNG, and ZIP files are allowed.'), false);
  }
};

// Create multer upload instance
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max file size to match frontend
  },
});

// Add error handling middleware
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    console.error("Multer error:", err);
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        message: "File too large. Maximum size is 50MB.",
      });
    }
    return res.status(400).json({
      message: `Upload error: ${err.message}`,
    });
  } else if (err) {
    console.error("Upload error:", err);
    return res.status(400).json({
      message: err.message,
    });
  }
  next();
};

module.exports = upload;
module.exports.handleMulterError = handleMulterError;
