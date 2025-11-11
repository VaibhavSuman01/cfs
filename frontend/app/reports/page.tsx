"use client";

import { EnhancedHeader } from '@/components/enhanced-header';
import { EnhancedFooter } from "@/components/enhanced-footer";
import { FadeInSection } from "@/components/fade-in-section"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { PricingDisplay } from "@/components/ui/pricing-display"
import {
  getServiceCardClasses,
  getServiceBackgroundColor,
  getServiceIconColor,
  getServicePriceColor,
  getServicePageHeroBackground,
} from "@/lib/service-colors"
import {
  FileText,
  TrendingUp,
  Calculator,
  CheckCircle,
  ArrowRight,
  Clock,
  BarChart3,
  Receipt,
} from "lucide-react"

export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-white">
      <EnhancedHeader />
      
      {/* Hero Section */}
      <section className={`relative overflow-hidden ${getServicePageHeroBackground("Reports")} py-32`}>
        <div className="container mx-auto px-4">
          <FadeInSection className="text-center space-y-8">
            <h1 className="text-5xl font-bold text-gray-900">Financial Reports</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Gain critical insights into your business's financial health and performance with our comprehensive reporting services.
            </p>
          </FadeInSection>
        </div>
      </section>

      {/* Report Services */}
      <FadeInSection>
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-4xl font-bold text-gray-900">
                Our Report Services
              </h2>
              <p className="text-xl text-gray-600">
                Comprehensive financial reporting solutions for your business
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
              {[
                {
                  icon: FileText,
                  title: "Project Reports",
                  slug: "project-reports",
                  description: "Comprehensive project reports for business planning and funding",
                  features: [
                    "Detailed project feasibility analysis",
                    "Financial projections and forecasts",
                    "Market analysis and research",
                    "Risk assessment and mitigation",
                    "Funding requirement calculations",
                  ],
                  priceKey: "project report",
                  timeline: "7-15 days",
                },
                {
                  icon: TrendingUp,
                  title: "CMA Reports",
                  slug: "cma-reports",
                  description: "Credit Monitoring Arrangement reports for loan applications",
                  features: [
                    "Working capital assessment",
                    "Fund flow and cash flow statements",
                    "Projected balance sheets",
                    "Loan repayment capacity analysis",
                    "Bank compliance documentation",
                  ],
                  priceKey: "dscr/cma report",
                  timeline: "5-10 days",
                },
                {
                  icon: Calculator,
                  title: "DSCR Reports",
                  slug: "dscr-reports",
                  description: "Debt Service Coverage Ratio reports for financial analysis",
                  features: [
                    "DSCR calculation and analysis",
                    "Debt servicing capacity evaluation",
                    "Cash flow projections",
                    "Loan eligibility assessment",
                    "Financial ratio analysis",
                  ],
                  priceKey: "dscr/cma report",
                  timeline: "5-10 days",
                },
                {
                  icon: Receipt,
                  title: "Bank Reconciliation",
                  slug: "bank-reconciliation",
                  description: "Bank statement reconciliation and financial auditing",
                  features: [
                    "Monthly bank statement reconciliation",
                    "Outstanding checks and deposits tracking",
                    "Bank charges and interest verification",
                    "Discrepancy identification and resolution",
                    "Audit-ready documentation",
                  ],
                  priceKey: "bank reconciliation",
                  timeline: "3-7 days",
                },
              ].map((service, index) => (
                <FadeInSection key={index} delay={index * 100}>
                  <Card className={getServiceCardClasses("Reports")}>
                    <CardHeader className="text-center">
                      <div className={getServiceBackgroundColor("Reports")}>
                        <service.icon className={getServiceIconColor("Reports")} />
                      </div>
                      <CardTitle className="text-xl text-gray-900">
                        {service.title}
                      </CardTitle>
                      <div className="space-y-2">
                        <div className={getServicePriceColor("Reports")}>
                          <PricingDisplay serviceName={service.priceKey} />
                        </div>
                        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                          <Clock className="h-4 w-4" />
                          <span>{service.timeline}</span>
                        </div>
                      </div>
                      <CardDescription className="text-gray-600">
                        {service.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        {service.features.map((feature, idx) => (
                          <div
                            key={idx}
                            className="flex items-center space-x-2"
                          >
                            <CheckCircle className="h-4 w-4 text-yellow-600" />
                            <span className="text-sm text-gray-600">
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>
                      <Link href={`/reports/${service.slug}`} passHref>
                        <Button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3">
                          Get Report <ArrowRight className="ml-2 h-5 w-5" />
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

      {/* Benefits Section */}
      <FadeInSection>
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-4xl font-bold text-gray-900">
                Why Financial Reports?
              </h2>
              <p className="text-xl text-gray-600">
                Benefits of professional financial reporting
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  title: "Loan Approval",
                  description: "Increase your chances of loan approval with professional reports",
                },
                {
                  title: "Business Planning",
                  description: "Make informed decisions with accurate financial projections",
                },
                {
                  title: "Investor Confidence",
                  description: "Build trust with investors through comprehensive reporting",
                },
                {
                  title: "Compliance Ready",
                  description: "Meet regulatory requirements with audit-ready documentation",
                },
              ].map((benefit, index) => (
                <FadeInSection key={index} delay={index * 100}>
                  <Card className="text-center hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {benefit.description}
                      </p>
                    </CardContent>
                  </Card>
                </FadeInSection>
              ))}
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Process Section */}
      <FadeInSection>
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-4xl font-bold text-gray-900">
                Our Report Process
              </h2>
              <p className="text-xl text-gray-600">
                Simple steps to get your financial reports
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  step: "01",
                  title: "Submit Documents",
                  description: "Share your financial documents and requirements",
                  icon: FileText,
                },
                {
                  step: "02",
                  title: "Analysis & Review",
                  description: "Our experts analyze your financial data",
                  icon: BarChart3,
                },
                {
                  step: "03",
                  title: "Report Preparation",
                  description: "We prepare comprehensive reports as per standards",
                  icon: TrendingUp,
                },
                {
                  step: "04",
                  title: "Delivery & Support",
                  description: "Receive your reports with ongoing support",
                  icon: CheckCircle,
                },
              ].map((step, index) => (
                <FadeInSection key={index} delay={index * 150}>
                  <div className="text-center space-y-4">
                    <div className="mx-auto w-16 h-16 bg-yellow-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                      {step.step}
                    </div>
                    <div className="mx-auto w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                      <step.icon className="h-6 w-6 text-yellow-600" />
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

      {/* CTA Section */}
      <FadeInSection>
        <section className="py-20 bg-yellow-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <div className="space-y-8">
              <h2 className="text-4xl font-bold">Need Financial Reports?</h2>
              <p className="text-xl text-yellow-100 max-w-2xl mx-auto">
                Our financial experts are here to help you with all your reporting needs
              </p>
              <div className="flex justify-center space-x-4">
                <Link
                  href={`/contact?service=${encodeURIComponent("Financial Reports")}`}
                  passHref
                >
                  <Button className="bg-white text-yellow-600 hover:bg-gray-100 px-8 py-3 text-lg">
                    Get Report Help
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </FadeInSection>
      
      <EnhancedFooter />
    </div>
  );
}
