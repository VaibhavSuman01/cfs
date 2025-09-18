"use client"

import { EnhancedHeader } from "@/components/enhanced-header";
import { EnhancedFooter } from "@/components/enhanced-footer";
import { FadeInSection } from "@/components/fade-in-section"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Briefcase, CheckCircle, Clock, Users, Target, BarChart3, ArrowRight, Lightbulb } from "lucide-react"
import { PricingDisplay } from "@/components/ui/pricing-display"

export default function StartupMentoringPage() {
  return (
    <div className="min-h-screen bg-white">
      <EnhancedHeader />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-100 py-20">
        <div className="container mx-auto px-4">
          <FadeInSection className="text-center space-y-8">
            <h1 className="text-5xl font-bold text-gray-900">Startup Mentoring</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive guidance for startups from ideation to scaling with expert mentorship
            </p>
            <div className="flex justify-center space-x-4">
              <Link href={`/dashboard/advisory?service=${encodeURIComponent("Startup Mentoring")}`} passHref>
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
                    Our startup mentoring service provides comprehensive guidance for entrepreneurs at every stage 
                    of their journey, from initial ideation to successful scaling.
                  </p>
                </div>

              <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900">What We Deliver</h3>
                  <div className="space-y-4">
                    {[
                      "Business plan development",
                      "Funding strategy and support",
                      "Market entry planning",
                      "Operational setup guidance",
                      "Investor pitch preparation",
                      "Growth and scaling strategies"
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
                      <Briefcase className="h-8 w-8 text-blue-600" />
                    </div>
                    <CardTitle className="text-2xl text-gray-900">Startup Mentoring</CardTitle>
                    <div className="text-3xl font-bold text-blue-600">
                      <PricingDisplay serviceName="startup mentoring" />
                    </div>
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                      <Clock className="h-4 w-4" />
                      <span>1-2 weeks</span>
                    </div>
                  </CardHeader>
                  <CardContent className="text-center">
                    <Link href={`/dashboard/advisory?service=${encodeURIComponent("Startup Mentoring")}`} passHref>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3">
                        Book Mentoring <ArrowRight className="ml-2 h-5 w-5" />
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
                        title: "Experienced Mentors",
                        description: "Successful entrepreneurs and industry experts"
                      },
                      {
                        icon: Target,
                        title: "Personalized Approach",
                        description: "Tailored guidance for your specific startup needs"
                      },
                      {
                        icon: Lightbulb,
                        title: "Proven Strategies",
                        description: "Time-tested methods for startup success"
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
              <h2 className="text-4xl font-bold text-gray-900">Our Mentoring Process</h2>
              <p className="text-xl text-gray-600">Structured approach to startup success</p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  step: "01",
                  title: "Assessment",
                  description: "Evaluate your startup idea and current stage",
                  icon: Target,
                },
                {
                  step: "02",
                  title: "Planning",
                  description: "Develop comprehensive business and growth plans",
                  icon: BarChart3,
                },
                {
                  step: "03",
                  title: "Execution",
                  description: "Guide implementation of key strategies",
                  icon: Briefcase,
                },
                {
                  step: "04",
                  title: "Scaling",
                  description: "Support growth and expansion efforts",
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
              <h2 className="text-4xl font-bold">Ready to Launch Your Startup?</h2>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                Get expert startup mentoring to turn your idea into a successful business
              </p>
              <div className="flex justify-center space-x-4">
                <Link href={`/dashboard/advisory?service=${encodeURIComponent("Startup Mentoring")}`} passHref>
                  <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg">
                    Start Mentoring
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
