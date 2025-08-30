"use client";

import { EnhancedHeader } from '@/components/enhanced-header';
import { EnhancedFooter } from '@/components/enhanced-footer';
import { FadeInSection } from '@/components/fade-in-section';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getBasePrice } from '@/lib/pricing';
import Link from 'next/link';
import {
  FileText,
  CheckCircle,
  ArrowRight,
  TrendingUp,
  Shield,
  Users,
  CreditCard,
  Zap
} from 'lucide-react';

export default function TanApplyPage() {
  const basePrice = getBasePrice("pan/tan card apply") ?? "₹499";

  return (
    <div className="min-h-screen bg-white">
      <EnhancedHeader />

      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center pt-20">
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <FadeInSection className="space-y-8">
              <div className="space-y-6">
                <Badge className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 hover:from-blue-200 hover:to-blue-300 animate-pulse border-0 px-4 py-2">
                  Tax Compliance
                </Badge>
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 bg-clip-text text-transparent">
                    TAN Application
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 bg-clip-text text-transparent">
                    & Registration
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  A prerequisite for deducting or collecting tax at source (TDS/TCS). TAN is mandatory for all persons responsible for tax deduction and collection.
                </p>

                <div className="grid sm:grid-cols-3 gap-4 pt-6">
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">{basePrice}</div>
                    <div className="text-sm text-gray-600">Starting Price</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">3-5 Days</div>
                    <div className="text-sm text-gray-600">Processing Time</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">Mandatory</div>
                    <div className="text-sm text-gray-600">for TDS/TCS</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <Link href={`/dashboard/other-registration-form?service=${encodeURIComponent('TAN Apply')}`} passHref>
                    <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                      Apply for TAN
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href={`/dashboard/other-registration-form?service=${encodeURIComponent('TAN Apply')}`} passHref>
                    <Button
                      variant="outline"
                      className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-3 rounded-full transition-all duration-300 hover:scale-105 bg-transparent"
                    >
                      Consult an Expert
                    </Button>
                  </Link>
                </div>
              </div>
            </FadeInSection>
            <FadeInSection className="hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-transparent rounded-full -translate-x-10 -translate-y-10"></div>
                <div className="relative rounded-lg shadow-2xl w-full h-80 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                  <FileText className="h-32 w-32 text-blue-600" />
                </div>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* What is TAN Section */}
      <FadeInSection>
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto mb-16">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">What is TAN?</h2>
              <p className="text-lg text-gray-600">
                Tax Deduction and Collection Account Number (TAN) is a 10-digit alphanumeric number required for tax compliance
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="text-center p-6 border-2 border-transparent hover:border-blue-200 hover:shadow-xl transition-all">
                <FileText className="mx-auto h-12 w-12 text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">10-Digit Number</h3>
                <p className="text-gray-600">Unique alphanumeric identifier for tax deduction and collection purposes.</p>
              </Card>
              <Card className="text-center p-6 border-2 border-transparent hover:border-blue-200 hover:shadow-xl transition-all">
                <Shield className="mx-auto h-12 w-12 text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Mandatory Requirement</h3>
                <p className="text-gray-600">Required for all persons responsible for deducting or collecting tax.</p>
              </Card>
              <Card className="text-center p-6 border-2 border-transparent hover:border-blue-200 hover:shadow-xl transition-all">
                <CreditCard className="mx-auto h-12 w-12 text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Tax Compliance</h3>
                <p className="text-gray-600">Must be quoted in all TDS/TCS returns and communications.</p>
              </Card>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Process Section */}
      <FadeInSection>
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto mb-16">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">Application Process</h2>
              <p className="text-lg text-gray-600">
                Simple steps to get your TAN number quickly and efficiently
              </p>
            </div>
            <div className="relative">
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5"></div>
              <div className="grid md:grid-cols-4 gap-16 relative">
                <div className="text-center space-y-4">
                  <div className="relative inline-block"><div className="w-20 h-20 mx-auto bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl font-bold">1</div></div>
                  <h3 className="text-xl font-semibold">Documentation</h3>
                  <p className="text-gray-600">Prepare required documents including PAN card and address proof.</p>
                </div>
                <div className="text-center space-y-4">
                  <div className="relative inline-block"><div className="w-20 h-20 mx-auto bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl font-bold">2</div></div>
                  <h3 className="text-xl font-semibold">Form Filling</h3>
                  <p className="text-gray-600">Complete Form 49B with accurate business and personal details.</p>
                </div>
                <div className="text-center space-y-4">
                  <div className="relative inline-block"><div className="w-20 h-20 mx-auto bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl font-bold">3</div></div>
                  <h3 className="text-xl font-semibold">Submission</h3>
                  <p className="text-gray-600">Submit the application online or at TIN-FC centers.</p>
                </div>
                <div className="text-center space-y-4">
                  <div className="relative inline-block"><div className="w-20 h-20 mx-auto bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl font-bold">4</div></div>
                  <h3 className="text-xl font-semibold">Approval</h3>
                  <p className="text-gray-600">Receive your TAN number within 3-5 working days.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* CTA Section */}
      <FadeInSection>
        <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto space-y-8">
              <h2 className="text-4xl lg:text-5xl font-bold">Need Your TAN Number?</h2>
              <p className="text-xl text-blue-100 leading-relaxed">
                Don't let tax compliance delays hold you back. Get your TAN number quickly and start your business operations without any hassles.
              </p>
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Link href={`/dashboard/other-registration-form?service=${encodeURIComponent('TAN Apply')}`} passHref>
                  <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    Apply Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href={`/dashboard/other-registration-form?service=${encodeURIComponent('TAN Apply')}`} passHref>
                  <Button
                    variant="outline"
                    className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg rounded-full transition-all duration-300 hover:scale-105 bg-transparent"
                  >
                    Apply Now
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
