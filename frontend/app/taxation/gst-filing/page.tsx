"use client"

import { EnhancedHeader } from "@/components/enhanced-header"
import { EnhancedFooter } from "@/components/enhanced-footer"
import { FadeInSection } from "@/components/fade-in-section"
import { AnimatedBackground } from "@/components/animated-background"
import { FloatingElements } from "@/components/floating-elements"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PricingDisplay } from "@/components/ui/pricing-display"

import {
  Receipt,
  CheckCircle,
  Shield,
  ArrowRight,
  TrendingUp,
  Phone,
  FileText,
  Landmark,
  FileCheck
} from "lucide-react"
import Link from "next/link"

export default function GstRegistrationPage() {
  
  return (
    <div className="min-h-screen bg-white">
      <EnhancedHeader />

      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center pt-20">
        <AnimatedBackground />
        <FloatingElements />

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <FadeInSection className="space-y-8">
              <div className="space-y-6">
                <Badge className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 hover:from-blue-200 hover:to-blue-300 animate-pulse border-0 px-4 py-2">
                  One Nation, One Tax
                </Badge>
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 bg-clip-text text-transparent">
                    GST Filing
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 bg-clip-text text-transparent">
                    Made Simple
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Stay compliant with monthly GST return filing. Our experts handle your GSTR-1 and GSTR-3B returns, ensuring timely submission and avoiding penalties.
                </p>

                <div className="grid sm:grid-cols-3 gap-4 pt-6">
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">₹1,499</div>
                    <div className="text-sm text-gray-600">Fixed Price</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">Monthly</div>
                    <div className="text-sm text-gray-600">Filing Frequency</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">GSTR-1,3B</div>
                    <div className="text-sm text-gray-600">Returns Included</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <Link href={`/dashboard/new-form?service=${encodeURIComponent("GST Filing")}`} passHref>
                    <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                      Start GST Filing
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href={`/dashboard/new-form?service=${encodeURIComponent("GST Filing")}`} passHref>
                    <Button
                      variant="outline"
                      className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-3 rounded-full transition-all duration-300 hover:scale-105 bg-transparent"
                    >
                      Consult an Expert
                    </Button>
                  </Link>
                </div>
              </div>
            </FadeInSection>
            <FadeInSection className="hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-transparent rounded-full -translate-x-10 -translate-y-10"></div>
                <img
                  src="/images/gst-hero.png"
                  alt="GST Filing Illustration"
                  className="relative rounded-lg w-full h-auto"
                />
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* Pricing Packages Section */}
      <FadeInSection>
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto mb-16">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">GST Filing Service</h2>
              <p className="text-lg text-gray-600">
                Complete monthly GST return filing service at a fixed price
              </p>
            </div>
            <div className="max-w-2xl mx-auto">
              <Card className="border-2 border-blue-400 hover:border-blue-600 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-3xl font-bold text-blue-600">Monthly GST Filing</CardTitle>
                  <div className="text-5xl font-bold text-gray-900">₹1,499</div>
                  <p className="text-lg text-gray-600">Fixed Price per Month</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ul className="space-y-4 text-left text-lg">
                    <li className="flex items-center"><CheckCircle className="h-6 w-6 text-blue-500 mr-4 flex-shrink-0" /><span>GSTR-1 Return Filing</span></li>
                    <li className="flex items-center"><CheckCircle className="h-6 w-6 text-blue-500 mr-4 flex-shrink-0" /><span>GSTR-3B Return Filing</span></li>
                    <li className="flex items-center"><CheckCircle className="h-6 w-6 text-blue-500 mr-4 flex-shrink-0" /><span>Data Compilation & Validation</span></li>
                    <li className="flex items-center"><CheckCircle className="h-6 w-6 text-blue-500 mr-4 flex-shrink-0" /><span>Timely Submission</span></li>
                    <li className="flex items-center"><CheckCircle className="h-6 w-6 text-blue-500 mr-4 flex-shrink-0" /><span>Penalty Avoidance</span></li>
                    <li className="flex items-center"><CheckCircle className="h-6 w-6 text-blue-500 mr-4 flex-shrink-0" /><span>Expert Support</span></li>
                  </ul>
                  <Link href={`/dashboard/new-form?service=${encodeURIComponent("GST Filing")}`} passHref>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-4">Start GST Filing Service</Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Benefits of GST Filing Section */}
      <FadeInSection>
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto mb-16">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">Benefits of GST Filing Service</h2>
              <p className="text-lg text-gray-600">
                Our monthly GST filing service ensures your business stays compliant and penalty-free.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="text-center p-6 border-2 border-transparent hover:border-blue-200 hover:shadow-xl transition-all">
                <FileCheck className="mx-auto h-12 w-12 text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Timely Compliance</h3>
                <p className="text-gray-600">Never miss a deadline with our systematic monthly filing process.</p>
              </Card>
              <Card className="text-center p-6 border-2 border-transparent hover:border-blue-200 hover:shadow-xl transition-all">
                <Shield className="mx-auto h-12 w-12 text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Penalty Protection</h3>
                <p className="text-gray-600">Avoid late fees and penalties with our expert filing service.</p>
              </Card>
              <Card className="text-center p-6 border-2 border-transparent hover:border-blue-200 hover:shadow-xl transition-all">
                <TrendingUp className="mx-auto h-12 w-12 text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Input Tax Credit</h3>
                <p className="text-gray-600">Maximize your ITC claims with accurate return filing.</p>
              </Card>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Registration Process Section */}
      <FadeInSection>
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto mb-16">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">Simple GST Filing Process</h2>
              <p className="text-lg text-gray-600">
                Our streamlined monthly process ensures your GST returns are filed accurately and on time.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="p-6 text-center"><CardTitle className="mb-4 text-blue-600">1. Share Data</CardTitle><p className="text-gray-600">Provide your sales and purchase data for the month.</p></Card>
              <Card className="p-6 text-center"><CardTitle className="mb-4 text-blue-600">2. Data Processing</CardTitle><p className="text-gray-600">We compile and validate your transaction data.</p></Card>
              <Card className="p-6 text-center"><CardTitle className="mb-4 text-blue-600">3. Return Preparation</CardTitle><p className="text-gray-600">GSTR-1 and GSTR-3B returns are prepared and reviewed.</p></Card>
              <Card className="p-6 text-center"><CardTitle className="mb-4 text-blue-600">4. Filing & Confirmation</CardTitle><p className="text-gray-600">Returns are filed on GST portal with confirmation receipt.</p></Card>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Documents Required Section */}
      <FadeInSection>
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto mb-16">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">Data Required for GST Filing</h2>
              <p className="text-lg text-gray-600">
                For monthly GST filing, we need the following transaction data from you:
              </p>
            </div>
            <div className="max-w-3xl mx-auto">
              <Card className="p-8">
                <ul className="space-y-4 text-gray-700 text-lg grid md:grid-cols-2 gap-x-8 gap-y-4">
                  <li className="flex items-center"><CheckCircle className="h-6 w-6 text-blue-500 mr-4 flex-shrink-0" /><span>Sales Invoices</span></li>
                  <li className="flex items-center"><CheckCircle className="h-6 w-6 text-blue-500 mr-4 flex-shrink-0" /><span>Purchase Invoices</span></li>
                  <li className="flex items-center"><CheckCircle className="h-6 w-6 text-blue-500 mr-4 flex-shrink-0" /><span>Bank Statements</span></li>
                  <li className="flex items-center"><CheckCircle className="h-6 w-6 text-blue-500 mr-4 flex-shrink-0" /><span>Credit/Debit Notes</span></li>
                  <li className="flex items-center"><CheckCircle className="h-6 w-6 text-blue-500 mr-4 flex-shrink-0" /><span>Export/Import Data</span></li>
                  <li className="flex items-center"><CheckCircle className="h-6 w-6 text-blue-500 mr-4 flex-shrink-0" /><span>Advance Receipts</span></li>
                  <li className="flex items-center"><CheckCircle className="h-6 w-6 text-blue-500 mr-4 flex-shrink-0" /><span>Reverse Charge Entries</span></li>
                  <li className="flex items-center"><CheckCircle className="h-6 w-6 text-blue-500 mr-4 flex-shrink-0" /><span>HSN/SAC Details</span></li>
                </ul>
              </Card>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* FAQ Section */}
      <FadeInSection>
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto mb-16">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">GST Filing FAQs</h2>
              <p className="text-lg text-gray-600">
                Find answers to common questions about GST return filing.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {[
                {
                  question: "What is the due date for GST returns?",
                  answer: "GSTR-1 is due by the 11th of the following month, and GSTR-3B is due by the 20th of the following month. For quarterly filers, the due dates are different."
                },
                {
                  question: "What happens if I miss the filing deadline?",
                  answer: "Late filing attracts penalties of ₹200 per day (₹100 for CGST + ₹100 for SGST) with a maximum of ₹5,000 per return. Our service ensures timely filing to avoid these penalties."
                },
                {
                  question: "What returns are included in the service?",
                  answer: "Our monthly service includes GSTR-1 (outward supplies) and GSTR-3B (summary return). Additional returns like GSTR-9 (annual return) are charged separately."
                },
                {
                  question: "How do I provide my transaction data?",
                  answer: "You can share your data through Excel files, PDF invoices, or through our secure online portal. We also accept data from popular accounting software like Tally, QuickBooks, etc."
                }
              ].map((faq, index) => (
                <FadeInSection key={index} delay={index * 100}>
                  <Card className="border-2 border-blue-100 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-gray-900 mb-3 text-lg">{faq.question}</h3>
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </CardContent>
                  </Card>
                </FadeInSection>
              ))}
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* CTA Section */}
      <FadeInSection>
        <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto space-y-8">
              <h2 className="text-4xl lg:text-5xl font-bold">Start Your GST Filing Service</h2>
              <p className="text-xl text-blue-100 leading-relaxed">
                Don't let compliance slow you down. Our experts handle your monthly GST returns, so you can focus on growing your business.
              </p>
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Link href={`/dashboard/new-form?service=${encodeURIComponent("GST Filing")}`} passHref>
                  <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    Start GST Filing Service
                    <FileCheck className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href={`/dashboard/new-form?service=${encodeURIComponent("GST Filing")}`} passHref>
                  <Button
                    variant="outline"
                    className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg rounded-full transition-all duration-300 hover:scale-105 bg-transparent"
                  >
                    Speak to Our Experts
                    <Phone className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </FadeInSection>

      <EnhancedFooter />
    </div>
  )
}
