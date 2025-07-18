import { useState, useEffect, useCallback, useRef } from 'react';
import { safelyStoreItem, clearOldestItems, isStorageNearQuota, clearAllItemsWithPrefix } from './storageManager';

/**
 * Custom hook for caching API responses
 * @param {string} key - The cache key
 * @param {Function} fetchFunction - The function to fetch data
 * @param {number} cacheTime - The cache time in milliseconds (default: 5 minutes)
 * @returns {Object} - { data, loading, error, refetch }
 */
/**
 * Enhanced version of useApiCache with automatic storage management
 * @param {string} key - The cache key
 * @param {Function} fetchFunction - The function to fetch data
 * @param {number} cacheTime - The cache time in milliseconds (default: 5 minutes)
 * @param {Object} options - Additional options
 * @param {boolean} options.autoCleanup - Whether to automatically clean up storage when near quota (default: true)
 * @param {number} options.cleanupThreshold - Percentage threshold to trigger cleanup (default: 80%)
 * @returns {Object} - { data, loading, error, refetch, clearCache, clearAllCache }
 */
const useApiCache = (key, fetchFunction, cacheTime = 5 * 60 * 1000, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Default options
  const defaultOptions = {
    autoCleanup: true,
    cleanupThreshold: 80
  };
  
  // Merge default options with provided options
  const { autoCleanup, cleanupThreshold } = { ...defaultOptions, ...options };
  
  // Use ref to avoid unnecessary re-renders
  const optionsRef = useRef({ autoCleanup, cleanupThreshold });

  const getCachedData = () => {
    try {
      const cachedData = localStorage.getItem(`api_cache_${key}`);
      if (cachedData) {
        const { data, timestamp } = JSON.parse(cachedData);
        const now = new Date().getTime();
        if (now - timestamp < cacheTime) {
          return data;
        }
      }
    } catch (error) {
      console.error('Error retrieving cached data:', error);
    }
    return null;
  };

  const setCachedData = (data) => {
    try {
      // Check if storage is near quota and cleanup is enabled
      if (optionsRef.current.autoCleanup && isStorageNearQuota(optionsRef.current.cleanupThreshold)) {
        // Proactively clear some space before attempting to store
        clearOldestItems(20, 'api_cache_');
      }
      
      const cacheData = {
        data,
        timestamp: new Date().getTime(),
      };
      
      // Prepare the data for storage
      const cacheKey = `api_cache_${key}`;
      const jsonData = JSON.stringify(cacheData);
      
      // Estimate the size of the data
      const estimatedSize = new TextEncoder().encode(jsonData).length;
      const sizeInKB = Math.round(estimatedSize / 1024);
      
      // Log size information for debugging
      if (sizeInKB > 100) {
        console.info(`Large cache item detected: ${key} (${sizeInKB}KB)`);
      }
      
      // Skip caching for extremely large items
      if (sizeInKB > 2000) { // 2MB is too large for localStorage
        console.warn(`Item too large to cache: ${key} (${sizeInKB}KB)`);
        return false;
      }
      
      // Configure storage options based on data size
      const storageOptions = {
        maxSizeKB: sizeInKB > 500 ? 500 : 1000, // Reduce max size for large items
        compress: true,  // Enable compression for large items
      };
      
      // Try to remove this specific item first if it exists (to replace it)
      try {
        localStorage.removeItem(cacheKey);
      } catch (e) {
        // Ignore errors here
      }
      
      // Use the enhanced safelyStoreItem utility with size checking and compression
      const success = safelyStoreItem(
        cacheKey, 
        jsonData, 
        'api_cache_', 
        storageOptions
      );
      
      if (!success) {
        console.warn(`Failed to cache ${key} (${sizeInKB}KB), trying aggressive cleanup`);
        // If safelyStoreItem failed, try more aggressive clearing
        clearOldestItems(50, 'api_cache_');
        
        // As a last resort, clear all items with this prefix
        if (!safelyStoreItem(cacheKey, jsonData, 'api_cache_', storageOptions)) {
          clearAllItemsWithPrefix('api_cache_');
          console.warn(`Cleared all api_cache_ items as last resort for ${key}`);
          
          // Final attempt after clearing everything
          if (!safelyStoreItem(cacheKey, jsonData, 'api_cache_', storageOptions)) {
            console.error(`Unable to store ${key} even after clearing all cache`);
          }
        }
      }
    } catch (error) {
      console.error('Error caching data:', error);
      // Continue without caching if all attempts fail
    }
  };

  const fetchData = async (force = false) => {
    setLoading(true);
    setError(null);

    try {
      // Check cache first if not forcing refresh
      if (!force) {
        const cachedData = getCachedData();
        if (cachedData) {
          setData(cachedData);
          setLoading(false);
          return;
        }
      }

      // Fetch fresh data
      const result = await fetchFunction();
      setData(result);
      setCachedData(result);
    } catch (err) {
      setError(err.message || 'An error occurred');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [key]); // Re-fetch when key changes

  const refetch = () => fetchData(true);
  
  // Function to clear all cache data
  const clearCache = () => {
    try {
      // Clear only this specific cache entry
      localStorage.removeItem(`api_cache_${key}`);
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  };

  // Function to clear all API cache entries
  const clearAllCache = () => {
    try {
      // Use the clearAllItemsWithPrefix utility for better performance
      const count = clearAllItemsWithPrefix('api_cache_');
      console.info(`Cleared ${count} API cache entries`);
      return count;
    } catch (error) {
      console.error('Error clearing all cache:', error);
      return 0;
    }
  };

  return { data, loading, error, refetch, clearCache, clearAllCache };
};

export default useApiCache;