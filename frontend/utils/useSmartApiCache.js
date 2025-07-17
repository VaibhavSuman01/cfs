import { useState, useEffect, useCallback, useRef } from 'react';
import useApiCache from './useApiCache';
import { isStorageNearQuota } from './storageManager';

/**
 * Smart API cache hook that intelligently handles large data
 * This hook extends useApiCache with additional intelligence for handling large responses
 * 
 * @param {string} key - The cache key
 * @param {Function} fetchFunction - The function to fetch data
 * @param {number} cacheTime - The cache time in milliseconds (default: 5 minutes)
 * @param {Object} options - Additional options
 * @param {boolean} options.autoCleanup - Whether to automatically clean up storage when near quota (default: true)
 * @param {number} options.cleanupThreshold - Percentage threshold to trigger cleanup (default: 80%)
 * @param {number} options.maxSizeKB - Maximum size in KB to allow for caching (default: 500KB)
 * @param {boolean} options.skipCacheForLargeData - Whether to skip caching for large data (default: true)
 * @returns {Object} - { data, loading, error, refetch, clearCache, clearAllCache, isCached }
 */
const useSmartApiCache = (key, fetchFunction, cacheTime = 5 * 60 * 1000, options = {}) => {
  // Default options
  const defaultOptions = {
    autoCleanup: true,
    cleanupThreshold: 80,
    maxSizeKB: 500,
    skipCacheForLargeData: true
  };
  
  // Merge default options with provided options
  const mergedOptions = { ...defaultOptions, ...options };
  
  // Track if the current data is cached
  const [isCached, setIsCached] = useState(false);
  
  // Use ref to avoid unnecessary re-renders
  const optionsRef = useRef(mergedOptions);
  
  // Use the base useApiCache hook
  const apiCache = useApiCache(key, fetchFunction, cacheTime, mergedOptions);
  
  // Wrap the original fetch function to add size-based caching decisions
  const smartFetchFunction = useCallback(async () => {
    try {
      // Check if storage is near quota
      const isNearQuota = isStorageNearQuota(optionsRef.current.cleanupThreshold);
      
      // If storage is near quota, try to free up space proactively
      if (isNearQuota) {
        const { clearOldestItems } = await import('./storageManager');
        console.warn('Storage quota nearly exceeded, clearing oldest items');
        clearOldestItems(30, 'api_cache_'); // Clear more items proactively
      }
      
      // Get the data from the original fetch function
      const data = await fetchFunction();
      
      // Estimate the size of the data
      const jsonData = JSON.stringify(data);
      const estimatedSize = new TextEncoder().encode(jsonData).length;
      const sizeInKB = Math.round(estimatedSize / 1024);
      
      // Log size information
      if (sizeInKB > 100) {
        console.info(`Large data detected for ${key}: ${sizeInKB}KB`);
      }
      
      // Determine if we should skip caching
      const skipCaching = (
        (optionsRef.current.skipCacheForLargeData && sizeInKB > optionsRef.current.maxSizeKB) ||
        (isNearQuota && sizeInKB > optionsRef.current.maxSizeKB / 2) // More aggressive when near quota
      );
      
      if (skipCaching) {
        console.warn(`Skipping cache for large data: ${key} (${sizeInKB}KB)`);
        setIsCached(false);
        return data;
      }
      
      // Data is not too large, allow caching
      setIsCached(true);
      return data;
    } catch (error) {
      console.error('Error in smartFetchFunction:', error);
      throw error;
    }
  }, [fetchFunction, key]);
  
  // Enhanced refetch function that clears cache if storage is near quota
  const smartRefetch = useCallback(async () => {
    try {
      // Check if storage is near quota
      if (isStorageNearQuota(optionsRef.current.cleanupThreshold)) {
        // Clear this cache entry before refetching
        apiCache.clearCache();
        console.info(`Cleared cache for ${key} before refetching due to storage pressure`);
      }
      
      // Call the original refetch
      return await apiCache.refetch();
    } catch (error) {
      console.error('Error in smartRefetch:', error);
      throw error;
    }
  }, [apiCache, key]);
  
  return {
    ...apiCache,
    refetch: smartRefetch,
    isCached
  };
};

export default useSmartApiCache;