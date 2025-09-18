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
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState<string | null>(null);
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
      name: "Company Formation",
      href: "/company-formation",
      dropdown: [
        { name: "Private Limited Company", href: "/company-formation/private-limited" },
        { name: "Public Limited Company", href: "/company-formation/public-limited" },
        { name: "One Person Company", href: "/company-formation/one-person-company" },
        { name: "Section 8 Company", href: "/company-formation/section-8" },
        { name: "Nidhi Company", href: "/company-formation/nidhi-company" },
        { name: "Producer Company", href: "/company-formation/producer-company" },
      ],
    },
    {
      name: "Other Registration",
      href: "/other-registration",
      dropdown: [
        { name: "LLP Registration", href: "/other-registration/llp-registration" },
        { name: "Partnership Firm", href: "/other-registration/partnership-firm" },
        { name: "Sole Proprietorship", href: "/other-registration/sole-proprietorship" },
        { name: "MSME/Udyam Registration", href: "/other-registration/msme-udyam-registration" },
        { name: "EPFO Registration", href: "/other-registration/epfo" },
        { name: "ESIC Registration", href: "/other-registration/esic" },
        { name: "PT Tax Registration", href: "/other-registration/pt-tax" },
        { name: "IEC Registration", href: "/other-registration/iec-registration" },
        { name: "Gumusta / Shop Registration", href: "/other-registration/gumusta-shop-registration" },
        { name: "Fassai (Food) Licence", href: "/other-registration/fassai-food-license" },
        { name: "Industry Licence", href: "/other-registration/industry-license" },
        { name: "NGO Registration", href: "/other-registration/ngo-registration" },
        { name: "PAN Application", href: "/other-registration/pan-apply" },
        { name: "TAN Application", href: "/other-registration/tan-apply" },
        { name: "Start-up India Registration", href: "/other-registration/startup-india-registration" },
        { name: "Digital Signature", href: "/other-registration/digital-signature" },
        { name: "GST Registration", href: "/other-registration/gst-registration" },
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
        { name: "Corporate Tax Filing", href: "/taxation/corporate-tax-filing" },
        { name: "Payroll Tax", href: "/taxation/payroll-tax" },
      ],
    },
    {
      name: "Trademark & ISO",
      href: "/trademark-iso",
      dropdown: [
        { name: "Trademark Registration", href: "/trademark-iso/trademark" },
        { name: "ISO 9001 Certification", href: "/trademark-iso/iso-9001" },
        { name: "ISO 14001 Certification", href: "/trademark-iso/iso-14001-certification" },
        { name: "Copyright Registration", href: "/trademark-iso/copyright-registration" },
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
        { name: "Business Strategy Consulting", href: "/advisory/business-strategy-consulting" },
        { name: "Legal & Compliance Advisory", href: "/advisory/legal-compliance-advisory" },
        { name: "HR & Organizational Development", href: "/advisory/hr-organizational-development" },
        { name: "Financial Planning & Analysis", href: "/advisory/financial-planning-analysis" },
        { name: "Digital Transformation", href: "/advisory/digital-transformation" },
        { name: "Startup Mentoring", href: "/advisory/startup-mentoring" },
        { name: "Tax Plan Analysis", href: "/advisory/tax-plan-analysis" },
        { name: "Assistance for Fund Raising", href: "/advisory/assistance-for-fund-raising" },
        { name: "Other Finance Related Services", href: "/advisory/other-finance-related-services" },
      ]
    },
  ];

  // Toggle mobile dropdown
  const toggleMobileDropdown = (itemName: string) => {
    setMobileDropdownOpen(prev => prev === itemName ? null : itemName);
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
          ? "bg-white/95 backdrop-blur-lg shadow-lg border-b border-blue-100"
          : "bg-white shadow-sm"
      }`}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Company Name in one line */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <Building2 className="h-10 w-10 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute inset-0 bg-blue-600 rounded-full opacity-20 scale-0 group-hover:scale-150 transition-transform duration-300"></div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-blue-600">
                Com Financial Services
              </span>
            </div>
          </Link>

          {/* Desktop Navigation - Single line */}
          <nav className="hidden lg:flex items-center space-x-6">
            {navigation.map((item) => (
              <div
                key={item.name}
                className="relative group"
                onMouseEnter={() => setActiveDropdown(item.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={item.href}
                  className="relative px-2 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-200 text-sm font-medium"
                >
                  {item.name}
                  {/* Blue underline on hover */}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                </Link>

                {item.dropdown && activeDropdown === item.name && (
                  <div
                    className={`absolute top-full mt-1 bg-white rounded-lg shadow-xl border border-gray-200 py-2 animate-fadeInUp z-[10000] ${item.name === 'Advisory' ? 'right-0' : 'left-0'} ${item.name === 'Other Registration' ? 'w-max max-w-4xl' : item.name === 'Tools' ? 'w-max max-w-5xl' : 'w-64'} max-h-[80vh] overflow-y-auto`}>
                    <div
                      className={``}>
                      {item.dropdown.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className="block px-4 py-3 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {/* User section */}
            <div 
              className="relative"
              onMouseEnter={() => setDropdownOpen(true)} 
              onMouseLeave={() => setDropdownOpen(false)}
            >
              {isAuthenticated ? (
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors">
                    {user?.avatarUrl ? (
                      <img 
                        src={getAvatarUrl(user.avatarUrl) || ""}  
                        alt="user avatar" 
                        className="w-8 h-8 rounded-full" 
                      />
                    ) : (
                      <UserIcon className="w-5 h-5" />
                    )}
                    <span className="font-medium text-sm">
                      {user?.name}
                    </span>
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 z-[10000] mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Link
                        href="/dashboard"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                      >
                        <LayoutDashboard className="w-4 h-4 mr-2" />
                        Dashboard
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md shadow-sm hover:shadow-md transition-all duration-300"
                  onClick={() => router.push("/auth")}
                >
                  Sign up
                </Button>
              )}
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-blue-50 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-blue-100 animate-fadeInUp">
            <nav className="flex flex-col space-y-2 pt-4 max-h-[80vh] overflow-y-auto">
              {navigation.map((item) => (
                <div key={item.name} className="border-b border-gray-100 last:border-0">
                  {item.dropdown ? (
                    <>
                      <button
                        onClick={() => toggleMobileDropdown(item.name)}
                        className="w-full flex items-center justify-between px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <span>{item.name}</span>
                        <svg
                          className={`w-4 h-4 transition-transform duration-200 ${
                            mobileDropdownOpen === item.name ? 'transform rotate-180' : ''
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
                      </button>
                      <div
                        className={`overflow-hidden transition-all duration-300 ${
                          mobileDropdownOpen === item.name ? 'max-h-[400px]' : 'max-h-0'
                        }`}
                      >
                        <div className="ml-4 space-y-1 py-1 max-h-[300px] overflow-y-auto">
                          {item.dropdown.map((subItem) => (
                            <Link
                              key={subItem.name}
                              href={subItem.href}
                              className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              onClick={() => {
                                setIsMenuOpen(false);
                                setMobileDropdownOpen(null);
                              }}
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className="block px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      onClick={() => {
                        setIsMenuOpen(false);
                        setMobileDropdownOpen(null);
                      }}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
              <Button
                className="mx-4 mt-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                onClick={() => router.push("/auth")}
              >
                Get Started
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
