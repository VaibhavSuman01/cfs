"use client"

import Link from "next/link"
import { Building2, Phone, Mail, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react"

export function EnhancedFooter() {
  const companyServices = [
    { name: "Private Limited Company", href: "/company-formation/private-limited" },
    { name: "Public Limited Company", href: "/company-formation/public-limited" },
    { name: "One Person Company", href: "/company-formation/one-person-company" },
    { name: "Section 8 Company", href: "/company-formation/section-8" },
  ]

  const otherServices = [
    { name: "LLP Registration", href: "/other-registration/llp" },
    { name: "Partnership Firm", href: "/other-registration/partnership" },
    { name: "Sole Proprietorship", href: "/other-registration/sole-proprietorship" },
    { name: "Producer Company", href: "/company-formation/producer-company" },
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
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-7 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center space-x-3">
              <Building2 className="h-10 w-10 text-blue-400" />
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">
                  Com Financial Services
                </span>
                <div className="text-sm text-blue-300">Your Business Partner</div>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Getting your business started with simple, swift and reasonably priced legal services, online. We are your
              trusted partner for business registrations, filings, and compliances.
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-blue-400" />
                <span className="text-gray-300">Contact: 0612-4535604</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-400" />
                <span className="text-gray-300">info@comfinserv.co</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-blue-400" />
                <span className="text-gray-300">HO: 211, NP
                  EXHIBITION ROAD
                  PATNA, BIHAR-800001
                </span>
              </div>
            </div>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Company Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-300">Company Formation</h3>
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

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">&copy; 2024 Com Financial Services. All rights reserved.</div>
            <div className="flex space-x-6 text-sm">
              <Link href="/privacy-policy" className="text-gray-400 hover:text-blue-300 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms-of-service" className="text-gray-400 hover:text-blue-300 transition-colors">
                Terms of Service
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
