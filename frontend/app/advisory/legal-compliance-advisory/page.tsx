"use client"

import { EnhancedHeader } from "@/components/enhanced-header";
import { EnhancedFooter } from "@/components/enhanced-footer";
import { FadeInSection } from "@/components/fade-in-section"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Shield, CheckCircle, Clock, Users, Target, BarChart3, ArrowRight, FileText } from "lucide-react"
import { PricingDisplay } from "@/components/ui/pricing-display"

export default function LegalComplianceAdvisoryPage() {
  return (
    <div className="min-h-screen bg-white">
      <EnhancedHeader />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-100 py-20">
        <div className="container mx-auto px-4">
          <FadeInSection className="text-center space-y-8">
            <h1 className="text-5xl font-bold text-gray-900">Legal & Compliance Advisory</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Navigate complex legal requirements and ensure regulatory compliance with expert guidance
            </p>
            <div className="flex justify-center space-x-4">
              <Link href={`/contact?service=${encodeURIComponent("Advisory")}&subService=${encodeURIComponent("Legal & Compliance Advisory")}`} passHref>
                <Button className="bg-blue-600 hover:bg-blue-700 px-8 py-3">Get Started</Button>
              </Link>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Service Details */}
      <FadeInSection>
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16">
              <div className="space-y-8">
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold text-gray-900">Service Overview</h2>
                  <p className="text-gray-600">
                    Our legal and compliance advisory service helps organizations navigate complex regulatory 
                    requirements, ensure compliance, and minimize legal risks.
                  </p>
                </div>

                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900">What We Deliver</h3>
                  <div className="space-y-4">
                    {[
                      "Regulatory compliance audit",
                      "Legal risk assessment",
                      "Contract review and drafting",
                      "Intellectual property strategy",
                      "Dispute resolution support",
                      "Compliance training programs"
                    ].map((item, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-blue-500" />
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <Card className="border-2 border-blue-200">
                  <CardHeader className="text-center">
                    <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                      <Shield className="h-8 w-8 text-blue-600" />
                    </div>
                    <CardTitle className="text-2xl text-gray-900">Legal & Compliance Advisory</CardTitle>
                    <div className="text-3xl font-bold text-blue-600">
                      <PricingDisplay serviceName="legal compliance advisory" />
                    </div>
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                      <Clock className="h-4 w-4" />
                      <span>1-2 weeks</span>
                    </div>
                  </CardHeader>
                  <CardContent className="text-center">
                    <Link href={`/contact?service=${encodeURIComponent("Advisory")}&subService=${encodeURIComponent("Legal & Compliance Advisory")}`} passHref>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3">
                        Book Service <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900">Why Choose Us</h3>
                  <div className="grid gap-4">
                    {[
                      {
                        icon: Users,
                        title: "Legal Experts",
                        description: "Experienced legal professionals with industry expertise"
                      },
                      {
                        icon: Target,
                        title: "Customized Solutions",
                        description: "Tailored compliance strategies for your business"
                      },
                      {
                        icon: FileText,
                        title: "Proven Track Record",
                        description: "Successfully helped numerous organizations achieve compliance"
                      }
                    ].map((benefit, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <benefit.icon className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{benefit.title}</h4>
                          <p className="text-sm text-gray-600">{benefit.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Process */}
      <FadeInSection>
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-4xl font-bold text-gray-900">Our Process</h2>
              <p className="text-xl text-gray-600">Structured approach to legal compliance</p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  step: "01",
                  title: "Assessment",
                  description: "Evaluate current compliance status and legal risks",
                  icon: Target,
                },
                {
                  step: "02",
                  title: "Analysis",
                  description: "Identify compliance gaps and legal requirements",
                  icon: BarChart3,
                },
                {
                  step: "03",
                  title: "Strategy",
                  description: "Develop compliance strategies and legal solutions",
                  icon: Shield,
                },
                {
                  step: "04",
                  title: "Implementation",
                  description: "Execute compliance measures and monitor progress",
                  icon: CheckCircle,
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
                    <h3 className="text-xl font-semibold text-gray-900">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
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
              <h2 className="text-4xl font-bold">Ready to Ensure Compliance?</h2>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                Protect your business with expert legal and compliance guidance
              </p>
              <div className="flex justify-center space-x-4">
                <Link href={`/contact?service=${encodeURIComponent("Advisory")}&subService=${encodeURIComponent("Legal & Compliance Advisory")}`} passHref>
                  <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg">
                    Get Legal Support
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
