import { httpClient } from './httpClient';
import { API_PATHS } from './apiConfig';
import { transformDashboardStats, transformTaxFormResponse, transformUsersData } from './transformers';

/**
 * Prefetches and caches common API data to improve navigation performance
 * @param {Array} routes - Array of route names to prefetch (e.g., ['dashboard', 'taxForms'])
 */
export const prefetchData = async (routes = []) => {
  try {
    const prefetchPromises = [];
    
    // Import storage utilities
    const { safelyStoreItem, clearOldestItems } = await import('./storageManager');
    
    // Helper function to cache data with storage management
    const cacheData = (key, data, ttl = 5 * 60 * 1000) => {
      try {
        const cacheItem = {
          data,
          timestamp: new Date().getTime(),
          ttl
        };
        const cacheKey = `api_cache_${key}`;
        const jsonData = JSON.stringify(cacheItem);
        
        // Use safelyStoreItem instead of direct localStorage.setItem
        const success = safelyStoreItem(cacheKey, jsonData, 'api_cache_', {
          maxSizeKB: 500, // Limit to 500KB
          compress: true  // Enable compression for large items
        });
        
        if (!success) {
          console.warn(`Failed to cache ${key}, trying cleanup`);
          // Try clearing some space and retry
          clearOldestItems(20, 'api_cache_');
        }
      } catch (error) {
        console.error(`Error caching ${key} data:`, error);
      }
    };

    // Dashboard stats
    if (routes.includes('dashboard')) {
      prefetchPromises.push(
        httpClient.get(API_PATHS.ADMIN.STATS)
          .then(response => {
            const transformedData = transformDashboardStats(response.data);
            cacheData('dashboardStats', transformedData);
            return transformedData;
          })
          .catch(error => console.error('Error prefetching dashboard stats:', error))
      );
    }

    // Tax forms
    if (routes.includes('taxForms')) {
      prefetchPromises.push(
        httpClient.get(API_PATHS.ADMIN.TAX_FORMS)
          .then(response => {
            const transformedData = transformTaxFormResponse(response.data);
            cacheData('taxForms', transformedData);
            return transformedData;
          })
          .catch(error => console.error('Error prefetching tax forms:', error))
      );
    }

    // Users
    if (routes.includes('users')) {
      prefetchPromises.push(
        httpClient.get(API_PATHS.ADMIN.USERS)
          .then(response => {
            const transformedData = transformUsersData(response.data);
            cacheData('users', transformedData);
            return transformedData;
          })
          .catch(error => console.error('Error prefetching users:', error))
      );
    }

    // Wait for all prefetch operations to complete
    await Promise.allSettled(prefetchPromises);
    
    console.log('Prefetching completed for routes:', routes);
  } catch (error) {
    console.error('Error during prefetching:', error);
  }
};

/**
 * Prefetches data for the next likely routes based on current route
 * @param {string} currentRoute - The current route path
 */
export const prefetchNextLikelyRoutes = (currentRoute) => {
  // Define likely next routes based on current route
  const likelyNextRoutes = {
    '/admin/dashboard': ['taxForms', 'users'],
    '/admin/tax-forms': ['dashboard', 'users'],
    '/admin/users': ['dashboard', 'taxForms'],
    '/admin/contact-messages': ['dashboard'],
    '/admin/profile': ['dashboard']
  };

  const routesToPrefetch = likelyNextRoutes[currentRoute] || ['dashboard'];
  prefetchData(routesToPrefetch);
};