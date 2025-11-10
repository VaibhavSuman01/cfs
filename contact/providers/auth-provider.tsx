"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import api from "@/lib/api-client";

interface SupportTeamMember {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  avatar?: string;
}

interface AuthContextType {
  user: SupportTeamMember | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<SupportTeamMember>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SupportTeamMember | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchProfile();
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get("/api/support-team/profile");
      if (response.data.success) {
        setUser(response.data.data);
      } else {
        throw new Error(response.data.message || "Failed to fetch profile");
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post("/api/support-team/login", {
        email,
        password,
      });

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        setUser(response.data.data);
      } else {
        throw new Error(response.data.message || "Login failed");
      }
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Login failed. Please try again."
      );
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/auth";
  };

  const updateProfile = async (data: Partial<SupportTeamMember>) => {
    try {
      const response = await api.put("/api/support-team/profile", data);
      if (response.data.success) {
        setUser(response.data.data);
      }
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to update profile"
      );
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, logout, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

