'use client';

import { createContext, ReactNode, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { Toaster } from 'sonner';
import { usePathname } from 'next/navigation';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../providers/auth-provider';

interface StorageMonitorContextType {
  isNearQuota: boolean;
  clearCache: (percentToClear?: number) => number;
}

// Create context for storage monitoring
const StorageMonitorContext = createContext<StorageMonitorContextType>({
  isNearQuota: false,
  clearCache: () => 0,
});

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export function Providers({ children }: { children: ReactNode }) {
  const [isNearQuota, setIsNearQuota] = useState(false);
  const pathname = usePathname();
  const isMountedRef = useRef(true);


  // Function to clear cache
  const clearCache = useCallback((percentToClear = 20) => {
    try {
      if (typeof window === 'undefined') return 0;
      const itemsCleared = clearOldestItems(percentToClear, 'api_cache_');

      return itemsCleared;
    } catch (error) {
      console.error('Error clearing cache:', error);
      return 0;
    }
  }, [checkStorage]);

  // Auto-cleanup when storage is near quota
  const autoCleanup = useCallback(() => {
    if (checkStorage()) {
      clearCache(20);
    }
  }, [checkStorage, clearCache]);

  // Set up periodic checking
  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return;
    
    // Initial check
    checkStorage();
    
    // Set up interval
    const intervalId = setInterval(() => {
      if (isMountedRef.current) {
        autoCleanup();
      }
    }, 120000); // Check every 2 minutes
    
    // Clean up on unmount
    return () => {
      clearInterval(intervalId);
    };
  }, [autoCleanup]);

  // Set up error listener for quota exceeded errors
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleStorageError = (event: ErrorEvent) => {
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
    return () => {
      window.removeEventListener('error', handleStorageError);
      isMountedRef.current = false;
    };
  }, [clearCache]);

  return (
    <QueryClientProvider client={queryClient}>
      <StorageMonitorContext.Provider value={{ isNearQuota, clearCache }}>
        <AuthProvider>
          <Toaster position="top-right" />
          {children}
        </AuthProvider>
      </StorageMonitorContext.Provider>
    </QueryClientProvider>
  );
}

export const useStorageMonitor = () => {
  const context = useContext(StorageMonitorContext);
  if (context === undefined) {
    throw new Error('useStorageMonitor must be used within a StorageMonitorProvider');
  }
  return context;
};
