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
  Award,
  TrendingUp,
  Users,
  FileCheck2,
  ClipboardList,
  CheckSquare,
  Search,
  ArrowRight,
  Phone
} from "lucide-react"

export default function ISO9001Page() {
  const basePrice = getBasePrice("iso 9001:2015") ?? "As per request";
  
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
                  International Standard for Quality
                </Badge>
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-gray-900 via-blue-600 to-gray-900 bg-clip-text text-transparent">
                    ISO 9001 Certification
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600 bg-clip-text text-transparent">
                    Commitment to Excellence
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Achieve the globally recognized standard for Quality Management Systems. ISO 9001 certification demonstrates your dedication to customer satisfaction and continuous improvement.
                </p>

                <div className="grid sm:grid-cols-3 gap-4 pt-6">
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">{basePrice}</div>
                    <div className="text-sm text-gray-600">Starting Price</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">Varies</div>
                    <div className="text-sm text-gray-600">Timeline</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">Globally</div>
                    <div className="text-sm text-gray-600">Recognized</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <Link href={`/dashboard/trademark-iso?service=${encodeURIComponent('ISO 9001')}`} passHref>
                    <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                      Get Certified
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href={`/dashboard/trademark-iso?service=${encodeURIComponent('ISO 9001')}`} passHref>
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
                  src="/images/iso-9001-hero.png"
                  alt="ISO 9001 Certification Illustration"
                  className="relative rounded-lg w-full h-auto"
                />
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* Benefits of ISO 9001 Section */}
      <FadeInSection>
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto mb-16">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">Advantages of ISO 9001</h2>
              <p className="text-lg text-gray-600">
                ISO 9001 certification offers significant benefits, enhancing your business's performance, reputation, and market access.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="text-center p-6 border-2 border-transparent hover:border-blue-200 hover:shadow-xl transition-all">
                <Users className="mx-auto h-12 w-12 text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Increased Customer Satisfaction</h3>
                <p className="text-gray-600">Meet customer requirements consistently, leading to higher satisfaction, loyalty, and repeat business.</p>
              </Card>
              <Card className="text-center p-6 border-2 border-transparent hover:border-blue-200 hover:shadow-xl transition-all">
                <TrendingUp className="mx-auto h-12 w-12 text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Improved Processes & Efficiency</h3>
                <p className="text-gray-600">Implement a systematic approach to quality management, reducing waste and improving operational efficiency.</p>
              </Card>
              <Card className="text-center p-6 border-2 border-transparent hover:border-blue-200 hover:shadow-xl transition-all">
                <Award className="mx-auto h-12 w-12 text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Enhanced Credibility & Reputation</h3>
                <p className="text-gray-600">Gain international recognition, build trust with stakeholders, and access new markets that require certification.</p>
              </Card>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Certification Process Section */}
      <FadeInSection>
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto mb-16">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">The Path to Certification</h2>
              <p className="text-lg text-gray-600">
                Our structured approach simplifies the ISO 9001 certification journey.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              <div className="space-y-4"><div className="flex justify-center items-center h-20 w-20 mx-auto bg-blue-100 rounded-full"><ClipboardList className="h-10 w-10 text-blue-600" /></div><h3 className="font-semibold">1. Gap Analysis</h3><p className="text-sm text-gray-600">We assess your current system against ISO 9001 requirements.</p></div>
              <div className="space-y-4"><div className="flex justify-center items-center h-20 w-20 mx-auto bg-blue-100 rounded-full"><FileCheck2 className="h-10 w-10 text-blue-600" /></div><h3 className="font-semibold">2. Documentation</h3><p className="text-sm text-gray-600">We help you prepare the necessary quality manuals and procedures.</p></div>
              <div className="space-y-4"><div className="flex justify-center items-center h-20 w-20 mx-auto bg-blue-100 rounded-full"><CheckSquare className="h-10 w-10 text-blue-600" /></div><h3 className="font-semibold">3. Implementation</h3><p className="text-sm text-gray-600">You implement the Quality Management System across your organization.</p></div>
              <div className="space-y-4"><div className="flex justify-center items-center h-20 w-20 mx-auto bg-blue-100 rounded-full"><Search className="h-10 w-10 text-blue-600" /></div><h3 className="font-semibold">4. Certification Audit</h3><p className="text-sm text-gray-600">An external body conducts audits to grant the certification.</p></div>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* FAQ Section */}
      <FadeInSection>
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto mb-16">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">ISO 9001 FAQs</h2>
              <p className="text-lg text-gray-600">
                Key questions about ISO 9001 certification answered.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {[
                {
                  question: "How long does ISO 9001 certification take?",
                  answer: "The timeline varies depending on the size and complexity of your organization, but it typically takes 6 to 12 months to prepare for and achieve certification."
                },
                {
                  question: "Is ISO 9001 certification a one-time process?",
                  answer: "No, the certification is valid for three years. To maintain it, your organization must undergo annual surveillance audits and a recertification audit every three years."
                },
                {
                  question: "What is a Quality Management System (QMS)?",
                  answer: "A QMS is a formal system that documents processes, procedures, and responsibilities for achieving quality policies and objectives. It's the foundation of ISO 9001."
                },
                {
                  question: "Can any business get ISO 9001 certified?",
                  answer: "Yes, ISO 9001 is a generic standard applicable to any organization, regardless of its size, type, or the products and services it provides."
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
              <h2 className="text-4xl lg:text-5xl font-bold">Elevate Your Quality Standards</h2>
              <p className="text-xl text-blue-100 leading-relaxed">
                Join thousands of businesses worldwide that have benefited from ISO 9001. Start your journey towards operational excellence and enhanced customer trust today.
              </p>
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Link href={`/dashboard/trademark-iso?service=${encodeURIComponent('ISO 9001')}`} passHref>
                  <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    Begin Certification
                    <Award className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href={`/dashboard/trademark-iso?service=${encodeURIComponent('ISO 9001')}`} passHref>
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
