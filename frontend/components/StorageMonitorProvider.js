import { useEffect, createContext, useContext, useState } from 'react';
import { isStorageNearQuota, clearOldestItems } from '../utils/storageManager';

// Create context for storage monitoring
const StorageMonitorContext = createContext({
  isNearQuota: false,
  clearCache: () => {},
});

/**
 * Provider component that monitors localStorage usage and provides
 * automatic cleanup functionality to prevent quota exceeded errors
 */
export const StorageMonitorProvider = ({ children, threshold = 80, checkInterval = 60000 }) => {
  const [isNearQuota, setIsNearQuota] = useState(false);
  
  // Function to check storage status
  const checkStorage = () => {
    try {
      const nearQuota = isStorageNearQuota(threshold);
      setIsNearQuota(nearQuota);
      return nearQuota;
    } catch (error) {
      console.error('Error checking storage:', error);
      return false;
    }
  };
  
  // Function to clear cache
  const clearCache = (percentToClear = 20) => {
    try {
      const itemsCleared = clearOldestItems(percentToClear, 'api_cache_');
      checkStorage();
      return itemsCleared;
    } catch (error) {
      console.error('Error clearing cache:', error);
      return 0;
    }
  };
  
  // Auto-cleanup when storage is near quota
  const autoCleanup = () => {
    if (checkStorage()) {
      clearCache(20);
    }
  };
  
  // Set up periodic checking
  useEffect(() => {
    // Initial check
    checkStorage();
    
    // Set up interval
    const intervalId = setInterval(() => {
      autoCleanup();
    }, checkInterval);
    
    // Clean up on unmount
    return () => clearInterval(intervalId);
  }, [threshold, checkInterval]);
  
  // Set up error listener for quota exceeded errors
  useEffect(() => {
    const handleStorageError = (event) => {
      // Check if it's a storage error
      if (event.message && 
          (event.message.includes('QuotaExceededError') || 
           event.message.includes('exceeded the quota') || 
           event.message.includes('NS_ERROR_DOM_QUOTA_REACHED'))) {
        
        // Aggressively clear cache
        clearCache(30);
      }
    };
    
    // Add global error listener
    window.addEventListener('error', handleStorageError);
    
    // Clean up
    return () => window.removeEventListener('error', handleStorageError);
  }, []);
  
  return (
    <StorageMonitorContext.Provider value={{ isNearQuota, clearCache }}>
      {children}
    </StorageMonitorContext.Provider>
  );
};

// Hook to use the storage monitor context
export const useStorageMonitor = () => useContext(StorageMonitorContext);

/**
 * Component that automatically monitors localStorage and prevents quota errors
 * This can be added to _app.js to provide global storage monitoring
 */
export const AutoStorageManager = () => {
  useEffect(() => {
    // Function to handle storage events
    const handleStorage = () => {
      try {
        // Check if storage is near quota
        if (isStorageNearQuota(75)) {
          // Clear oldest items if near quota
          clearOldestItems(20, 'api_cache_');
        }
      } catch (error) {
        console.error('Error in AutoStorageManager:', error);
      }
    };
    
    // Set up interval to check storage
    const intervalId = setInterval(handleStorage, 120000); // Check every 2 minutes
    
    // Initial check
    handleStorage();
    
    // Clean up
    return () => clearInterval(intervalId);
  }, []);
  
  // This component doesn't render anything
  return null;
};

export default StorageMonitorProvider;