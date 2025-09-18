"use client"

import { EnhancedHeader } from "@/components/enhanced-header"
import { EnhancedFooter } from "@/components/enhanced-footer"
import { FadeInSection } from "@/components/fade-in-section"
import { AnimatedBackground } from "@/components/animated-background"
import { FloatingElements } from "@/components/floating-elements"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { PricingDisplay } from "@/components/ui/pricing-display"
import {
  FileSpreadsheet,
  CheckCircle,
  Shield,
  ArrowRight,
  TrendingUp,
  Phone,
  FileText,
  Landmark,
  UserCheck
} from "lucide-react"

export default function IncomeTaxFilingPage() {
  
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
                  Fulfill Your Duty, Secure Your Future
                </Badge>
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 bg-clip-text text-transparent">
                    Income Tax Filing
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 bg-clip-text text-transparent">
                    Simplified & Accurate
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  File your Income Tax Return (ITR) with confidence. Our experts ensure maximum deductions and a hassle-free filing experience for individuals and businesses.
                </p>

                <div className="grid sm:grid-cols-3 gap-4 pt-6">
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">
                      <PricingDisplay serviceName="income tax filing" />
                    </div>
                    <div className="text-sm text-gray-600">Starting Price</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">Claim</div>
                    <div className="text-sm text-gray-600">Refunds</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">Avoid</div>
                    <div className="text-sm text-gray-600">Penalties</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <Link href={`/dashboard/new-form?service=${encodeURIComponent("Income Tax Filing")}`} passHref>
                    <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                      File Your ITR Now
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href={`/dashboard/new-form?service=${encodeURIComponent("Income Tax Filing")}`} passHref>
                    <Button
                      variant="outline"
                      className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-3 rounded-full transition-all duration-300 hover:scale-105 bg-transparent"
                    >
                      Talk to a Tax Expert
                    </Button>
                  </Link>
                </div>
              </div>
            </FadeInSection>
            <FadeInSection className="hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-transparent rounded-full -translate-x-10 -translate-y-10"></div>
                <img
                  src="/images/income-tax-hero.svg"
                  alt="Income Tax Filing Illustration"
                  className="relative rounded-lg shadow-2xl w-full h-auto"
                />
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* Why File Your ITR Section */}
      <FadeInSection>
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto mb-16">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">Why Filing Your ITR is Important</h2>
              <p className="text-lg text-gray-600">
                Beyond being a legal requirement, filing your Income Tax Return offers significant financial benefits and opportunities.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="text-center p-6 border-2 border-transparent hover:border-blue-200 hover:shadow-xl transition-all">
                <Landmark className="mx-auto h-12 w-12 text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Claim Tax Refunds</h3>
                <p className="text-gray-600">If excess tax has been deducted (TDS), filing an ITR is the only way to claim your rightful refund.</p>
              </Card>
              <Card className="text-center p-6 border-2 border-transparent hover:border-blue-200 hover:shadow-xl transition-all">
                <FileText className="mx-auto h-12 w-12 text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Proof of Income</h3>
                <p className="text-gray-600">ITR documents serve as crucial proof of income for loan applications, visa processing, and credit card approvals.</p>
              </Card>
              <Card className="text-center p-6 border-2 border-transparent hover:border-blue-200 hover:shadow-xl transition-all">
                <Shield className="mx-auto h-12 w-12 text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Avoid Penalties</h3>
                <p className="text-gray-600">Timely filing helps you avoid hefty penalties for non-compliance and late submission of your tax returns.</p>
              </Card>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Simple Filing Process Section */}
      <FadeInSection>
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto mb-16">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">Our 4-Step Filing Process</h2>
              <p className="text-lg text-gray-600">
                We've simplified the ITR filing process to make it effortless for you.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="p-6 text-center"><CardTitle className="mb-4 text-blue-600">1. Upload Documents</CardTitle><p className="text-gray-600">Securely upload your tax documents like Form 16, bank statements, etc.</p></Card>
              <Card className="p-6 text-center"><CardTitle className="mb-4 text-blue-600">2. Expert Review</CardTitle><p className="text-gray-600">Our tax experts review your documents and prepare your return.</p></Card>
              <Card className="p-6 text-center"><CardTitle className="mb-4 text-blue-600">3. Review & Approve</CardTitle><p className="text-gray-600">You review the prepared return and give your approval for filing.</p></Card>
              <Card className="p-6 text-center"><CardTitle className="mb-4 text-blue-600">4. Filing & Acknowledgment</CardTitle><p className="text-gray-600">We e-file your return and send you the ITR-V acknowledgment.</p></Card>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Documents Required Section */}
      <FadeInSection>
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto mb-16">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">Document Checklist for ITR Filing</h2>
              <p className="text-lg text-gray-600">
                Gather these essential documents for a smooth and accurate filing experience.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="p-6">
                <CardTitle className="mb-4 text-blue-600">General Documents</CardTitle>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start"><CheckCircle className="h-5 w-5 text-blue-500 mr-3 mt-1 flex-shrink-0" /><span>PAN Card & Aadhaar Card</span></li>
                  <li className="flex items-start"><CheckCircle className="h-5 w-5 text-blue-500 mr-3 mt-1 flex-shrink-0" /><span>Bank Account Statements</span></li>
                  <li className="flex items-start"><CheckCircle className="h-5 w-5 text-blue-500 mr-3 mt-1 flex-shrink-0" /><span>Form 26AS, AIS & TIS</span></li>
                </ul>
              </Card>
              <Card className="p-6">
                <CardTitle className="mb-4 text-blue-600">For Salaried Individuals</CardTitle>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start"><CheckCircle className="h-5 w-5 text-blue-500 mr-3 mt-1 flex-shrink-0" /><span>Form 16 (Part A & B)</span></li>
                  <li className="flex items-start"><CheckCircle className="h-5 w-5 text-blue-500 mr-3 mt-1 flex-shrink-0" /><span>Salary Slips</span></li>
                  <li className="flex items-start"><CheckCircle className="h-5 w-5 text-blue-500 mr-3 mt-1 flex-shrink-0" /><span>Rent Receipts for HRA</span></li>
                </ul>
              </Card>
              <Card className="p-6">
                <CardTitle className="mb-4 text-blue-600">For Other Incomes</CardTitle>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start"><CheckCircle className="h-5 w-5 text-blue-500 mr-3 mt-1 flex-shrink-0" /><span>Capital Gains Statements</span></li>
                  <li className="flex items-start"><CheckCircle className="h-5 w-5 text-blue-500 mr-3 mt-1 flex-shrink-0" /><span>Rental Income Details</span></li>
                  <li className="flex items-start"><CheckCircle className="h-5 w-5 text-blue-500 mr-3 mt-1 flex-shrink-0" /><span>Interest Certificates</span></li>
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
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">Income Tax Filing FAQs</h2>
              <p className="text-lg text-gray-600">
                Common questions about filing your income tax return.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {[
                {
                  question: "Can I file my ITR without Form 16?",
                  answer: "Yes, you can. You can use your salary slips, Form 26AS, and AIS to gather the necessary income and TDS details to file your return accurately."
                },
                {
                  question: "What happens if I miss the ITR filing deadline?",
                  answer: "Filing after the due date can result in penalties, loss of the ability to carry forward losses, and delayed refunds. It is always advisable to file on time."
                },
                {
                  question: "Which ITR form should I use?",
                  answer: "The ITR form depends on your sources of income. Our platform automatically selects the correct form for you based on the information you provide, simplifying the process."
                },
                {
                  question: "Do I need to attach any documents when e-filing?",
                  answer: "No, you do not need to attach any documents when e-filing your return. However, you should keep them safe in case the Income Tax Department asks for them later."
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
              <h2 className="text-4xl lg:text-5xl font-bold">Ready to File Your Taxes?</h2>
              <p className="text-xl text-blue-100 leading-relaxed">
                Let's make this tax season your easiest one yet. Get started with our expert-assisted ITR filing service today and ensure you get the best possible outcome.
              </p>
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Link href={`/dashboard/new-form?service=${encodeURIComponent("Income Tax Filing")}`} passHref>
                  <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    Start My ITR Filing
                    <FileSpreadsheet className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href={`/dashboard/new-form?service=${encodeURIComponent("Income Tax Filing")}`} passHref>
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
