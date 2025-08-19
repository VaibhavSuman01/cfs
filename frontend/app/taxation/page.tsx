"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EnhancedHeader } from "@/components/enhanced-header";
import { EnhancedFooter } from "@/components/enhanced-footer";
import { FadeInSection } from "@/components/fade-in-section"
import { Calculator, FileText, TrendingUp, Shield, CheckCircle, ArrowRight, Clock, Users, Building } from "lucide-react"

export default function TaxationPage() {
  return (
    <div className="min-h-screen bg-white">
      <EnhancedHeader />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-100 py-20">
        <div className="container mx-auto px-4">
          <FadeInSection className="text-center space-y-8">
            <h1 className="text-5xl font-bold text-gray-900">Taxation Services</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Complete tax compliance solutions including GST registration, income tax filing, TDS returns, and tax
              planning services.
            </p>
          </FadeInSection>
        </div>
      </section>

      {/* Tax Services */}
      <FadeInSection>
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-4xl font-bold text-gray-900">Our Tax Services</h2>
              <p className="text-xl text-gray-600">Comprehensive tax solutions for individuals and businesses</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: TrendingUp,
                  title: "GST Registration",
                  description: "Get your GST number and ensure compliance with GST regulations",
                  features: [
                    "GST registration within 7 days",
                    "Digital signature certificate",
                    "Monthly/Quarterly return filing",
                    "GST compliance support",
                    "Input tax credit optimization",
                  ],
                  price: "₹2,999",
                  timeline: "3-7 days",
                },
                {
                  icon: FileText,
                  title: "Income Tax Filing",
                  description: "Professional income tax return filing for individuals and businesses",
                  features: [
                    "ITR-1 to ITR-7 filing",
                    "Tax computation and planning",
                    "Refund processing support",
                    "Notice handling",
                    "Tax saving advice",
                  ],
                  price: "₹2,499",
                  timeline: "1-3 days",
                },
                {
                  icon: Calculator,
                  title: "TDS Returns",
                  description: "TDS return filing and compliance for businesses and professionals",
                  features: [
                    "Quarterly TDS return filing",
                    "TDS certificate generation",
                    "Late fee calculation",
                    "Correction statements",
                    "TDS compliance audit",
                  ],
                  price: "₹3,999",
                  timeline: "2-5 days",
                },
                {
                  icon: Shield,
                  title: "Tax Planning",
                  description: "Strategic tax planning to minimize tax liability legally",
                  features: [
                    "Tax saving investment advice",
                    "Salary structuring",
                    "Business tax optimization",
                    "Advance tax calculation",
                    "Tax efficient structures",
                  ],
                  price: "₹7,999",
                  timeline: "5-7 days",
                },
                {
                  icon: Building,
                  title: "Corporate Tax",
                  description: "Complete corporate tax compliance and advisory services",
                  features: [
                    "Corporate tax return filing",
                    "Transfer pricing compliance",
                    "Tax audit support",
                    "MAT credit optimization",
                    "International taxation",
                  ],
                  price: "₹19,999",
                  timeline: "7-10 days",
                },
                {
                  icon: Users,
                  title: "Payroll Tax",
                  description: "Payroll tax management and compliance for businesses",
                  features: [
                    "Salary tax computation",
                    "Form 16 preparation",
                    "PF and ESI compliance",
                    "Professional tax filing",
                    "Payroll audit support",
                  ],
                  price: "₹9,999",
                  timeline: "3-5 days",
                },
              ].map((service, index) => (
                <FadeInSection key={index} delay={index * 100}>
                  <Card className="border-2 border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
                    <CardHeader className="text-center">
                      <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                        <service.icon className="h-8 w-8 text-blue-600 group-hover:scale-110 transition-transform" />
                      </div>
                      <CardTitle className="text-xl text-gray-900">{service.title}</CardTitle>
                      <div className="space-y-2">
                        <div className="text-2xl font-bold text-blue-600">{service.price}</div>
                        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                          <Clock className="h-4 w-4" />
                          <span>{service.timeline}</span>
                        </div>
                      </div>
                      <CardDescription className="text-gray-600">{service.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        {service.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm text-gray-600">{feature}</span>
                          </div>
                        ))}
                      </div>
                      <Link href={`/tax-form?service=${encodeURIComponent(service.title)}`} passHref>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3">
                          Book Service <ArrowRight className="ml-2 h-5 w-5" />
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

      {/* GST Benefits */}
      <FadeInSection>
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-4xl font-bold text-gray-900">Why GST Registration?</h2>
              <p className="text-xl text-gray-600">Benefits of getting GST registered</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  title: "Legal Compliance",
                  description: "Mandatory for businesses with turnover above ₹20 lakhs",
                },
                {
                  title: "Input Tax Credit",
                  description: "Claim credit for taxes paid on purchases",
                },
                {
                  title: "Business Credibility",
                  description: "Increases trust with customers and suppliers",
                },
                {
                  title: "Pan India Sales",
                  description: "Sell products and services across India",
                },
              ].map((benefit, index) => (
                <FadeInSection key={index} delay={index * 100}>
                  <Card className="text-center hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                      <p className="text-gray-600 text-sm">{benefit.description}</p>
                    </CardContent>
                  </Card>
                </FadeInSection>
              ))}
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Tax Calendar */}
      <FadeInSection>
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-4xl font-bold text-gray-900">Important Tax Dates</h2>
              <p className="text-xl text-gray-600">Never miss a tax deadline</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  month: "April",
                  deadlines: ["Advance Tax Q4 - 15th April", "TDS Return Q4 - 30th April"],
                },
                {
                  month: "July",
                  deadlines: ["ITR Filing - 31st July", "Advance Tax Q1 - 15th July", "TDS Return Q1 - 31st July"],
                },
                {
                  month: "September",
                  deadlines: ["Advance Tax Q2 - 15th September"],
                },
                {
                  month: "October",
                  deadlines: ["TDS Return Q2 - 31st October"],
                },
                {
                  month: "December",
                  deadlines: ["Advance Tax Q3 - 15th December"],
                },
                {
                  month: "January",
                  deadlines: ["TDS Return Q3 - 31st January"],
                },
              ].map((calendar, index) => (
                <FadeInSection key={index} delay={index * 100}>
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-xl text-blue-600">{calendar.month}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {calendar.deadlines.map((deadline, idx) => (
                          <div key={idx} className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-orange-500" />
                            <span className="text-sm text-gray-600">{deadline}</span>
                          </div>
                        ))}
                      </div>
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
        <section className="py-20 bg-blue-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <div className="space-y-8">
              <h2 className="text-4xl font-bold">Need Tax Assistance?</h2>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                Our tax experts are here to help you with all your tax compliance needs
              </p>
              <div className="flex justify-center space-x-4">
                <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg">Get Tax Help</Button>
                
              </div>
            </div>
          </div>
        </section>
      </FadeInSection>
      <EnhancedFooter />
    </div>
  )
}
