"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
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
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Check localStorage for currentUser
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("currentUser");
      if (stored) setUser(JSON.parse(stored));
      else setUser(null);
    }
  }, []);

  const navigation = [
    {
      name: "Company Formation",
      href: "/company-formation",
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
        { name: "LLP Registration", href: "/other-registration/llp" },
        { name: "Partnership Firm", href: "/other-registration/partnership" },
        {
          name: "Sole Proprietorship",
          href: "/other-registration/sole-proprietorship",
        },
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
      ],
    },
    {
      name: "Trademark & ISO",
      href: "/trademark-iso",
      dropdown: [
        { name: "Trademark Registration", href: "/trademark-iso/trademark" },
        { name: "ISO 9001 Certification", href: "/trademark-iso/iso-9001" },
        { name: "ISO 14001 Certification", href: "/trademark-iso/iso-14001" },
        { name: "Copyright Registration", href: "/trademark-iso/copyright" },
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
    { name: "Advisory", href: "/advisory" },
  ];

  // Toggle mobile dropdown
  const toggleMobileDropdown = (itemName: string) => {
    setMobileDropdownOpen((prev) => (prev === itemName ? null : itemName));
  };

  // Sign out handler
  const handleSignOut = () => {
    localStorage.removeItem("currentUser");
    setUser(null);
    setIsMenuOpen(false);
    setMobileDropdownOpen(null);
    router.push("/");
  };

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
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
                  <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 animate-fadeInUp z-50">
                    {item.dropdown.map((subItem) => (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        className="block px-4 py-3 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* User section */}
            {!user ? (
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md shadow-sm hover:shadow-md transition-all duration-300"
                onClick={() => router.push("/auth")}
              >
                Sign up
              </Button>
            ) : (
              <div
                className="relative group"
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <button
                  className="relative flex items-center gap-2 px-2 py-2 text-blue-600 hover:text-gray-900 transition-colors duration-200 text-sm font-medium"
                  style={{ minWidth: 0 }}
                  type="button"
                >
                  <UserIcon className="w-4 h-4" />
                  <span>Hi</span>
                  <span className="font-semibold">
                    {user.fullName.split(" ")[0]}
                  </span>
                  {/* Blue underline on hover */}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-900 transition-all duration-300 group-hover:w-full"></span>
                </button>
                {dropdownOpen && (
                  <div
                    className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 animate-fadeInUp z-50"
                    onMouseEnter={() => setDropdownOpen(true)}
                    onMouseLeave={() => setDropdownOpen(false)}
                  >
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      Manage Profile
                    </Link>
                    <Link
                      href="/user"
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Open Dashboard
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}
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
            <nav className="flex flex-col space-y-2 pt-4">
              {navigation.map((item) => (
                <div
                  key={item.name}
                  className="border-b border-gray-100 last:border-0"
                >
                  {item.dropdown ? (
                    <>
                      <button
                        onClick={() => toggleMobileDropdown(item.name)}
                        className="w-full flex items-center justify-between px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <span>{item.name}</span>
                        <svg
                          className={`w-4 h-4 transition-transform duration-200 ${
                            mobileDropdownOpen === item.name
                              ? "transform rotate-180"
                              : ""
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
                          mobileDropdownOpen === item.name
                            ? "max-h-96"
                            : "max-h-0"
                        }`}
                      >
                        <div className="ml-4 space-y-1 py-1">
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
                onClick={() => router.push("/get-started")}
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
