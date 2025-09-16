"use client"

import { EnhancedHeader } from "@/components/enhanced-header"
import { EnhancedFooter } from "@/components/enhanced-footer"
import { FadeInSection } from "@/components/fade-in-section"
import { AnimatedBackground } from "@/components/animated-background"
import { FloatingElements } from "@/components/floating-elements"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { getBasePrice } from "@/lib/pricing"
import {
  Users,
  CheckCircle,
  Shield,
  ArrowRight,
  Star,
  TrendingUp,
  Award,
  Phone,
  Mail,
  MapPin,
  FileText,
  Briefcase,
  Handshake
} from "lucide-react"
import Link from "next/link"

export default function LlpRegistrationPage() {
  const basePrice = getBasePrice("llp registration") ?? "₹4,999";
  
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
                  Flexible Business Structure
                </Badge>
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 bg-clip-text text-transparent">
                    LLP Registration
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 bg-clip-text text-transparent">
                    (Limited Liability Partnership)
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Combine the benefits of a partnership and a company with an LLP. Enjoy limited liability protection and operational flexibility. Get your LLP registered with our expert assistance.
                </p>

                <div className="grid sm:grid-cols-3 gap-4 pt-6">
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">{basePrice}</div>
                    <div className="text-sm text-gray-600">Starting Price</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">10-15 Days</div>
                    <div className="text-sm text-gray-600">Processing Time</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">99.9%</div>
                    <div className="text-sm text-gray-600">Success Rate</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <Link href={`/dashboard/other-registration-form?service=${encodeURIComponent("LLP Registration")}`} passHref>
                    <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                      Register Your LLP Now
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href={`/dashboard/other-registration-form?service=${encodeURIComponent("LLP Registration")}`} passHref>
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
                  src="/images/llp-hero.svg"
                  alt="LLP Registration Illustration"
                  className="relative rounded-lg shadow-2xl w-full h-auto"
                />
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* What is an LLP Section */}
      <FadeInSection>
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto mb-16">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">What is a Limited Liability Partnership?</h2>
              <p className="text-lg text-gray-600">
                An LLP is a corporate business vehicle that enables professional expertise and entrepreneurial initiative to combine and operate in a flexible, innovative, and efficient manner, providing benefits of limited liability while allowing its members the flexibility for organizing their internal structure as a partnership.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="text-center p-6 border-2 border-transparent hover:border-blue-200 hover:shadow-xl transition-all">
                <Shield className="mx-auto h-12 w-12 text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Limited Liability</h3>
                <p className="text-gray-600">Partners are not liable for each other's misconduct or negligence. Liability is limited to their agreed contribution.</p>
              </Card>
              <Card className="text-center p-6 border-2 border-transparent hover:border-blue-200 hover:shadow-xl transition-all">
                <Handshake className="mx-auto h-12 w-12 text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Flexible Agreement</h3>
                <p className="text-gray-600">The rights and duties of partners are governed by the LLP agreement, offering great flexibility in management and operations.</p>
              </Card>
              <Card className="text-center p-6 border-2 border-transparent hover:border-blue-200 hover:shadow-xl transition-all">
                <Briefcase className="mx-auto h-12 w-12 text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Separate Legal Entity</h3>
                <p className="text-gray-600">An LLP is a separate legal entity from its partners, having perpetual succession, just like a company.</p>
              </Card>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Pricing Packages Section */}
      <FadeInSection>
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto mb-16">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">Choose Your LLP Package</h2>
              <p className="text-lg text-gray-600">
                Select the package that best fits your business requirements
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <Card className="border-2 border-blue-200 hover:border-blue-400 hover:shadow-xl transition-all duration-300">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl font-bold text-blue-600">Basic</CardTitle>
                  <div className="text-4xl font-bold text-gray-900">₹4,999</div>
                  <p className="text-sm text-gray-600">Starting Price</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3 text-left">
                    <li className="flex items-center"><CheckCircle className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" /><span>LLP Registration</span></li>
                    <li className="flex items-center"><CheckCircle className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" /><span>DSC & DPIN</span></li>
                    <li className="flex items-center"><CheckCircle className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" /><span>Basic Documentation</span></li>
                  </ul>
                  <Link href={`/contact?service=${encodeURIComponent("LLP Registration - Basic")}`} passHref>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">Choose Basic</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="border-2 border-blue-400 hover:border-blue-600 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl font-bold text-blue-600">Standard</CardTitle>
                  <div className="text-4xl font-bold text-gray-900">₹9,999</div>
                  <p className="text-sm text-gray-600">Most Popular</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3 text-left">
                    <li className="flex items-center"><CheckCircle className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" /><span>Everything in Basic</span></li>
                    <li className="flex items-center"><CheckCircle className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" /><span>LLP Agreement Drafting</span></li>
                    <li className="flex items-center"><CheckCircle className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" /><span>Priority Processing</span></li>
                    <li className="flex items-center"><CheckCircle className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" /><span>Expert Consultation</span></li>
                  </ul>
                  <Link href={`/contact?service=${encodeURIComponent("LLP Registration - Standard")}`} passHref>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">Choose Standard</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="border-2 border-blue-200 hover:border-blue-400 hover:shadow-xl transition-all duration-300">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl font-bold text-blue-600">Premium</CardTitle>
                  <div className="text-4xl font-bold text-gray-900">₹14,999</div>
                  <p className="text-sm text-gray-600">Complete Solution</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3 text-left">
                    <li className="flex items-center"><CheckCircle className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" /><span>Everything in Standard</span></li>
                    <li className="flex items-center"><CheckCircle className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" /><span>Bank Account Opening</span></li>
                    <li className="flex items-center"><CheckCircle className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" /><span>Compliance Setup</span></li>
                    <li className="flex items-center"><CheckCircle className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" /><span>1 Year Support</span></li>
                  </ul>
                  <Link href={`/contact?service=${encodeURIComponent("LLP Registration - Premium")}`} passHref>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">Choose Premium</Button>
                  </Link>
                </CardContent>
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
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">Our 5-Step LLP Registration Process</h2>
              <p className="text-lg text-gray-600">
                We've simplified the LLP registration process to get you up and running in no time.
              </p>
            </div>
            <div className="relative">
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5"></div>
              <div className="grid md:grid-cols-5 gap-8 relative">
                <div className="text-center space-y-4">
                  <div className="relative inline-block"><div className="w-16 h-16 mx-auto bg-blue-500 text-white rounded-full flex items-center justify-center text-xl font-bold">1</div></div>
                  <h3 className="text-lg font-semibold">DSC & DPIN</h3>
                </div>
                <div className="text-center space-y-4">
                  <div className="relative inline-block"><div className="w-16 h-16 mx-auto bg-blue-500 text-white rounded-full flex items-center justify-center text-xl font-bold">2</div></div>
                  <h3 className="text-lg font-semibold">Name Approval</h3>
                </div>
                <div className="text-center space-y-4">
                  <div className="relative inline-block"><div className="w-16 h-16 mx-auto bg-blue-500 text-white rounded-full flex items-center justify-center text-xl font-bold">3</div></div>
                  <h3 className="text-lg font-semibold">Filing Forms</h3>
                </div>
                <div className="text-center space-y-4">
                  <div className="relative inline-block"><div className="w-16 h-16 mx-auto bg-blue-500 text-white rounded-full flex items-center justify-center text-xl font-bold">4</div></div>
                  <h3 className="text-lg font-semibold">Certificate</h3>
                </div>
                <div className="text-center space-y-4">
                  <div className="relative inline-block"><div className="w-16 h-16 mx-auto bg-blue-500 text-white rounded-full flex items-center justify-center text-xl font-bold">5</div></div>
                  <h3 className="text-lg font-semibold">LLP Agreement</h3>
                </div>
              </div>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Documents Required Section */}
      <FadeInSection>
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto mb-16">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">Documents Required for LLP</h2>
              <p className="text-lg text-gray-600">
                Please provide the following documents for a smooth and quick registration.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="p-6">
                <CardTitle className="mb-4 text-blue-600">For Partners</CardTitle>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start"><CheckCircle className="h-5 w-5 text-blue-500 mr-3 mt-1 flex-shrink-0" /><span>PAN Card and Aadhaar Card.</span></li>
                  <li className="flex items-start"><CheckCircle className="h-5 w-5 text-blue-500 mr-3 mt-1 flex-shrink-0" /><span>Identity Proof: Driving License, Passport, or Voter ID.</span></li>
                  <li className="flex items-start"><CheckCircle className="h-5 w-5 text-blue-500 mr-3 mt-1 flex-shrink-0" /><span>Latest Address Proof: Utility bill or bank statement (not older than 2 months).</span></li>
                  <li className="flex items-start"><CheckCircle className="h-5 w-5 text-blue-500 mr-3 mt-1 flex-shrink-0" /><span>Form 9 (Consent to act as a designated partner).</span></li>
                </ul>
              </Card>
              <Card className="p-6">
                <CardTitle className="mb-4 text-blue-600">For Registered Office</CardTitle>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start"><CheckCircle className="h-5 w-5 text-blue-500 mr-3 mt-1 flex-shrink-0" /><span>Address Proof: Latest utility bill (Electricity/Telephone).</span></li>
                  <li className="flex items-start"><CheckCircle className="h-5 w-5 text-blue-500 mr-3 mt-1 flex-shrink-0" /><span>No Objection Certificate (NOC) from the property owner if rented.</span></li>
                  <li className="flex items-start"><CheckCircle className="h-5 w-5 text-blue-500 mr-3 mt-1 flex-shrink-0" /><span>Rent agreement if the property is rented.</span></li>
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
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">Your LLP Questions, Answered</h2>
              <p className="text-lg text-gray-600">
                Find answers to common questions about Limited Liability Partnerships.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {[
                {
                  question: "What is the minimum number of partners in an LLP?",
                  answer: "An LLP must have at least two partners, and at least two of them must be designated partners. There is no maximum limit on the number of partners."
                },
                {
                  question: "Can an existing partnership firm be converted to an LLP?",
                  answer: "Yes, an existing partnership firm can be converted into an LLP by complying with the provisions of the LLP Act. This allows the firm to retain its identity and goodwill."
                },
                {
                  question: "Is an audit mandatory for an LLP?",
                  answer: "An audit is mandatory for an LLP only if its turnover exceeds ₹40 lakh or its contribution exceeds ₹25 lakh in any financial year."
                },
                {
                  question: "What is the LLP Agreement?",
                  answer: "The LLP Agreement is a crucial document that defines the rights, duties, and mutual relationship between the partners and the LLP. It must be filed with the MCA within 30 days of incorporation."
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
              <h2 className="text-4xl lg:text-5xl font-bold">Ready to Form Your LLP?</h2>
              <p className="text-xl text-blue-100 leading-relaxed">
                Get the perfect blend of flexibility and protection for your business. Start your LLP registration with our expert team today.
              </p>
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Link href={`/dashboard/other-registration-form?service=${encodeURIComponent("LLP Registration")}`} passHref>
                  <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    Start My LLP Registration
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href={`/dashboard/other-registration-form?service=${encodeURIComponent("LLP Registration")}`} passHref>
                  <Button
                    variant="outline"
                    className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg rounded-full transition-all duration-300 hover:scale-105 bg-transparent"
                  >
                    Apply Now
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
