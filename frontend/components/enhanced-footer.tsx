"use client";

import Link from "next/link";
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
} from "lucide-react";

export function EnhancedFooter() {
  const companyServices = [
    {
      name: "Private Limited Company",
      href: "/company-information/private-limited",
    },
    {
      name: "Public Limited Company",
      href: "/company-information/public-limited",
    },
    {
      name: "One Person Company",
      href: "/company-information/one-person-company",
    },
    { name: "Section 8 Company", href: "/company-information/section-8" },
    { name: "Nidhi Company", href: "/company-information/nidhi-company" },
    { name: "Producer Company", href: "/company-information/producer-company" },
  ];

  const otherServices = [
    { name: "GST Registration", href: "/other-registration/gst-registration" },
    { name: "LLP Registration", href: "/other-registration/llp-registration" },
    { name: "Partnership Firm", href: "/other-registration/partnership-firm" },
    {
      name: "Sole Proprietorship",
      href: "/other-registration/sole-proprietorship",
    },
    {
      name: "MSME/Udyam Registration",
      href: "/other-registration/msme-udyam-registration",
    },
    { name: "EPFO Registration", href: "/other-registration/epfo" },
    { name: "ESIC Registration", href: "/other-registration/esic" },
    { name: "PT Tax Registration", href: "/other-registration/pt-tax" },
    { name: "IEC Registration", href: "/other-registration/iec-registration" },
    {
      name: "Gumusta / Shop Registration",
      href: "/other-registration/gumusta-shop-registration",
    },
    {
      name: "Fassai (Food) Licence",
      href: "/other-registration/fassai-food-license",
    },
    { name: "Industry Licence", href: "/other-registration/industry-license" },
    { name: "NGO Registration", href: "/other-registration/ngo-registration" },
    { name: "PAN Application", href: "/other-registration/pan-apply" },
    { name: "TAN Application", href: "/other-registration/tan-apply" },
    {
      name: "Start-up India Registration",
      href: "/other-registration/startup-india-registration",
    },
    {
      name: "Digital Signature",
      href: "/other-registration/digital-signature",
    },
  ];

  const taxationServices = [
    { name: "GST Filing", href: "/taxation/gst-filing" },
    { name: "Income Tax Filing", href: "/taxation/income-tax" },
    { name: "TDS Returns", href: "/taxation/tds-returns" },
    { name: "Tax Planning", href: "/taxation/tax-planning" },
    { name: "EPFO Filing", href: "/taxation/epfo-filing" },
    { name: "ESIC Filing", href: "/taxation/esic-filing" },
    { name: "PT-Tax Filing", href: "/taxation/pt-tax-filing" },
    { name: "Corporate Tax Filing", href: "/taxation/corporate-tax-filing" },
    { name: "Payroll Tax", href: "/taxation/payroll-tax" },
  ];

  const reportsServices = [
    { name: "Project Reports", href: "/reports/project-reports" },
    { name: "CMA Reports", href: "/reports/cma-reports" },
    { name: "DSCR Reports", href: "/reports/dscr-reports" },
    { name: "Bank Reconciliation", href: "/reports/bank-reconciliation" },
  ];

  const rocReturnsServices = [
    { name: "Annual Filing", href: "/roc-returns/annual-filing" },
    { name: "Board Resolutions", href: "/roc-returns/board-resolutions" },
    { name: "Director Changes", href: "/roc-returns/director-changes" },
    { name: "Share Transfer", href: "/roc-returns/share-transfer" },
  ];

  const legalServices = [
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
  ];

  const advisoryServices = [
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
  ];

  const toolsServices = [
    { name: "Income Tax Calculator", href: "/tools/income-tax-calculator" },
    { name: "EMI Calculator", href: "/tools/emi-calculator" },
    { name: "GST Calculator", href: "/tools/gst-calculator" },
    { name: "SIP Calculator", href: "/tools/sip-calculator" },
    { name: "HSN Code Finder", href: "/tools/hsn-code-finder" },
    { name: "Salary Calculator", href: "/tools/salary-calculator" },
  ];

  const quickLinks = [
    { name: "About Us", href: "/about" },
    { name: "Contact Us", href: "/contact" },
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
          }}
        ></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Company Information */}
          <div className="space-y-3">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-blue-300 tracking-tight">
                Company Information
              </h3>
              <div className="w-12 h-0.5 bg-gradient-to-r from-blue-400 to-blue-300 rounded-full"></div>
            </div>
            <div className="flex flex-wrap gap-x-3 gap-y-2">
              {companyServices.map((service, index) => (
                <div key={service.name} className="flex items-center">
                  <Link
                    href={service.href}
                    className="text-gray-400 hover:text-blue-300 transition-all duration-300 hover:translate-x-1 text-sm group whitespace-nowrap relative"
                  >
                    <span className="group-hover:text-blue-300 relative">
                      {service.name}
                    </span>
                  </Link>
                  {index < companyServices.length - 1 && (
                    <span className="mx-2 text-gray-600">•</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Other Registration */}
          <div className="space-y-3">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-blue-300 tracking-tight">
                Other Registration
              </h3>
              <div className="w-12 h-0.5 bg-gradient-to-r from-blue-400 to-blue-300 rounded-full"></div>
            </div>
            <div className="flex flex-wrap gap-x-3 gap-y-2">
              {otherServices.map((service, index) => (
                <div key={service.name} className="flex items-center">
                  <Link
                    href={service.href}
                    className="text-gray-400 hover:text-blue-300 transition-all duration-300 hover:translate-x-1 text-sm group whitespace-nowrap relative"
                  >
                    <span className="group-hover:text-blue-300 relative">
                      {service.name}
                    </span>
                  </Link>
                  {index < otherServices.length - 1 && (
                    <span className="mx-2 text-gray-600">•</span>
                  )}
                </div>
              ))}
            </div>
          </div>
          {/* Taxation */}
          <div className="space-y-3">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-blue-300 tracking-tight">Taxation</h3>
              <div className="w-12 h-0.5 bg-gradient-to-r from-blue-400 to-blue-300 rounded-full"></div>
            </div>
            <div className="flex flex-wrap gap-x-3 gap-y-2">
              {taxationServices.map((service, index) => (
                <div key={service.name} className="flex items-center">
                  <Link
                    href={service.href}
                    className="text-gray-400 hover:text-blue-300 transition-all duration-300 hover:translate-x-1 text-sm group whitespace-nowrap relative"
                  >
                    <span className="group-hover:text-blue-300 relative">
                      {service.name}
                    </span>
                  </Link>
                  {index < taxationServices.length - 1 && (
                    <span className="mx-2 text-gray-600">•</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Reports */}
          <div className="space-y-3">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-blue-300 tracking-tight">Reports</h3>
              <div className="w-12 h-0.5 bg-gradient-to-r from-blue-400 to-blue-300 rounded-full"></div>
            </div>
            <div className="flex flex-wrap gap-x-3 gap-y-2">
              {reportsServices.map((service, index) => (
                <div key={service.name} className="flex items-center">
                  <Link
                    href={service.href}
                    className="text-gray-400 hover:text-blue-300 transition-all duration-300 hover:translate-x-1 text-sm group whitespace-nowrap relative"
                  >
                    <span className="group-hover:text-blue-300 relative">
                      {service.name}
                    </span>
                  </Link>
                  {index < reportsServices.length - 1 && (
                    <span className="mx-2 text-gray-600">•</span>
                  )}
                </div>
              ))}
            </div>
          </div>
          {/* Trademark & ISO */}
          <div className="space-y-3">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-blue-300 tracking-tight">
                Trademark & ISO
              </h3>
              <div className="w-12 h-0.5 bg-gradient-to-r from-blue-400 to-blue-300 rounded-full"></div>
            </div>
            <div className="flex flex-wrap gap-x-3 gap-y-2">
              {legalServices.map((service, index) => (
                <div key={service.name} className="flex items-center">
                  <Link
                    href={service.href}
                    className="text-gray-400 hover:text-blue-300 transition-all duration-300 hover:translate-x-1 text-sm group whitespace-nowrap relative"
                  >
                    <span className="group-hover:text-blue-300 relative">
                      {service.name}
                    </span>
                  </Link>
                  {index < legalServices.length - 1 && (
                    <span className="mx-2 text-gray-600">•</span>
                  )}
                </div>
              ))}
            </div>
          </div>
          {/* ROC Returns */}
          <div className="space-y-3">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-blue-300 tracking-tight">ROC Returns</h3>
              <div className="w-12 h-0.5 bg-gradient-to-r from-blue-400 to-blue-300 rounded-full"></div>
            </div>
            <div className="flex flex-wrap gap-x-3 gap-y-2">
              {rocReturnsServices.map((service, index) => (
                <div key={service.name} className="flex items-center">
                  <Link
                    href={service.href}
                    className="text-gray-400 hover:text-blue-300 transition-all duration-300 hover:translate-x-1 text-sm group whitespace-nowrap relative"
                  >
                    <span className="group-hover:text-blue-300 relative">
                      {service.name}
                    </span>
                  </Link>
                  {index < rocReturnsServices.length - 1 && (
                    <span className="mx-2 text-gray-600">•</span>
                  )}
                </div>
              ))}
            </div>
          </div>
          {/* Left Column - Services */}
          <div className="space-y-5">

            {/* Advisory Services */}
            <div className="space-y-3">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-blue-300 tracking-tight">
                  Advisory Services
                </h3>
                <div className="w-12 h-0.5 bg-gradient-to-r from-blue-400 to-blue-300 rounded-full"></div>
              </div>
              <div className="flex flex-wrap gap-x-3 gap-y-2">
                {advisoryServices.map((service, index) => (
                  <div key={service.name} className="flex items-center">
                    <Link
                      href={service.href}
                      className="text-gray-400 hover:text-blue-300 transition-all duration-300 hover:translate-x-1 text-sm group whitespace-nowrap relative"
                    >
                      <span className="group-hover:text-blue-300 relative">
                        {service.name}
                      </span>
                    </Link>
                    {index < advisoryServices.length - 1 && (
                      <span className="mx-2 text-gray-600">•</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Tools & Calculators */}
            <div className="space-y-3">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-blue-300 tracking-tight">
                  Tools & Calculators
                </h3>
                <div className="w-12 h-0.5 bg-gradient-to-r from-blue-400 to-blue-300 rounded-full"></div>
              </div>
              <div className="flex flex-wrap gap-x-3 gap-y-2">
                {toolsServices.map((service, index) => (
                  <div key={service.name} className="flex items-center">
                    <Link
                      href={service.href}
                      className="text-gray-400 hover:text-blue-300 transition-all duration-300 hover:translate-x-1 text-sm group whitespace-nowrap relative"
                    >
                      <span className="group-hover:text-blue-300 relative">
                        {service.name}
                      </span>
                    </Link>
                    {index < toolsServices.length - 1 && (
                      <span className="mx-2 text-gray-600">•</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Company Info */}
          <div className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 via-blue-300 to-blue-200 bg-clip-text text-transparent">
                    Com Financial Services
                  </h2>
                  <p className="text-blue-300 font-medium text-sm">
                    Your Trusted Business Partner
                  </p>
                </div>
              </div>

              <p className="text-gray-300 leading-relaxed text-sm max-w-md">
                Empowering businesses with comprehensive legal, financial, and
                compliance solutions. Your success is our commitment.
              </p>
              <h4 className="text-lg font-semibold text-blue-300 mb-3">
                Get in Touch
              </h4>
              <div className="flex flex-wrap gap-4 md:gap-6">
                <a href="tel:06124535604" className="flex items-start space-x-3 group cursor-pointer">
                  <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center group-hover:bg-blue-600/30 group-hover:scale-110 transition-all duration-300">
                    <Phone className="h-4 w-4 text-blue-400 group-hover:text-blue-300" />
                  </div>
                  <div>
                    <p className="text-gray-300 font-medium text-sm group-hover:text-blue-300 transition-colors">Phone</p>
                    <p className="text-gray-400 text-xs group-hover:text-blue-200 transition-colors">0612-4535604</p>
                  </div>
                </a>

                <a href="mailto:info@comfinserv.co" className="flex items-start space-x-3 group cursor-pointer">
                  <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center group-hover:bg-blue-600/30 group-hover:scale-110 transition-all duration-300">
                    <Mail className="h-4 w-4 text-blue-400 group-hover:text-blue-300" />
                  </div>
                  <div>
                    <p className="text-gray-300 font-medium text-sm group-hover:text-blue-300 transition-colors">Email</p>
                    <p className="text-gray-400 text-xs group-hover:text-blue-200 transition-colors">info@comfinserv.co</p>
                  </div>
                </a>

                <div className="flex items-start space-x-3 group">
                  <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center group-hover:bg-blue-600/30 group-hover:scale-110 transition-all duration-300">
                    <MapPin className="h-4 w-4 text-blue-400 group-hover:text-blue-300" />
                  </div>
                  <div>
                    <p className="text-gray-300 font-medium text-sm group-hover:text-blue-300 transition-colors">Address</p>
                    <p className="text-gray-400 text-xs group-hover:text-blue-200 transition-colors">
                      211, NP Exhibition Road
                      <br />
                      Patna, Bihar-800001
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-4 border-t border-gray-700/50">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <div className="text-center lg:text-left">
              <p className="text-gray-400 text-xs mb-1">
                &copy; 2024 Com Financial Services. All rights reserved.
              </p>
              <p className="text-gray-500 text-xs mb-1">
                Empowering businesses across India with trusted financial
                solutions.
              </p>
              <p className="text-gray-500 text-xs">
                * Prices vary based on company size, complexity, and industry
                standards
              </p>
            </div>

            <div className="flex flex-wrap justify-center lg:justify-end gap-6 text-sm">
              {quickLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-gray-400 hover:text-blue-300 transition-colors duration-300 hover:scale-105"
                >
                  {link.name}
                </Link>
              ))}
              <Link
                href="/privacy-policy"
                className="text-gray-400 hover:text-blue-300 transition-colors duration-300 hover:scale-105"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms-and-conditions"
                className="text-gray-400 hover:text-blue-300 transition-colors duration-300 hover:scale-105"
              >
                Terms and Conditions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
