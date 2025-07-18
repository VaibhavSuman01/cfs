/**
 * Data transformation utilities
 * Handles transformations between backend and frontend data structures
 */

/**
 * Transforms tax form data from API response to frontend format
 * @param {Object} apiResponse - The raw API response
 * @returns {Object} Transformed data for frontend use
 */
export const transformTaxFormResponse = (apiResponse) => {
  if (!apiResponse) return null;

  return {
    ...apiResponse,
    // Ensure documents paths are correctly formatted
    documents:
      apiResponse.documents?.map((doc) => ({
        ...doc,
        path: doc.path?.startsWith("/") ? doc.path.substring(1) : doc.path,
      })) || [],
  };
};

/**
 * Transforms dashboard stats from API response to frontend format
 * with optimization for storage efficiency
 * @param {Object} apiResponse - The raw API response
 * @param {Object} options - Transformation options
 * @param {boolean} options.optimizeForStorage - Whether to optimize for storage (default: true)
 * @param {number} options.maxRecentForms - Maximum number of recent forms to include (default: 5)
 * @param {boolean} options.aggressiveOptimization - Whether to apply aggressive optimization (default: false)
 * @returns {Object} Transformed stats for dashboard display
 */
export const transformDashboardStats = (apiResponse, options = {}) => {
  if (!apiResponse) return {};
  
  const { 
    optimizeForStorage = true, 
    maxRecentForms = 5,
    aggressiveOptimization = false
  } = options;
  
  // Extract basic stats
  const result = {
    taxFormsPending: apiResponse.taxForms?.pending || 0,
    taxFormsReviewed: apiResponse.taxForms?.reviewed || 0,
    taxFormsFiled: apiResponse.taxForms?.filed || 0,
    contactMessages: apiResponse.contacts || 0,
    totalUsers: apiResponse.users || 0,
  };
  
  // Process recent forms with optimization if needed
  if (apiResponse.recent && apiResponse.recent.length > 0) {
    // Limit the number of recent forms based on optimization level
    const limitCount = aggressiveOptimization ? Math.min(3, maxRecentForms) : maxRecentForms;
    const recentForms = optimizeForStorage
      ? apiResponse.recent.slice(0, limitCount)
      : apiResponse.recent;
    
    // Optimize each recent form by removing unnecessary fields
    result.recentForms = recentForms.map(form => {
      // Basic optimized form with essential fields only
      const optimizedForm = {
        _id: form._id,
        fullName: form.fullName,
        status: form.status,
        pan: form.pan,
        email: form.email,
        createdAt: form.createdAt
      };
      
      // Add document count instead of full document array if aggressive optimization is enabled
      if (aggressiveOptimization && form.documents) {
        optimizedForm.documentCount = form.documents.length;
      } else if (form.documents) {
        // For regular optimization, include minimal document info
        optimizedForm.documents = form.documents.map(doc => ({
          _id: doc._id,
          name: doc.name,
          // Exclude large fields like content, path, etc.
        }));
      }
      
      // Only include updatedAt if different from createdAt and not using aggressive optimization
      if (!aggressiveOptimization && form.updatedAt && form.updatedAt !== form.createdAt) {
        optimizedForm.updatedAt = form.updatedAt;
      }
      
      return optimizedForm;
    });
  } else {
    result.recentForms = [];
  }
  
  // Estimate the size of the result
  try {
    const jsonSize = new TextEncoder().encode(JSON.stringify(result)).length;
    const sizeInKB = Math.round(jsonSize / 1024);
    
    // If the result is still large, apply more aggressive optimization
    if (sizeInKB > 400 && !aggressiveOptimization) {
      console.warn(`Dashboard stats too large (${sizeInKB}KB), applying aggressive optimization`);
      return transformDashboardStats(apiResponse, { ...options, aggressiveOptimization: true });
    }
    
    console.info(`Dashboard stats size: ${sizeInKB}KB`);
  } catch (e) {
    console.error('Error estimating dashboard stats size:', e);
  }
  
  return result;
};

/**
 * Transforms pagination data from API response
 * @param {Object} apiResponse - The raw API response with pagination
 * @returns {Object} Standardized pagination object
 */
/**
 * Transforms users data from API response to frontend format
 * @param {Object} apiResponse - The raw API response
 * @returns {Object} Transformed users data for frontend display
 */
export const transformUsersData = (apiResponse) => {
  if (!apiResponse) return { users: [], pagination: { currentPage: 1, totalPages: 1 } };

  return {
    users: apiResponse.users || [],
    pagination: transformPagination(apiResponse),
  };
};

export const transformPagination = (apiResponse) => {
  if (!apiResponse?.pagination) return { currentPage: 1, totalPages: 1 };

  return {
    currentPage: apiResponse.pagination.page || 1,
    totalPages: apiResponse.pagination.pages || 1,
    totalItems: apiResponse.pagination.total || 0,
    limit: apiResponse.pagination.limit || 10,
  };
};
