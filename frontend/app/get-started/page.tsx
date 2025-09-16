'use client';

import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, User, Mail, CreditCard, Calendar, Phone, Lock, CheckCircle, Building2, Menu, X, ChevronDown, FileText, Shield, Users, ArrowRight, TrendingUp, Clock, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import router from 'next/router';
import Link from 'next/link';

// Mock user storage (in real app, this would be a database)
let users: any[] = [];
let currentUser: any = null;

// Check if user is logged in on component mount
const checkCurrentUser = () => {
  if (typeof window !== 'undefined') {
    const storedUsers = localStorage.getItem('users');
    const storedCurrentUser = localStorage.getItem('currentUser');
    
    if (storedUsers) {
      users = JSON.parse(storedUsers);
    }
    if (storedCurrentUser) {
      currentUser = JSON.parse(storedCurrentUser);
      return true;
    }
  }
  return false;
};

// Enhanced Header Component
function EnhancedHeader({ isLoggedIn, user, onLogout }: { isLoggedIn: boolean, user: any, onLogout: () => void }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigation = [
    { name: "Company Formation", href: "/company-formation" },
    { name: "Other Registration", href: "/other-registration" },
    { name: "Taxation", href: "/taxation" },
    { name: "Trademark & ISO", href: "/trademark-iso" },
    { name: "ROC Returns", href: "/roc-returns" },
    { name: "Advisory", href: "/advisory" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? "bg-white/95 backdrop-blur-lg shadow-lg border-b border-blue-100" : "bg-transparent"
    }`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="relative">
              <Building2 className="h-10 w-10 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute inset-0 bg-blue-600 rounded-full opacity-20 scale-0 group-hover:scale-150 transition-transform duration-300"></div>
            </div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Com Financial Services
              </span>
              <div className="text-xs text-blue-500 font-medium">Your Business Partner</div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => (
              <button
                key={item.name}
                className="px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-200 text-sm font-medium rounded-lg hover:bg-blue-50"
              >
                {item.name}
              </button>
            ))}
            
            {isLoggedIn && user ? (
              <div className="relative ml-4">
                <button
                  className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-blue-100"
                  onMouseEnter={() => setShowUserMenu(true)}
                  onMouseLeave={() => setShowUserMenu(false)}
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-gray-700 font-medium">Hi, {user.fullName.split(' ')[0]}</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
                
                {showUserMenu && (
                  <div 
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-10 animate-fadeInUp"
                    onMouseEnter={() => setShowUserMenu(true)}
                    onMouseLeave={() => setShowUserMenu(false)}
                  >
                    <Button onClick={() => router.push("/profile")} className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center space-x-2 transition-colors">
                      <User className="w-4 h-4 text-gray-600" />
                      <span>Manage Profile</span>
                    </Button>
                    <Button onClick={() => router.push("/user")} className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center space-x-2 transition-colors">
                      <CheckCircle className="w-4 h-4 text-gray-600" />
                      <span>Open Dashboard</span>
                    </Button>
                    <hr className="my-1" />
                    <Button 
                      onClick={onLogout}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 text-blue-600 flex items-center space-x-2 transition-colors"
                    >
                      <Lock className="w-4 h-4" />
                      <span>Sign Out</span>
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <button className="ml-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                Sign up
              </button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-blue-50 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-blue-100 animate-fadeInUp">
            <nav className="flex flex-col space-y-2 pt-4">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  className="text-left px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </button>
              ))}
              {isLoggedIn && user ? (
                <div className="mx-4 mt-4 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium text-gray-800">Hi, {user.fullName.split(' ')[0]}</span>
                  </div>
                  <div className="space-y-2">
                    <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-white rounded transition-colors">
                      Manage Profile
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-white rounded transition-colors">
                      Open Dashboard
                    </button>
                    <button 
                      onClick={onLogout}
                      className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-white rounded transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <button className="mx-4 mt-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full py-2">
                  Get Started
                </button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

// Homepage Component
function HomePage({ user }: { user: any }) {
  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-blue-100/50"></div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 px-4 py-2 rounded-full text-sm font-medium inline-block animate-pulse">
                  ₹50+ Cr Business Registrations Processed
                </div>
                <h1 className="text-6xl lg:text-7xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 bg-clip-text text-transparent">
                    Your Business
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 bg-clip-text text-transparent">
                    Bandhu
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                  Getting your business started with simple, swift and reasonably priced legal services, online.
                </p>
                <div className="flex items-center space-x-2">
                  <div className="h-1 w-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
                  <p className="text-lg font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent tracking-wider">
                    REGISTRATIONS. FILINGS. COMPLIANCES.
                  </p>
                  <div className="h-1 w-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="border-2 border-blue-100 hover:border-blue-300 transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 cursor-pointer group bg-gradient-to-br from-white to-blue-50 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
                      <FileText className="h-6 w-6 text-blue-600 group-hover:scale-110 transition-transform" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Self Registration</h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">100% accuracy guaranteed</p>
                  <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 group-hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl text-white py-2 rounded-lg">
                    Start Now
                  </button>
                </div>

                <div className="border-2 border-blue-100 hover:border-blue-300 transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 cursor-pointer group bg-gradient-to-br from-white to-blue-50 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
                      <Users className="h-6 w-6 text-blue-600 group-hover:scale-110 transition-transform" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Expert Assistance</h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">Registration in 24 hours</p>
                  <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 group-hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl text-white py-2 rounded-lg">
                    Book Now
                  </button>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-200 rounded-3xl blur-3xl opacity-30"></div>
              <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-blue-100 hover:shadow-3xl transition-all duration-500">
                <div className="space-y-6">
                  <div className="w-full h-64 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center">
                    <Building2 className="w-24 h-24 text-blue-600" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Professional Registration Services</h3>
                    <p className="text-gray-600">Trusted by thousands of businesses across India</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
              Our Services
            </h2>
            <p className="text-xl text-gray-600">Choose from our comprehensive range of business services</p>
          </div>

          <div className="grid md:grid-cols-5 gap-6">
            {[
              { icon: Building2, title: "Company Registration", description: "Start your company with complete legal compliance" },
              { icon: FileText, title: "Other Registration", description: "LLP, Partnership, and other business structures" },
              { icon: TrendingUp, title: "Taxation", description: "GST, Income Tax, and tax planning services" },
              { icon: Award, title: "Trademark/ISO", description: "Protect your brand and get quality certification" },
              { icon: Shield, title: "ROC Returns", description: "Annual filings and company compliance" },
            ].map((service, index) => (
              <div key={index} className="text-center hover:shadow-2xl transition-all duration-500 hover:-translate-y-4 cursor-pointer group border-2 border-transparent hover:border-blue-200 bg-gradient-to-br from-white to-blue-50/50 rounded-lg p-8">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mb-6 group-hover:from-blue-200 group-hover:to-blue-300 transition-all duration-300 group-hover:scale-110">
                  <service.icon className="h-10 w-10 text-blue-600 group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-3">{service.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center space-y-6 mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold">Why Choose Com Financial Services?</h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto font-light">
              India's trusted business registration partner with proven expertise and unmatched service quality
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Clock, title: "Lightning Fast Processing", description: "Get your business registered in as little as 24 hours with our streamlined digital process." },
              { icon: Shield, title: "100% Secure & Compliant", description: "Your documents and data are completely secure with our encrypted systems and full legal compliance." },
              { icon: Award, title: "Expert Support Team", description: "Dedicated relationship manager and expert guidance throughout your business journey." },
            ].map((feature, index) => (
              <div key={index} className="text-center space-y-6 group">
                <div className="mx-auto w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 group-hover:scale-110">
                  <feature.icon className="h-10 w-10 text-white group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="text-2xl font-semibold">{feature.title}</h3>
                <p className="text-blue-100 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
              Ready to Start Your Business Journey?
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Join thousands of entrepreneurs who have successfully registered their companies with us. Get started today and turn your business dreams into reality.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center">
                Start Registration Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <Link href="/contact" passHref>
                <button className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 text-lg rounded-full transition-all duration-300 hover:scale-105 bg-transparent flex items-center justify-center">
                  Talk to Expert
                  <Phone className="ml-2 h-5 w-5" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Auth Component
function AuthComponent({ onAuthSuccess }: { onAuthSuccess: (user: any) => void }) {
  const [isLogin, setIsLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [signupForm, setSignupForm] = useState({
    fullName: '',
    email: '',
    panCard: '',
    dateOfBirth: '',
    mobileNumber: '',
    password: '',
    confirmPassword: ''
  });

  const [loginForm, setLoginForm] = useState({
    emailOrPan: '',
    password: ''
  });

  const [errors, setErrors] = useState<any>({});

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePAN = (pan: string) => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan);
  const validateMobile = (mobile: string) => /^[6-9]\d{9}$/.test(mobile);

  const handleSignupSubmit = () => {
    const newErrors: any = {};

    if (!signupForm.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!signupForm.email || !validateEmail(signupForm.email)) newErrors.email = 'Valid email is required';
    if (!signupForm.panCard || !validatePAN(signupForm.panCard)) newErrors.panCard = 'Valid PAN card number is required (e.g., ABCDE1234F)';
    if (!signupForm.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!signupForm.mobileNumber || !validateMobile(signupForm.mobileNumber)) newErrors.mobileNumber = 'Valid mobile number is required';
    if (!signupForm.password || signupForm.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (signupForm.password !== signupForm.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    if (users.some(user => user.email === signupForm.email || user.panCard === signupForm.panCard)) {
      newErrors.general = 'User with this email or PAN card already exists';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const newUser = {
        id: Date.now(),
        fullName: signupForm.fullName,
        email: signupForm.email,
        panCard: signupForm.panCard,
        dateOfBirth: signupForm.dateOfBirth,
        mobileNumber: signupForm.mobileNumber,
        password: signupForm.password
      };
      users.push(newUser);
      
      // Store in memory (localStorage not available in artifacts)
      currentUser = newUser;
      onAuthSuccess(newUser);
    }
  };

  const handleLoginSubmit = () => {
    const newErrors: any = {};

    if (!loginForm.emailOrPan) newErrors.emailOrPan = 'Email or PAN card is required';
    if (!loginForm.password) newErrors.password = 'Password is required';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const user = users.find(u => 
        (u.email === loginForm.emailOrPan || u.panCard === loginForm.emailOrPan) && 
        u.password === loginForm.password
      );

      if (user) {
        currentUser = user;
        onAuthSuccess(user);
      } else {
        setErrors({ general: 'Invalid credentials' });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {isLogin ? 'Welcome Back' : 'Get Started'}
          </h1>
          <p className="text-gray-600">
            {isLogin ? 'Sign in to your account' : 'Create your account to continue'}
          </p>
        </div>

        {!isLogin ? (
          <div className="space-y-4">
            {errors.general && (
              <div className="bg-blue-50 text-blue-600 p-3 rounded-lg text-sm">
                {errors.general}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={signupForm.fullName}
                  onChange={(e) => setSignupForm({...signupForm, fullName: e.target.value})}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.fullName ? 'border-blue-500' : 'border-gray-300'}`}
                  placeholder="Enter your full name"
                />
              </div>
              {errors.fullName && <p className="text-blue-500 text-xs mt-1">{errors.fullName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={signupForm.email}
                  onChange={(e) => setSignupForm({...signupForm, email: e.target.value})}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.email ? 'border-blue-500' : 'border-gray-300'}`}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && <p className="text-blue-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">PAN Card Number</label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={signupForm.panCard}
                  onChange={(e) => setSignupForm({...signupForm, panCard: e.target.value.toUpperCase()})}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.panCard ? 'border-blue-500' : 'border-gray-300'}`}
                  placeholder="ABCDE1234F"
                  maxLength={10}
                />
              </div>
              {errors.panCard && <p className="text-blue-500 text-xs mt-1">{errors.panCard}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="date"
                  value={signupForm.dateOfBirth}
                  onChange={(e) => setSignupForm({...signupForm, dateOfBirth: e.target.value})}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.dateOfBirth ? 'border-blue-500' : 'border-gray-300'}`}
                />
              </div>
              {errors.dateOfBirth && <p className="text-blue-500 text-xs mt-1">{errors.dateOfBirth}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="tel"
                  value={signupForm.mobileNumber}
                  onChange={(e) => setSignupForm({...signupForm, mobileNumber: e.target.value})}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.mobileNumber ? 'border-blue-500' : 'border-gray-300'}`}
                  placeholder="Enter 10-digit mobile number"
                  maxLength={10}
                />
              </div>
              {errors.mobileNumber && <p className="text-blue-500 text-xs mt-1">{errors.mobileNumber}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={signupForm.password}
                  onChange={(e) => setSignupForm({...signupForm, password: e.target.value})}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.password ? 'border-blue-500' : 'border-gray-300'}`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-blue-500 text-xs mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={signupForm.confirmPassword}
                  onChange={(e) => setSignupForm({...signupForm, confirmPassword: e.target.value})}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.confirmPassword ? 'border-blue-500' : 'border-gray-300'}`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-blue-500 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>

            <button
              type="button"
              onClick={handleSignupSubmit}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105"
            >
              Register
            </button>

            <div className="text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className="text-blue-600 hover:text-blue-800 font-semibold"
                >
                  Sign In
                </button>
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {errors.general && (
              <div className="bg-blue-50 text-blue-600 p-3 rounded-lg text-sm">
                {errors.general}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email or PAN Card</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={loginForm.emailOrPan}
                  onChange={(e) => setLoginForm({...loginForm, emailOrPan: e.target.value})}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.emailOrPan ? 'border-blue-500' : 'border-gray-300'}`}
                  placeholder="Enter email or PAN card"
                />
              </div>
              {errors.emailOrPan && <p className="text-blue-500 text-xs mt-1">{errors.emailOrPan}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.password ? 'border-blue-500' : 'border-gray-300'}`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-blue-500 text-xs mt-1">{errors.password}</p>}
            </div>

            <button
              type="button"
              onClick={handleLoginSubmit}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105"
            >
              Sign In
            </button>

            <div className="text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className="text-blue-600 hover:text-blue-800 font-semibold"
                >
                  Sign Up
                </button>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Main App Component
export default function IntegratedApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const hasUser = checkCurrentUser();
    if (hasUser && currentUser) {
      setIsLoggedIn(true);
      setUser(currentUser);
    }
  }, []);

  const handleAuthSuccess = (userData: any) => {
    setUser(userData);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    currentUser = null;
    setUser(null);
    setIsLoggedIn(false);
    // In a real app, you would also clear localStorage here
  };

  if (!isLoggedIn) {
    return <AuthComponent onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <>
      <EnhancedHeader isLoggedIn={isLoggedIn} user={user} onLogout={handleLogout} />
      <HomePage user={user} />
    </>
  );
}