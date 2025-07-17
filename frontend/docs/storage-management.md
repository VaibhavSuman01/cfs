# Browser Storage Management

This document provides an overview of the browser storage management system implemented in the CFS application to prevent `QuotaExceededError` issues.

## Overview

Browsers have limited localStorage capacity (typically 5-10MB). When this quota is exceeded, operations that attempt to store data will fail with a `QuotaExceededError`. This implementation provides several utilities to manage storage effectively and prevent these errors.

## Recent Updates

**Enhanced Storage Optimization (2023-11-15)**

We've implemented advanced storage optimization features to handle large data more intelligently:

- **Smart size detection**: Automatically detects large objects before storing
- **Data compression**: Simplifies large objects by removing unnecessary data
- **Intelligent caching**: Skips caching for extremely large responses
- **Storage analysis**: Tools to analyze and optimize localStorage usage

## Components

### 1. Storage Manager Utility (`storageManager.js`)

Core utility functions for managing localStorage:

```javascript
// Get current localStorage usage in bytes
getLocalStorageUsage();

// Get approximate localStorage quota (typically 5MB)
getLocalStorageQuota();

// Check if storage is near quota
isStorageNearQuota(thresholdPercentage = 80);

// Clear oldest items to free up space
clearOldestItems(percentToClear = 20, prefix = '');

// Clear all items with a specific prefix
clearAllItemsWithPrefix(prefix);

// Safely store an item with quota management and size optimization
safelyStoreItem(key, value, prefix = '', options = {
  maxSizeKB: 500,  // Maximum size in KB to allow
  compress: true    // Whether to compress large values
});
```

### 2. Enhanced API Cache Hook (`useApiCache.js`)

An improved version of the API cache hook that automatically manages storage:

```javascript
const { data, loading, error, refetch, clearCache, clearAllCache } = useApiCache(
  'cacheKey',
  fetchFunction,
  cacheTime,
  {
    autoCleanup: true,        // Automatically clean up when near quota
    cleanupThreshold: 80      // Percentage threshold to trigger cleanup
  }
);
```

### 3. Smart API Cache Hook (`useSmartApiCache.js`)

An intelligent caching hook that makes size-based decisions:

```javascript
const { 
  data, 
  loading, 
  error, 
  refetch, 
  isCached, // Whether current data came from cache
  clearCache 
} = useSmartApiCache(
  'cacheKey',
  fetchFunction,
  cacheTime,
  {
    maxSizeKB: 500,            // Skip caching for data larger than 500KB
    skipCacheForLargeData: true, // Skip caching for large responses
    autoCleanup: true,          // Automatically clean up when near quota
    cleanupThreshold: 70        // Percentage threshold to trigger cleanup
  }
);
```

### 4. Storage Optimizer Utility (`storageOptimizer.js`)

Utilities for analyzing and optimizing objects before storage:

```javascript
// Analyze an object to identify large properties
const analysis = analyzeObjectSize(myObject, {
  warnSizeKB: 50,  // Size in KB to trigger warnings
  maxDepth: 3      // Maximum recursion depth for analysis
});

// Optimize an object for storage
const result = optimizeForStorage(myObject, {
  truncateArrays: true,     // Truncate large arrays
  maxArrayLength: 20,       // Maximum array length to keep
  truncateStrings: true,    // Truncate large strings
  maxStringLength: 1000     // Maximum string length to keep
});

// Analyze current localStorage usage
const storageAnalysis = analyzeLocalStorage();
```

### 5. Robust API Cache Hook (`useRobustApiCache.js`)

A more advanced hook that integrates with the storage monitor:

```javascript
const { 
  data, 
  loading, 
  error, 
  refetch, 
  isUsingCache 
} = useRobustApiCache(
  'cacheKey',
  fetchFunction,
  {
    cacheTime: 5 * 60 * 1000,  // 5 minutes
    skipCache: false,           // Skip cache entirely
    sizeThreshold: 100 * 1024,  // Skip cache for responses larger than 100KB
    criticalData: false         // Mark as critical data to preserve in cache
  }
);
```

### 4. Storage Monitor Provider (`StorageMonitorProvider.js`)

A React context provider that monitors storage usage and provides cleanup functionality:

```jsx
// In _app.js
import { StorageMonitorProvider, AutoStorageManager } from '../components/StorageMonitorProvider';

function MyApp({ Component, pageProps }) {
  return (
    <StorageMonitorProvider threshold={75} checkInterval={120000}>
      {/* Auto storage management component */}
      {typeof window !== "undefined" && <AutoStorageManager />}
      <Component {...pageProps} />
    </StorageMonitorProvider>
  );
}
```

### 5. Storage Monitor Hook

Access storage monitoring functionality in any component:

```jsx
import { useStorageMonitor } from '../components/StorageMonitorProvider';

function MyComponent() {
  const { isNearQuota, clearCache } = useStorageMonitor();
  
  return (
    <div>
      {isNearQuota && (
        <div className="warning">Storage is nearly full!</div>
      )}
      <button onClick={() => clearCache(20)}>Clear Some Cache</button>
    </div>
  );
}
```

### 6. Storage Monitor Component (`StorageMonitor.js`)

A ready-to-use UI component for displaying storage status and providing cleanup options:

```jsx
import StorageMonitor from '../components/StorageMonitor';

function AdminPage() {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <StorageMonitor showControls={true} />
    </div>
  );
}
```

## Best Practices

1. **Use the smart caching hooks**: Replace `useApiCache` with `useSmartApiCache` for intelligent size-based caching decisions.

2. **Optimize large responses**: For API endpoints that return large amounts of data:
   - Use `transformDashboardStats` with `optimizeForStorage: true` to reduce data size
   - Set appropriate `maxSizeKB` and `skipCacheForLargeData` options in `useSmartApiCache`
   - Consider using the `storageOptimizer.js` utilities to analyze and optimize large objects

3. **Analyze storage usage**: Use the `analyzeLocalStorage()` function to identify problematic storage patterns and large items.

4. **Implement data transformers**: Create data transformer functions that optimize API responses before caching:
   ```javascript
   // Example transformer that optimizes data for storage
   const optimizeForCache = (data) => {
     // Remove unnecessary fields
     const { largeUnneededField, ...essentialData } = data;
     return essentialData;
   };
   ```

5. **Add the Storage Monitor**: Include the `StorageMonitor` component in admin pages to give administrators visibility and control.

6. **Use advanced storage options**: When storing large items, use the enhanced options:
   ```javascript
   safelyStoreItem(key, value, 'prefix_', {
     maxSizeKB: 200,  // Limit size
     compress: true   // Enable compression
   });
   ```

7. **Regular maintenance**: Schedule periodic cache cleanup during quiet periods or after major data updates.

## Troubleshooting

### Common Issues

1. **QuotaExceededError**: If you encounter storage quota errors despite using the storage management system:
   - Use `analyzeObjectSize` to identify which properties are consuming the most space
   - Check the browser console for warnings about large items being stored
   - Apply `optimizeForStorage` to large objects before caching them
   - Use `useSmartApiCache` with appropriate size limits and cleanup thresholds
   - Consider modifying data transformers to exclude unnecessary data
   - For persistent issues, implement a more aggressive cleanup strategy:
     ```javascript
     // In extreme cases, clear all API cache entries
     clearAllItemsWithPrefix('api_cache_');
     ```

2. **Large Dashboard Data**: If dashboard statistics are causing storage issues:
   - Limit the number of recent items displayed using the `maxRecentForms` option
   - Use the optimized transformer with storage optimization enabled:
     ```javascript
     transformDashboardStats(data, { 
       optimizeForStorage: true,
       maxRecentForms: 5
     });
     ```
   - Consider implementing pagination for dashboard data instead of caching everything

3. **Stale Data**: If components are displaying outdated information:
   - Verify the `cacheTime` settings in your API cache hooks
   - Check if the cache key is properly incorporating all relevant parameters
   - Use the `clearCache` function to manually invalidate specific cache entries
   - Monitor the `isCached` flag from `useSmartApiCache` to verify data source

4. **Performance Issues**: If storage operations are causing performance problems:
   - Move storage operations to web workers where possible
   - Implement debouncing for frequent updates
   - Consider using IndexedDB for very large datasets instead of localStorage
   - Use the compression options in `safelyStoreItem` for large objects

## Recent Enhancements

The following enhancements have been implemented to address the `QuotaExceededError` issues:

1. **Smart Size Detection**: The system now automatically detects large objects before storing them and provides warnings in the console.

2. **Data Compression**: Large objects can now be automatically compressed or simplified before storage using the `simplifyLargeObject` function.

3. **Intelligent Caching**: The new `useSmartApiCache` hook makes size-based decisions about what to cache and when to skip caching for large responses.

4. **Storage Analysis Tools**: The `storageOptimizer.js` utility provides tools to analyze object size, identify problematic properties, and optimize objects for storage.

5. **Enhanced Dashboard Optimization**: The `transformDashboardStats` function now includes options to limit the number of recent forms and optimize the data structure for storage efficiency.

6. **Progressive Cleanup Strategy**: The storage system now implements a progressive cleanup strategy that tries increasingly aggressive approaches when storage quota is exceeded:
   - First attempt: Clear 20% of oldest items with the same prefix
   - Second attempt: Clear 50% of oldest items with the same prefix
   - Final attempt: Clear all items with the same prefix

7. **Size-Based Storage Options**: The `safelyStoreItem` function now accepts options for maximum size and compression settings.

## Implementation Details

The storage management system works through several layers:

1. **Prevention**: Proactively monitors storage usage and clears space when approaching limits.

2. **Handling**: Catches quota errors when they occur and automatically clears space to retry operations.

3. **Recovery**: Provides tools for users to manually clear cache when needed.

4. **Visibility**: Shows storage status to administrators for monitoring and management.

This multi-layered approach ensures robust handling of browser storage limitations while maintaining optimal application performance.