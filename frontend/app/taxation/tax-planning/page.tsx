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
  FileSpreadsheet,
  CheckCircle,
  Shield,
  ArrowRight,
  TrendingUp,
  Phone,
  PiggyBank,
  Briefcase,
  Target
} from "lucide-react"

export default function TaxPlanningPage() {
  const basePrice = getBasePrice("tax planning") ?? "₹4,999";
  
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
                  Maximize Savings, Minimize Liability
                </Badge>
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 bg-clip-text text-transparent">
                    Strategic Tax Planning
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 bg-clip-text text-transparent">
                    For a Secure Future
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Unlock the full potential of your earnings with our expert tax planning services. We help individuals and businesses legally reduce their tax burden and achieve their financial goals.
                </p>

                <div className="grid sm:grid-cols-3 gap-4 pt-6">
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">{basePrice}</div>
                    <div className="text-sm text-gray-600">Starting Price</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">Customized</div>
                    <div className="text-sm text-gray-600">Timeline</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">Expert</div>
                    <div className="text-sm text-gray-600">Strategy</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-6">
                  <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    Plan Your Taxes
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-3 rounded-full transition-all duration-300 hover:scale-105 bg-transparent"
                  >
                    Consult a Strategist
                  </Button>
                </div>
              </div>
            </FadeInSection>
            <FadeInSection className="hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-transparent rounded-full -translate-x-10 -translate-y-10"></div>
                <img
                  src="/images/tax-planning-hero.svg"
                  alt="Tax Planning Illustration"
                  className="relative rounded-lg shadow-2xl w-full h-auto"
                />
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* Objectives of Tax Planning Section */}
      <FadeInSection>
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto mb-16">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">Why is Tax Planning Essential?</h2>
              <p className="text-lg text-gray-600">
                Effective tax planning is a proactive approach to financial management that goes beyond just filing returns. It's about making smart, informed decisions throughout the year.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="text-center p-6 border-2 border-transparent hover:border-blue-200 hover:shadow-xl transition-all">
                <Target className="mx-auto h-12 w-12 text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Reduce Tax Liability</h3>
                <p className="text-gray-600">Legally minimize the amount of tax you pay by taking full advantage of all available deductions and exemptions.</p>
              </Card>
              <Card className="text-center p-6 border-2 border-transparent hover:border-blue-200 hover:shadow-xl transition-all">
                <TrendingUp className="mx-auto h-12 w-12 text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Boost Savings & Investments</h3>
                <p className="text-gray-600">Free up more of your income for savings, investments, and achieving your long-term financial goals.</p>
              </Card>
              <Card className="text-center p-6 border-2 border-transparent hover:border-blue-200 hover:shadow-xl transition-all">
                <Shield className="mx-auto h-12 w-12 text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Ensure Financial Stability</h3>
                <p className="text-gray-600">Gain better control over your finances, improve cash flow, and build a stable economic future with confidence.</p>
              </Card>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Tax Saving Instruments Section */}
      <FadeInSection>
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto mb-16">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">Popular Tax-Saving Strategies</h2>
              <p className="text-lg text-gray-600">
                We help you leverage a wide range of tax-saving instruments to build a robust financial portfolio.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="p-6 text-center"><CardTitle className="mb-4 text-blue-600">Section 80C</CardTitle><p className="text-gray-600">Investments in PPF, ELSS, Life Insurance, Home Loan Principal, etc. up to ₹1.5 Lakhs.</p></Card>
              <Card className="p-6 text-center"><CardTitle className="mb-4 text-blue-600">Section 80D</CardTitle><p className="text-gray-600">Deductions on health insurance premiums for self, family, and parents.</p></Card>
              <Card className="p-6 text-center"><CardTitle className="mb-4 text-blue-600">NPS Contribution</CardTitle><p className="text-gray-600">Additional deduction of ₹50,000 under Section 80CCD(1B) for NPS.</p></Card>
              <Card className="p-6 text-center"><CardTitle className="mb-4 text-blue-600">Home Loan Interest</CardTitle><p className="text-gray-600">Deduction up to ₹2 Lakhs on interest paid for a self-occupied property.</p></Card>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* For Individuals vs Businesses Section */}
      <FadeInSection>
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="space-y-6">
                <h3 className="text-3xl font-bold text-blue-800">For Individuals</h3>
                <p className="text-gray-600">We analyze your income, investments, and financial goals to create a personalized tax-saving plan. This includes salary restructuring, choosing the right investment mix, and maximizing deductions for HRA, LTA, and more.</p>
              </div>
              <div className="space-y-6">
                <h3 className="text-3xl font-bold text-blue-800">For Businesses</h3>
                <p className="text-gray-600">Our corporate tax planning services focus on optimizing your business structure, managing expenses, and leveraging deductions for depreciation, employee benefits, and other operational costs to enhance profitability.</p>
              </div>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* FAQ Section */}
      <FadeInSection>
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto mb-16">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">Tax Planning FAQs</h2>
              <p className="text-lg text-gray-600">
                Common questions about strategic tax planning.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {[
                {
                  question: "Is tax planning legal?",
                  answer: "Absolutely. Tax planning is the legal and ethical process of using the provisions of tax law to your advantage. It is different from tax evasion, which is illegal."
                },
                {
                  question: "When is the best time to start tax planning?",
                  answer: "The best time to start tax planning is at the beginning of the financial year (April 1st). This gives you ample time to make informed investment decisions rather than rushing at the last minute."
                },
                {
                  question: "Does tax planning only involve investments?",
                  answer: "No. While investments are a major part, tax planning also includes structuring your salary, timing your expenses, and choosing the right business structure to optimize your tax liability."
                },
                {
                  question: "Who needs tax planning?",
                  answer: "Everyone who earns a taxable income can benefit from tax planning, from salaried individuals to business owners. A well-structured plan helps maximize your take-home income."
                }
              ].map((faq, index) => (
                <FadeInSection key={index} delay={index * 100}>
                  <Card className="border-2 border-blue-100 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-gray-900 mb-3 text-lg">{faq.question}</h3>
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
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
        <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto space-y-8">
              <h2 className="text-4xl lg:text-5xl font-bold">Build a Smarter Financial Future</h2>
              <p className="text-xl text-blue-100 leading-relaxed">
                Stop leaving money on the table. Partner with our tax strategists to create a proactive plan that works for you all year round. Let's build your wealth, together.
              </p>
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  Create My Tax Plan
                  <PiggyBank className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg rounded-full transition-all duration-300 hover:scale-105 bg-transparent"
                >
                  Talk to a Strategist
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
