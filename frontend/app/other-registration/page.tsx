"use client"

import { EnhancedFooter } from "@/components/enhanced-footer";
import { FadeInSection } from "@/components/fade-in-section"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { PricingDisplay } from "@/components/ui/pricing-display"
import { Users, FileText, Building, Handshake, CheckCircle, ArrowRight, Shield, Clock, Globe } from "lucide-react"


export default function OtherRegistrationPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-100 py-20">
        <div className="container mx-auto px-4">
          <FadeInSection className="text-center space-y-8">
            <h1 className="text-5xl font-bold text-gray-900">Other Business Registrations</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose from various business structures including LLP, Partnership Firm, Sole Proprietorship, and more
              based on your business needs.
            </p>
          </FadeInSection>
        </div>
      </section>

      {/* Registration Types */}
      <FadeInSection>
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Users,
                  title: "LLP Registration",
                  slug: "llp-registration",
                  description:
                    "Limited Liability Partnership with flexibility of partnership and benefits of limited liability",
                  features: [
                    "Minimum 2 partners required",
                    "Limited liability protection",
                    "Flexible management structure",
                    "Lower compliance requirements",
                    "No minimum capital requirement",
                  ],
                  priceKey: "llp registration",
                  timeline: "7-10 days",
                },
                {
                  icon: Handshake,
                  title: "Partnership Firm",
                  slug: "partnership-firm",
                  description: "Traditional partnership structure for businesses with multiple partners",
                  features: [
                    "Minimum 2 partners required",
                    "Partnership deed preparation",
                    "Easy to form and operate",
                    "Shared profits and losses",
                    "Mutual agency relationship",
                  ],
                  priceKey: "partnership firm",
                  timeline: "3-5 days",
                },
                {
                  icon: FileText,
                  title: "Sole Proprietorship",
                  slug: "sole-proprietorship",
                  description: "Simplest form of business ownership for individual entrepreneurs",
                  features: [
                    "Single person ownership",
                    "Complete control over business",
                    "Easy to start and close",
                    "Minimal legal formalities",
                    "Direct tax benefits",
                  ],
                  priceKey: "sole proprietorship",
                  timeline: "1-2 days",
                },
                {
                  icon: FileText,
                  title: "Digital Signature",
                  slug: "digital-signature",
                  description: "Secure your online transactions with a Digital Signature Certificate (DSC).",
                  features: [
                    "Class 3 DSC",
                    "With USB Token",
                    "2 Years Validity",
                    "For Individuals & Organizations",
                    "e-Tendering & e-Filing",
                  ],
                    price: "As per request",
                  timeline: "1-2 days",
                },
                {
                  icon: FileText,
                  title: "GST Filing",
                  slug: "gst-registration",
                  description: "Comply with the Goods and Services Tax law in India.",
                  features: [
                    "For businesses above threshold limit",
                    "Input tax credit benefits",
                    "Legally recognized as supplier",
                    "Inter-state sales without restrictions",
                    "Unified tax system",
                  ],
                  priceKey: "gst registration",
                  timeline: "3-7 days",
                },
                {
                  icon: Building,
                  title: "Gumusta / Shop & Establishment",
                  slug: "gumusta-shop-registration",
                  description: "A mandatory registration for all shops and commercial establishments.",
                  features: [
                    "State-specific registration",
                    "Legal proof of business",
                    "Required for opening bank account",
                    "Covers shops, hotels, eateries",
                    "Annual renewal may be required",
                  ],
                  priceKey: "form 3/gumasta",
                  timeline: "2-4 days",
                },
                {
                  icon: Users,
                  title: "EPFO Registration",
                  slug: "epfo",
                  description: "Secure your employees' future with provident fund benefits.",
                  features: [
                    "For businesses with 20+ employees",
                    "Mandatory compliance",
                    "Retirement savings scheme",
                    "Employee pension scheme",
                    "Insurance benefits",
                  ],
                  price: "As per request",
                  timeline: "3-5 days",
                },
                {
                  icon: Shield,
                  title: "ESIC Registration",
                  slug: "esic",
                  description: "Provide employees with health and social security benefits.",
                  features: [
                    "For businesses with 10+ employees",
                    "Medical benefits for employees & family",
                    "Sickness & maternity benefits",
                    "Disablement benefits",
                    "Social security scheme",
                  ],
                  price: "As per request",
                  timeline: "3-5 days",
                },
                {
                  icon: CheckCircle,
                  title: "FSSAI Food License",
                  slug: "fassai-food-license",
                  description: "Ensure your food business complies with food safety standards in India.",
                  features: [
                    "Mandatory for food businesses",
                    "Basic, State & Central license",
                    "Ensures food quality & safety",
                    "Builds consumer trust",
                    "Avoid legal penalties",
                  ],
                  price: "As per request",
                  timeline: "7-15 days",
                },
                {
                  icon: Globe,
                  title: "IEC Registration",
                  slug: "iec-registration",
                  description: "Unlock global markets with your Import Export Code.",
                  features: [
                    "Mandatory for import/export",
                    "10-digit identification number",
                    "No renewal required",
                    "Access to international markets",
                    "Avail government export schemes",
                  ],
                  price: "As per request",
                  timeline: "1-2 days",
                },
                {
                  icon: Building,
                  title: "Industry License",
                  slug: "industry-license",
                  description: "Obtain the necessary licenses to operate your industrial unit legally.",
                  features: [
                    "Permit for industrial operations",
                    "Ensures regulatory compliance",
                    "Covers environmental & safety norms",
                    "Varies by industry and state",
                    "Promotes organized development",
                  ],
                  price: "As per request",
                  timeline: "Varies",
                },
                {
                  icon: Building,
                  title: "MSME/Udyam Registration",
                  slug: "msme-udyam-registration",
                  description: "Get your business recognized as a Micro, Small, or Medium Enterprise.",
                  features: [
                    "Government recognition certificate",
                    "Access to subsidies & schemes",
                    "Easier access to credit",
                    "Priority in government tenders",
                    "No renewal required",
                  ],
                  price: "As per request",
                  timeline: "1-2 days",
                },
              ].map((registration, index) => (
                <FadeInSection key={index} delay={index * 100}>
                  <Card className="border-2 border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
                    <CardHeader className="text-center">
                      <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                        <registration.icon className="h-8 w-8 text-blue-600 group-hover:scale-110 transition-transform" />
                      </div>
                      <CardTitle className="text-xl text-gray-900">{registration.title}</CardTitle>
                      <div className="space-y-2">
                        <div className="text-2xl font-bold text-blue-600">
                          {registration.priceKey ? (
                            <PricingDisplay serviceName={registration.priceKey} />
                          ) : (
                            registration.price
                          )}
                        </div>
                        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                          <Clock className="h-4 w-4" />
                          <span>{registration.timeline}</span>
                        </div>
                      </div>
                      <CardDescription className="text-gray-600">{registration.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        {registration.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-blue-500" />
                            <span className="text-sm text-gray-600">{feature}</span>
                          </div>
                        ))}
                      </div>
                      <Link href={`/other-registration/${registration.slug}`} passHref>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700">
                          Register Now <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </FadeInSection>
              ))}
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Comparison Table */}
      <FadeInSection>
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-4xl font-bold text-gray-900">Compare Business Structures</h2>
              <p className="text-xl text-gray-600">Choose the right structure for your business</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-lg shadow-lg">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left">Feature</th>
                    <th className="px-6 py-4 text-center">Sole Proprietorship</th>
                    <th className="px-6 py-4 text-center">Partnership</th>
                    <th className="px-6 py-4 text-center">LLP</th>
                    <th className="px-6 py-4 text-center">Private Limited</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {[
                    {
                      feature: "Minimum Members",
                      sole: "1",
                      partnership: "2",
                      llp: "2",
                      pvt: "2",
                    },
                    {
                      feature: "Maximum Members",
                      sole: "1",
                      partnership: "20",
                      llp: "No Limit",
                      pvt: "200",
                    },
                    {
                      feature: "Liability",
                      sole: "Unlimited",
                      partnership: "Unlimited",
                      llp: "Limited",
                      pvt: "Limited",
                    },
                    {
                      feature: "Compliance",
                      sole: "Low",
                      partnership: "Low",
                      llp: "Medium",
                      pvt: "High",
                    },
                    {
                      feature: "Fund Raising",
                      sole: "Difficult",
                      partnership: "Difficult",
                      llp: "Moderate",
                      pvt: "Easy",
                    },
                  ].map((row, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{row.feature}</td>
                      <td className="px-6 py-4 text-center text-gray-600">{row.sole}</td>
                      <td className="px-6 py-4 text-center text-gray-600">{row.partnership}</td>
                      <td className="px-6 py-4 text-center text-gray-600">{row.llp}</td>
                      <td className="px-6 py-4 text-center text-gray-600">{row.pvt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* CTA Section */}
      <FadeInSection>
        <section className="py-20 bg-blue-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <div className="space-y-8">
              <h2 className="text-4xl font-bold">Need Help Choosing?</h2>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                Our experts can help you choose the right business structure based on your specific needs
              </p>
              <div className="flex justify-center space-x-4">
                <Link href={`/contact?service=${encodeURIComponent("Other Business Registrations")}`} passHref>
                  <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg">Talk to Expert</Button>
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
