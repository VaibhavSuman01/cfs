"use client"

import { EnhancedHeader } from "@/components/enhanced-header"
import { EnhancedFooter } from "@/components/enhanced-footer"
import { FadeInSection } from "@/components/fade-in-section"
import { AnimatedBackground } from "@/components/animated-background"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, Lock, Eye, FileText } from "lucide-react"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <EnhancedHeader />

      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center justify-center pt-20">
        <AnimatedBackground />

        <div className="container mx-auto px-4 py-20 relative z-10">
          <FadeInSection className="text-center space-y-8 max-w-4xl mx-auto">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-6">
              <Shield className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-6xl lg:text-7xl font-bold">
              <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 bg-clip-text text-transparent">
                Privacy
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 bg-clip-text text-transparent">
                Policy
              </span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
            </p>
            <p className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </FadeInSection>
        </div>
      </section>

      {/* Privacy Policy Content */}
      <FadeInSection>
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="space-y-8">
              {/* Introduction */}
              <Card className="border-2 border-blue-100 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <FileText className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Introduction</h2>
                      <p className="text-gray-600 leading-relaxed">
                        Com Financial Services ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Information We Collect */}
              <Card className="border-2 border-blue-100 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Eye className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">Information We Collect</h2>
                      <div className="space-y-4 text-gray-600">
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">Personal Information</h3>
                          <p className="leading-relaxed">
                            We may collect personal information that you provide to us, including but not limited to:
                          </p>
                          <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                            <li>Name, email address, phone number, and postal address</li>
                            <li>Business registration details and documents</li>
                            <li>Payment information and billing details</li>
                            <li>Government-issued identification documents</li>
                            <li>Any other information you choose to provide</li>
                          </ul>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">Automatically Collected Information</h3>
                          <p className="leading-relaxed">
                            When you visit our website, we may automatically collect certain information, including:
                          </p>
                          <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                            <li>IP address and browser type</li>
                            <li>Device information and operating system</li>
                            <li>Pages visited and time spent on pages</li>
                            <li>Referring website addresses</li>
                            <li>Cookies and similar tracking technologies</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* How We Use Your Information */}
              <Card className="border-2 border-blue-100 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Lock className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Use Your Information</h2>
                      <p className="text-gray-600 leading-relaxed mb-4">
                        We use the information we collect for various purposes, including:
                      </p>
                      <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                        <li>To provide, maintain, and improve our services</li>
                        <li>To process your registrations and applications</li>
                        <li>To communicate with you about your account and services</li>
                        <li>To send you updates, newsletters, and promotional materials (with your consent)</li>
                        <li>To respond to your inquiries and provide customer support</li>
                        <li>To detect, prevent, and address technical issues and fraud</li>
                        <li>To comply with legal obligations and regulatory requirements</li>
                        <li>To analyze usage patterns and improve user experience</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Information Sharing */}
              <Card className="border-2 border-blue-100 shadow-lg">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Information Sharing and Disclosure</h2>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                    <li><strong>Service Providers:</strong> We may share information with third-party service providers who assist us in operating our website and conducting our business</li>
                    <li><strong>Legal Requirements:</strong> We may disclose information if required by law or in response to valid requests by public authorities</li>
                    <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information may be transferred</li>
                    <li><strong>With Your Consent:</strong> We may share your information with your explicit consent</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Data Security */}
              <Card className="border-2 border-blue-100 shadow-lg">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Security</h2>
                  <p className="text-gray-600 leading-relaxed">
                    We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
                  </p>
                </CardContent>
              </Card>

              {/* Your Rights */}
              <Card className="border-2 border-blue-100 shadow-lg">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rights</h2>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    You have the right to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                    <li>Access and receive a copy of your personal information</li>
                    <li>Rectify inaccurate or incomplete information</li>
                    <li>Request deletion of your personal information</li>
                    <li>Object to processing of your personal information</li>
                    <li>Request restriction of processing</li>
                    <li>Data portability</li>
                    <li>Withdraw consent at any time</li>
                  </ul>
                  <p className="text-gray-600 leading-relaxed mt-4">
                    To exercise these rights, please contact us using the contact information provided below.
                  </p>
                </CardContent>
              </Card>

              {/* Cookies */}
              <Card className="border-2 border-blue-100 shadow-lg">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookies and Tracking Technologies</h2>
                  <p className="text-gray-600 leading-relaxed">
                    We use cookies and similar tracking technologies to track activity on our website and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our website.
                  </p>
                </CardContent>
              </Card>

              {/* Changes to Privacy Policy */}
              <Card className="border-2 border-blue-100 shadow-lg">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to This Privacy Policy</h2>
                  <p className="text-gray-600 leading-relaxed">
                    We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes.
                  </p>
                </CardContent>
              </Card>

              {/* Contact Us */}
              <Card className="border-2 border-blue-100 shadow-lg bg-gradient-to-br from-blue-50 to-gray-50">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    If you have any questions about this Privacy Policy, please contact us:
                  </p>
                  <div className="space-y-2 text-gray-600">
                    <p><strong>Email:</strong> info@comfinserv.co</p>
                    <p><strong>Phone:</strong> 0612-4535604</p>
                    <p><strong>Address:</strong> 211, NP EXHIBITION ROAD, PATNA, BIHAR-800001</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </FadeInSection>

      <EnhancedFooter />
    </div>
  )
}

