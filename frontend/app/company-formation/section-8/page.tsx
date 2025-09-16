"use client"

import Link from "next/link";
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
  Heart,  
  Shield,
  Users,
  ArrowRight,
  Star,
  TrendingUp,
  Award,
  Phone,
  Mail,
  MapPin,
  FileText,
  Briefcase,
  BarChart,
  CheckCircle
} from "lucide-react"

export default function Section8CompanyPage() {
  const basePrice = getBasePrice("section 8 company") ?? "₹8,999";
  
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
                  For Non-Profit Organizations
                </Badge>
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 bg-clip-text text-transparent">
                    Section 8 Company
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 bg-clip-text text-transparent">
                    Registration
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Establish your non-profit organization with the legal structure of a company. A Section 8 Company is ideal for promoting commerce, art, science, sports, education, research, social welfare, religion, or charity.
                </p>

                <div className="grid sm:grid-cols-3 gap-4 pt-6">
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">{basePrice}</div>
                    <div className="text-sm text-gray-600">Starting Price</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">15-25 Days</div>
                    <div className="text-sm text-gray-600">Processing Time</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">99.8%</div>
                    <div className="text-sm text-gray-600">Success Rate</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <Link href={`/dashboard/company-formation-form?service=${encodeURIComponent('Section 8 Company')}`} passHref>
                    <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                      Start Your NGO
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href={`/dashboard/company-formation-form?service=${encodeURIComponent('Section 8 Company')}`} passHref>
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
                  src="/images/section8-hero.svg"
                  alt="Section 8 Company Illustration"
                  className="relative rounded-lg shadow-2xl w-full h-auto"
                />
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* What is a Section 8 Company Section */}
      <FadeInSection>
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto mb-16">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">What is a Section 8 Company?</h2>
              <p className="text-lg text-gray-600">
                A Section 8 Company is registered for charitable or not-for-profit purposes. The profits generated must be used to promote its objects and cannot be distributed as dividends to its members.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="text-center p-6 border-2 border-transparent hover:border-blue-200 hover:shadow-xl transition-all">
                <Heart className="mx-auto h-12 w-12 text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Charitable Objects</h3>
                <p className="text-gray-600">Established for promoting commerce, art, science, sports, education, research, social welfare, religion, charity, or environmental protection.</p>
              </Card>
              <Card className="text-center p-6 border-2 border-transparent hover:border-blue-200 hover:shadow-xl transition-all">
                <Shield className="mx-auto h-12 w-12 text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Profit Distribution</h3>
                <p className="text-gray-600">Intends to apply all its profits or other income in promoting its objects and prohibits the payment of any dividend to its members.</p>
              </Card>
              <Card className="text-center p-6 border-2 border-transparent hover:border-blue-200 hover:shadow-xl transition-all">
                <Award className="mx-auto h-12 w-12 text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Government License</h3>
                <p className="text-gray-600">Operates under a license from the Central Government and enjoys several privileges and exemptions under company law.</p>
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
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">Choose Your Section 8 Package</h2>
              <p className="text-lg text-gray-600">
                Select the package that best fits your Section 8 company registration requirements
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <Card className="border-2 border-blue-200 hover:border-blue-400 hover:shadow-xl transition-all duration-300">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl font-bold text-blue-600">Basic</CardTitle>
                  <div className="text-4xl font-bold text-gray-900">₹8,999</div>
                  <p className="text-sm text-gray-600">Starting Price</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3 text-left">
                    <li className="flex items-center"><CheckCircle className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" /><span>Section 8 Registration</span></li>
                    <li className="flex items-center"><CheckCircle className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" /><span>DSC & DPIN</span></li>
                    <li className="flex items-center"><CheckCircle className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" /><span>Basic Documentation</span></li>
                  </ul>
                  <Link href={`/dashboard/company-formation-form?service=${encodeURIComponent('Section 8 Company')}`} passHref>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">Choose Basic</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="border-2 border-blue-400 hover:border-blue-600 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl font-bold text-blue-600">Standard</CardTitle>
                  <div className="text-4xl font-bold text-gray-900">₹24,999</div>
                  <p className="text-sm text-gray-600">Most Popular</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3 text-left">
                    <li className="flex items-center"><CheckCircle className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" /><span>Everything in Basic</span></li>
                    <li className="flex items-center"><CheckCircle className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" /><span>Priority Processing</span></li>
                    <li className="flex items-center"><CheckCircle className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" /><span>Expert Consultation</span></li>
                    <li className="flex items-center"><CheckCircle className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" /><span>Bank Account Setup</span></li>
                  </ul>
                  <Link href={`/dashboard/company-formation-form?service=${encodeURIComponent('Section 8 Company')}`} passHref>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">Choose Standard</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="border-2 border-blue-200 hover:border-blue-400 hover:shadow-xl transition-all duration-300">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl font-bold text-blue-600">Premium</CardTitle>
                  <div className="text-4xl font-bold text-gray-900">₹29,999</div>
                  <p className="text-sm text-gray-600">Complete Solution</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3 text-left">
                    <li className="flex items-center"><CheckCircle className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" /><span>Everything in Standard</span></li>
                    <li className="flex items-center"><CheckCircle className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" /><span>80G & 12A Registration</span></li>
                    <li className="flex items-center"><CheckCircle className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" /><span>Compliance Setup</span></li>
                    <li className="flex items-center"><CheckCircle className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" /><span>1 Year Support</span></li>
                  </ul>
                  <Link href={`/dashboard/company-formation-form?service=${encodeURIComponent('Section 8 Company')}`} passHref>
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
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">Our Incorporation Process</h2>
              <p className="text-lg text-gray-600">
                We provide a seamless and transparent registration process for your Section 8 Company.
              </p>
            </div>
            <div className="relative">
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5"></div>
              <div className="grid md:grid-cols-3 gap-16 relative">
                <div className="text-center space-y-4">
                  <div className="relative inline-block">
                    <div className="w-20 h-20 mx-auto bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl font-bold">1</div>
                  </div>
                  <h3 className="text-xl font-semibold">Apply for Name & DSC</h3>
                  <p className="text-gray-600">We apply for the Digital Signature Certificate (DSC) and a unique name for your company via the SPICE+ PART A form.</p>
                </div>
                <div className="text-center space-y-4">
                  <div className="relative inline-block">
                    <div className="w-20 h-20 mx-auto bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl font-bold">2</div>
                  </div>
                  <h3 className="text-xl font-semibold">Prepare & File Forms</h3>
                  <p className="text-gray-600">We prepare and file all necessary forms, including SPICE+, eMoA, eAoA, and INC-15 declaration, with the MCA.</p>
                </div>
                <div className="text-center space-y-4">
                  <div className="relative inline-block">
                    <div className="w-20 h-20 mx-auto bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl font-bold">3</div>
                  </div>
                  <h3 className="text-xl font-semibold">Get License & Incorporate</h3>
                  <p className="text-gray-600">The CRC processes the documents and issues the license and Certificate of Incorporation, along with PAN and TAN.</p>
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
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">Documents for Section 8 Registration</h2>
              <p className="text-lg text-gray-600">
                Gather these documents to ensure a smooth and quick registration process.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="p-6">
                <CardTitle className="mb-4 text-blue-600">For Directors</CardTitle>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start"><CheckCircle className="h-5 w-5 text-blue-500 mr-3 mt-1 flex-shrink-0" /><span>PAN Card and Aadhaar Card.</span></li>
                  <li className="flex items-start"><CheckCircle className="h-5 w-5 text-blue-500 mr-3 mt-1 flex-shrink-0" /><span>Identity Proof: Driving License, Passport, or Voter ID.</span></li>
                  <li className="flex items-start"><CheckCircle className="h-5 w-5 text-blue-500 mr-3 mt-1 flex-shrink-0" /><span>Latest Address Proof: Utility bill or bank statement (not older than 2 months).</span></li>
                  <li className="flex items-start"><CheckCircle className="h-5 w-5 text-blue-500 mr-3 mt-1 flex-shrink-0" /><span>Form DIR-2 (Consent to act as a director).</span></li>
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
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">Common Questions Answered</h2>
              <p className="text-lg text-gray-600">
                Here are some frequently asked questions about Section 8 Company registration.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {[
                {
                  question: "Can a Section 8 Company make a profit?",
                  answer: "Yes, a Section 8 Company can generate profits. However, these profits must be used for promoting the company's objects and cannot be distributed as dividends to its members."
                },
                {
                  question: "Is there a minimum capital requirement?",
                  answer: "No, there is no prescribed minimum paid-up share capital for a Section 8 Company. The capital can be structured based on the requirements of the company."
                },
                {
                  question: "Do Section 8 Companies get tax exemptions?",
                  answer: "Section 8 Companies can avail of several tax benefits. They can get exemptions under Sections 12A and 80G of the Income Tax Act, which provides tax relief to the company and its donors."
                },
                {
                  question: "What are the compliance requirements for a Section 8 Company?",
                  answer: "They must conduct at least one board meeting every six months, maintain books of accounts, prepare financial statements, and file annual returns with the Registrar of Companies (ROC)."
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

      {/* Documents Required */}
      <FadeInSection>
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-4xl font-bold text-gray-900">Documents Required</h2>
              <p className="text-xl text-gray-600">Keep these documents ready for quick registration</p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-gray-900">For Directors</h3>
                <div className="space-y-4">
                  {[
                    "PAN Card of all Directors",
                    "Aadhaar Card of all Directors",
                    "Passport size photographs",
                    "Residential proof (Passport or Driving License or Voter ID card)",
                    "Mobile number and Email ID",
                  ].map((doc, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-blue-500" />
                      <span className="text-gray-700">{doc}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-gray-900">For Company</h3>
                <div className="space-y-4">
                  {[
                    "Rent agreement (if rented)",
                    "NOC from property owner",
                    "Utility bill of registered office",
                    "Proposed company names (1-2 options)",
                  ].map((doc, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-blue-500" />
                      <span className="text-gray-700">{doc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* CTA Section */}
      <FadeInSection>
        <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto space-y-8">
              <h2 className="text-4xl lg:text-5xl font-bold">Ready to Make a Difference?</h2>
              <p className="text-xl text-blue-100 leading-relaxed">
                Start your non-profit venture today with a Section 8 Company. Our experts are here to help you navigate the registration process and bring your vision to life.
              </p>
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Link href={`/dashboard/company-formation-form?service=${encodeURIComponent('Section 8 Company')}`} passHref>
                  <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    Register My Section 8 Company
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href={`/dashboard/company-formation-form?service=${encodeURIComponent('Section 8 Company')}`} passHref>
                  <Button
                    variant="outline"
                    className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg rounded-full transition-all duration-300 hover:scale-105 bg-transparent"
                  >
                    Apply Now
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
