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
import {
  UserPlus,
  UserMinus,
  UserX,
  FileText,
  Scale,
  ArrowRight,
  Phone
} from "lucide-react"

export default function DirectorChangesPage() {
  const basePrice = getBasePrice("director appointment/resignation") ?? "₹3,999";
  
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
                  Seamless Board Management
                </Badge>
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-gray-900 via-blue-600 to-gray-900 bg-clip-text text-transparent">
                    Director Changes
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600 bg-clip-text text-transparent">
                    Appointment & Removal
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Manage your company's board effectively by seamlessly handling the appointment, resignation, and removal of directors as per the Companies Act, 2013.
                </p>

                <div className="grid sm:grid-cols-3 gap-4 pt-6">
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">{basePrice}</div>
                    <div className="text-sm text-gray-600">Per Change</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">5-7 Days</div>
                    <div className="text-sm text-gray-600">Timeline</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">ROC</div>
                    <div className="text-sm text-gray-600">Filing Included</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-6">
                  <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    Manage Directors
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    className="border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white px-8 py-3 rounded-full transition-all duration-300 hover:scale-105 bg-transparent"
                  >
                    Consult an Expert
                  </Button>
                </div>
              </div>
            </FadeInSection>
            <FadeInSection className="hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-transparent rounded-full -translate-x-10 -translate-y-10"></div>
                <img
                  src="/images/director-changes-hero.svg"
                  alt="Director Changes Illustration"
                  className="relative rounded-lg shadow-2xl w-full h-auto"
                />
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* Director Change Processes Section */}
      <FadeInSection>
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto mb-16">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">Managing Director Changes: The Process</h2>
              <p className="text-lg text-gray-600">
                Whether appointing, removing, or accepting a resignation, each process has a specific legal framework to ensure compliance.
              </p>
            </div>
            <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="p-6 border-2 border-transparent hover:border-blue-200 hover:shadow-xl transition-all">
                <CardHeader className="flex items-center space-x-4 pb-4">
                  <UserPlus className="h-10 w-10 text-blue-500" />
                  <CardTitle className="text-2xl font-bold text-blue-700">Appointment</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Appoint a new director by passing a board resolution, followed by shareholder approval in a General Meeting. File Form DIR-12 with the ROC within 30 days.</p>
                </CardContent>
              </Card>
              <Card className="p-6 border-2 border-transparent hover:border-blue-200 hover:shadow-xl transition-all">
                <CardHeader className="flex items-center space-x-4 pb-4">
                  <UserMinus className="h-10 w-10 text-blue-500" />
                  <CardTitle className="text-2xl font-bold text-blue-700">Resignation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">A director resigns by submitting a written notice. The board acknowledges it, and the company files Form DIR-12. The director may also file Form DIR-11.</p>
                </CardContent>
              </Card>
              <Card className="p-6 border-2 border-transparent hover:border-blue-200 hover:shadow-xl transition-all">
                <CardHeader className="flex items-center space-x-4 pb-4">
                  <UserX className="h-10 w-10 text-blue-500" />
                  <CardTitle className="text-2xl font-bold text-blue-700">Removal</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Remove a director via an ordinary resolution at a General Meeting, ensuring they have an opportunity to be heard. File Form DIR-12 post-removal.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Key Forms Section */}
      <FadeInSection>
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto mb-16">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">Essential ROC Filings</h2>
              <p className="text-lg text-gray-600">
                Timely and accurate filing of forms is crucial for compliance.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card className="text-center p-6 border-2 border-transparent hover:border-blue-200 hover:shadow-xl transition-all">
                <FileText className="mx-auto h-12 w-12 text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Form DIR-12</h3>
                <p className="text-gray-600">Filed by the company for any change in directors (appointment, resignation, removal). Must be submitted within 30 days of the change.</p>
              </Card>
              <Card className="text-center p-6 border-2 border-transparent hover:border-blue-200 hover:shadow-xl transition-all">
                <FileText className="mx-auto h-12 w-12 text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Form DIR-11</h3>
                <p className="text-gray-600">Optionally filed by the resigning director to notify the ROC of their resignation, providing a personal record of the cessation.</p>
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
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">Director Changes FAQs</h2>
              <p className="text-lg text-gray-600">
                Common questions about managing your board of directors.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {[
                {
                  question: "What is a Director Identification Number (DIN)?",
                  answer: "A DIN is a unique 8-digit identification number that is a mandatory prerequisite for any person intending to become a director in an Indian company."
                },
                {
                  question: "Can a director be removed for not attending meetings?",
                  answer: "Yes, under Section 167 of the Companies Act, a director automatically vacates their office if they miss all board meetings over a 12-month period, with or without leave."
                },
                {
                  question: "What happens if Form DIR-12 is not filed on time?",
                  answer: "Delay in filing Form DIR-12 results in significant additional fees, which increase with the duration of the delay. It also leads to non-compliance penalties."
                },
                {
                  question: "Is shareholder approval always needed to appoint a director?",
                  answer: "While the board can appoint an 'Additional Director', their appointment must be regularized by shareholders at the next Annual General Meeting (AGM) to continue in office."
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
              <h2 className="text-4xl lg:text-5xl font-bold">Navigate Director Changes with Confidence</h2>
              <p className="text-xl text-blue-100 leading-relaxed">
                Our experts ensure every director appointment, resignation, or removal is handled smoothly and in full compliance with ROC regulations. Let us manage the paperwork, so you can focus on your business.
              </p>
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  Get Compliance Support
                  <Scale className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg rounded-full transition-all duration-300 hover:scale-105 bg-transparent"
                >
                  Contact Us
                  <Phone className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      </FadeInSection>

      <EnhancedFooter />
    </div>
  )
}
