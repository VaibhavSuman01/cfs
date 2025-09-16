"use client"

import { EnhancedHeader } from "@/components/enhanced-header"
import { EnhancedFooter } from "@/components/enhanced-footer"
import { FadeInSection } from "@/components/fade-in-section"
import { AnimatedBackground } from "@/components/animated-background"
import { FloatingElements } from "@/components/floating-elements"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getBasePrice } from "@/lib/pricing"
import Link from "next/link"
import {
  ArrowRightLeft,
  FileText,
  Stamp,
  ShieldCheck,
  Scale,
  ArrowRight,
  Phone,
  CheckCircle
} from "lucide-react"

export default function ShareTransferPage() {
  const basePrice = getBasePrice("share transfer & capital changes") ?? "₹5,999";
  
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
                  Ownership & Compliance
                </Badge>
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-gray-900 via-blue-600 to-gray-900 bg-clip-text text-transparent">
                    Share Transfer
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600 bg-clip-text text-transparent">
                    Seamless & Compliant
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Securely transfer ownership of shares in your company with a clear, compliant process, ensuring all legal requirements are met with precision.
                </p>

                <div className="grid sm:grid-cols-3 gap-4 pt-6">
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">{basePrice}</div>
                    <div className="text-sm text-gray-600">Per Transfer</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">10-15 Days</div>
                    <div className="text-sm text-gray-600">Timeline</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">Compliant</div>
                    <div className="text-sm text-gray-600">Process</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-6">
                  <Link href={`/dashboard/roc-returns-form?service=${encodeURIComponent("Share Transfer")}`} passHref>
                    <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                      Initiate a Transfer
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href={`/dashboard/roc-returns-form?service=${encodeURIComponent("Share Transfer")}`} passHref>
                    <Button
                      variant="outline"
                      className="border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white px-8 py-3 rounded-full transition-all duration-300 hover:scale-105 bg-transparent"
                    >
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
            </FadeInSection>
            <FadeInSection className="hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-transparent rounded-full -translate-x-10 -translate-y-10"></div>
                <img
                  src="/images/share-transfer-hero.svg"
                  alt="Share Transfer Illustration"
                  className="relative rounded-lg shadow-2xl w-full h-auto"
                />
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* Share Transfer Process Section */}
      <FadeInSection>
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto mb-16">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">The Share Transfer Process</h2>
              <p className="text-lg text-gray-600">
                A step-by-step guide to transferring shares in a private limited company.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="p-6 border-2 border-transparent hover:border-blue-200 hover:shadow-xl transition-all">
                <CardHeader className="flex items-center space-x-4 pb-4">
                  <FileText className="h-10 w-10 text-blue-500" />
                  <CardTitle className="text-xl font-bold text-blue-700">1. Execute Form SH-4</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">The transferor and transferee must execute the Share Transfer Deed (Form SH-4), which is the primary legal instrument for the transfer.</p>
                </CardContent>
              </Card>
              <Card className="p-6 border-2 border-transparent hover:border-blue-200 hover:shadow-xl transition-all">
                <CardHeader className="flex items-center space-x-4 pb-4">
                  <Stamp className="h-10 w-10 text-blue-500" />
                  <CardTitle className="text-xl font-bold text-blue-700">2. Pay Stamp Duty</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">The executed Form SH-4 must be duly stamped as per the Indian Stamp Act. The rate is 0.015% of the market value of the shares.</p>
                </CardContent>
              </Card>
              <Card className="p-6 border-2 border-transparent hover:border-blue-200 hover:shadow-xl transition-all">
                <CardHeader className="flex items-center space-x-4 pb-4">
                  <ShieldCheck className="h-10 w-10 text-blue-500" />
                  <CardTitle className="text-xl font-bold text-blue-700">3. Board Approval</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Submit the deed and original share certificate to the company. The Board of Directors will pass a resolution to approve the transfer.</p>
                </CardContent>
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
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">Choose Your Share Transfer Package</h2>
              <p className="text-lg text-gray-600">
                Select the package that best fits your share transfer requirements
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
                    <li className="flex items-center"><CheckCircle className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" /><span>Form SH-4 Drafting</span></li>
                    <li className="flex items-center"><CheckCircle className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" /><span>Basic Documentation</span></li>
                    <li className="flex items-center"><CheckCircle className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" /><span>ROC Filing Support</span></li>
                  </ul>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">Choose Basic</Button>
                </CardContent>
              </Card>

              <Card className="border-2 border-blue-400 hover:border-blue-600 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl font-bold text-blue-600">Standard</CardTitle>
                  <div className="text-4xl font-bold text-gray-900">₹6,999</div>
                  <p className="text-sm text-gray-600">Most Popular</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3 text-left">
                    <li className="flex items-center"><CheckCircle className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" /><span>Everything in Basic</span></li>
                    <li className="flex items-center"><CheckCircle className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" /><span>Priority Processing</span></li>
                    <li className="flex items-center"><CheckCircle className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" /><span>Expert Consultation</span></li>
                    <li className="flex items-center"><CheckCircle className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" /><span>Board Resolution Support</span></li>
                  </ul>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">Choose Standard</Button>
                </CardContent>
              </Card>

              <Card className="border-2 border-blue-200 hover:border-blue-400 hover:shadow-xl transition-all duration-300">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl font-bold text-blue-600">Premium</CardTitle>
                  <div className="text-4xl font-bold text-gray-900">₹9,999</div>
                  <p className="text-sm text-gray-600">Complete Solution</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3 text-left">
                    <li className="flex items-center"><CheckCircle className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" /><span>Everything in Standard</span></li>
                    <li className="flex items-center"><CheckCircle className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" /><span>Multiple Share Transfers</span></li>
                    <li className="flex items-center"><CheckCircle className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" /><span>Legal Compliance Review</span></li>
                    <li className="flex items-center"><CheckCircle className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" /><span>1 Year Support</span></li>
                  </ul>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">Choose Premium</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Key Considerations Section */}
      <FadeInSection>
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto mb-16">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">Important Considerations</h2>
              <p className="text-lg text-gray-600">
                Key factors to review before initiating a share transfer.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card className="text-center p-6 border-2 border-transparent hover:border-blue-200 hover:shadow-xl transition-all">
                <h3 className="text-xl font-semibold mb-2">Articles of Association (AOA)</h3>
                <p className="text-gray-600">Always review the company's AOA first. It may contain restrictions on share transfers, such as the 'Right of Pre-emption,' which requires offering shares to existing members first.</p>
              </Card>
              <Card className="text-center p-6 border-2 border-transparent hover:border-blue-200 hover:shadow-xl transition-all">
                <h3 className="text-xl font-semibold mb-2">Transfer vs. Transmission</h3>
                <p className="text-gray-600">A 'transfer' is a voluntary act by the shareholder. 'Transmission' is an automatic transfer by operation of law, such as upon the death or insolvency of a shareholder.</p>
              </Card>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* FAQ Section */}
      <FadeInSection>
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto mb-16">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">Share Transfer FAQs</h2>
              <p className="text-lg text-gray-600">
                Your common questions about transferring shares answered.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {[
                {
                  question: "What is Form SH-4?",
                  answer: "Form SH-4 is the prescribed legal document, or 'instrument of transfer,' that must be executed by both the seller (transferor) and buyer (transferee) to effect a share transfer."
                },
                {
                  question: "How long does the company have to issue a new share certificate?",
                  answer: "After the board approves the transfer, the company must issue a new share certificate in the name of the transferee within one month from the date of receiving the transfer documents."
                },
                {
                  question: "Can the board refuse to register a transfer?",
                  answer: "Yes, the board can refuse a transfer if the transfer documents are incomplete or if the transfer violates provisions in the Articles of Association. They must send a notice of refusal within 30 days."
                },
                {
                  question: "Is share transfer possible for a one-person company (OPC)?",
                  answer: "No, an OPC has only one member. Shares can only be transferred in the event of the member's death or incapacity, which is considered a transmission, not a transfer."
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
              <h2 className="text-4xl lg:text-5xl font-bold">Ready to Transfer Shares?</h2>
              <p className="text-xl text-blue-100 leading-relaxed">
                Let our experts guide you through every step of the share transfer process, from drafting the deed to final approval, ensuring a smooth and compliant transaction.
              </p>
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Link href={`/dashboard/roc-returns-form?service=${encodeURIComponent("Share Transfer")}`} passHref>
                  <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    Get Professional Help
                    <Scale className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href={`/dashboard/roc-returns-form?service=${encodeURIComponent("Share Transfer")}`} passHref>
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
