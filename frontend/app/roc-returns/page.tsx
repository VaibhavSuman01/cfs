"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EnhancedHeader } from "@/components/enhanced-header";
import { FadeInSection } from "@/components/fade-in-section"
import {
  FileText,
  Calendar,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Clock,
  Shield,
  Users,
  Building,
} from "lucide-react"

export default function ROCReturnsPage() {
  return (
    <div className="min-h-screen bg-white">
      <EnhancedHeader />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-100 py-20">
        <div className="container mx-auto px-4">
          <FadeInSection className="text-center space-y-8">
            <h1 className="text-5xl font-bold text-gray-900">ROC Returns & Company Management</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Complete ROC compliance services including annual filings, board resolutions, and ongoing company
              management.
            </p>
          </FadeInSection>
        </div>
      </section>

      {/* ROC Services */}
      <FadeInSection>
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-4xl font-bold text-gray-900">Our ROC Services</h2>
              <p className="text-xl text-gray-600">Complete compliance solutions for your company</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: FileText,
                  title: "Annual Filing (AOC-4 & MGT-7)",
                  description: "Mandatory annual return filing with ROC within prescribed timelines",
                  features: [
                    "Balance Sheet filing",
                    "Annual Return preparation",
                    "Director's report",
                    "Auditor's report filing",
                    "Compliance certificate",
                  ],
                  price: "₹14,999",
                  timeline: "7-10 days",
                  urgent: false,
                },
                {
                  icon: Calendar,
                  title: "Board Meeting & Resolutions",
                  description: "Conduct board meetings and prepare necessary resolutions",
                  features: [
                    "Board meeting minutes",
                    "Resolution drafting",
                    "Notice preparation",
                    "Compliance with Companies Act",
                    "Digital documentation",
                  ],
                  price: "₹2,999",
                  timeline: "3-5 days",
                  urgent: false,
                },
                {
                  icon: Users,
                  title: "Director Appointment/Resignation",
                  description: "Handle director changes and related ROC filings",
                  features: [
                    "DIR-12 filing",
                    "DIN application",
                    "Consent letters",
                    "Board resolutions",
                    "ROC notifications",
                  ],
                  price: "₹5,999",
                  timeline: "5-7 days",
                  urgent: false,
                },
                {
                  icon: Building,
                  title: "Share Transfer & Capital Changes",
                  description: "Manage share transfers and capital structure changes",
                  features: [
                    "Share transfer forms",
                    "Capital alteration",
                    "SH-7 filing",
                    "Updated share certificates",
                    "ROC compliance",
                  ],
                  price: "₹5,999",
                  timeline: "10-15 days",
                  urgent: false,
                },
                {
                  icon: AlertTriangle,
                  title: "ROC Default Removal",
                  description: "Remove company from ROC defaulter list and restore compliance",
                  features: [
                    "Default analysis",
                    "Penalty calculation",
                    "Form filing with additional fees",
                    "Compliance restoration",
                    "Status monitoring",
                  ],
                  price: "₹14,999",
                  timeline: "15-20 days",
                  urgent: true,
                },
                {
                  icon: Shield,
                  title: "Company Strike Off",
                  description: "Close dormant company through strike off process",
                  features: [
                    "STK-2 application",
                    "Board resolution",
                    "Compliance verification",
                    "Publication in gazette",
                    "Final closure certificate",
                  ],
                  price: "₹24,999",
                  timeline: "60-90 days",
                  urgent: false,
                },
              ].map((service, index) => (
                <FadeInSection key={index} delay={index * 100}>
                  <Card
                    className={`border-2 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group ${
                      service.urgent ? "border-red-200 hover:border-red-300" : "border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    {service.urgent && (
                      <div className="bg-red-100 text-red-800 text-xs font-medium px-3 py-1 rounded-b-lg text-center">
                        Urgent Service
                      </div>
                    )}
                    <CardHeader className="text-center">
                      <div
                        className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${
                          service.urgent ? "bg-red-100" : "bg-blue-100"
                        }`}
                      >
                        <service.icon className={`h-8 w-8 ${service.urgent ? "text-red-600" : "text-blue-600"}`} />
                      </div>
                      <CardTitle className="text-xl text-gray-900">{service.title}</CardTitle>
                      <div className="space-y-2">
                        <div className={`text-2xl font-bold ${service.urgent ? "text-red-600" : "text-blue-600"}`}>
                          {service.price}
                        </div>
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
                      <Link href={`/contact?service=${encodeURIComponent(service.title)}`} passHref>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 group-hover:scale-105 transition-transform">
                          Get Started <ArrowRight className="ml-2 h-4 w-4" />
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

      {/* Compliance Calendar */}
      <FadeInSection>
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-4xl font-bold text-gray-900">ROC Compliance Calendar</h2>
              <p className="text-xl text-gray-600">Important deadlines you cannot miss</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  month: "May",
                  deadline: "30th May",
                  filing: "Annual Return (MGT-7)",
                  description: "File annual return within 60 days of AGM",
                },
                {
                  month: "September",
                  deadline: "30th September",
                  filing: "Financial Statements (AOC-4)",
                  description: "File balance sheet and P&L account",
                },
                {
                  month: "December",
                  deadline: "31st December",
                  filing: "Cost Audit Report",
                  description: "For companies covered under cost audit",
                },
                {
                  month: "March",
                  deadline: "31st March",
                  filing: "Board Meeting",
                  description: "Minimum 4 board meetings per year",
                },
              ].map((item, index) => (
                <FadeInSection key={index} delay={index * 100}>
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{item.month}</div>
                      <div className="text-lg font-semibold text-gray-900">{item.deadline}</div>
                    </CardHeader>
                    <CardContent className="text-center space-y-2">
                      <h3 className="font-semibold text-gray-900">{item.filing}</h3>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </CardContent>
                  </Card>
                </FadeInSection>
              ))}
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Penalties */}
      <FadeInSection>
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-4xl font-bold text-gray-900">Avoid Heavy Penalties</h2>
              <p className="text-xl text-gray-600">Non-compliance can result in severe consequences</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  violation: "Late Filing of Annual Return",
                  penalty: "₹100 per day + ₹5 Lakhs max",
                  consequence: "Company may be struck off",
                },
                {
                  violation: "Non-filing of Financial Statements",
                  penalty: "₹100 per day + ₹5 Lakhs max",
                  consequence: "Director disqualification",
                },
                {
                  violation: "Non-compliance with Board Meetings",
                  penalty: "₹25,000 to ₹5 Lakhs",
                  consequence: "Legal action against directors",
                },
              ].map((penalty, index) => (
                <FadeInSection key={index} delay={index * 100}>
                  <Card className="border-2 border-red-200 hover:border-red-300 hover:shadow-lg transition-all">
                    <CardHeader className="text-center">
                      <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                        <AlertTriangle className="h-8 w-8 text-red-600" />
                      </div>
                      <CardTitle className="text-lg text-gray-900">{penalty.violation}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center space-y-4">
                      <div className="text-xl font-bold text-red-600">{penalty.penalty}</div>
                      <p className="text-sm text-gray-600">{penalty.consequence}</p>
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
              <h2 className="text-4xl font-bold">Stay ROC Compliant</h2>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                Don't risk penalties and legal issues. Let our experts handle your ROC compliance.
              </p>
              <div className="flex justify-center space-x-4">
                <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg">
                  Get Compliance Help
                </Button>
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg bg-transparent"
                >
                  Check Compliance Status
                </Button>
              </div>
            </div>
          </div>
        </section>
      </FadeInSection>
    </div>
  )
}
