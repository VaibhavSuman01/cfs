"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EnhancedHeader } from "@/components/enhanced-header";
import { EnhancedFooter } from "@/components/enhanced-footer";
import { FadeInSection } from "@/components/fade-in-section"
import { Calculator, FileText, TrendingUp, Shield, CheckCircle, ArrowRight, Clock, Users, Building } from "lucide-react"
import Link from "next/link";
import { PricingDisplay } from "@/components/ui/pricing-display"
import { getServiceCardClasses, getServiceBackgroundColor, getServiceIconColor, getServicePriceColor, getServicePageHeroBackground } from "@/lib/service-colors"

export default function TaxationPage() {
  return (
    <div className="min-h-screen bg-white">
      <EnhancedHeader />

      {/* Hero Section */}
      <section className={`relative overflow-hidden ${getServicePageHeroBackground("Taxation")} py-20`}>
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
                  title: "GST Filing",
                  button: "gst-filing",
                  description: "Monthly/quarterly GST compliance (GSTR-1, GSTR-3B) with ITC support",
                  features: [
                    "GSTR-1 (outward supplies) filing",
                    "GSTR-3B summary return filing",
                    "E-invoice/e-way bill guidance",
                    "Input Tax Credit reconciliation",
                  ],
                  priceKey: "gst filing",
                  timeline: "3-7 days",
                },
                {
                  icon: FileText,
                  title: "Income Tax Filing",
                  button: "income-tax",
                  description: "ITR preparation and e-filing (ITR-1 to ITR-7), refunds and compliance support",
                  features: [
                    "Form 16/AIS/26AS-based return prep",
                    "ITR-1 to ITR-7 applicability guidance",
                    "Old vs New regime optimization",
                    "Advance tax and refund tracking",
                    "Notices and rectification support",
                  ],
                  priceKey: "income tax filing",
                  timeline: "1-3 days",
                },
                {
                  icon: Calculator,
                  title: "TDS Returns",
                  button: "tds-returns",
                  description: "Quarterly TDS/TCS e-returns and TRACES compliance (24Q/26Q/27Q/27EQ)",
                  features: [
                    "Quarterly Form 24Q/26Q/27Q/27EQ",
                    "Challan (OIN) mapping & validation",
                    "Deductor/deductee PAN validation",
                    "Conso file & FVU generation",
                    "Correction statements & Form 16/16A",
                  ],
                  priceKey: "tds returns (per qtr)",
                  timeline: "2-5 days",
                },
                {
                  icon: Shield,
                  title: "Tax Planning",
                  button: "tax-planning",
                  description: "Year-round planning covering 80C/80D deductions, HRA/LTA and capital gains",
                  features: [
                    "Section 80C/80D/80G optimization",
                    "HRA, LTA and perquisite planning",
                    "Capital gains exemptions (54/54F)",
                    "Business/profession tax strategy",
                    "Advance tax and TDS planning",
                  ],
                  priceKey: "tax planning",
                  timeline: "5-7 days",
                },
                {
                  icon: Building,
                  title: "Corporate Tax",
                  button: "corporate-tax-filing",
                  description: "Corporate ITR, tax audit support, MAT/115BAA options and TP compliance",
                  features: [
                    "Company ITR and schedules (ROI)",
                    "Tax audit (3CA/3CB-3CD) assistance",
                    "MAT/AMT and section 115BAA/115BAB",
                    "Transfer pricing documentation",
                    "TDS/TCS and advance tax review",
                  ],
                  priceKey: "corporate tax (company)",
                  timeline: "7-10 days",
                },
                {
                  icon: Users,
                  title: "Payroll Tax",
                  button: "payroll-tax",
                  description: "End-to-end payroll compliance: TDS on salary, PF, ESI and PT",
                  features: [
                    "Monthly payroll and TDS (Form 24Q)",
                    "Form 16 generation and distribution",
                    "EPF (ECR) and ESIC contributions",
                    "Professional Tax returns (state-wise)",
                    "Payroll statutory registers & audit",
                  ],
                  priceKey: "payroll tax (per month)",
                  timeline: "3-5 days",
                },
                {
                  icon: Calculator,
                  title:"EPFO Filing",
                  button:"epfo-filing",
                  description:"EPF registration and monthly ECR filing with challan payment support",
                  features:[
                    "EPF registration & code allotment",
                    "UAN/KYC onboarding for employees",
                    "Monthly ECR preparation & payment",
                    "Return filing & ledger reconciliation",
                    "Inspections and compliance advisory",
                  ],
                  price:"As per request",
                  timeline:"3-7 days"
                },
                {
                  icon: Shield,
                  title: "ESIC Filing",
                  button: "esic-filing",
                  description: "ESIC registration, monthly contributions and return compliance",
                  features: [
                    "Employer code registration",
                    "IP (employee) registration & KYC",
                    "Monthly contribution challans",
                    "Half-yearly return compliance",
                    "Inspection/audit assistance",
                  ],
                  price: "As per request",
                  timeline: "3-7 days",
                },
                {
                  icon: FileText,
                  title: "PT-Tax Filing",
                  button: "pt-tax-filing",
                  description: "Professional Tax registration and monthly/annual filing as per state rules",
                  features: [
                    "PT registration and enrollment",
                    "Slab-wise employee classification",
                    "Monthly/annual returns & challans",
                    "State-specific compliance calendar",
                    "Notices and assessment support",
                  ],
                  price: "As per request",
                  timeline: "2-5 days",
                },
              ].map((service, index) => (
                <FadeInSection key={index} delay={index * 100}>
                  <Card className={getServiceCardClasses('Taxation')}>
                    <CardHeader className="text-center">
                      <div className={getServiceBackgroundColor('Taxation')}>
                        <service.icon className={getServiceIconColor('Taxation')} />
                      </div>
                      <CardTitle className="text-xl text-gray-900">{service.title}</CardTitle>
                      <div className="space-y-2">
                        <div className={getServicePriceColor('Taxation')}>
                          {service.priceKey ? (
                            <PricingDisplay serviceName={service.priceKey} />
                          ) : (
                            service.price
                          )}
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
                            <CheckCircle className="h-4 w-4 text-blue-500" />
                            <span className="text-sm text-gray-600">{feature}</span>
                          </div>
                        ))}
                      </div>
                      <Link href={`/taxation/${service.button}`} passHref>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3">
                          Book Service <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                  {/* view more from dropdown */}
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
              <h2 className="text-4xl font-bold text-gray-900">Why GST Filing?</h2>
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
                            <Clock className="h-4 w-4 text-blue-500" />
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
