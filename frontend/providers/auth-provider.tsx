'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api, { API_PATHS } from '@/lib/api-client';
import { User } from '@/lib/api-client';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  refreshUserProfile: () => Promise<void>;
  
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  pan?: string;
  mobile?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        if (api.isAuthenticated()) {
          // Get user from localStorage first for quick UI update
          const storedUser = api.getUser();
          if (storedUser && storedUser.role) {
            setUser(storedUser);
          } else {
            console.warn('Stored user data is invalid or missing role');
          }

          // Then verify with the server and get fresh data
          await refreshUserProfile();
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        // If server verification fails, log out
        api.logout();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Refresh user profile from the server
  const refreshUserProfile = async () => {
    try {
      const response = await api.get(API_PATHS.AUTH.ME);
      // The backend returns user data in the 'data' property, not 'user'
      const userData = response.data.data;
      
      if (!userData) {
        console.error('User data is undefined in API response');
        throw new Error('User data is undefined');
      }
      
      // Update user in state and localStorage
      setUser(userData);
      

      
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
      const response = await api.post(API_PATHS.AUTH.LOGIN, { identifier: email, password });
      const { token, refreshToken, user: userData } = response.data;

      if (!userData) {
        console.error('User data is undefined in login response');
        throw new Error('User data is undefined');
      }

      // Store auth data
      api.setAuth(token, refreshToken, userData);
      setUser(userData);

      // Set cookies for middleware authentication
      document.cookie = `token=${token}; path=/`;

      toast.success('Login successful!');
      
      router.push('/dashboard');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (userData: RegisterData) => {
    setIsLoading(true);
    try {
      const response = await api.post(API_PATHS.AUTH.REGISTER, userData);
      const { token, refreshToken, user: newUser } = response.data;

      // Store auth data
      api.setAuth(token, refreshToken, newUser);
      setUser(newUser);

      toast.success('Registration successful!');
      router.push('/dashboard');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
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
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    router.push('/');
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
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