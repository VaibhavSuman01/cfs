"use client";

import { EnhancedHeader } from "@/components/enhanced-header";
import { EnhancedFooter } from "@/components/enhanced-footer";
import { FadeInSection } from "@/components/fade-in-section";
import { AnimatedBackground } from "@/components/animated-background";
import { FloatingElements } from "@/components/floating-elements";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getBasePrice } from "@/lib/pricing";
import {
  ArrowRight,
  Phone,
  Users,
  FileCheck,
  PiggyBank,
  ShieldCheck,
  CheckCircle,
} from "lucide-react";

export default function PayrollTaxPage() {
  const basePrice = getBasePrice("payroll tax (per month)") ?? "₹3,999";

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
                  Efficient & Compliant
                </Badge>
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 bg-clip-text text-transparent">
                    Payroll Tax Management
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 bg-clip-text text-transparent">
                    Seamless & Reliable
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Simplify your payroll tax obligations, from TDS and PF to ESI.
                  Our comprehensive service ensures accuracy, timeliness, and
                  full statutory compliance for your business.
                </p>

                <div className="grid sm:grid-cols-3 gap-4 pt-6">
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">
                      {basePrice}
                    </div>
                    <div className="text-sm text-gray-600">Starting Price</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">
                      Monthly
                    </div>
                    <div className="text-sm text-gray-600">Processing</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">Full</div>
                    <div className="text-sm text-gray-600">Compliance</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-6">
                  <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    Streamline Payroll
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
                  src="/images/payroll-hero.png"
                  alt="Payroll Tax Management Illustration"
                  className="relative rounded-lg w-full h-auto"
                />
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* Key Services Section */}
      <FadeInSection>
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto mb-16">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">
                Our Payroll Tax Services
              </h2>
              <p className="text-lg text-gray-600">
                We offer a complete suite of services to manage your payroll
                compliance effectively.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="text-center p-6 border-2 border-transparent hover:border-blue-200 hover:shadow-xl transition-all">
                <PiggyBank className="mx-auto h-12 w-12 text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">TDS on Salary</h3>
                <p className="text-gray-600">
                  Accurate calculation and deduction of Tax Deducted at Source
                  (TDS) for all employees and timely filing of returns.
                </p>
              </Card>
              <Card className="text-center p-6 border-2 border-transparent hover:border-blue-200 hover:shadow-xl transition-all">
                <ShieldCheck className="mx-auto h-12 w-12 text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  PF & ESI Compliance
                </h3>
                <p className="text-gray-600">
                  Managing Provident Fund (PF) and Employee State Insurance
                  (ESI) contributions, deposits, and return filings.
                </p>
              </Card>
              <Card className="text-center p-6 border-2 border-transparent hover:border-blue-200 hover:shadow-xl transition-all">
                <FileCheck className="mx-auto h-12 w-12 text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Form 16 Issuance</h3>
                <p className="text-gray-600">
                  Timely generation and issuance of Form 16 to all your
                  employees at the end of the financial year.
                </p>
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
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">
                Choose Your Payroll Package
              </h2>
              <p className="text-lg text-gray-600">
                Select the package that best fits your payroll management needs
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <Card className="border-2 border-blue-200 hover:border-blue-400 hover:shadow-xl transition-all duration-300">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl font-bold text-blue-600">
                    Basic
                  </CardTitle>
                  <div className="text-4xl font-bold text-gray-900">
                    ₹9,999*
                  </div>
                  <p className="text-sm text-gray-600">Per Month</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3 text-left">
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
                      <span>Monthly Payroll Processing</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
                      <span>TDS Calculation</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
                      <span>Basic Compliance</span>
                    </li>
                  </ul>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Choose Basic
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-2 border-blue-400 hover:border-blue-600 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl font-bold text-blue-600">
                    Standard
                  </CardTitle>
                  <div className="text-4xl font-bold text-gray-900">
                    ₹14,999*
                  </div>
                  <p className="text-sm text-gray-600">Most Popular</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3 text-left">
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
                      <span>Everything in Basic</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
                      <span>PF & ESI Management</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
                      <span>Form 16 Generation</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
                      <span>Priority Support</span>
                    </li>
                  </ul>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Choose Standard
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-2 border-blue-200 hover:border-blue-400 hover:shadow-xl transition-all duration-300">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl font-bold text-blue-600">
                    Premium
                  </CardTitle>
                  <div className="text-4xl font-bold text-gray-900">
                    ₹24,999
                  </div>
                  <p className="text-sm text-gray-600">Complete Solution</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3 text-left">
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
                      <span>Everything in Standard</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
                      <span>Advanced Analytics</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
                      <span>Custom Reports</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
                      <span>Dedicated Manager</span>
                    </li>
                  </ul>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Choose Premium
                  </Button>
                </CardContent>
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
              <h2 className="text-4xl lg:text-5xl font-bold">
                Focus on Your Team, Not on Paperwork
              </h2>
              <p className="text-xl text-blue-100 leading-relaxed">
                Delegate your payroll tax complexities to us. We ensure your
                payroll is accurate, compliant, and hassle-free, giving you more
                time to focus on your people and your business.
              </p>
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  Get Started Today
                  <Users className="ml-2 h-5 w-5" />
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
  );
}
