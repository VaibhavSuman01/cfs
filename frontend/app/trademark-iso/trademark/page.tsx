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
  ShieldCheck,
  Search,
  FileText,
  BookOpen,
  Award,
  ArrowRight,
  Phone,
  Building,
  Lightbulb
} from "lucide-react"
import Link from "next/link"

export default function TrademarkRegistrationPage() {
  const basePrice = getBasePrice("trademark registration (for msme)") ?? "₹999";
  
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
                  Protect Your Brand Identity
                </Badge>
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-gray-900 via-blue-600 to-gray-900 bg-clip-text text-transparent">
                    Trademark Registration
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600 bg-clip-text text-transparent">
                    Secure Your Unique Mark
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Safeguard your brand's most valuable asset. Our expert services make the trademark registration process simple, fast, and secure, giving you exclusive rights and legal protection.
                </p>

                <div className="grid sm:grid-cols-3 gap-4 pt-6">
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">{basePrice}</div>
                    <div className="text-sm text-gray-600">Starting Price</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">1-2 Days</div>
                    <div className="text-sm text-gray-600">For Search</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">100%</div>
                    <div className="text-sm text-gray-600">Secure Process</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <Link href={`/contact?service=${encodeURIComponent("Trademark Registration")}`} passHref>
                    <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                      Register My Trademark
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href={`/contact?service=${encodeURIComponent("Trademark Registration")}`} passHref>
                    <Button
                      variant="outline"
                      className="border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white px-8 py-3 rounded-full transition-all duration-300 hover:scale-105 bg-transparent"
                    >
                      Check Eligibility
                    </Button>
                  </Link>
                </div>
              </div>
            </FadeInSection>
            <FadeInSection className="hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-transparent rounded-full -translate-x-10 -translate-y-10"></div>
                <img
                  src="/images/trademark-hero.svg"
                  alt="Trademark Registration Illustration"
                  className="relative rounded-lg shadow-2xl w-full h-auto"
                />
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* Benefits of Trademark Registration Section */}
      <FadeInSection>
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto mb-16">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">Why Register Your Trademark?</h2>
              <p className="text-lg text-gray-600">
                Registering your trademark is a critical step in building and protecting a strong brand. It provides numerous legal and commercial advantages.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="text-center p-6 border-2 border-transparent hover:border-blue-200 hover:shadow-xl transition-all">
                <ShieldCheck className="mx-auto h-12 w-12 text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Exclusive Legal Protection</h3>
                <p className="text-gray-600">Gain the exclusive right to use your mark nationwide and take legal action against anyone who infringes on your brand.</p>
              </Card>
              <Card className="text-center p-6 border-2 border-transparent hover:border-blue-200 hover:shadow-xl transition-all">
                <Building className="mx-auto h-12 w-12 text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Builds Brand Recognition</h3>
                <p className="text-gray-600">A registered trademark helps customers identify and trust your products and services, creating a loyal customer base.</p>
              </Card>
              <Card className="text-center p-6 border-2 border-transparent hover:border-blue-200 hover:shadow-xl transition-all">
                <Lightbulb className="mx-auto h-12 w-12 text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Creates a Valuable Asset</h3>
                <p className="text-gray-600">Your trademark becomes an intangible asset that adds value to your business and can be sold, licensed, or franchised.</p>
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
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">Our Simple 5-Step Process</h2>
              <p className="text-lg text-gray-600">
                We've streamlined the trademark registration process to make it as efficient as possible.
              </p>
            </div>
            <div className="grid md:grid-cols-5 gap-8 text-center">
              <div className="space-y-4"><div className="flex justify-center items-center h-20 w-20 mx-auto bg-blue-100 rounded-full"><Search className="h-10 w-10 text-blue-600" /></div><h3 className="font-semibold">1. Trademark Search</h3><p className="text-sm text-gray-600">We conduct a thorough search to ensure your proposed mark is unique.</p></div>
              <div className="space-y-4"><div className="flex justify-center items-center h-20 w-20 mx-auto bg-blue-100 rounded-full"><FileText className="h-10 w-10 text-blue-600" /></div><h3 className="font-semibold">2. Application Filing</h3><p className="text-sm text-gray-600">We prepare and file your trademark application with the registrar.</p></div>
              <div className="space-y-4"><div className="flex justify-center items-center h-20 w-20 mx-auto bg-blue-100 rounded-full"><BookOpen className="h-10 w-10 text-blue-600" /></div><h3 className="font-semibold">3. Examination</h3><p className="text-sm text-gray-600">The registrar examines the application for compliance and objections.</p></div>
              <div className="space-y-4"><div className="flex justify-center items-center h-20 w-20 mx-auto bg-blue-100 rounded-full"><Award className="h-10 w-10 text-blue-600" /></div><h3 className="font-semibold">4. Publication</h3><p className="text-sm text-gray-600">Your mark is published in the Trademark Journal for opposition.</p></div>
              <div className="space-y-4"><div className="flex justify-center items-center h-20 w-20 mx-auto bg-blue-100 rounded-full"><ShieldCheck className="h-10 w-10 text-blue-600" /></div><h3 className="font-semibold">5. Registration</h3><p className="text-sm text-gray-600">If no opposition, the registration certificate is issued.</p></div>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Documents Required Section */}
      <FadeInSection>
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto mb-16">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">Documents Required</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="p-6"><CardTitle className="mb-4 text-blue-600">For Individuals</CardTitle><ul className="list-disc list-inside text-gray-600"><li>PAN Card</li><li>Aadhar Card</li><li>Logo/Brand Name</li></ul></Card>
              <Card className="p-6"><CardTitle className="mb-4 text-blue-600">For Companies/LLPs</CardTitle><ul className="list-disc list-inside text-gray-600"><li>Incorporation Certificate</li><li>Company PAN Card</li><li>MSME Certificate (if any)</li></ul></Card>
              <Card className="p-6"><CardTitle className="mb-4 text-blue-600">For Partnership Firms</CardTitle><ul className="list-disc list-inside text-gray-600"><li>Partnership Deed</li><li>Firm's PAN Card</li><li>Logo/Brand Name</li></ul></Card>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* FAQ Section */}
      <FadeInSection>
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto mb-16">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">Trademark FAQs</h2>
              <p className="text-lg text-gray-600">
                Your questions about trademark registration, answered.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {[
                {
                  question: "What can be trademarked?",
                  answer: "You can trademark a brand name, logo, slogan, sound, or even a color combination that uniquely identifies your goods or services from others."
                },
                {
                  question: "How long is a trademark registration valid?",
                  answer: "A trademark registration is valid for 10 years from the date of application. It can be renewed indefinitely for subsequent 10-year periods."
                },
                {
                  question: "What is the difference between TM and ® symbols?",
                  answer: "The TM symbol can be used with any unregistered trademark to indicate a claim of ownership. The ® symbol can only be used after the trademark has been officially registered."
                },
                {
                  question: "Can I register a trademark myself?",
                  answer: "Yes, but the process is complex and requires legal knowledge. Using a professional service ensures accuracy, avoids common pitfalls, and increases the chances of successful registration."
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
              <h2 className="text-4xl lg:text-5xl font-bold">Ready to Protect Your Brand?</h2>
              <p className="text-xl text-blue-100 leading-relaxed">
                Don't leave your brand vulnerable. Take the first step towards securing your identity today. Our team is ready to guide you through every step of the process.
              </p>
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Link href={`/contact?service=${encodeURIComponent("Trademark Registration")}`} passHref>
                  <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    Start My Registration
                    <ShieldCheck className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href={`/contact?service=${encodeURIComponent("Trademark Registration")}`} passHref>
                  <Button
                    variant="outline"
                    className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg rounded-full transition-all duration-300 hover:scale-105 bg-transparent"
                  >
                    Speak to an Expert
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
