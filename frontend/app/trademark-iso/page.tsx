"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { EnhancedHeader } from "@/components/enhanced-header";
import { EnhancedFooter } from "@/components/enhanced-footer";
import { FadeInSection } from "@/components/fade-in-section"
import { Shield, Award, Search, FileText, CheckCircle, ArrowRight, Globe, Star, Zap } from "lucide-react"
import { getBasePrice } from "@/lib/pricing"

export default function TrademarkISOPage() {
  return (
    <div className="min-h-screen bg-white">
      <EnhancedHeader />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-100 py-20">
        <div className="container mx-auto px-4">
          <FadeInSection className="text-center space-y-8">
            <h1 className="text-5xl font-bold text-gray-900">Trademark & ISO Certification</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Protect your brand with trademark registration and enhance your business credibility with ISO
              certification.
            </p>
          </FadeInSection>
        </div>
      </section>

      {/* Services Overview */}
      <FadeInSection>
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16">
              {/* Trademark Section */}
              <div className="space-y-8">
                <div className="text-center space-y-4">
                  <div className="mx-auto w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                    <Shield className="h-10 w-10 text-blue-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">Trademark Registration</h2>
                  <p className="text-gray-600">Protect your brand identity and intellectual property</p>
                </div>

                <div className="grid gap-6">
                  {[
                    {
                      title: "Trademark Search",
                      description: "Comprehensive search to ensure your trademark is unique",
                      price: getBasePrice("trademark search") ?? "₹999",
                      timeline: "1-2 days",
                    },
                    {
                      title: "Trademark Filing",
                      description: "Complete trademark application filing with government",
                      price: getBasePrice("trademark filing") ?? "₹3,999",
                      timeline: "3-5 days",
                    },
                    {
                      title: "Trademark Registration",
                      description: "End-to-end trademark registration process",
                      price: getBasePrice("trademark registration (for msme)") ?? "₹6,999",
                      timeline: "12-18 months",
                    },
                  ].map((service, index) => (
                    <FadeInSection key={index} delay={index * 100}>
                      <Card className="border-2 border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{service.title}</h3>
                              <p className="text-gray-600 text-sm">{service.description}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-xl font-bold text-blue-600">{service.price}</div>
                              <div className="text-sm text-gray-500">{service.timeline}</div>
                            </div>
                          </div>
                          <Link href={`/trademark-iso/trademark`} passHref>
                            <Button className="w-full bg-blue-600 hover:bg-blue-700">
                              Get Started <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>
                    </FadeInSection>
                  ))}
                </div>
              </div>

              {/* ISO Section */}
              <div className="space-y-8">
                <div className="text-center space-y-4">
                  <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                    <Award className="h-10 w-10 text-green-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">ISO Certification</h2>
                  <p className="text-gray-600">Enhance credibility with international quality standards</p>
                </div>

                <div className="grid gap-6">
                  {[
                    {
                      title: "ISO 9001:2015",
                      description: "Quality Management System certification",
                      price: getBasePrice("iso 9001:2015") ?? "₹15,999",
                      timeline: "45-60 days",
                    },
                    {
                      title: "ISO 14001:2015",
                      description: "Environmental Management System certification",
                      price: getBasePrice("iso 14001:2015") ?? "₹18,999",
                      timeline: "45-60 days",
                    },
                    {
                      title: "ISO 45001:2018",
                      description: "Occupational Health & Safety Management System",
                      price: getBasePrice("iso 45001:2018") ?? "₹20,999",
                      timeline: "45-60 days",
                    },
                  ].map((service, index) => (
                    <FadeInSection key={index} delay={index * 100}>
                      <Card className="border-2 border-gray-200 hover:border-green-300 hover:shadow-lg transition-all duration-300">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{service.title}</h3>
                              <p className="text-gray-600 text-sm">{service.description}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-xl font-bold text-green-600">{service.price}</div>
                              <div className="text-sm text-gray-500">{service.timeline}</div>
                            </div>
                          </div>
                          <Link href={`/trademark-iso/iso-9001`} passHref>
                            <Button className="w-full bg-green-600 hover:bg-green-700">
                              Get Started <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>
                    </FadeInSection>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Trademark Process */}
      <FadeInSection>
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-4xl font-bold text-gray-900">Trademark Registration Process</h2>
              <p className="text-xl text-gray-600">Step-by-step process to protect your brand</p>
            </div>

            <div className="grid md:grid-cols-5 gap-8">
              {[
                {
                  step: "01",
                  title: "Trademark Search",
                  description: "Search existing trademarks to ensure uniqueness",
                  icon: Search,
                },
                {
                  step: "02",
                  title: "Application Filing",
                  description: "File trademark application with required documents",
                  icon: FileText,
                },
                {
                  step: "03",
                  title: "Examination",
                  description: "Government examines the application for compliance",
                  icon: Shield,
                },
                {
                  step: "04",
                  title: "Publication",
                  description: "Trademark published in official journal for objections",
                  icon: Globe,
                },
                {
                  step: "05",
                  title: "Registration",
                  description: "Trademark certificate issued after successful process",
                  icon: Award,
                },
              ].map((step, index) => (
                <FadeInSection key={index} delay={index * 150}>
                  <div className="text-center space-y-4">
                    <div className="mx-auto w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                      {step.step}
                    </div>
                    <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <step.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
                    <p className="text-gray-600 text-sm">{step.description}</p>
                  </div>
                </FadeInSection>
              ))}
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* ISO Benefits */}
      <FadeInSection>
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-4xl font-bold text-gray-900">Benefits of ISO Certification</h2>
              <p className="text-xl text-gray-600">Why your business needs ISO certification</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Star,
                  title: "Enhanced Credibility",
                  description: "Build trust with customers and stakeholders through international recognition",
                },
                {
                  icon: Zap,
                  title: "Improved Efficiency",
                  description: "Streamline processes and reduce waste through systematic approach",
                },
                {
                  icon: Globe,
                  title: "Global Market Access",
                  description: "Access international markets with recognized quality standards",
                },
                {
                  icon: Shield,
                  title: "Risk Management",
                  description: "Identify and mitigate risks through structured management systems",
                },
                {
                  icon: Award,
                  title: "Competitive Advantage",
                  description: "Stand out from competitors with certified quality management",
                },
                {
                  icon: CheckCircle,
                  title: "Compliance Assurance",
                  description: "Ensure compliance with regulatory and customer requirements",
                },
              ].map((benefit, index) => (
                <FadeInSection key={index} delay={index * 100}>
                  <Card className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
                    <CardContent className="p-6">
                      <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                        <benefit.icon className="h-8 w-8 text-green-600" />
                      </div>
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

      {/* Documents Required */}
      <FadeInSection>
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-4xl font-bold text-gray-900">Documents Required</h2>
              <p className="text-xl text-gray-600">Keep these documents ready for quick processing</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-gray-900">For Trademark Registration</h3>
                <div className="space-y-4">
                  {[
                    "Trademark logo/wordmark in JPG format",
                    "Applicant's PAN card and Aadhaar card",
                    "Address proof of applicant",
                    "Power of attorney (if filed through agent)",
                    "Priority document (if claiming priority)",
                    "User affidavit (if claiming prior use)",
                  ].map((doc, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-blue-500" />
                      <span className="text-gray-700">{doc}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-gray-900">For ISO Certification</h3>
                <div className="space-y-4">
                  {[
                    "Company registration certificate",
                    "Quality manual and procedures",
                    "Organizational chart",
                    "Process flow charts",
                    "List of products/services",
                    "Previous audit reports (if any)",
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

      {/* CTA Section */}
      <FadeInSection>
        <section className="py-20 bg-gradient-to-r from-blue-600 to-green-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <div className="space-y-8">
              <h2 className="text-4xl font-bold">Protect Your Brand & Enhance Credibility</h2>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                Get started with trademark registration and ISO certification today
              </p>
              <div className="flex justify-center space-x-4">
                <Link href={`/trademark-iso/trademark`} passHref>
                  <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg">
                    Register Trademark
                  </Button>
                </Link>
                <Link href={`/trademark-iso/iso-9001`} passHref>
                  <Button
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg bg-transparent"
                  >
                    Get ISO Certified
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
