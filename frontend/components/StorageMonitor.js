import React, { useState } from 'react';
import useStorageMonitor from '../utils/useStorageMonitor';

/**
 * Component to display localStorage usage and provide cleanup options
 * Can be added to admin pages or settings pages
 */
const StorageMonitor = ({ showControls = true, className = '' }) => {
  const {
    usage,
    quota,
    percentUsed,
    isNearLimit,
    formatSize,
    clearApiCache,
    clearStorage,
    checkStorage
  } = useStorageMonitor();

  const [isClearing, setIsClearing] = useState(false);
  const [clearResult, setClearResult] = useState(null);

  // Handle clearing API cache
  const handleClearApiCache = async () => {
    setIsClearing(true);
    setClearResult(null);
    
    try {
      const itemsCleared = clearApiCache(30); // Clear 30% of API cache
      setClearResult({
        success: true,
        message: `Successfully cleared ${itemsCleared} cache items.`
      });
    } catch (error) {
      setClearResult({
        success: false,
        message: `Error clearing cache: ${error.message}`
      });
    } finally {
      setIsClearing(false);
    }
  };

  // Handle clearing all storage
  const handleClearAllStorage = async () => {
    if (!window.confirm('Are you sure you want to clear all cached data? This may affect performance temporarily.')) {
      return;
    }
    
    setIsClearing(true);
    setClearResult(null);
    
    try {
      const itemsCleared = clearStorage(100); // Clear 100% of storage
      setClearResult({
        success: true,
        message: `Successfully cleared ${itemsCleared} storage items.`
      });
    } catch (error) {
      setClearResult({
        success: false,
        message: `Error clearing storage: ${error.message}`
      });
    } finally {
      setIsClearing(false);
    }
  };

  // Get status color based on usage percentage
  const getStatusColor = () => {
    if (percentUsed >= 90) return 'text-red-600';
    if (percentUsed >= 70) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className={`bg-white rounded-lg shadow p-4 ${className}`}>
      <h3 className="text-lg font-semibold mb-2">Browser Storage Status</h3>
      
      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <span>Storage Usage:</span>
          <span className={getStatusColor()}>
            {formatSize(usage)} / {formatSize(quota)} ({percentUsed}%)
          </span>
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className={`h-2.5 rounded-full ${isNearLimit ? 'bg-red-600' : 'bg-blue-600'}`}
            style={{ width: `${Math.min(percentUsed, 100)}%` }}
          ></div>
        </div>
        
        {isNearLimit && (
          <p className="text-red-600 text-sm mt-1">
            Storage is nearly full. Consider clearing some data.
          </p>
        )}
      </div>
      
      {showControls && (
        <div className="flex flex-col space-y-2">
          <button
            onClick={handleClearApiCache}
            disabled={isClearing}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isClearing ? 'Clearing...' : 'Clear API Cache'}
          </button>
          
          <button
            onClick={handleClearAllStorage}
            disabled={isClearing}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
          >
            {isClearing ? 'Clearing...' : 'Clear All Cached Data'}
          </button>
          
          <button
            onClick={checkStorage}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Refresh Status
          </button>
        </div>
      )}
      
      {clearResult && (
        <div className={`mt-3 p-2 rounded ${clearResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {clearResult.message}
        </div>
      )}
    </div>
  );
};

export default StorageMonitor;