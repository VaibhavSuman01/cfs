"use client"

import { EnhancedHeader } from "@/components/enhanced-header"
import { EnhancedFooter } from "@/components/enhanced-footer"
import { FadeInSection } from "@/components/fade-in-section"
import { AnimatedBackground } from "@/components/animated-background"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, Scale, AlertCircle, CheckCircle, XCircle } from "lucide-react"

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-white">
      <EnhancedHeader />

      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center justify-center pt-20">
        <AnimatedBackground />

        <div className="container mx-auto px-4 py-20 relative z-10">
          <FadeInSection className="text-center space-y-8 max-w-4xl mx-auto">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-6">
              <Scale className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-6xl lg:text-7xl font-bold">
              <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 bg-clip-text text-transparent">
                Terms and
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 bg-clip-text text-transparent">
                Conditions
              </span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              Please read these terms and conditions carefully before using our services.
            </p>
            <p className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </FadeInSection>
        </div>
      </section>

      {/* Terms and Conditions Content */}
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
                        These Terms and Conditions ("Terms") govern your access to and use of the services provided by Com Financial Services ("we," "our," or "us"). By accessing or using our services, you agree to be bound by these Terms. If you do not agree to these Terms, please do not use our services.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Acceptance of Terms */}
              <Card className="border-2 border-blue-100 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">Acceptance of Terms</h2>
                      <p className="text-gray-600 leading-relaxed">
                        By registering for an account, submitting an application, or using any of our services, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy. These Terms constitute a legally binding agreement between you and Com Financial Services.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Services Description */}
              <Card className="border-2 border-blue-100 shadow-lg">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Services Description</h2>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Com Financial Services provides business registration, compliance, and advisory services, including but not limited to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                    <li>Company registration and incorporation services</li>
                    <li>Tax filing and compliance services</li>
                    <li>ROC returns and annual filings</li>
                    <li>Other business registration services</li>
                    <li>Advisory and consulting services</li>
                    <li>Report generation services</li>
                  </ul>
                  <p className="text-gray-600 leading-relaxed mt-4">
                    We reserve the right to modify, suspend, or discontinue any service at any time without prior notice.
                  </p>
                </CardContent>
              </Card>

              {/* User Obligations */}
              <Card className="border-2 border-blue-100 shadow-lg">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">User Obligations</h2>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    You agree to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                    <li>Provide accurate, current, and complete information when using our services</li>
                    <li>Maintain and promptly update your account information</li>
                    <li>Maintain the security of your account credentials</li>
                    <li>Notify us immediately of any unauthorized use of your account</li>
                    <li>Use our services only for lawful purposes</li>
                    <li>Comply with all applicable laws and regulations</li>
                    <li>Not use our services to transmit any harmful or malicious code</li>
                    <li>Not attempt to gain unauthorized access to our systems</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Payment Terms */}
              <Card className="border-2 border-blue-100 shadow-lg">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Terms</h2>
                  <div className="space-y-4 text-gray-600">
                    <p className="leading-relaxed">
                      <strong>Fees:</strong> All fees for our services are displayed on our website and are subject to change without prior notice. You agree to pay all fees associated with the services you select.
                    </p>
                    <p className="leading-relaxed">
                      <strong>Payment Methods:</strong> We accept various payment methods as displayed on our website. All payments must be made in Indian Rupees (INR) unless otherwise specified.
                    </p>
                    <p className="leading-relaxed">
                      <strong>Refunds:</strong> Refund policies are outlined in our Refund Policy. Please review it carefully before making a payment.
                    </p>
                    <p className="leading-relaxed">
                      <strong>Late Payments:</strong> If payment is not received by the due date, we reserve the right to suspend or terminate your services.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Intellectual Property */}
              <Card className="border-2 border-blue-100 shadow-lg">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Intellectual Property</h2>
                  <p className="text-gray-600 leading-relaxed">
                    All content, materials, trademarks, logos, and intellectual property on our website and services are owned by Com Financial Services or our licensors. You may not use, reproduce, distribute, or create derivative works from any content without our prior written consent.
                  </p>
                </CardContent>
              </Card>

              {/* Limitation of Liability */}
              <Card className="border-2 border-blue-100 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <AlertCircle className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">Limitation of Liability</h2>
                      <p className="text-gray-600 leading-relaxed mb-4">
                        To the maximum extent permitted by law:
                      </p>
                      <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                        <li>Our services are provided "as is" and "as available" without warranties of any kind</li>
                        <li>We do not guarantee that our services will be uninterrupted, secure, or error-free</li>
                        <li>We shall not be liable for any indirect, incidental, special, consequential, or punitive damages</li>
                        <li>Our total liability shall not exceed the amount you paid for the specific service in question</li>
                        <li>We are not responsible for delays or failures due to circumstances beyond our reasonable control</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Indemnification */}
              <Card className="border-2 border-blue-100 shadow-lg">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Indemnification</h2>
                  <p className="text-gray-600 leading-relaxed">
                    You agree to indemnify, defend, and hold harmless Com Financial Services, its officers, directors, employees, and agents from and against any claims, damages, losses, liabilities, and expenses (including legal fees) arising out of or relating to your use of our services, violation of these Terms, or infringement of any rights of another party.
                  </p>
                </CardContent>
              </Card>

              {/* Termination */}
              <Card className="border-2 border-blue-100 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <XCircle className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">Termination</h2>
                      <p className="text-gray-600 leading-relaxed mb-4">
                        We may terminate or suspend your account and access to our services immediately, without prior notice, for any reason, including:
                      </p>
                      <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                        <li>Breach of these Terms</li>
                        <li>Fraudulent or illegal activity</li>
                        <li>Non-payment of fees</li>
                        <li>Violation of applicable laws or regulations</li>
                      </ul>
                      <p className="text-gray-600 leading-relaxed mt-4">
                        Upon termination, your right to use our services will immediately cease, and we may delete your account and data.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Governing Law */}
              <Card className="border-2 border-blue-100 shadow-lg">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Governing Law and Dispute Resolution</h2>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    Any disputes arising out of or relating to these Terms or our services shall be subject to the exclusive jurisdiction of the courts in Patna, Bihar, India.
                  </p>
                </CardContent>
              </Card>

              {/* Changes to Terms */}
              <Card className="border-2 border-blue-100 shadow-lg">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to Terms</h2>
                  <p className="text-gray-600 leading-relaxed">
                    We reserve the right to modify these Terms at any time. We will notify you of any material changes by posting the updated Terms on our website and updating the "Last updated" date. Your continued use of our services after such modifications constitutes your acceptance of the updated Terms.
                  </p>
                </CardContent>
              </Card>

              {/* Contact Us */}
              <Card className="border-2 border-blue-100 shadow-lg bg-gradient-to-br from-blue-50 to-gray-50">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    If you have any questions about these Terms and Conditions, please contact us:
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

