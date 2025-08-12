"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  CreditCard,
  Calendar,
  Phone,
  Lock,
  Building2,
  ArrowRight,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { FadeInSection } from "@/components/fade-in-section";
import { AnimatedBackground } from "@/components/animated-background";
import { useAuth } from "@/providers/auth-provider";
import { toast } from "sonner";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { login, register, isLoading, isAuthenticated } = useAuth();
  const [signupForm, setSignupForm] = useState({
    fullName: "",
    email: "",
    panCard: "",
    dateOfBirth: "",
    mobileNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [loginForm, setLoginForm] = useState({
    emailOrPan: "",
    password: "",
  });
  const [errors, setErrors] = useState<any>({});
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  // Validation helpers
  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePAN = (pan: string) => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan);
  const validateMobile = (mobile: string) => /^[6-9]\d{9}$/.test(mobile);

  // Signup handler
  const handleSignup = async () => {
    const newErrors: any = {};

    // Client-side validation
    if (!signupForm.fullName.trim())
      newErrors.fullName = "Full name is required";
    if (!signupForm.email || !validateEmail(signupForm.email))
      newErrors.email = "Valid email is required";
    if (!signupForm.panCard || !validatePAN(signupForm.panCard))
      newErrors.panCard =
        "Valid PAN card number is required (e.g., ABCDE1234F)";
    if (!signupForm.dateOfBirth)
      newErrors.dateOfBirth = "Date of birth is required";
    if (!signupForm.mobileNumber || !validateMobile(signupForm.mobileNumber))
      newErrors.mobileNumber = "Valid 10-digit mobile number is required";
    if (!signupForm.password || signupForm.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (signupForm.password !== signupForm.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      await register({
        name: signupForm.fullName.trim(),
        email: signupForm.email.toLowerCase(),
        password: signupForm.password,
        panCardNo: signupForm.panCard.toUpperCase(),
        dob: signupForm.dateOfBirth, // must be ISO-8601, the input is type="date"
        mobile: signupForm.mobileNumber,
        aadhaarNo: undefined,
      });

      // Reset form (handled by auth provider redirect)
      setSignupForm({
        fullName: "",
        email: "",
        panCard: "",
        dateOfBirth: "",
        mobileNumber: "",
        password: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      console.error("Signup error:", error);
      setErrors({
        general:
          error.response?.data?.message ||
          "Registration failed. Please try again.",
      });
    }
  };

  // Login handler
  const handleLogin = async () => {
    const newErrors: any = {};
    if (!loginForm.emailOrPan)
      newErrors.emailOrPan = "Email or PAN card is required";
    if (!loginForm.password) newErrors.password = "Password is required";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      // Determine if input is email or PAN
      const isEmail = validateEmail(loginForm.emailOrPan);
      const isPAN = validatePAN(loginForm.emailOrPan);

      // Pass the emailOrPan value directly as identifier
      // The backend will determine if it's an email or PAN
      await login(loginForm.emailOrPan, loginForm.password);
      // Redirect is handled in the auth provider
    } catch (error: any) {
      console.error("Login error:", error);
      setErrors({
        general:
          error.response?.data?.message ||
          "Invalid credentials. Please try again.",
      });
    }
  };

  // Handle forgot password
  const handleForgotPassword = async () => {
    if (!loginForm.emailOrPan) {
      setErrors({ emailOrPan: "Please enter your email to reset password" });
      return;
    }

    // Require an email address for reset (PAN is not valid here)
    const isEmail = validateEmail(loginForm.emailOrPan);
    if (!isEmail) {
      setErrors({
        emailOrPan: "Please enter a valid email address to reset password",
      });
      return;
    }

    try {
      await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001"
        }/api/auth/request-password-reset`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: loginForm.emailOrPan }),
        }
      );

      toast.success(
        "If your email is registered, you will receive reset instructions shortly"
      );
    } catch (error: any) {
      console.error("Forgot password error:", error);
      setErrors({
        general: "Failed to send reset link. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      <AnimatedBackground />

      {/* Header */}
      <div className="relative z-10 pt-8 pb-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center space-x-3">
            <Building2 className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Com Financial Services
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center min-h-[calc(100vh-120px)] relative z-10">
        <FadeInSection className="w-full max-w-md">
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8">
            {/* Toggle Buttons */}
            <div className="flex bg-gray-100 rounded-xl p-1 mb-8">
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
                  !isLogin
                    ? "bg-white text-blue-600 shadow-md"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Sign Up
              </button>
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
                  isLogin
                    ? "bg-white text-blue-600 shadow-md"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Sign In
              </button>
            </div>

            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent mb-2">
                {isLogin ? "Welcome Back" : "Get Started"}
              </h1>
              <p className="text-gray-600">
                {isLogin
                  ? "Sign in to your account to continue"
                  : "Create your account to get started"}
              </p>
            </div>

            {!isLogin ? (
              // Signup Form
              <div className="space-y-6">
                {errors.general && (
                  <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl text-sm">
                    {errors.general}
                  </div>
                )}

                {/* Full Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={signupForm.fullName}
                      onChange={(e) =>
                        setSignupForm({
                          ...signupForm,
                          fullName: e.target.value,
                        })
                      }
                      className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                        errors.fullName ? "border-red-500" : "border-gray-200"
                      }`}
                      placeholder="Enter your full name"
                    />
                  </div>
                  {errors.fullName && (
                    <p className="text-red-500 text-xs mt-2">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      value={signupForm.email}
                      onChange={(e) =>
                        setSignupForm({ ...signupForm, email: e.target.value })
                      }
                      className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                        errors.email ? "border-red-500" : "border-gray-200"
                      }`}
                      placeholder="Enter your email"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-2">{errors.email}</p>
                  )}
                </div>

                {/* PAN Card */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    PAN Card Number
                  </label>
                  <div className="relative">
                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={signupForm.panCard}
                      onChange={(e) =>
                        setSignupForm({
                          ...signupForm,
                          panCard: e.target.value.toUpperCase(),
                        })
                      }
                      className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                        errors.panCard ? "border-red-500" : "border-gray-200"
                      }`}
                      placeholder="ABCDE1234F"
                      maxLength={10}
                    />
                  </div>
                  {errors.panCard && (
                    <p className="text-red-500 text-xs mt-2">
                      {errors.panCard}
                    </p>
                  )}
                </div>

                {/* DOB */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Date of Birth
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="date"
                      value={signupForm.dateOfBirth}
                      onChange={(e) =>
                        setSignupForm({
                          ...signupForm,
                          dateOfBirth: e.target.value,
                        })
                      }
                      className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                        errors.dateOfBirth
                          ? "border-red-500"
                          : "border-gray-200"
                      }`}
                    />
                  </div>
                  {errors.dateOfBirth && (
                    <p className="text-red-500 text-xs mt-2">
                      {errors.dateOfBirth}
                    </p>
                  )}
                </div>

                {/* Mobile */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="tel"
                      value={signupForm.mobileNumber}
                      onChange={(e) =>
                        setSignupForm({
                          ...signupForm,
                          mobileNumber: e.target.value,
                        })
                      }
                      className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                        errors.mobileNumber
                          ? "border-red-500"
                          : "border-gray-200"
                      }`}
                      placeholder="Enter 10-digit mobile number"
                      maxLength={10}
                    />
                  </div>
                  {errors.mobileNumber && (
                    <p className="text-red-500 text-xs mt-2">
                      {errors.mobileNumber}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={signupForm.password}
                      onChange={(e) =>
                        setSignupForm({
                          ...signupForm,
                          password: e.target.value,
                        })
                      }
                      className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                        errors.password ? "border-red-500" : "border-gray-200"
                      }`}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-2">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={signupForm.confirmPassword}
                      onChange={(e) =>
                        setSignupForm({
                          ...signupForm,
                          confirmPassword: e.target.value,
                        })
                      }
                      className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                        errors.confirmPassword
                          ? "border-red-500"
                          : "border-gray-200"
                      }`}
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-2">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleSignup}
                  disabled={isLoading}
                  className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center ${
                    isLoading ? "opacity-75 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin h-5 w-5 mr-2" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="inline ml-2 h-5 w-5" />
                    </>
                  )}
                </button>
              </div>
            ) : (
              // Login Form
              <div className="space-y-6">
                {errors.general && (
                  <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl text-sm">
                    {errors.general}
                  </div>
                )}

                {/* Email or PAN */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email or PAN Card
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={loginForm.emailOrPan}
                      onChange={(e) =>
                        setLoginForm({
                          ...loginForm,
                          emailOrPan: e.target.value,
                        })
                      }
                      className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                        errors.emailOrPan ? "border-red-500" : "border-gray-200"
                      }`}
                      placeholder="Enter email or PAN card"
                    />
                  </div>
                  {errors.emailOrPan && (
                    <p className="text-red-500 text-xs mt-2">
                      {errors.emailOrPan}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      disabled={isLoading}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={loginForm.password}
                      onChange={(e) =>
                        setLoginForm({ ...loginForm, password: e.target.value })
                      }
                      className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                        errors.password ? "border-red-500" : "border-gray-200"
                      }`}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-2">
                      {errors.password}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleLogin}
                  disabled={isLoading}
                  className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center ${
                    isLoading ? "opacity-75 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin h-5 w-5 mr-2" />
                      Signing In...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="inline ml-2 h-5 w-5" />
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Features */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Secure & Fast</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>24/7 Support</span>
                </div>
              </div>
            </div>
          </div>
        </FadeInSection>
      </div>
    </div>
  );
}
