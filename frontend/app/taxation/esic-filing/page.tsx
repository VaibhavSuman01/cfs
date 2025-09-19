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
  ArrowRight,
  Phone,
  Users,
  FileCheck,
  HeartPulse,
  Baby,
  Stethoscope
} from "lucide-react"

export default function EsicFilingPage() {
  const basePrice = getBasePrice("esic filing") ?? "As per request";
  
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
                  Employee Health Security
                </Badge>
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-gray-900 via-blue-600 to-gray-900 bg-clip-text text-transparent">
                    ESIC Filing
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600 bg-clip-text text-transparent">
                    Protect Your Team
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Manage ESIC compliance effortlessly. We ensure accurate, timely filing of half-yearly returns to provide your employees with crucial health benefits.
                </p>

                <div className="grid sm:grid-cols-3 gap-4 pt-6">
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">{basePrice}</div>
                    <div className="text-sm text-gray-600">Per Filing</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">Half-Yearly</div>
                    <div className="text-sm text-gray-600">Filing Cycle</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">Full</div>
                    <div className="text-sm text-gray-600">Compliance</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-6">
                  <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    Start ESIC Filing
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    className="border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white px-8 py-3 rounded-full transition-all duration-300 hover:scale-105 bg-transparent"
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
                  src="/images/esic-filing-hero.png"
                  alt="ESIC Filing Illustration"
                  className="relative rounded-lg w-full h-auto"
                />
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <FadeInSection>
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto mb-16">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">ESIC Benefits for Employees</h2>
              <p className="text-lg text-gray-600">
                ESIC provides a comprehensive safety net for your workforce.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="text-center p-6 border-2 border-transparent hover:border-blue-200 hover:shadow-xl transition-all">
                <Stethoscope className="mx-auto h-12 w-12 text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Medical Benefits</h3>
                <p className="text-gray-600">Full medical care for employees and their dependents from day one of employment.</p>
              </Card>
              <Card className="text-center p-6 border-2 border-transparent hover:border-blue-200 hover:shadow-xl transition-all">
                <HeartPulse className="mx-auto h-12 w-12 text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Sickness & Disability</h3>
                <p className="text-gray-600">Cash benefits during sickness and disablement to compensate for loss of wages.</p>
              </Card>
              <Card className="text-center p-6 border-2 border-transparent hover:border-blue-200 hover:shadow-xl transition-all">
                <Baby className="mx-auto h-12 w-12 text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Maternity Benefits</h3>
                <p className="text-gray-600">Paid leave and medical care for female employees during maternity.</p>
              </Card>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* CTA Section */}
      <FadeInSection>
        <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto space-y-8">
              <h2 className="text-4xl lg:text-5xl font-bold">Ensure Your Team's Well-being</h2>
              <p className="text-xl text-blue-100 leading-relaxed">
                Partner with us to manage your ESIC obligations seamlessly. 
              </p>
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all">
                  Book Our Service
                  <Users className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg rounded-full transition-all bg-transparent">
                  Talk to an Expert
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

