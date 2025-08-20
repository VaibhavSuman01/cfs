"use client"

import { EnhancedHeader } from "@/components/enhanced-header"
import { EnhancedFooter } from "@/components/enhanced-footer"
import { FadeInSection } from "@/components/fade-in-section"
import { AnimatedBackground } from "@/components/animated-background"
import { FloatingElements } from "@/components/floating-elements"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  User,
  CheckCircle,
  Shield,
  ArrowRight,
  TrendingUp,
  Phone,
  FileText,
  Briefcase,
  Zap,
  Rocket
} from "lucide-react"

export default function SoleProprietorshipPage() {
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
                  Your Business, Your Rules
                </Badge>
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 bg-clip-text text-transparent">
                    Sole Proprietorship
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 bg-clip-text text-transparent">
                    Registration
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Be your own boss. A Sole Proprietorship is the simplest business structure, owned and managed by a single person with minimal compliance. Perfect for freelancers and small business owners.
                </p>

                <div className="grid sm:grid-cols-3 gap-4 pt-6">
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">₹1,999</div>
                    <div className="text-sm text-gray-600">Starting Price</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">1-3 Days</div>
                    <div className="text-sm text-gray-600">Processing Time</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">100%</div>
                    <div className="text-sm text-gray-600">Ownership</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    Start Your Business
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-3 rounded-full transition-all duration-300 hover:scale-105 bg-transparent"
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
                  src="/images/proprietorship-hero.svg"
                  alt="Sole Proprietorship Illustration"
                  className="relative rounded-lg shadow-2xl w-full h-auto"
                />
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* Why Choose Proprietorship Section */}
      <FadeInSection>
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto mb-16">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">Why Choose a Sole Proprietorship?</h2>
              <p className="text-lg text-gray-600">
                This business structure is favored by individual entrepreneurs for its simplicity, complete control, and minimal regulatory hurdles.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="text-center p-6 border-2 border-transparent hover:border-blue-200 hover:shadow-xl transition-all">
                <Rocket className="mx-auto h-12 w-12 text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Easy & Quick to Start</h3>
                <p className="text-gray-600">No complex registration process. You can start your business in just a few days with basic identity and address proofs.</p>
              </Card>
              <Card className="text-center p-6 border-2 border-transparent hover:border-blue-200 hover:shadow-xl transition-all">
                <User className="mx-auto h-12 w-12 text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Complete Control</h3>
                <p className="text-gray-600">As the sole owner, you make all the decisions quickly and independently, without needing to consult anyone.</p>
              </Card>
              <Card className="text-center p-6 border-2 border-transparent hover:border-blue-200 hover:shadow-xl transition-all">
                <FileText className="mx-auto h-12 w-12 text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Minimal Compliance</h3>
                <p className="text-gray-600">Fewer legal formalities and lower compliance requirements compared to companies or LLPs, saving you time and money.</p>
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
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">Getting Your Business Recognized</h2>
              <p className="text-lg text-gray-600">
                While there's no single 'proprietorship registration,' you establish your business identity through a few key government registrations.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="p-6 text-center">
                <CardTitle className="mb-4 text-blue-600">1. MSME/Udyam Registration</CardTitle>
                <p className="text-gray-600">Registering as a Micro, Small, or Medium Enterprise provides government recognition and access to various benefits.</p>
              </Card>
              <Card className="p-6 text-center">
                <CardTitle className="mb-4 text-blue-600">2. Shop & Establishment Act</CardTitle>
                <p className="text-gray-600">A state-specific license required for operating a business from a commercial or residential premise.</p>
              </Card>
              <Card className="p-6 text-center">
                <CardTitle className="mb-4 text-blue-600">3. GST Filing</CardTitle>
                <p className="text-gray-600">Mandatory if your annual turnover exceeds the prescribed limit, and essential for inter-state business.</p>
              </Card>
              <Card className="p-6 text-center">
                <CardTitle className="mb-4 text-blue-600">4. Bank Account</CardTitle>
                <p className="text-gray-600">Opening a current bank account in the business's name is a key step to formalize your operations.</p>
              </Card>
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
              <p className="text-lg text-gray-600">
                The documentation process is simple and straightforward. You'll need:
              </p>
            </div>
            <div className="max-w-2xl mx-auto">
              <Card className="p-8">
                <ul className="space-y-4 text-gray-700 text-lg">
                  <li className="flex items-center"><CheckCircle className="h-6 w-6 text-green-500 mr-4 flex-shrink-0" /><span>Aadhaar Card of the Proprietor.</span></li>
                  <li className="flex items-center"><CheckCircle className="h-6 w-6 text-green-500 mr-4 flex-shrink-0" /><span>PAN Card of the Proprietor.</span></li>
                  <li className="flex items-center"><CheckCircle className="h-6 w-6 text-green-500 mr-4 flex-shrink-0" /><span>Proof of Business Address (Utility Bill / Rent Agreement).</span></li>
                  <li className="flex items-center"><CheckCircle className="h-6 w-6 text-green-500 mr-4 flex-shrink-0" /><span>Bank Account Details (Cancelled Cheque / Bank Statement).</span></li>
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
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">Proprietorship FAQs</h2>
              <p className="text-lg text-gray-600">
                Find answers to common questions about starting a proprietorship.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {[
                {
                  question: "Is there any specific registration for a proprietorship?",
                  answer: "No, there isn't a single registration. A proprietorship is recognized through other registrations like GST, MSME, or a Shop & Establishment license obtained in the name of the proprietor."
                },
                {
                  question: "What is the main disadvantage of a proprietorship?",
                  answer: "The primary disadvantage is unlimited liability. The owner is personally responsible for all business debts, meaning personal assets are at risk if the business fails to pay its liabilities."
                },
                {
                  question: "Can I hire employees in a proprietorship?",
                  answer: "Yes, you can hire employees. You will need to comply with labor laws, such as obtaining a Shop & Establishment license and potentially registering for PF and ESI depending on the number of employees."
                },
                {
                  question: "How is a proprietorship taxed?",
                  answer: "The income of the proprietorship is treated as the personal income of the proprietor. It is added to their other income and taxed at the applicable individual income tax slab rates."
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
              <h2 className="text-4xl lg:text-5xl font-bold">Ready to Be Your Own Boss?</h2>
              <p className="text-xl text-blue-100 leading-relaxed">
                Take the first step towards your entrepreneurial journey. Let us help you set up your Sole Proprietorship quickly and correctly.
              </p>
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  Start My Proprietorship
                  <Rocket className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg rounded-full transition-all duration-300 hover:scale-105 bg-transparent"
                >
                  Speak to Our Experts
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
