/**
 * Utility functions for managing browser storage
 */

/**
 * Gets the current usage of localStorage in bytes
 * @returns {number} The approximate size in bytes
 */
export const getLocalStorageUsage = () => {
  let total = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const value = localStorage.getItem(key);
    total += (key.length + value.length) * 2; // UTF-16 uses 2 bytes per character
  }
  return total;
};

/**
 * Gets the maximum localStorage quota (approximate)
 * @returns {number} The approximate quota in bytes
 */
export const getLocalStorageQuota = () => {
  // Most browsers have a limit of 5-10MB
  // This is an approximation as there's no standard API to get the exact quota
  return 5 * 1024 * 1024; // 5MB as a safe default
};

/**
 * Checks if localStorage is near its quota limit
 * @param {number} thresholdPercentage - Percentage threshold (0-100)
 * @returns {boolean} True if usage is above the threshold
 */
export const isStorageNearQuota = (thresholdPercentage = 80) => {
  const usage = getLocalStorageUsage();
  const quota = getLocalStorageQuota();
  return (usage / quota) * 100 >= thresholdPercentage;
};

/**
 * Clears the oldest items from localStorage to free up space
 * @param {number} percentToClear - Percentage of items to clear (1-100)
 * @param {string} prefix - Optional prefix to filter which items to clear
 * @returns {number} Number of items cleared
 */
export const clearOldestItems = (percentToClear = 20, prefix = '') => {
  try {
    // Get all keys that match the prefix
    const allKeys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!prefix || (key && key.startsWith(prefix))) {
        allKeys.push(key);
      }
    }
    
    if (allKeys.length === 0) return 0;
    
    // Sort items by timestamp if they have one
    const sortedItems = allKeys
      .map(key => {
        try {
          const value = localStorage.getItem(key);
          let timestamp = 0;
          
          // Try to parse JSON and extract timestamp
          try {
            const parsed = JSON.parse(value);
            timestamp = parsed.timestamp || 0;
          } catch (e) {
            // Not JSON or no timestamp
          }
          
          return { key, timestamp };
        } catch (e) {
          return { key, timestamp: 0 };
        }
      })
      .sort((a, b) => a.timestamp - b.timestamp); // Oldest first
    
    // Calculate how many items to remove
    const removeCount = Math.max(1, Math.floor(sortedItems.length * (percentToClear / 100)));
    
    // Remove the oldest items
    for (let i = 0; i < removeCount; i++) {
      if (i < sortedItems.length) {
        localStorage.removeItem(sortedItems[i].key);
      }
    }
    
    return removeCount;
  } catch (error) {
    console.error('Error clearing oldest items:', error);
    return 0;
  }
};

/**
 * Safely stores an item in localStorage with quota management
 * @param {string} key - The key to store
 * @param {string} value - The value to store
 * @param {string} prefix - Optional prefix for clearing related items if quota is exceeded
 * @returns {boolean} True if storage was successful
 */
/**
 * Safely stores an item in localStorage with quota management and size checking
 * @param {string} key - The key to store
 * @param {string} value - The value to store
 * @param {string} prefix - Optional prefix for clearing related items if quota is exceeded
 * @param {Object} options - Additional options
 * @param {number} options.maxSizeKB - Maximum size in KB to allow (default: 500KB)
 * @param {boolean} options.compress - Whether to compress large values (default: true)
 * @returns {boolean} True if storage was successful
 */
export const safelyStoreItem = (key, value, prefix = '', options = {}) => {
  // Default options
  const { maxSizeKB = 500, compress = true } = options;
  const maxSize = maxSizeKB * 1024; // Convert to bytes
  
  try {
    // Check value size
    const valueSize = new TextEncoder().encode(value).length;
    
    // If value is too large, try to handle it
    if (valueSize > maxSize) {
      console.warn(`Large item detected (${Math.round(valueSize/1024)}KB): ${key}`);
      
      // For very large items, we might need to split or compress
      if (compress) {
        try {
          // For large objects, try to remove unnecessary data before storing
          // This is a simple approach - parse the JSON, remove any large arrays or nested objects
          // that might not be critical, then stringify again
          let parsedValue;
          try {
            parsedValue = JSON.parse(value);
          } catch (e) {
            // Not JSON, can't optimize
            console.warn('Large value is not JSON, cannot optimize');
            return false;
          }
          
          // Create a simplified version for storage
          // This is a generic approach - for specific data structures, you might
          // want to implement custom logic
          const simplifiedValue = simplifyLargeObject(parsedValue);
          
          // Try to store the simplified version
          const simplifiedJson = JSON.stringify(simplifiedValue);
          const newSize = new TextEncoder().encode(simplifiedJson).length;
          
          if (newSize <= maxSize) {
            localStorage.setItem(key, simplifiedJson);
            console.info(`Stored simplified version of ${key} (${Math.round(newSize/1024)}KB)`);
            return true;
          } else {
            console.warn(`Even simplified version is too large: ${Math.round(newSize/1024)}KB`);
            return false;
          }
        } catch (optimizeError) {
          console.error('Error optimizing large value:', optimizeError);
          return false;
        }
      } else {
        console.warn('Value too large and compression disabled');
        return false;
      }
    }
    
    // For normal sized values, try to store directly
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      // Handle quota exceeded error
      if (error instanceof DOMException && 
          (error.name === 'QuotaExceededError' || 
           error.name === 'NS_ERROR_DOM_QUOTA_REACHED')) {
        
        // Aggressively clear space
        let cleared = clearOldestItems(20, prefix);
        
        // If first clearing didn't free enough space, try more aggressive clearing
        if (cleared > 0) {
          try {
            localStorage.setItem(key, value);
            return true;
          } catch (retryError) {
            // If still failing, clear even more aggressively
            cleared = clearOldestItems(50, prefix);
            
            if (cleared > 0) {
              try {
                localStorage.setItem(key, value);
                return true;
              } catch (finalError) {
                console.error('Failed to store item after aggressive clearing:', finalError);
                // As a last resort, clear ALL items with this prefix
                clearAllItemsWithPrefix(prefix);
                try {
                  localStorage.setItem(key, value);
                  return true;
                } catch (lastError) {
                  console.error('All attempts to store item failed:', lastError);
                  return false;
                }
              }
            }
          }
        }
      }
      
      console.error('Error storing item in localStorage:', error);
      return false;
    }
  } catch (error) {
    console.error('Error in safelyStoreItem:', error);
    return false;
  }
};

// Import the storage optimizer utilities
import { optimizeForStorage } from './storageOptimizer';

/**
 * Simplifies a large object by removing or truncating non-essential data
 * Uses the optimizeForStorage utility for more advanced optimization
 * @param {Object} obj - The object to simplify
 * @param {Object} options - Optimization options
 * @returns {Object} A simplified version of the object
 */
const simplifyLargeObject = (obj, options = {}) => {
  // Use the optimizeForStorage utility with default options
  const defaultOptions = {
    truncateArrays: true,
    maxArrayLength: 10,
    truncateStrings: true,
    maxStringLength: 1000
  };
  
  // Merge with any provided options
  const mergedOptions = { ...defaultOptions, ...options };
  
  try {
    // Use the storage optimizer utility
    const result = optimizeForStorage(obj, mergedOptions);
    
    // Log optimization results if significant
    if (result.sizeReductionPercent > 20) {
      console.info(
        `Storage optimization: Reduced object size by ${result.sizeReductionPercent}% ` +
        `(${result.originalSizeKB}KB → ${result.optimizedSizeKB}KB)`
      );
    }
    
    return result.optimized;
  } catch (error) {
    console.error('Error optimizing object:', error);
    
    // Fallback to basic optimization if the utility fails
    return basicSimplifyObject(obj, mergedOptions);
  }
};

/**
 * Basic object simplification as a fallback
 * @private
 */
const basicSimplifyObject = (obj, options) => {
  const { maxArrayLength, maxStringLength } = options;
  
  // For arrays, limit the number of items
  if (Array.isArray(obj)) {
    // Keep only first N items for large arrays
    if (obj.length > maxArrayLength) {
      return obj.slice(0, maxArrayLength).map(item => {
        if (typeof item === 'object' && item !== null) {
          return basicSimplifyObject(item, options);
        }
        return item;
      });
    }
    
    // For smaller arrays, process each item
    return obj.map(item => {
      if (typeof item === 'object' && item !== null) {
        return basicSimplifyObject(item, options);
      }
      return item;
    });
  }
  
  // For objects, process recursively
  if (typeof obj === 'object' && obj !== null) {
    const result = {};
    
    // Process each property
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = obj[key];
        
        // Skip very large string values
        if (typeof value === 'string' && value.length > maxStringLength) {
          result[key] = value.substring(0, maxStringLength) + '... (truncated)';
        }
        // Process nested objects/arrays
        else if (typeof value === 'object' && value !== null) {
          result[key] = basicSimplifyObject(value, options);
        }
        // Keep primitive values as is
        else {
          result[key] = value;
        }
      }
    }
    
    return result;
  }
  
  // Return primitive values as is
  return obj;
};

/**
 * Clears all items with a specific prefix
 * @param {string} prefix - The prefix to match
 * @returns {number} Number of items cleared
 */
export const clearAllItemsWithPrefix = (prefix) => {
  if (!prefix) return 0;
  
  let count = 0;
  const keysToRemove = [];
  
  // Collect all keys with the prefix
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(prefix)) {
      keysToRemove.push(key);
    }
  }
  
  // Remove all collected keys
  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
    count++;
  });
  
  return count;
};