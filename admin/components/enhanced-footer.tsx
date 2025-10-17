"use client"

import Link from "next/link"
import { Building2, Phone, Mail, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react"

export function EnhancedFooter() {
  const companyServices = [
    { name: "Private Limited Company", href: "/company-formation/private-limited" },
    { name: "Public Limited Company", href: "/company-formation/public-limited" },
    { name: "One Person Company", href: "/company-formation/one-person-company" },
    { name: "Section 8 Company", href: "/company-formation/section-8" },
    { name: "Nidhi Company", href: "/company-formation/nidhi-company" },
    { name: "Producer Company", href: "/company-formation/producer-company" },
  ]

  const otherServices = [
    { name: "LLP Registration", href: "/other-registration/llp" },
    { name: "Partnership Firm", href: "/other-registration/partnership" },
    { name: "GST Registration", href: "/other-registration/gst-registration" },
    { name: "Sole Proprietorship", href: "/other-registration/sole-proprietorship" },
    { name: "MSME/Udyam Registration", href: "/other-registration/msme" },
    { name: "IEC Registration", href: "/other-registration/iec" },
    { name: "FSSAI Food License", href: "/other-registration/fssai" },
    { name: "Gumusta Shop Registration", href: "/other-registration/gumusta" },
    { name: "Industry License", href: "/other-registration/industry-license" },
    { name: "NGO Registration", href: "/other-registration/ngo" },
    { name: "PAN Apply", href: "/other-registration/pan" },
    { name: "TAN Apply", href: "/other-registration/tan" },
    { name: "Startup India Registration", href: "/other-registration/startup-india" },
    { name: "Digital Signature", href: "/other-registration/digital-signature" },
    { name: "PT Tax", href: "/other-registration/pt-tax" },
  ]

  const taxationServices = [
    { name: "GST Filing", href: "/taxation/gst-filing" },
    { name: "Income Tax Filing", href: "/taxation/income-tax" },
    { name: "TDS Returns", href: "/taxation/tds-returns" },
    { name: "Tax Planning", href: "/taxation/tax-planning" },
    { name: "EPFO Filing", href: "/taxation/epfo" },
    { name: "ESIC Filing", href: "/taxation/esic" },
    { name: "Corporate Tax Filing", href: "/taxation/corporate-tax" },
  ]

  const reportsServices = [
    { name: "Project Reports", href: "/reports/project-reports" },
    { name: "CMA Reports", href: "/reports/cma-reports" },
    { name: "DSCR Reports", href: "/reports/dscr-reports" },
    { name: "Bank Reconciliation", href: "/reports/bank-reconciliation" },
  ]

  const legalServices = [
    { name: "Trademark Registration", href: "/trademark-iso/trademark" },
    { name: "ISO 9001 Certification", href: "/trademark-iso/iso-9001" },
    { name: "ISO 14001 Certification", href: "/trademark-iso/iso-14001" },
    { name: "Copyright Registration", href: "/trademark-iso/copyright" },
    { name: "Legal Advisory", href: "/advisory" },
  ]

  const advisoryServices = [
    { name: "Business Strategy Consulting", href: "/advisory/business-strategy" },
    { name: "Financial Planning & Analysis", href: "/advisory/financial-planning" },
    { name: "Digital Transformation", href: "/advisory/digital-transformation" },
    { name: "HR & Organizational Development", href: "/advisory/hr-development" },
    { name: "Legal Compliance Advisory", href: "/advisory/legal-compliance" },
    { name: "Startup Mentoring", href: "/advisory/startup-mentoring" },
    { name: "Tax Planning & Analysis", href: "/advisory/tax-planning" },
    { name: "Fund Raising Assistance", href: "/advisory/fund-raising" },
  ]

  const quickLinks = [
    { name: "About Us", href: "/about" },
    { name: "Contact Us", href: "/contact" },
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Terms of Service", href: "/terms-of-service" },
    { name: "Refund Policy", href: "/refund-policy" },
    { name: "Blog", href: "/blog" },
  ]

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-8">
          {/* Company Info */}
          <div className="xl:col-span-2 space-y-6">
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
                <span className="text-gray-300">+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-400" />
                <span className="text-gray-300">info@comfinancialservices.co</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-blue-400" />
                <span className="text-gray-300">Business District, Mumbai, India</span>
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

          {/* Reports Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-300">Reports</h3>
            <div className="space-y-2">
              {reportsServices.map((service) => (
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
            <h3 className="text-lg font-semibold text-blue-300">Legal & IP</h3>
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

          {/* Advisory Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-300">Advisory</h3>
            <div className="space-y-2">
              {advisoryServices.map((service) => (
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
