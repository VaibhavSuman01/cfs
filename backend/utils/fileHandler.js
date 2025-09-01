const fs = require('fs');
const path = require('path');

/**
 * Read file data from disk storage
 * @param {Object} file - Multer file object
 * @returns {Buffer} - File data as buffer
 */
function getFileData(file) {
  if (file.buffer) {
    // Memory storage - return buffer directly
    return file.buffer;
  } else if (file.path) {
    // Disk storage - read file from disk
    return fs.readFileSync(file.path);
  } else {
    throw new Error('Invalid file object - no buffer or path found');
  }
}

/**
 * Clean up temporary files after processing
 * @param {Array} files - Array of multer file objects
 */
function cleanupTempFiles(files) {
  if (!files || !Array.isArray(files)) return;
  
  files.forEach(file => {
    if (file.path && fs.existsSync(file.path)) {
      try {
        fs.unlinkSync(file.path);
        console.log(`Cleaned up temp file: ${file.path}`);
      } catch (error) {
        console.error(`Error cleaning up temp file ${file.path}:`, error);
      }
    }
  });
}

/**
 * Get file extension from filename
 * @param {string} filename - Original filename
 * @returns {string} - File extension
 */
function getFileExtension(filename) {
  return path.extname(filename).toLowerCase();
}

/**
 * Generate unique filename
 * @param {string} originalName - Original filename
 * @returns {string} - Unique filename
 */
function generateUniqueFilename(originalName) {
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
  const ext = path.extname(originalName);
  return uniqueSuffix + ext;
}

module.exports = {
  getFileData,
  cleanupTempFiles,
  getFileExtension,
  generateUniqueFilename
};