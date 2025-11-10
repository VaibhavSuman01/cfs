"use client"

import Link from "next/link"
import { Building2, Phone, Mail, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react"

export function EnhancedFooter() {
  const companyServices = [
    { name: "Private Limited Company", href: "/company-information/private-limited" },
    { name: "Public Limited Company", href: "/company-information/public-limited" },
    { name: "One Person Company", href: "/company-information/one-person-company" },
    { name: "Section 8 Company", href: "/company-information/section-8" },
  ]

  const otherServices = [
    { name: "LLP Registration", href: "/other-registration/llp" },
    { name: "Partnership Firm", href: "/other-registration/partnership" },
    { name: "Sole Proprietorship", href: "/other-registration/sole-proprietorship" },
    { name: "Producer Company", href: "/company-information/producer-company" },
  ]

  const taxationServices = [
    { name: "GST Filing", href: "/taxation/gst-registration" },
    { name: "Income Tax Filing", href: "/taxation/income-tax" },
    { name: "TDS Returns", href: "/taxation/tds-returns" },
    { name: "Tax Planning", href: "/taxation/tax-planning" },
  ]

  const legalServices = [
    { name: "Trademark Registration", href: "/trademark-iso/trademark" },
    { name: "ISO Certification", href: "/trademark-iso/iso-9001" },
    { name: "Copyright Registration", href: "/trademark-iso/copyright" },
    { name: "Legal Advisory", href: "/advisory" },
  ]

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
  ]

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Services Section - All in a row */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">
          {/* Company Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-300">Company Information</h3>
            <div className="space-y-2">
              {companyServices.map((service) => (
                <Link
                  key={service.name}
                  href={service.href}
                  className="block text-gray-400 hover:text-blue-300 transition-colors text-sm"
                >
                  {service.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Other Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-300">Other Registration</h3>
            <div className="space-y-2">
              {otherServices.map((service) => (
                <Link
                  key={service.name}
                  href={service.href}
                  className="block text-gray-400 hover:text-blue-300 transition-colors text-sm"
                >
                  {service.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Taxation Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-300">Taxation</h3>
            <div className="space-y-2">
              {taxationServices.map((service) => (
                <Link
                  key={service.name}
                  href={service.href}
                  className="block text-gray-400 hover:text-blue-300 transition-colors text-sm"
                >
                  {service.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Legal Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-300">Trademark & ISO</h3>
            <div className="space-y-2">
              {legalServices.map((service) => (
                <Link
                  key={service.name}
                  href={service.href}
                  className="block text-gray-400 hover:text-blue-300 transition-colors text-sm"
                >
                  {service.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Tools Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-300">Tools</h3>
            <div className="space-y-2">
              {toolsServices.map((service) => (
                <Link
                  key={service.name}
                  href={service.href}
                  className="block text-gray-400 hover:text-blue-300 transition-colors text-sm"
                >
                  {service.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-300">Quick Links</h3>
            <div className="space-y-2">
              {quickLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="block text-gray-400 hover:text-blue-300 transition-colors text-sm"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Company Details & Tools Section */}
        <div className="border-t border-gray-700 pt-8 mb-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Building2 className="h-8 w-8 text-blue-400" />
                <div>
                  <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">
                    Com Financial Services
                  </span>
                  <div className="text-xs text-blue-300">Your Business Partner</div>
                </div>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                Getting your business started with simple, swift and reasonably priced legal services, online. We are your
                trusted partner for business registrations, filings, and compliances.
              </p>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-blue-400" />
                  <span className="text-gray-300 text-sm">0612-4535604</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-blue-400" />
                  <span className="text-gray-300 text-sm">info@comfinserv.co</span>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="h-4 w-4 text-blue-400 mt-1" />
                  <span className="text-gray-300 text-sm">211, NP EXHIBITION ROAD, PATNA, BIHAR-800001</span>
                </div>
              </div>
              <div className="flex space-x-3">
                <a
                  href="#"
                  className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors"
                >
                  <Facebook className="h-4 w-4" />
                </a>
                <a
                  href="#"
                  className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors"
                >
                  <Twitter className="h-4 w-4" />
                </a>
                <a
                  href="#"
                  className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
                <a
                  href="#"
                  className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Minimized */}
        <div className="border-t border-gray-700 pt-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <div className="text-gray-400 text-xs">&copy; 2024 Com Financial Services. All rights reserved.</div>
            <div className="flex space-x-4 text-xs">
              <Link href="/privacy-policy" className="text-gray-400 hover:text-blue-300 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms-and-conditions" className="text-gray-400 hover:text-blue-300 transition-colors">
                Terms and Conditions
              </Link>
              <Link href="/refund-policy" className="text-gray-400 hover:text-blue-300 transition-colors">
                Refund Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
