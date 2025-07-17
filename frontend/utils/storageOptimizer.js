/**
 * Storage Optimizer Utility
 * 
 * This utility provides functions to analyze and optimize objects before storing them in localStorage.
 * It helps identify large properties, compress data, and provide recommendations for storage optimization.
 */

/**
 * Analyzes an object to identify large properties that might cause storage issues
 * @param {Object} obj - The object to analyze
 * @param {Object} options - Analysis options
 * @param {number} options.warnSizeKB - Size in KB to trigger warnings (default: 50KB)
 * @param {number} options.maxDepth - Maximum recursion depth (default: 3)
 * @returns {Object} Analysis results with size information and recommendations
 */
export const analyzeObjectSize = (obj, options = {}) => {
  const { warnSizeKB = 50, maxDepth = 3 } = options;
  const warnSize = warnSizeKB * 1024;
  
  // Convert to JSON to get actual storage size
  const jsonString = JSON.stringify(obj);
  const totalSize = new TextEncoder().encode(jsonString).length;
  
  // Initialize results
  const result = {
    totalSize,
    totalSizeKB: Math.round(totalSize / 1024 * 10) / 10,
    isLarge: totalSize > warnSize,
    largeProperties: [],
    recommendations: []
  };
  
  // If object is small, no need for detailed analysis
  if (!result.isLarge) {
    return result;
  }
  
  // Add recommendation based on size
  if (totalSize > 1024 * 1024) { // > 1MB
    result.recommendations.push('Object is extremely large (>1MB). Consider splitting into multiple smaller objects or storing only essential data.');
  } else if (totalSize > 500 * 1024) { // > 500KB
    result.recommendations.push('Object is very large (>500KB). Consider optimizing by removing unnecessary properties.');
  } else {
    result.recommendations.push('Object is moderately large. Review large properties identified below.');
  }
  
  // Analyze individual properties
  analyzeProperties(obj, '', result, 0, maxDepth, warnSize / 10);
  
  // Sort large properties by size (descending)
  result.largeProperties.sort((a, b) => b.size - a.size);
  
  // Add specific recommendations based on property analysis
  if (result.largeProperties.length > 0) {
    const topLargeProps = result.largeProperties.slice(0, 3);
    result.recommendations.push(
      `Focus on optimizing these large properties: ${topLargeProps.map(p => p.path).join(', ')}`
    );
  }
  
  // Check for arrays that might be truncated
  const largeArrays = result.largeProperties.filter(p => p.type === 'array' && p.length > 20);
  if (largeArrays.length > 0) {
    result.recommendations.push(
      `Consider limiting the length of large arrays: ${largeArrays.map(p => `${p.path} (${p.length} items)`).join(', ')}`
    );
  }
  
  return result;
};

/**
 * Recursively analyzes properties of an object to identify large ones
 * @private
 */
const analyzeProperties = (obj, path, result, depth, maxDepth, warnSize) => {
  // Stop if we've reached max depth
  if (depth > maxDepth) return;
  
  // Handle different types
  if (Array.isArray(obj)) {
    // Analyze array as a whole
    const jsonString = JSON.stringify(obj);
    const size = new TextEncoder().encode(jsonString).length;
    
    if (size > warnSize) {
      result.largeProperties.push({
        path,
        type: 'array',
        length: obj.length,
        size,
        sizeKB: Math.round(size / 1024 * 10) / 10
      });
    }
    
    // Only analyze individual items if not too deep
    if (depth < maxDepth - 1) {
      // Analyze a sample of array items if array is large
      const sampleSize = Math.min(5, obj.length);
      for (let i = 0; i < sampleSize; i++) {
        analyzeProperties(obj[i], `${path}[${i}]`, result, depth + 1, maxDepth, warnSize);
      }
    }
  } 
  else if (obj !== null && typeof obj === 'object') {
    // Analyze each property of the object
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = obj[key];
        const newPath = path ? `${path}.${key}` : key;
        
        // For objects and arrays, recurse
        if (typeof value === 'object' && value !== null) {
          analyzeProperties(value, newPath, result, depth + 1, maxDepth, warnSize);
        } 
        // For strings, check size directly
        else if (typeof value === 'string') {
          const size = new TextEncoder().encode(value).length;
          if (size > warnSize) {
            result.largeProperties.push({
              path: newPath,
              type: 'string',
              length: value.length,
              size,
              sizeKB: Math.round(size / 1024 * 10) / 10
            });
          }
        }
      }
    }
  }
};

/**
 * Optimizes an object for storage by applying various strategies to reduce its size
 * @param {Object} obj - The object to optimize
 * @param {Object} options - Optimization options
 * @param {boolean} options.truncateArrays - Whether to truncate large arrays (default: true)
 * @param {number} options.maxArrayLength - Maximum array length to keep (default: 20)
 * @param {boolean} options.truncateStrings - Whether to truncate large strings (default: true)
 * @param {number} options.maxStringLength - Maximum string length to keep (default: 1000)
 * @returns {Object} The optimized object
 */
export const optimizeForStorage = (obj, options = {}) => {
  const { 
    truncateArrays = true, 
    maxArrayLength = 20,
    truncateStrings = true,
    maxStringLength = 1000
  } = options;
  
  // First analyze the object to get size information
  const analysis = analyzeObjectSize(obj);
  
  // If object is not large, return it as is
  if (!analysis.isLarge) {
    return { 
      optimized: obj,
      sizeReduction: 0,
      originalSize: analysis.totalSize,
      optimizedSize: analysis.totalSize,
      unchanged: true
    };
  }
  
  // Apply optimization strategies
  const optimized = optimizeObject(obj, options);
  
  // Calculate new size
  const optimizedSize = new TextEncoder().encode(JSON.stringify(optimized)).length;
  
  return {
    optimized,
    sizeReduction: analysis.totalSize - optimizedSize,
    sizeReductionPercent: Math.round((analysis.totalSize - optimizedSize) / analysis.totalSize * 100),
    originalSize: analysis.totalSize,
    originalSizeKB: analysis.totalSizeKB,
    optimizedSize,
    optimizedSizeKB: Math.round(optimizedSize / 1024 * 10) / 10,
    unchanged: false
  };
};

/**
 * Recursively optimizes an object or array
 * @private
 */
const optimizeObject = (obj, options) => {
  const { 
    truncateArrays, 
    maxArrayLength,
    truncateStrings,
    maxStringLength
  } = options;
  
  // Handle arrays
  if (Array.isArray(obj)) {
    // Truncate array if needed
    const arrayToProcess = truncateArrays && obj.length > maxArrayLength 
      ? obj.slice(0, maxArrayLength)
      : obj;
      
    // Process each item in the array
    return arrayToProcess.map(item => {
      if (item === null || typeof item !== 'object') {
        return optimizePrimitive(item, options);
      }
      return optimizeObject(item, options);
    });
  }
  
  // Handle objects
  if (obj !== null && typeof obj === 'object') {
    const result = {};
    
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = obj[key];
        
        if (value === null || typeof value !== 'object') {
          result[key] = optimizePrimitive(value, options);
        } else {
          result[key] = optimizeObject(value, options);
        }
      }
    }
    
    return result;
  }
  
  // Handle primitives
  return optimizePrimitive(obj, options);
};

/**
 * Optimizes a primitive value
 * @private
 */
const optimizePrimitive = (value, options) => {
  const { truncateStrings, maxStringLength } = options;
  
  // Truncate long strings
  if (truncateStrings && typeof value === 'string' && value.length > maxStringLength) {
    return value.substring(0, maxStringLength) + '... (truncated)';
  }
  
  return value;
};

/**
 * Provides recommendations for optimizing localStorage usage based on current content
 * @returns {Object} Recommendations and statistics
 */
export const analyzeLocalStorage = () => {
  const result = {
    totalItems: 0,
    totalSize: 0,
    largeItems: [],
    recommendations: [],
    categorySizes: {}
  };
  
  try {
    // Analyze all items in localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;
      
      const value = localStorage.getItem(key);
      const size = new TextEncoder().encode(value).length;
      
      // Update totals
      result.totalItems++;
      result.totalSize += size;
      
      // Categorize by prefix
      const category = key.split('_')[0] || 'other';
      if (!result.categorySizes[category]) {
        result.categorySizes[category] = {
          size: 0,
          count: 0,
          items: []
        };
      }
      
      result.categorySizes[category].size += size;
      result.categorySizes[category].count++;
      
      // Track large items
      if (size > 50 * 1024) { // > 50KB
        result.largeItems.push({
          key,
          size,
          sizeKB: Math.round(size / 1024 * 10) / 10
        });
      }
    }
    
    // Sort large items by size
    result.largeItems.sort((a, b) => b.size - a.size);
    
    // Calculate category percentages and sort
    const categories = Object.entries(result.categorySizes).map(([name, data]) => ({
      name,
      ...data,
      sizeKB: Math.round(data.size / 1024 * 10) / 10,
      percentage: Math.round(data.size / result.totalSize * 1000) / 10
    }));
    
    result.categories = categories.sort((a, b) => b.size - a.size);
    
    // Generate recommendations
    if (result.totalSize > 4 * 1024 * 1024) { // > 4MB
      result.recommendations.push('Total localStorage usage is very high (>4MB). Consider clearing old data.');
    }
    
    if (result.largeItems.length > 0) {
      result.recommendations.push(
        `Consider optimizing these large items: ${result.largeItems.slice(0, 3).map(i => `${i.key} (${i.sizeKB}KB)`).join(', ')}`
      );
    }
    
    // Find dominant categories
    const dominantCategories = categories.filter(c => c.percentage > 20);
    if (dominantCategories.length > 0) {
      result.recommendations.push(
        `These categories use significant storage: ${dominantCategories.map(c => `${c.name} (${c.percentage}%)`).join(', ')}`
      );
    }
    
  } catch (error) {
    console.error('Error analyzing localStorage:', error);
    result.error = error.message;
  }
  
  return result;
};