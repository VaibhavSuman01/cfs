'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api-client';
import { User } from '@/lib/api-client';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (api.isAuthenticated()) {
        try {
          await refreshUserProfile();
        } catch (error) {
          console.error('Authentication check failed:', error);
          logout();
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Refresh user profile from the server
  const refreshUserProfile = async () => {
    try {
      const response = await api.get('/api/auth/me');
      // The backend returns user data in the 'data' property, not 'user'
      const userData = response.data.data;
      
      if (!userData) {
        console.error('User data is undefined in API response');
        throw new Error('User data is undefined');
      }
      
      // Update user in state and localStorage
      setUser(userData);
      
      // Update cookies for middleware authentication
      const token = localStorage.getItem('token');
      if (token) {
        document.cookie = `auth-token=${token}; path=/`;
        document.cookie = `is-admin=${userData.role === 'admin'}; path=/`;
      }
      
      // Check if user is admin, if not, throw an error to be handled by the caller
      if (userData && userData.role !== 'admin') {
        toast.error('Access denied. Admin privileges required.');
        throw new Error('User does not have admin privileges.');
      }
      
      return userData;
    } catch (error) {
      console.error('Failed to refresh user profile:', error);
      throw error;
    }
  };

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Use identifier parameter instead of email for API compatibility
      const response = await api.post('/api/auth/login', { identifier: email, password });
      const { token, refreshToken, user: userData } = response.data;

      if (!userData) {
        console.error('User data is undefined in login response');
        throw new Error('User data is undefined');
      }

      // Store auth data
      api.setAuth(token, refreshToken, userData);
      setUser(userData);
      
      // Set cookies for middleware authentication
      document.cookie = `auth-token=${token}; path=/`;
      document.cookie = `is-admin=${userData.role === 'admin'}; path=/`;

      // Check if user is admin, if not redirect to user dashboard
      if (userData && userData.role !== 'admin') {
        toast.error('Access denied. Admin privileges required.');
        api.logout();
        router.push('/auth');
        return;
      }

      toast.success('Login successful!');
      router.push('/admin/dashboard');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    api.logout();
    setUser(null);
    
    // Clear cookies for middleware authentication
    document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'is-admin=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    
    router.push('/auth');
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    refreshUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};