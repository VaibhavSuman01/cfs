import { useState, useEffect, useCallback } from 'react';
import useApiCache from './useApiCache';
import { useStorageMonitor } from '../components/StorageMonitorProvider';
import { isStorageNearQuota } from './storageManager';

/**
 * Enhanced API cache hook that integrates with storage monitoring
 * to provide a more robust caching solution that prevents quota errors
 * 
 * @param {string} key - Cache key
 * @param {Function} fetchFunction - Function to fetch data
 * @param {Object} options - Configuration options
 * @param {number} options.cacheTime - Cache duration in ms (default: 5 minutes)
 * @param {boolean} options.skipCache - Whether to skip cache for large responses
 * @param {number} options.sizeThreshold - Size threshold in bytes to skip caching (default: 100KB)
 * @param {boolean} options.criticalData - Whether this is critical data that should be preserved in cache
 * @returns {Object} Cache hook result object
 */
const useRobustApiCache = (key, fetchFunction, options = {}) => {
  // Default options
  const {
    cacheTime = 5 * 60 * 1000,
    skipCache = false,
    sizeThreshold = 100 * 1024, // 100KB
    criticalData = false,
  } = options;
  
  // Get storage monitor context
  const { isNearQuota, clearCache } = useStorageMonitor();
  
  // State to track if we should use cache
  const [shouldUseCache, setShouldUseCache] = useState(!skipCache);
  
  // Determine if we should use cache based on storage conditions
  useEffect(() => {
    // If skipCache is true, don't use cache regardless
    if (skipCache) {
      setShouldUseCache(false);
      return;
    }
    
    // If storage is near quota and this isn't critical data, skip cache
    if (isNearQuota && !criticalData) {
      setShouldUseCache(false);
    } else {
      setShouldUseCache(true);
    }
  }, [skipCache, isNearQuota, criticalData]);
  
  // Create a wrapper for the fetch function that can handle size-based caching decisions
  const wrappedFetchFunction = useCallback(async () => {
    try {
      const result = await fetchFunction();
      
      // If we have a result and it's very large, we might want to skip caching
      if (result) {
        // Estimate the size of the result
        const resultSize = new TextEncoder().encode(
          JSON.stringify(result)
        ).length;
        
        // If the result is larger than threshold and storage is getting full,
        // update shouldUseCache for next time
        if (resultSize > sizeThreshold && isStorageNearQuota(60)) {
          setShouldUseCache(false);
        }
      }
      
      return result;
    } catch (error) {
      throw error;
    }
  }, [fetchFunction, sizeThreshold]);
  
  // Use the regular API cache hook with our configuration
  const apiCacheResult = useApiCache(
    key,
    wrappedFetchFunction,
    cacheTime,
    { autoCleanup: true, cleanupThreshold: 70 }
  );
  
  // Enhanced refetch that clears cache if storage is near quota
  const robustRefetch = useCallback(async () => {
    // If storage is near quota, clear some space first
    if (isNearQuota) {
      clearCache(20);
    }
    
    return apiCacheResult.refetch();
  }, [apiCacheResult.refetch, isNearQuota, clearCache]);
  
  return {
    ...apiCacheResult,
    refetch: robustRefetch,
    isUsingCache: shouldUseCache,
  };
};

export default useRobustApiCache;