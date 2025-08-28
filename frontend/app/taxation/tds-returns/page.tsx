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
  CalendarDays,
  Phone,
  FileText,
  Landmark,
  Users,
  AlertTriangle
} from "lucide-react"

export default function TdsReturnsPage() {
  const basePrice = getBasePrice("tds returns (per qtr)") ?? "₹2,499";
  
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
                  Stay Compliant, Avoid Penalties
                </Badge>
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 bg-clip-text text-transparent">
                    TDS Return Filing
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 bg-clip-text text-transparent">
                    Accurate & On-Time
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Ensure timely and accurate filing of your quarterly TDS returns. Our experts handle everything from data compilation to uploading, keeping you compliant with all regulations.
                </p>

                <div className="grid sm:grid-cols-3 gap-4 pt-6">
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">{basePrice}</div>
                    <div className="text-sm text-gray-600">Per Quarter</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">Quarterly</div>
                    <div className="text-sm text-gray-600">Filing</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">Expert</div>
                    <div className="text-sm text-gray-600">Assistance</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    File TDS Return
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-3 rounded-full transition-all duration-300 hover:scale-105 bg-transparent"
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
                  src="/images/tds-hero.svg"
                  alt="TDS Return Filing Illustration"
                  className="relative rounded-lg shadow-2xl w-full h-auto"
                />
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* What is TDS Section */}
      <FadeInSection>
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto mb-16">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">What is TDS Return Filing?</h2>
              <p className="text-lg text-gray-600">
                A TDS (Tax Deducted at Source) return is a quarterly statement submitted to the Income Tax Department. It summarizes all TDS-related transactions, including the amount of tax deducted and deposited with the government. Filing is mandatory for all entities that have deducted tax.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="text-center p-6 border-2 border-transparent hover:border-blue-200 hover:shadow-xl transition-all">
                <Users className="mx-auto h-12 w-12 text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Who Should File?</h3>
                <p className="text-gray-600">Any person or entity with a TAN who has deducted tax on payments like salary, rent, commission, or professional fees.</p>
              </Card>
              <Card className="text-center p-6 border-2 border-transparent hover:border-blue-200 hover:shadow-xl transition-all">
                <CalendarDays className="mx-auto h-12 w-12 text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Quarterly Compliance</h3>
                <p className="text-gray-600">TDS returns must be filed every quarter, with specific due dates for each period to ensure timely reporting.</p>
              </Card>
              <Card className="text-center p-6 border-2 border-transparent hover:border-blue-200 hover:shadow-xl transition-all">
                <AlertTriangle className="mx-auto h-12 w-12 text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Avoid Heavy Penalties</h3>
                <p className="text-gray-600">Non-filing or late filing of TDS returns attracts significant penalties and interest from the tax department.</p>
              </Card>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Pricing Packages Section */}
      <FadeInSection>
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto mb-16">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">Choose Your TDS Filing Package</h2>
              <p className="text-lg text-gray-600">
                Select the package that best fits your TDS compliance needs
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <Card className="border-2 border-blue-200 hover:border-blue-400 hover:shadow-xl transition-all duration-300">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl font-bold text-blue-600">Basic</CardTitle>
                  <div className="text-4xl font-bold text-gray-900">₹2,499</div>
                  <p className="text-sm text-gray-600">Per Quarter</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3 text-left">
                    <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" /><span>Quarterly TDS Filing</span></li>
                    <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" /><span>Basic Documentation</span></li>
                    <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" /><span>Form Submission</span></li>
                  </ul>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">Choose Basic</Button>
                </CardContent>
              </Card>

              <Card className="border-2 border-blue-400 hover:border-blue-600 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl font-bold text-blue-600">Standard</CardTitle>
                  <div className="text-4xl font-bold text-gray-900">₹4,999</div>
                  <p className="text-sm text-gray-600">Most Popular</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3 text-left">
                    <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" /><span>Everything in Basic</span></li>
                    <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" /><span>Priority Processing</span></li>
                    <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" /><span>Expert Consultation</span></li>
                    <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" /><span>Error Resolution</span></li>
                  </ul>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">Choose Standard</Button>
                </CardContent>
              </Card>

              <Card className="border-2 border-blue-200 hover:border-blue-400 hover:shadow-xl transition-all duration-300">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl font-bold text-blue-600">Premium</CardTitle>
                  <div className="text-4xl font-bold text-gray-900">₹6,999</div>
                  <p className="text-sm text-gray-600">Complete Solution</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3 text-left">
                    <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" /><span>Everything in Standard</span></li>
                    <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" /><span>Annual TDS Summary</span></li>
                    <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" /><span>Compliance Monitoring</span></li>
                    <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" /><span>1 Year Support</span></li>
                  </ul>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">Choose Premium</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* TDS Return Forms Section */}
      <FadeInSection>
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto mb-16">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">Types of TDS Return Forms</h2>
              <p className="text-lg text-gray-600">
                Different forms are used for filing TDS returns based on the nature of the payment.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="p-6 text-center"><CardTitle className="mb-4 text-blue-600">Form 24Q</CardTitle><p className="text-gray-600">For TDS deducted on salary payments to employees.</p></Card>
              <Card className="p-6 text-center"><CardTitle className="mb-4 text-blue-600">Form 26Q</CardTitle><p className="text-gray-600">For TDS on payments other than salary (e.g., rent, interest, professional fees).</p></Card>
              <Card className="p-6 text-center"><CardTitle className="mb-4 text-blue-600">Form 27Q</CardTitle><p className="text-gray-600">For TDS on payments made to non-residents (other than salary).</p></Card>
              <Card className="p-6 text-center"><CardTitle className="mb-4 text-blue-600">Form 27EQ</CardTitle><p className="text-gray-600">For Tax Collected at Source (TCS) by sellers of specified goods.</p></Card>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Due Dates Section */}
      <FadeInSection>
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto mb-16">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">Quarterly Filing Due Dates</h2>
              <p className="text-lg text-gray-600">
                Adhering to these deadlines is crucial for TDS compliance.
              </p>
            </div>
            <div className="max-w-3xl mx-auto">
              <Card className="p-6 shadow-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div className="font-semibold text-lg text-blue-700">Quarter Ending</div>
                  <div className="font-semibold text-lg text-blue-700">Due Date for Filing</div>
                  <div className="border-t pt-4">April - June</div>
                  <div className="border-t pt-4">July 31st</div>
                  <div className="border-t pt-4">July - September</div>
                  <div className="border-t pt-4">October 31st</div>
                  <div className="border-t pt-4">October - December</div>
                  <div className="border-t pt-4">January 31st</div>
                  <div className="border-t pt-4">January - March</div>
                  <div className="border-t pt-4">May 31st</div>
                </div>
              </Card>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* FAQ Section */}
      <FadeInSection>
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto mb-16">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">TDS Return FAQs</h2>
              <p className="text-lg text-gray-600">
                Common questions about filing TDS returns.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {[
                {
                  question: "What is a TAN and is it mandatory for TDS returns?",
                  answer: "TAN (Tax Deduction and Collection Account Number) is a 10-digit alphanumeric number required for anyone responsible for deducting or collecting tax. It is mandatory to have a TAN to file TDS returns."
                },
                {
                  question: "What is the penalty for late filing of TDS returns?",
                  answer: "A late filing fee of ₹200 per day is levied under Section 234E until the fee equals the amount of TDS. A separate penalty can also be levied by the Assessing Officer."
                },
                {
                  question: "Can I file a TDS return if I haven't deducted any tax?",
                  answer: "If you are liable to deduct TDS but fail to do so, you are still required to file a return. A nil return can be filed if no tax was deductible during the quarter."
                },
                {
                  question: "What is a revised TDS return?",
                  answer: "If you discover any error or omission after filing the original TDS return, you can file a revised return to correct the mistake. There is no time limit for filing a revised return."
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
              <h2 className="text-4xl lg:text-5xl font-bold">Effortless TDS Compliance is Here</h2>
              <p className="text-xl text-blue-100 leading-relaxed">
                Don't let TDS filing be a burden. Our experts will handle the entire process for you, ensuring accuracy, timeliness, and complete peace of mind. Get started today!
              </p>
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  File My TDS Return
                  <FileSpreadsheet className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg rounded-full transition-all duration-300 hover:scale-105 bg-transparent"
                >
                  Speak to Our Experts
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
