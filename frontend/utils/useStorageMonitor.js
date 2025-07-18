import { useState, useEffect } from 'react';
import { getLocalStorageUsage, getLocalStorageQuota, clearOldestItems } from './storageManager';

/**
 * Hook to monitor localStorage usage and provide cleanup functions
 * @param {number} checkInterval - Interval in ms to check storage usage (default: 60000ms/1min)
 * @param {number} warningThreshold - Percentage threshold to trigger warning (default: 80%)
 * @returns {Object} Storage monitoring state and functions
 */
const useStorageMonitor = (checkInterval = 60000, warningThreshold = 80) => {
  const [storageInfo, setStorageInfo] = useState({
    usage: 0,          // Current usage in bytes
    quota: 0,          // Estimated quota in bytes
    percentUsed: 0,    // Percentage of quota used
    isNearLimit: false // Whether storage is near limit
  });

  // Function to update storage information
  const checkStorage = () => {
    const usage = getLocalStorageUsage();
    const quota = getLocalStorageQuota();
    const percentUsed = Math.round((usage / quota) * 100);
    const isNearLimit = percentUsed >= warningThreshold;

    setStorageInfo({
      usage,
      quota,
      percentUsed,
      isNearLimit
    });

    return { usage, quota, percentUsed, isNearLimit };
  };

  // Function to clear storage when needed
  const clearStorage = (percentToClear = 20, prefix = '') => {
    const itemsCleared = clearOldestItems(percentToClear, prefix);
    // Update storage info after clearing
    checkStorage();
    return itemsCleared;
  };

  // Clear API cache specifically
  const clearApiCache = (percentToClear = 20) => {
    return clearStorage(percentToClear, 'api_cache_');
  };

  // Auto-cleanup when near limit
  const autoCleanup = () => {
    const { isNearLimit } = checkStorage();
    if (isNearLimit) {
      return clearApiCache(20); // Clear 20% of API cache
    }
    return 0;
  };

  // Check storage on mount and at intervals
  useEffect(() => {
    // Initial check
    checkStorage();

    // Set up interval for checking
    const intervalId = setInterval(() => {
      checkStorage();
    }, checkInterval);

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, [checkInterval]);

  return {
    ...storageInfo,
    checkStorage,
    clearStorage,
    clearApiCache,
    autoCleanup,
    formatSize: (bytes) => {
      if (bytes < 1024) return `${bytes} B`;
      if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }
  };
};

export default useStorageMonitor;