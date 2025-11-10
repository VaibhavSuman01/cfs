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
    { name: "Producer Company", href: "/company-formation/producer-company" },
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

  const toolsServices = [
    { name: "Income Tax Calculator", href: "/tools/income-tax-calculator" },
    { name: "EMI Calculator", href: "/tools/emi-calculator" },
    { name: "GST Calculator", href: "/tools/gst-calculator" },
    { name: "SIP Calculator", href: "/tools/sip-calculator" },
    { name: "HSN Code Finder", href: "/tools/hsn-code-finder" },
    { name: "Salary Calculator", href: "/tools/salary-calculator" },
  ]

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

      <div className="container mx-auto px-4 py-20 relative z-10">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-8 lg:gap-12">
          {/* Company Info - Takes 2 columns on large screens */}
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Building2 className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-blue-300 to-blue-200 bg-clip-text text-transparent">
                    Com Financial Services
                  </h2>
                  <p className="text-blue-300 font-medium">
                    Your Trusted Business Partner
                  </p>
                </div>
              </div>

              <p className="text-gray-300 leading-relaxed text-lg max-w-md">
                Empowering businesses with comprehensive legal, financial, and
                compliance solutions. Your success is our commitment.
              </p>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h4 className="text-xl font-semibold text-blue-300 mb-4">
                Get in Touch
              </h4>
              <div className="space-y-4">
                <div className="flex items-start space-x-4 group">
                  <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center group-hover:bg-blue-600/30 transition-colors">
                    <Phone className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-gray-300 font-medium">Phone</p>
                    <p className="text-gray-400">0612-4535604</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 group">
                  <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center group-hover:bg-blue-600/30 transition-colors">
                    <Mail className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-gray-300 font-medium">Email</p>
                    <p className="text-gray-400">info@comfinserv.co</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 group">
                  <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center group-hover:bg-blue-600/30 transition-colors">
                    <MapPin className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-gray-300 font-medium">Address</p>
                    <p className="text-gray-400">
                      211, NP Exhibition Road
                      <br />
                      Patna, Bihar-800001
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="space-y-4">
              <h4 className="text-xl font-semibold text-blue-300">Follow Us</h4>
              <div className="flex space-x-3">
                {[
                  { icon: Facebook, href: "#", label: "Facebook" },
                  { icon: Twitter, href: "#", label: "Twitter" },
                  { icon: Linkedin, href: "#", label: "LinkedIn" },
                  { icon: Instagram, href: "#", label: "Instagram" },
                ].map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center hover:from-blue-500 hover:to-blue-600 transition-all duration-300 hover:scale-110 hover:shadow-lg"
                    aria-label={social.label}
                  >
                    <social.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Services Grid - 6 columns on large screens */}
          <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            {/* Company Formation */}
            <div className="space-y-6">
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-blue-300">
                  Company Formation
                </h3>
                <div className="w-12 h-1 bg-gradient-to-r from-blue-400 to-blue-300 rounded-full"></div>
              </div>
              <div className="space-y-3">
                {companyServices.map((service) => (
                  <Link
                    key={service.name}
                    href={service.href}
                    className="block text-gray-400 hover:text-blue-300 transition-all duration-300 hover:translate-x-1 text-sm group"
                  >
                    <span className="group-hover:text-blue-300">
                      {service.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Other Registration */}
            <div className="space-y-6">
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-blue-300">
                  Other Registration
                </h3>
                <div className="w-12 h-1 bg-gradient-to-r from-blue-400 to-blue-300 rounded-full"></div>
              </div>
              <div className="space-y-3">
                {otherServices.map((service) => (
                  <Link
                    key={service.name}
                    href={service.href}
                    className="block text-gray-400 hover:text-blue-300 transition-all duration-300 hover:translate-x-1 text-sm group"
                  >
                    <span className="group-hover:text-blue-300">
                      {service.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Taxation */}
            <div className="space-y-6">
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-blue-300">Taxation</h3>
                <div className="w-12 h-1 bg-gradient-to-r from-blue-400 to-blue-300 rounded-full"></div>
              </div>
              <div className="space-y-3">
                {taxationServices.map((service) => (
                  <Link
                    key={service.name}
                    href={service.href}
                    className="block text-gray-400 hover:text-blue-300 transition-all duration-300 hover:translate-x-1 text-sm group"
                  >
                    <span className="group-hover:text-blue-300">
                      {service.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Reports */}
            <div className="space-y-6">
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-blue-300">Reports</h3>
                <div className="w-12 h-1 bg-gradient-to-r from-blue-400 to-blue-300 rounded-full"></div>
              </div>
              <div className="space-y-3">
                {reportsServices.map((service) => (
                  <Link
                    key={service.name}
                    href={service.href}
                    className="block text-gray-400 hover:text-blue-300 transition-all duration-300 hover:translate-x-1 text-sm group"
                  >
                    <span className="group-hover:text-blue-300">
                      {service.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Trademark & ISO */}
            <div className="space-y-6">
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-blue-300">
                  Trademark & ISO
                </h3>
                <div className="w-12 h-1 bg-gradient-to-r from-blue-400 to-blue-300 rounded-full"></div>
              </div>
              <div className="space-y-3">
                {legalServices.map((service) => (
                  <Link
                    key={service.name}
                    href={service.href}
                    className="block text-gray-400 hover:text-blue-300 transition-all duration-300 hover:translate-x-1 text-sm group"
                  >
                    <span className="group-hover:text-blue-300">
                      {service.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* ROC Returns */}
            <div className="space-y-6">
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-blue-300">ROC Returns</h3>
                <div className="w-12 h-1 bg-gradient-to-r from-blue-400 to-blue-300 rounded-full"></div>
              </div>
              <div className="space-y-3">
                {rocReturnsServices.map((service) => (
                  <Link
                    key={service.name}
                    href={service.href}
                    className="block text-gray-400 hover:text-blue-300 transition-all duration-300 hover:translate-x-1 text-sm group"
                  >
                    <span className="group-hover:text-blue-300">
                      {service.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Advisory Services - Full Width Section */}
        <div className="mt-16 pt-8 border-t border-gray-700">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-blue-300">
                  Advisory Services
                </h3>
                <div className="w-12 h-1 bg-gradient-to-r from-blue-400 to-blue-300 rounded-full"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {advisoryServices.map((service) => (
                  <Link
                    key={service.name}
                    href={service.href}
                    className="block text-gray-400 hover:text-blue-300 transition-all duration-300 hover:translate-x-1 text-sm group"
                  >
                    <span className="group-hover:text-blue-300">
                      {service.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-blue-300">
                  Tools & Calculators
                </h3>
                <div className="w-12 h-1 bg-gradient-to-r from-blue-400 to-blue-300 rounded-full"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {toolsServices.map((service) => (
                  <Link
                    key={service.name}
                    href={service.href}
                    className="block text-gray-400 hover:text-blue-300 transition-all duration-300 hover:translate-x-1 text-sm group"
                  >
                    <span className="group-hover:text-blue-300">
                      {service.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-4 border-t border-gray-700">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
            <div className="text-center lg:text-left">
              <p className="text-gray-400 text-sm mb-2">
                &copy; 2024 Com Financial Services. All rights reserved.
              </p>
              <p className="text-gray-500 text-xs mb-2">
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
                href="/terms-of-service"
                className="text-gray-400 hover:text-blue-300 transition-colors duration-300 hover:scale-105"
              >
                Terms of Service
              </Link>
              <Link
                href="/refund-policy"
                className="text-gray-400 hover:text-blue-300 transition-colors duration-300 hover:scale-105"
              >
                Refund Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
