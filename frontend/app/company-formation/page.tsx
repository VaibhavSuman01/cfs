"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { EnhancedHeader } from "@/components/enhanced-header";
import { EnhancedFooter } from "@/components/enhanced-footer";
import { FadeInSection } from "@/components/fade-in-section"
import { Building2, CheckCircle, Clock, Shield, Users, FileText, ArrowRight, Star, Zap } from "lucide-react"
import { getBasePrice } from "@/lib/pricing"

export default function CompanyFormationPage() {
  return (
    <div className="min-h-screen bg-white">
      <EnhancedHeader />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-100 py-20">
        <div className="container mx-auto px-4">
          <FadeInSection className="text-center space-y-8">
            <Badge className="bg-green-100 text-green-800">Most Popular Service</Badge>
            <h1 className="text-5xl font-bold text-gray-900">Company Formation</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Start your Private Limited Company, Public Limited Company, or One Person Company with complete legal
              compliance and documentation.
            </p>
            <div className="flex justify-center space-x-4">
              <Link href={`/contact?service=${encodeURIComponent("Company Formation")}`} passHref>
                <Button className="bg-blue-600 hover:bg-blue-700 px-8 py-3">Start Registration</Button>
              </Link>

            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Company Types */}
      <FadeInSection>
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-4xl font-bold text-gray-900">Choose Your Company Type</h2>
              <p className="text-xl text-gray-600">Select the right structure for your business needs</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Private Limited Company",
                  slug: "private-limited",
                  priceKey: "private limited company",
                  description: "Most popular choice for startups and growing businesses",
                  features: [
                    "Limited liability protection",
                    "Easy to raise funds",
                    "Separate legal entity",
                    "Perpetual succession",
                    "Tax benefits available",
                  ],
                  popular: true,
                },
                {
                  title: "One Person Company (OPC)",
                  slug: "one-person-company",
                  priceKey: "one person company (opc)",
                  description: "Perfect for solo entrepreneurs and individual businesses",
                  features: [
                    "Single person ownership",
                    "Limited liability",
                    "Easy compliance",
                    "Can be converted to Pvt Ltd",
                    "Minimum capital ₹1 Lakh",
                  ],
                  popular: false,
                },
                {
                  title: "Public Limited Company",
                  slug: "public-limited",
                  priceKey: "public limited company",
                  description: "For large businesses planning to go public",
                  features: [
                    "Can raise funds from public",
                    "Shares freely transferable",
                    "Higher credibility",
                    "Minimum 7 members",
                    "Strict compliance requirements",
                  ],
                  popular: false,
                },
                {
                  title: "Nidhi Company",
                  slug: "nidhi-company",
                  priceKey: "nidhi company",
                  description: "For promoting thrift and savings among members",
                  features: [
                    "Encourages savings habit",
                    "Borrows and lends within members",
                    "Minimum 7 members",
                    "Easy to manage",
                    "Lower regulatory burden",
                  ],
                  popular: false,
                },
                {
                  title: "Section 8 Company (NPO)",
                  slug: "section-8",
                  priceKey: "section 8 company",
                  description: "For non-profit organizations promoting social welfare",
                  features: [
                    "Promotes charitable objects",
                    "No profit distribution to members",
                    "Tax exemptions under 80G",
                    "High credibility",
                    "No minimum capital required",
                  ],
                  popular: false,
                },
              ].map((company: any, index) => (
                <FadeInSection key={index} delay={index * 100}>
                  <Card
                    className={`relative border-2 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 ${
                      company.popular ? "border-blue-500 shadow-lg" : "border-gray-200"
                    }`}
                  >
                    {company.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-blue-600 text-white">Most Popular</Badge>
                      </div>
                    )}
                    <CardHeader className="text-center">
                      <CardTitle className="text-xl text-gray-900">{company.title}</CardTitle>
                      <div className="text-3xl font-bold text-blue-600">{getBasePrice(company.priceKey) ?? "—"}</div>
                      <CardDescription>{company.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        {company.features.map((feature: string, idx: number) => (
                          <div key={idx} className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm text-gray-600">{feature}</span>
                          </div>
                        ))}
                      </div>
                      <Link href={`/company-formation/${company.slug}`} passHref>
                        <Button
                          className={`w-full ${
                            company.popular ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-600 hover:bg-gray-700"
                          }`}
                        >
                          Choose This Plan <ArrowRight className="ml-2 h-4 w-4" />
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

      {/* Process Steps */}
      <FadeInSection>
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-4xl font-bold text-gray-900">Registration Process</h2>
              <p className="text-xl text-gray-600">Simple 5-step process to get your company registered</p>
            </div>

            <div className="grid md:grid-cols-5 gap-8">
              {[
                {
                  step: "01",
                  title: "Submit Details",
                  description: "Provide company name, director details, and required documents",
                  icon: FileText,
                },
                {
                  step: "02",
                  title: "Digital Signature",
                  description: "Get digital signatures from directors",
                  icon: CheckCircle,
                },
                {
                  step: "03",
                  title: "Name Approval",
                  description: "We check name availability and get approval from MCA",
                  icon: CheckCircle,
                },
                {
                  step: "04",
                  title: "File Documents",
                  description: "Submit incorporation documents and get digital signatures",
                  icon: Shield,
                },
                {
                  step: "05",
                  title: "Get Certificate",
                  description: "Receive Certificate of Incorporation and start business",
                  icon: Star,
                },
              ].map((step, index) => (
                <FadeInSection key={index} delay={index * 150}>
                  <div className="text-center space-y-2">
                    <div className="mx-auto w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                      {step.step}
                    </div>
                    <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <step.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
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
                      <CheckCircle className="h-5 w-5 text-green-500" />
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
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-gray-700">{doc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Benefits */}
      <FadeInSection>
        <section className="py-20 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-4xl font-bold">Why Register Your Company?</h2>
              <p className="text-xl text-blue-100">Unlock these benefits with company registration</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Shield,
                  title: "Limited Liability",
                  description: "Personal assets are protected from business liabilities",
                },
                {
                  icon: Building2,
                  title: "Separate Legal Entity",
                  description: "Company exists independently of its owners",
                },
                {
                  icon: Users,
                  title: "Easy Fund Raising",
                  description: "Attract investors and raise capital easily",
                },
                {
                  icon: Star,
                  title: "Tax Benefits",
                  description: "Enjoy various tax deductions and benefits",
                },
                {
                  icon: Clock,
                  title: "Perpetual Succession",
                  description: "Company continues even if directors change",
                },
                {
                  icon: Zap,
                  title: "Higher Credibility",
                  description: "Build trust with customers and vendors",
                },
              ].map((benefit, index) => (
                <FadeInSection key={index} delay={index * 100}>
                  <div className="text-center space-y-4">
                    <div className="mx-auto w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
                      <benefit.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold">{benefit.title}</h3>
                    <p className="text-blue-100">{benefit.description}</p>
                  </div>
                </FadeInSection>
              ))}
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* CTA Section */}
      <FadeInSection>
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 text-center">
            <div className="space-y-8">
              <h2 className="text-4xl font-bold text-gray-900">Ready to Start Your Company?</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Join thousands of entrepreneurs who have successfully registered their companies with us
              </p>
              <div className="flex justify-center space-x-4">
                <Link href={`/contact?service=${encodeURIComponent("Company Formation")}`} passHref>
                  <Button className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg">Start Registration Now</Button>
                </Link>
                <Link href="/contact" passHref>
                  <Button variant="outline" className="px-8 py-3 text-lg bg-transparent">
                    Talk to Expert
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
