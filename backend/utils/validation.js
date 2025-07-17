/**
 * Utility functions for validation
 */

/**
 * Validates if a string is a valid MongoDB ObjectId
 * @param {string} id - The ID to validate
 * @returns {boolean} - True if valid, false otherwise
 */
const isValidObjectId = (id) => {
  if (!id || typeof id !== 'string') {
    return false;
  }
  
  // MongoDB ObjectId is a 24-character hex string
  return /^[0-9a-fA-F]{24}$/.test(id);
};

/**
 * Middleware to validate ObjectId parameters
 * @param {string} paramName - The name of the parameter to validate (default: 'id')
 */
const validateObjectId = (paramName = 'id') => {
  return (req, res, next) => {
    const id = req.params[paramName];
    
    if (!isValidObjectId(id)) {
      return res.status(400).json({ 
        message: `Invalid ID format. ${paramName} must be a 24-character hex string.` 
      });
    }
    
    next();
  };
};

module.exports = {
  isValidObjectId,
  validateObjectId
};