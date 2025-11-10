"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/providers/auth-provider";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getAvatarUrl } from "@/lib/avatar-utils";
import {
  Building2,
  Menu,
  X,
  User as UserIcon,
  Settings,
  LayoutDashboard,
  LogOut,
} from "lucide-react";

export function EnhancedHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState<string | null>(
    null
  );
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigation = [
    {
      name: "Company Information",
      href: "/company-information",
      dropdown: [
        {
          name: "Private Limited Company",
          href: "/company-formation/private-limited",
        },
        {
          name: "Public Limited Company",
          href: "/company-formation/public-limited",
        },
        {
          name: "One Person Company",
          href: "/company-formation/one-person-company",
        },
        { name: "Section 8 Company", href: "/company-formation/section-8" },
        { name: "Nidhi Company", href: "/company-formation/nidhi-company" },
        {
          name: "Producer Company",
          href: "/company-formation/producer-company",
        },
      ],
    },
    {
      name: "Other Registration",
      href: "/other-registration",
      dropdown: [
        // Business Registrations (0-5)
        {
          name: "LLP Registration",
          href: "/other-registration/llp-registration",
        },
        {
          name: "Partnership Firm",
          href: "/other-registration/partnership-firm",
        },
        {
          name: "Sole Proprietorship",
          href: "/other-registration/sole-proprietorship",
        },
        {
          name: "Digital Signature",
          href: "/other-registration/digital-signature",
        },
        {
          name: "IEC Registration",
          href: "/other-registration/iec-registration",
        },
        {
          name: "NGO Registration",
          href: "/other-registration/ngo-registration",
        },
        // Government Registrations (6-12)
        {
          name: "MSME/Udyam Registration",
          href: "/other-registration/msme-udyam-registration",
        },
        { name: "EPFO Registration", href: "/other-registration/epfo" },
        { name: "ESIC Registration", href: "/other-registration/esic" },
        {
          name: "Gumusta / Shop Registration",
          href: "/other-registration/gumusta-shop-registration",
        },
        {
          name: "Fassai (Food) Licence",
          href: "/other-registration/fassai-food-license",
        },
        {
          name: "Industry Licence",
          href: "/other-registration/industry-license",
        },
        {
          name: "Start-up India Registration",
          href: "/other-registration/startup-india-registration",
        },
        // Tax & Compliance (13-16)
        {
          name: "GST Registration",
          href: "/other-registration/gst-registration",
        },
        { name: "PT Tax Registration", href: "/other-registration/pt-tax" },
        { name: "PAN Application", href: "/other-registration/pan-apply" },
        { name: "TAN Application", href: "/other-registration/tan-apply" },
      ],
    },
    {
      name: "Reports",
      href: "/reports",
      dropdown: [
        { name: "Project Reports", href: "/reports/project-reports" },
        { name: "CMA Reports", href: "/reports/cma-reports" },
        { name: "DSCR Reports", href: "/reports/dscr-reports" },
        { name: "Bank Reconciliation", href: "/reports/bank-reconciliation" },
      ],
    },
    {
      name: "Taxation",
      href: "/taxation",
      dropdown: [
        { name: "GST Filing", href: "/taxation/gst-filing" },
        { name: "Income Tax Filing", href: "/taxation/income-tax" },
        { name: "TDS Returns", href: "/taxation/tds-returns" },
        { name: "Tax Planning", href: "/taxation/tax-planning" },
        { name: "EPFO Filing", href: "/taxation/epfo-filing" },
        { name: "ESIC Filing", href: "/taxation/esic-filing" },
        { name: "PT-Tax Filing", href: "/taxation/pt-tax-filing" },
        {
          name: "Corporate Tax Filing",
          href: "/taxation/corporate-tax-filing",
        },
        { name: "Payroll Tax", href: "/taxation/payroll-tax" },
      ],
    },
    {
      name: "Trademark & ISO",
      href: "/trademark-iso",
      dropdown: [
        { name: "Trademark Registration", href: "/trademark-iso/trademark" },
        { name: "ISO 9001 Certification", href: "/trademark-iso/iso-9001" },
        {
          name: "ISO 14001 Certification",
          href: "/trademark-iso/iso-14001-certification",
        },
        {
          name: "Copyright Registration",
          href: "/trademark-iso/copyright-registration",
        },
      ],
    },
    {
      name: "ROC Returns",
      href: "/roc-returns",
      dropdown: [
        { name: "Annual Filing", href: "/roc-returns/annual-filing" },
        { name: "Board Resolutions", href: "/roc-returns/board-resolutions" },
        { name: "Director Changes", href: "/roc-returns/director-changes" },
        { name: "Share Transfer", href: "/roc-returns/share-transfer" },
      ],
    },
    // {
    //   name: "Tools",
    //   href: "/tools",
    //   dropdown: [
    //     { name: "Income Tax Calculator", href: "/tools/income-tax-calculator" },
    //     { name: "EMI Calculator", href: "/tools/emi-calculator" },
    //     { name: "Mutual Fund Calculator", href: "/tools/mutual-fund-calculator" },
    //     { name: "HSN Code Finder", href: "/tools/hsn-code-finder" },
    //     { name: "SIP Calculator", href: "/tools/sip-calculator" },
    //     { name: "GST Calculator", href: "/tools/gst-calculator" },
    //     { name: "PPF Calculator", href: "/tools/ppf-calculator" },
    //     { name: "GST Number Search", href: "/tools/gst-number-search" },
    //     { name: "IFSC Code Search", href: "/tools/ifsc-code-search" },
    //     { name: "Generate Rent Receipts", href: "/tools/rent-receipts" },
    //     { name: "Home Loan EMI Calculator", href: "/tools/home-loan-emi" },
    //     { name: "NPS Calculator", href: "/tools/nps-calculator" },
    //     { name: "HRA Calculator", href: "/tools/hra-calculator" },
    //     { name: "RD Calculator", href: "/tools/rd-calculator" },
    //     { name: "FD Calculator", href: "/tools/fd-calculator" },
    //     { name: "Gold Rates Today", href: "/tools/gold-rates" },
    //     { name: "Currency Converter", href: "/tools/currency-converter" },
    //     { name: "Compound Interest Calculator", href: "/tools/compound-interest" },
    //     { name: "Tax Saving Calculator", href: "/tools/tax-saving" },
    //     { name: "Get IT Refund Status", href: "/tools/it-refund-status" },
    //     { name: "Salary Calculator", href: "/tools/salary-calculator" },
    //     { name: "EPF Calculator", href: "/tools/epf-calculator" },
    //     { name: "GST Number Search by Name", href: "/tools/gst-search-by-name" },
    //   ]
    // },
    {
      name: "Advisory",
      href: "/advisory",
      dropdown: [
        {
          name: "Business Strategy Consulting",
          href: "/advisory/business-strategy-consulting",
        },
        {
          name: "Legal & Compliance Advisory",
          href: "/advisory/legal-compliance-advisory",
        },
        {
          name: "HR & Organizational Development",
          href: "/advisory/hr-organizational-development",
        },
        {
          name: "Financial Planning & Analysis",
          href: "/advisory/financial-planning-analysis",
        },
        {
          name: "Digital Transformation",
          href: "/advisory/digital-transformation",
        },
        { name: "Startup Mentoring", href: "/advisory/startup-mentoring" },
        { name: "Tax Plan Analysis", href: "/advisory/tax-plan-analysis" },
        {
          name: "Assistance for Fund Raising",
          href: "/advisory/assistance-for-fund-raising",
        },
        {
          name: "Other Finance Related Services",
          href: "/advisory/other-finance-related-services",
        },
      ],
    },
  ];

  // Toggle mobile dropdown
  const toggleMobileDropdown = (itemName: string) => {
    setMobileDropdownOpen((prev) => (prev === itemName ? null : itemName));
  };

  // Sign out handler
  const handleSignOut = () => {
    logout();
    setIsMenuOpen(false);
    setMobileDropdownOpen(null);
  };

  return (
    <header
      className={`fixed top-0 w-full z-[10000] transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-lg shadow-xl border-b border-blue-100"
          : "bg-white/90 backdrop-blur-sm shadow-md"
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Enhanced Logo and Company Name */}
          <Link href="/" className="flex items-center space-x-4 group">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                <Building2 className="h-7 w-7 text-white group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl opacity-0 group-hover:opacity-20 scale-0 group-hover:scale-110 transition-all duration-300"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent group-hover:from-blue-500 group-hover:to-blue-600 transition-all duration-300">
                Com Financial Services
              </span>
              <span className="text-xs text-gray-500 font-medium -mt-1">
                Your Business Partner
              </span>
            </div>
          </Link>

          {/* Enhanced Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-2">
            {navigation.map((item) => (
              <div
                key={item.name}
                className="relative group"
                onMouseEnter={() => setActiveDropdown(item.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={item.href}
                  className="relative px-4 py-3 text-gray-700 hover:text-blue-600 transition-all duration-300 text-sm font-semibold rounded-lg hover:bg-blue-50/50 group-hover:shadow-sm"
                >
                  {item.name}
                  {/* Enhanced underline effect */}
                  <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300 group-hover:w-3/4 rounded-full"></span>
                </Link>

                {item.dropdown && activeDropdown === item.name && (
                  <div
                    className={`absolute top-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 py-4 animate-fadeInUp z-[10000] ${
                      item.name === "Advisory" ? "right-0" : "left-0"
                    } ${
                      item.name === "Other Registration"
                        ? "w-max max-w-6xl"
                        : item.name === "Tools"
                        ? "w-max max-w-5xl"
                        : "w-72"
                    } max-h-[80vh] overflow-y-auto backdrop-blur-sm`}
                  >
                    {item.name === "Other Registration" ? (
                      // Mega Menu for Other Registration
                      <div className="px-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {/* Column 1: Business Registrations */}
                          <div className="space-y-3">
                            <h4 className="text-sm font-bold text-blue-600 uppercase tracking-wide border-b border-blue-100 pb-2">
                              Business Registrations
                            </h4>
                            {item.dropdown.slice(0, 6).map((subItem) => (
                              <Link
                                key={subItem.name}
                                href={subItem.href}
                                className="block px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 rounded-lg transition-all duration-300 hover:translate-x-1 group"
                              >
                                <span className="group-hover:font-medium">
                                  {subItem.name}
                                </span>
                              </Link>
                            ))}
                          </div>

                          {/* Column 2: Government Registrations */}
                          <div className="space-y-3">
                            <h4 className="text-sm font-bold text-blue-600 uppercase tracking-wide border-b border-blue-100 pb-2">
                              Government Registrations
                            </h4>
                            {item.dropdown.slice(6, 13).map((subItem) => (
                              <Link
                                key={subItem.name}
                                href={subItem.href}
                                className="block px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 rounded-lg transition-all duration-300 hover:translate-x-1 group"
                              >
                                <span className="group-hover:font-medium">
                                  {subItem.name}
                                </span>
                              </Link>
                            ))}
                          </div>

                          {/* Column 3: Tax & Compliance */}
                          <div className="space-y-3">
                            <h4 className="text-sm font-bold text-blue-600 uppercase tracking-wide border-b border-blue-100 pb-2">
                              Tax & Compliance
                            </h4>
                            {item.dropdown.slice(13, 17).map((subItem) => (
                              <Link
                                key={subItem.name}
                                href={subItem.href}
                                className="block px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 rounded-lg transition-all duration-300 hover:translate-x-1 group"
                              >
                                <span className="group-hover:font-medium">
                                  {subItem.name}
                                </span>
                              </Link>
                            ))}
                          </div>
                        </div>

                        {/* Bottom CTA Section */}
                        <div className="mt-6 pt-4 border-t border-gray-100">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-semibold text-gray-800">
                                Need Help Choosing?
                              </p>
                              <p className="text-xs text-gray-500">
                                Our experts can guide you to the right service
                              </p>
                            </div>
                            <Link
                              href="/contact"
                              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                            >
                              Get Consultation
                            </Link>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // Regular dropdown for other items
                      <div className="px-2">
                        {item.dropdown.map((subItem) => (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            className="block px-4 py-3 text-sm text-gray-600 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 rounded-lg transition-all duration-300 hover:translate-x-1 group"
                          >
                            <span className="group-hover:font-medium">
                              {subItem.name}
                            </span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* Enhanced User section */}
            {isAuthenticated ? (
              <div 
                className="relative group"
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <button className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 transition-all duration-300 py-2 px-3 rounded-lg hover:bg-blue-50/50 group">
                  {user?.avatarUrl ? (
                    <div className="relative">
                      <img
                        src={getAvatarUrl(user.avatarUrl) || ""}
                        alt="user avatar"
                        className="w-9 h-9 rounded-full ring-2 ring-blue-100 group-hover:ring-blue-300 transition-all duration-300"
                      />
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                  ) : (
                    <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <UserIcon className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <div className="flex flex-col items-start">
                    <span className="font-semibold text-sm text-gray-800 group-hover:text-blue-600 transition-colors">
                      {user?.name}
                    </span>
                    <span className="text-xs text-gray-500">Welcome back</span>
                  </div>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 z-[10000] w-56 rounded-xl bg-white shadow-2xl border border-gray-100 py-2 mt-2 backdrop-blur-sm">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-800">
                        {user?.name}
                      </p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <Link
                      href="/dashboard"
                      className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 transition-all duration-300 hover:translate-x-1 group"
                    >
                      <LayoutDashboard className="w-4 h-4 mr-3 text-blue-500" />
                      <span className="group-hover:font-medium">Dashboard</span>
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 transition-all duration-300 hover:translate-x-1 group"
                    >
                      <LogOut className="w-4 h-4 mr-3 text-red-500" />
                      <span className="group-hover:font-medium">Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg transition-all duration-300"
                  onClick={() => router.push("/auth")}
                >
                  Sign In
                </Button>
                <Button
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  onClick={() => router.push("/auth")}
                >
                  Get Started
                </Button>
              </div>
            )}
          </nav>

          {/* Enhanced Mobile Menu Button */}
          <button
            className="lg:hidden p-3 rounded-xl hover:bg-blue-50 transition-all duration-300 hover:scale-105 group"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="relative">
              {isMenuOpen ? (
                <X className="h-6 w-6 text-gray-700 group-hover:text-blue-600 transition-colors" />
              ) : (
                <Menu className="h-6 w-6 text-gray-700 group-hover:text-blue-600 transition-colors" />
              )}
            </div>
          </button>
        </div>

        {/* Enhanced Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden mt-6 pb-6 border-t border-gradient-to-r from-blue-100 to-blue-200 animate-fadeInUp">
            <nav className="flex flex-col space-y-3 pt-6 max-h-[80vh] overflow-y-auto">
              {navigation.map((item) => (
                <div key={item.name} className="bg-gray-50/50 rounded-xl p-1">
                  {item.dropdown ? (
                    <>
                      <button
                        onClick={() => toggleMobileDropdown(item.name)}
                        className="w-full flex items-center justify-between px-4 py-4 text-gray-700 hover:text-blue-600 hover:bg-white rounded-lg transition-all duration-300 group"
                      >
                        <span className="font-semibold group-hover:text-blue-600">
                          {item.name}
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500 bg-blue-100 px-2 py-1 rounded-full">
                            {item.dropdown.length} services
                          </span>
                          <svg
                            className={`w-5 h-5 transition-transform duration-300 ${
                              mobileDropdownOpen === item.name
                                ? "transform rotate-180 text-blue-600"
                                : "text-gray-400"
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </div>
                      </button>
                      <div
                        className={`overflow-hidden transition-all duration-500 ${
                          mobileDropdownOpen === item.name
                            ? "max-h-[600px] opacity-100"
                            : "max-h-0 opacity-0"
                        }`}
                      >
                        {item.name === "Other Registration" ? (
                          // Mega Menu for Mobile - Other Registration
                          <div className="ml-4 space-y-4 py-3 max-h-[500px] overflow-y-auto">
                            {/* Business Registrations */}
                            <div className="space-y-2">
                              <h5 className="text-xs font-bold text-blue-600 uppercase tracking-wide border-b border-blue-100 pb-1">
                                Business Registrations
                              </h5>
                              {item.dropdown.slice(0, 6).map((subItem) => (
                                <Link
                                  key={subItem.name}
                                  href={subItem.href}
                                  className="block px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 rounded-lg transition-all duration-300 hover:translate-x-2 group"
                                  onClick={() => {
                                    setIsMenuOpen(false);
                                    setMobileDropdownOpen(null);
                                  }}
                                >
                                  <span className="group-hover:font-medium">
                                    {subItem.name}
                                  </span>
                                </Link>
                              ))}
                            </div>

                            {/* Government Registrations */}
                            <div className="space-y-2">
                              <h5 className="text-xs font-bold text-blue-600 uppercase tracking-wide border-b border-blue-100 pb-1">
                                Government Registrations
                              </h5>
                              {item.dropdown.slice(6, 12).map((subItem) => (
                                <Link
                                  key={subItem.name}
                                  href={subItem.href}
                                  className="block px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 rounded-lg transition-all duration-300 hover:translate-x-2 group"
                                  onClick={() => {
                                    setIsMenuOpen(false);
                                    setMobileDropdownOpen(null);
                                  }}
                                >
                                  <span className="group-hover:font-medium">
                                    {subItem.name}
                                  </span>
                                </Link>
                              ))}
                            </div>

                            {/* Tax & Compliance */}
                            <div className="space-y-2">
                              <h5 className="text-xs font-bold text-blue-600 uppercase tracking-wide border-b border-blue-100 pb-1">
                                Tax & Compliance
                              </h5>
                              {item.dropdown.slice(12, 18).map((subItem) => (
                                <Link
                                  key={subItem.name}
                                  href={subItem.href}
                                  className="block px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 rounded-lg transition-all duration-300 hover:translate-x-2 group"
                                  onClick={() => {
                                    setIsMenuOpen(false);
                                    setMobileDropdownOpen(null);
                                  }}
                                >
                                  <span className="group-hover:font-medium">
                                    {subItem.name}
                                  </span>
                                </Link>
                              ))}
                            </div>

                            {/* Specialized Services */}
                            <div className="space-y-2">
                              <h5 className="text-xs font-bold text-blue-600 uppercase tracking-wide border-b border-blue-100 pb-1">
                                Specialized Services
                              </h5>
                              {item.dropdown.slice(18).map((subItem) => (
                                <Link
                                  key={subItem.name}
                                  href={subItem.href}
                                  className="block px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 rounded-lg transition-all duration-300 hover:translate-x-2 group"
                                  onClick={() => {
                                    setIsMenuOpen(false);
                                    setMobileDropdownOpen(null);
                                  }}
                                >
                                  <span className="group-hover:font-medium">
                                    {subItem.name}
                                  </span>
                                </Link>
                              ))}
                            </div>
                          </div>
                        ) : (
                          // Regular mobile dropdown for other items
                          <div className="ml-4 space-y-2 py-3 max-h-[400px] overflow-y-auto">
                            {item.dropdown.map((subItem) => (
                              <Link
                                key={subItem.name}
                                href={subItem.href}
                                className="block px-4 py-3 text-sm text-gray-600 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 rounded-lg transition-all duration-300 hover:translate-x-2 group"
                                onClick={() => {
                                  setIsMenuOpen(false);
                                  setMobileDropdownOpen(null);
                                }}
                              >
                                <span className="group-hover:font-medium">
                                  {subItem.name}
                                </span>
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className="block px-4 py-4 text-gray-700 hover:text-blue-600 hover:bg-white rounded-lg transition-all duration-300 font-semibold group"
                      onClick={() => {
                        setIsMenuOpen(false);
                        setMobileDropdownOpen(null);
                      }}
                    >
                      <span className="group-hover:text-blue-600">
                        {item.name}
                      </span>
                    </Link>
                  )}
                </div>
              ))}

              {/* Enhanced Mobile Auth Buttons */}
              <div className="flex flex-col space-y-3 pt-4">
                <Button
                  variant="outline"
                  className="w-full text-gray-700 border-gray-300 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 py-3 rounded-xl transition-all duration-300"
                  onClick={() => {
                    router.push("/auth");
                    setIsMenuOpen(false);
                  }}
                >
                  Sign In
                </Button>
                <Button
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  onClick={() => {
                    router.push("/auth");
                    setIsMenuOpen(false);
                  }}
                >
                  Get Started
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
