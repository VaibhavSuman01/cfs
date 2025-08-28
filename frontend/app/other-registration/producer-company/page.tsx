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
  Users,
  CheckCircle,
  Shield,
  ArrowRight,
  TrendingUp,
  Phone,
  FileText,
  Briefcase,
  Sprout
} from "lucide-react"

export default function ProducerCompanyPage() {
  const basePrice = getBasePrice("producer company") ?? "₹34,999";
  
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
                  Empowering Farmers & Artisans
                </Badge>
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 bg-clip-text text-transparent">
                    Producer Company
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 bg-clip-text text-transparent">
                    Registration
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  A special business structure for farmers, agriculturalists, and artisans to pool resources, gain market access, and improve their collective bargaining power. 
                </p>

                <div className="grid sm:grid-cols-3 gap-4 pt-6">
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">{basePrice}</div>
                    <div className="text-sm text-gray-600">Starting Price</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">20-30 Days</div>
                    <div className="text-sm text-gray-600">Processing Time</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">Collective</div>
                    <div className="text-sm text-gray-600">Growth</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    Form Your Producer Company
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
                  src="/images/producer-hero.svg"
                  alt="Producer Company Illustration"
                  className="relative rounded-lg shadow-2xl w-full h-auto"
                />
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* What is a Producer Company Section */}
      <FadeInSection>
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto mb-16">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">What is a Producer Company?</h2>
              <p className="text-lg text-gray-600">
                A Producer Company is a legally recognized body of farmers/agriculturalists with the aim to improve their standard of living and ensure a good status of their available support, incomes, and profitability.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="text-center p-6 border-2 border-transparent hover:border-blue-200 hover:shadow-xl transition-all">
                <Users className="mx-auto h-12 w-12 text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Owned by Producers</h3>
                <p className="text-gray-600">Membership is exclusive to primary producers, ensuring the focus remains on their collective benefit.</p>
              </Card>
              <Card className="text-center p-6 border-2 border-transparent hover:border-blue-200 hover:shadow-xl transition-all">
                <Shield className="mx-auto h-12 w-12 text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Limited Liability</h3>
                <p className="text-gray-600">Combines the benefits of a cooperative society with the professionalism and limited liability of a private company.</p>
              </Card>
              <Card className="text-center p-6 border-2 border-transparent hover:border-blue-200 hover:shadow-xl transition-all">
                <TrendingUp className="mx-auto h-12 w-12 text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Collective Strength</h3>
                <p className="text-gray-600">Enables producers to access larger markets, better technology, and financial resources together.</p>
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
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">6-Step Registration Process</h2>
              <p className="text-lg text-gray-600">
                We follow a structured procedure to ensure your Producer Company is legally compliant and established correctly.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="p-6"><CardTitle className="mb-2 text-blue-600">1. Obtain DSC & DIN</CardTitle><p className="text-gray-600">Digital Signature and Director ID for all proposed directors.</p></Card>
              <Card className="p-6"><CardTitle className="mb-2 text-blue-600">2. Name Reservation</CardTitle><p className="text-gray-600">Unique name approval using the SPICe+ form.</p></Card>
              <Card className="p-6"><CardTitle className="mb-2 text-blue-600">3. Document Preparation</CardTitle><p className="text-gray-600">Drafting the Memorandum (MoA) and Articles (AoA) of Association.</p></Card>
              <Card className="p-6"><CardTitle className="mb-2 text-blue-600">4. Filing Application</CardTitle><p className="text-gray-600">Submitting the SPICe+ incorporation form to the ROC.</p></Card>
              <Card className="p-6"><CardTitle className="mb-2 text-blue-600">5. ROC Verification</CardTitle><p className="text-gray-600">Scrutiny of documents by the Registrar of Companies.</p></Card>
              <Card className="p-6"><CardTitle className="mb-2 text-blue-600">6. Certificate Issued</CardTitle><p className="text-gray-600">Receipt of the Certificate of Incorporation to begin operations.</p></Card>
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
                A minimum of 10 producers and 5 directors are required. Please provide the following documents.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="p-6">
                <CardTitle className="mb-4 text-blue-600">For Directors & Members</CardTitle>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start"><CheckCircle className="h-5 w-5 text-blue-500 mr-3 mt-1 flex-shrink-0" /><span>PAN Card and Aadhaar Card.</span></li>
                  <li className="flex items-start"><CheckCircle className="h-5 w-5 text-blue-500 mr-3 mt-1 flex-shrink-0" /><span>Identity Proof: Driving License, Passport, or Voter ID.</span></li>
                  <li className="flex items-start"><CheckCircle className="h-5 w-5 text-blue-500 mr-3 mt-1 flex-shrink-0" /><span>Latest Address Proof: Utility bill or bank statement.</span></li>
                  <li className="flex items-start"><CheckCircle className="h-5 w-5 text-blue-500 mr-3 mt-1 flex-shrink-0" /><span>Recent passport-sized photograph.</span></li>
                </ul>
              </Card>
              <Card className="p-6">
                <CardTitle className="mb-4 text-blue-600">For Registered Office</CardTitle>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start"><CheckCircle className="h-5 w-5 text-blue-500 mr-3 mt-1 flex-shrink-0" /><span>Proof of Address: Latest utility bill (Electricity/Telephone).</span></li>
                  <li className="flex items-start"><CheckCircle className="h-5 w-5 text-blue-500 mr-3 mt-1 flex-shrink-0" /><span>No Objection Certificate (NOC) from the property owner.</span></li>
                  <li className="flex items-start"><CheckCircle className="h-5 w-5 text-blue-500 mr-3 mt-1 flex-shrink-0" /><span>Rent agreement if the property is on rent.</span></li>
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
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">Producer Company FAQs</h2>
              <p className="text-lg text-gray-600">
                Common questions about forming a Producer Company.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {[
                {
                  question: "Who can be a member of a Producer Company?",
                  answer: "Only individuals or institutions who are 'primary producers'—persons engaged in agriculture, horticulture, animal husbandry, etc.—can become members."
                },
                {
                  question: "What is the minimum capital required?",
                  answer: "A Producer Company must have a minimum authorized capital of ₹5 lakh and a minimum paid-up capital of ₹1 lakh."
                },
                {
                  question: "Can a Producer Company have external investors?",
                  answer: "No, a Producer Company cannot have government or private equity stakes. Ownership is restricted to its producer members to ensure their interests are protected."
                },
                {
                  question: "Are there tax benefits for a Producer Company?",
                  answer: "Yes, Producer Companies enjoy tax benefits, including exemptions on agricultural income, similar to cooperative societies, which helps in reinvesting profits for growth."
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
              <h2 className="text-4xl lg:text-5xl font-bold">Unite and Grow Together</h2>
              <p className="text-xl text-blue-100 leading-relaxed">
                Empower your community of producers. Form a Producer Company to enhance your business, access new markets, and build a stronger future.
              </p>
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  Register My Producer Company
                  <Sprout className="ml-2 h-5 w-5" />
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
