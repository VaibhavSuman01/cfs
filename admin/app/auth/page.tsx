"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  User,
  Lock,
  Shield,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { FadeInSection } from "@/components/fade-in-section";
import { AnimatedBackground } from "@/components/animated-background";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useAuth } from "@/providers/auth-provider";
import { toast } from "sonner";

export default function AdminAuthPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, isAuthenticated } = useAuth();
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<any>({});
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/admin");
    }
  }, [isAuthenticated, router]);

  // Validation helpers
  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Login handler
  const handleLogin = async () => {
    const newErrors: any = {};

    // Client-side validation
    if (!loginForm.email || !validateEmail(loginForm.email))
      newErrors.email = "Valid email is required";
    if (!loginForm.password || loginForm.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      await login(loginForm.email.toLowerCase(), loginForm.password);
      toast.success("Login successful!");
      router.push("/admin");
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "Login failed. Please try again.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 via-blue-800 to-white/5 flex items-center justify-center p-4 relative overflow-hidden">
      <AnimatedBackground />
      
      <FadeInSection className="w-full max-w-md relative z-10">
        <Card variant="glass" className="p-8">
          {/* Header */}
          <CardHeader className="text-center pb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600/30 backdrop-blur rounded-full mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Admin Login
            </h1>
            <p className="text-white/80">
              Access the administrative dashboard
            </p>
          </CardHeader>

          {/* Login Form */}
          <CardContent className="pt-0">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-white/90 mb-2">
                Email Address
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 w-5 h-5" />
                <input
                  type="email"
                  value={loginForm.email}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, email: e.target.value })
                  }
                  className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl bg-white/10 backdrop-blur text-white placeholder-white/50 focus:ring-2 focus:ring-white/30 focus:border-white/50 transition-all duration-300 ${
                    errors.email ? "border-red-400" : "border-white/20"
                  }`}
                  placeholder="Enter your admin email"
                  suppressHydrationWarning
                />
              </div>
              {errors.email && (
                <p className="text-red-300 text-xs mt-2">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-white/90 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={loginForm.password}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, password: e.target.value })
                  }
                  className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl bg-white/10 backdrop-blur text-white placeholder-white/50 focus:ring-2 focus:ring-white/30 focus:border-white/50 transition-all duration-300 ${
                    errors.password ? "border-red-400" : "border-white/20"
                  }`}
                  placeholder="Enter your password"
                  suppressHydrationWarning
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-300 text-xs mt-2">{errors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-white/20 backdrop-blur text-white py-4 rounded-xl font-semibold text-lg hover:bg-white/30 focus:ring-4 focus:ring-white/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-white/60">
              Secure admin access only
            </p>
          </div>
          </CardContent>
        </Card>
      </FadeInSection>
    </div>
  );
}