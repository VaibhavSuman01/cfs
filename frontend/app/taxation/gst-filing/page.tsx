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
                  Get your business GST-compliant. Register for a Goods and Services Tax Identification Number (GSTIN) to legally collect taxes and claim input tax credits.
                </p>

                <div className="grid sm:grid-cols-3 gap-4 pt-6">
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">
                      <PricingDisplay serviceName="gst registration" />
                    </div>
                    <div className="text-sm text-gray-600">Starting Price</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">2-6 Days</div>
                    <div className="text-sm text-gray-600">Processing Time</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">₹40L+</div>
                    <div className="text-sm text-gray-600">Turnover Limit</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <Link href={`/dashboard/new-form?service=${encodeURIComponent("GST Filing")}`} passHref>
                    <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                      Register for GST
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
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">Choose Your GST Filing Package</h2>
              <p className="text-lg text-gray-600">
                Select the package that best fits your GST filing requirements
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <Card className="border-2 border-blue-200 hover:border-blue-400 hover:shadow-xl transition-all duration-300">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl font-bold text-blue-600">Basic</CardTitle>
                  <div className="text-4xl font-bold text-gray-900">₹1,999</div>
                  <p className="text-sm text-gray-600">Starting Price</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3 text-left">
                    <li className="flex items-center"><CheckCircle className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" /><span>GST Registration</span></li>
                    <li className="flex items-center"><CheckCircle className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" /><span>Basic Documentation</span></li>
                    <li className="flex items-center"><CheckCircle className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" /><span>Registration Certificate</span></li>
                  </ul>
                  <Link href={`/dashboard/new-form?service=${encodeURIComponent("GST Filing - Basic")}`} passHref>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">Choose Basic</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="border-2 border-blue-400 hover:border-blue-600 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl font-bold text-blue-600">Standard</CardTitle>
                  <div className="text-4xl font-bold text-gray-900">₹2,999</div>
                  <p className="text-sm text-gray-600">Most Popular</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3 text-left">
                    <li className="flex items-center"><CheckCircle className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" /><span>Everything in Basic</span></li>
                    <li className="flex items-center"><CheckCircle className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" /><span>Priority Processing</span></li>
                    <li className="flex items-center"><CheckCircle className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" /><span>Expert Consultation</span></li>
                    <li className="flex items-center"><CheckCircle className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" /><span>Post-Registration Support</span></li>
                  </ul>
                  <Link href={`/dashboard/new-form?service=${encodeURIComponent("GST Filing - Standard")}`} passHref>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">Choose Standard</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="border-2 border-blue-200 hover:border-blue-400 hover:shadow-xl transition-all duration-300">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl font-bold text-blue-600">Premium</CardTitle>
                  <div className="text-4xl font-bold text-gray-900">₹4,999</div>
                  <p className="text-sm text-gray-600">Complete Solution</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3 text-left">
                    <li className="flex items-center"><CheckCircle className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" /><span>Everything in Standard</span></li>
                    <li className="flex items-center"><CheckCircle className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" /><span>Compliance Training</span></li>
                    <li className="flex items-center"><CheckCircle className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" /><span>1 Year Support</span></li>
                    <li className="flex items-center"><CheckCircle className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" /><span>GST Filing Assistance</span></li>
                  </ul>
                  <Link href={`/dashboard/new-form?service=${encodeURIComponent("GST Filing - Premium")}`} passHref>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">Choose Premium</Button>
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
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">Benefits of GST Filing</h2>
              <p className="text-lg text-gray-600">
                Registering for GST provides your business with a range of advantages, from legal recognition to competitive strength.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="text-center p-6 border-2 border-transparent hover:border-blue-200 hover:shadow-xl transition-all">
                <FileCheck className="mx-auto h-12 w-12 text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Legal Recognition</h3>
                <p className="text-gray-600">Your business is recognized as a legitimate, law-abiding supplier of goods or services.</p>
              </Card>
              <Card className="text-center p-6 border-2 border-transparent hover:border-blue-200 hover:shadow-xl transition-all">
                <Receipt className="mx-auto h-12 w-12 text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Input Tax Credit</h3>
                <p className="text-gray-600">Claim credit on taxes paid on inputs and use it to offset the tax you owe on outputs.</p>
              </Card>
              <Card className="text-center p-6 border-2 border-transparent hover:border-blue-200 hover:shadow-xl transition-all">
                <TrendingUp className="mx-auto h-12 w-12 text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Inter-State Trade</h3>
                <p className="text-gray-600">Conduct business across state lines without restrictions and expand your market reach.</p>
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
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">Simple Online Registration Process</h2>
              <p className="text-lg text-gray-600">
                Our streamlined process ensures you get your GSTIN quickly and efficiently.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="p-6 text-center"><CardTitle className="mb-4 text-blue-600">1. Submit Documents</CardTitle><p className="text-gray-600">Provide your PAN, Aadhaar, and business details.</p></Card>
              <Card className="p-6 text-center"><CardTitle className="mb-4 text-blue-600">2. Application Filing</CardTitle><p className="text-gray-600">We file Form REG-01 on your behalf on the GST portal.</p></Card>
              <Card className="p-6 text-center"><CardTitle className="mb-4 text-blue-600">3. Officer Review</CardTitle><p className="text-gray-600">A GST officer reviews your application for accuracy.</p></Card>
              <Card className="p-6 text-center"><CardTitle className="mb-4 text-blue-600">4. GSTIN Issued</CardTitle><p className="text-gray-600">Receive your GST Filing Certificate and unique GSTIN.</p></Card>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Documents Required Section */}
      <FadeInSection>
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto mb-16">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">Documents Required for GST Filing</h2>
              <p className="text-lg text-gray-600">
                The documentation process is straightforward. You'll need the following:
              </p>
            </div>
            <div className="max-w-3xl mx-auto">
              <Card className="p-8">
                <ul className="space-y-4 text-gray-700 text-lg grid md:grid-cols-2 gap-x-8 gap-y-4">
                  <li className="flex items-center"><CheckCircle className="h-6 w-6 text-blue-500 mr-4 flex-shrink-0" /><span>PAN Card of Applicant</span></li>
                  <li className="flex items-center"><CheckCircle className="h-6 w-6 text-blue-500 mr-4 flex-shrink-0" /><span>Aadhaar Card</span></li>
                  <li className="flex items-center"><CheckCircle className="h-6 w-6 text-blue-500 mr-4 flex-shrink-0" /><span>Proof of Business Registration</span></li>
                  <li className="flex items-center"><CheckCircle className="h-6 w-6 text-blue-500 mr-4 flex-shrink-0" /><span>Promoter's ID & Address Proof</span></li>
                  <li className="flex items-center"><CheckCircle className="h-6 w-6 text-blue-500 mr-4 flex-shrink-0" /><span>Business Address Proof</span></li>
                  <li className="flex items-center"><CheckCircle className="h-6 w-6 text-blue-500 mr-4 flex-shrink-0" /><span>Bank Account Statement</span></li>
                  <li className="flex items-center"><CheckCircle className="h-6 w-6 text-blue-500 mr-4 flex-shrink-0" /><span>Digital Signature</span></li>
                  <li className="flex items-center"><CheckCircle className="h-6 w-6 text-blue-500 mr-4 flex-shrink-0" /><span>Letter of Authorization</span></li>
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
                Find answers to common questions about GST registration.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {[
                {
                  question: "Who is required to get GST registration?",
                  answer: "Any business with an annual turnover exceeding ₹40 lakh (for goods) or ₹20 lakh (for services) must register. It's also mandatory for e-commerce sellers, inter-state suppliers, and casual taxable persons, regardless of turnover."
                },
                {
                  question: "Is there a fee for GST registration?",
                  answer: "No, there are no government fees for GST registration. The process is free of cost on the official GST portal. Charges may only apply if you hire a professional for assistance."
                },
                {
                  question: "How long is a GST registration valid?",
                  answer: "A standard GST registration is valid until it is surrendered by the taxpayer or cancelled by the authorities. It does not have an expiry date."
                },
                {
                  question: "Can I register for GST voluntarily?",
                  answer: "Yes, businesses that do not meet the turnover threshold can still register for GST voluntarily. This allows them to claim input tax credit and conduct inter-state trade legally."
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
              <h2 className="text-4xl lg:text-5xl font-bold">Get Your Business GST Ready</h2>
              <p className="text-xl text-blue-100 leading-relaxed">
                Don't let compliance slow you down. Our experts make GST registration a hassle-free experience, so you can focus on growing your business.
              </p>
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Link href={`/dashboard/new-form?service=${encodeURIComponent("GST Filing")}`} passHref>
                  <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    Apply for GSTIN Now
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
