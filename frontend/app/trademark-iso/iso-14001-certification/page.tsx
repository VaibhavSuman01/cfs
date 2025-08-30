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
  Award,
  TrendingUp,
  Users,
  FileCheck2,
  ClipboardList,
  CheckSquare,
  Search,
  ArrowRight,
  Phone,
  Leaf
} from 'lucide-react';

export default function Iso14001Page() {
  const basePrice = getBasePrice("iso 14001 certification") ?? "As per request";

  return (
    <div className="min-h-screen bg-white">
      <EnhancedHeader />

      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center pt-20">
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <FadeInSection className="space-y-8">
              <div className="space-y-6">
                <Badge className="bg-gradient-to-r from-green-100 to-green-200 text-green-800 hover:from-green-200 hover:to-green-300 animate-pulse border-0 px-4 py-2">
                  Environmental Management Standard
                </Badge>
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-gray-900 via-green-600 to-gray-900 bg-clip-text text-transparent">
                    ISO 14001 Certification
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-green-500 via-green-400 to-green-600 bg-clip-text text-transparent">
                    Environmental Excellence
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  ISO 14001 is the international standard for an effective environmental management system (EMS). It provides a framework that an organization can follow, rather than establishing environmental performance requirements. Certification helps organizations improve their environmental performance through more efficient use of resources and reduction of waste.
                </p>

                <div className="grid sm:grid-cols-3 gap-4 pt-6">
                  <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                    <div className="text-2xl font-bold text-green-600">{basePrice}</div>
                    <div className="text-sm text-gray-600">Starting Price</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                    <div className="text-2xl font-bold text-green-600">3-6 Months</div>
                    <div className="text-sm text-gray-600">Processing Time</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                    <div className="text-2xl font-bold text-green-600">Globally</div>
                    <div className="text-sm text-gray-600">Recognized</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <Link href={`/dashboard/trademark-iso-form?service=${encodeURIComponent('ISO 14001')}`} passHref>
                    <Button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                      Get Certified
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href={`/dashboard/trademark-iso-form?service=${encodeURIComponent('ISO 14001')}`} passHref>
                    <Button
                      variant="outline"
                      className="border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-8 py-3 rounded-full transition-all duration-300 hover:scale-105 bg-transparent"
                    >
                      Consult an Expert
                    </Button>
                  </Link>
                </div>
              </div>
            </FadeInSection>
            <FadeInSection className="hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-green-100 to-transparent rounded-full -translate-x-10 -translate-y-10"></div>
                <div className="relative rounded-lg shadow-2xl w-full h-80 bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
                  <Leaf className="h-32 w-32 text-green-600" />
                </div>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* What is ISO 14001 Section */}
      <FadeInSection>
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto mb-16">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-green-600 bg-clip-text text-transparent">What is ISO 14001?</h2>
              <p className="text-lg text-gray-600">
                The international standard for environmental management systems
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="text-center p-6 border-2 border-transparent hover:border-green-200 hover:shadow-xl transition-all">
                <Leaf className="mx-auto h-12 w-12 text-green-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Environmental Focus</h3>
                <p className="text-gray-600">Systematic approach to managing environmental aspects and impacts.</p>
              </Card>
              <Card className="text-center p-6 border-2 border-transparent hover:border-green-200 hover:shadow-xl transition-all">
                <Award className="mx-auto h-12 w-12 text-green-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">International Standard</h3>
                <p className="text-gray-600">Globally recognized framework for environmental management.</p>
              </Card>
              <Card className="text-center p-6 border-2 border-transparent hover:border-green-200 hover:shadow-xl transition-all">
                <TrendingUp className="mx-auto h-12 w-12 text-green-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Continuous Improvement</h3>
                <p className="text-gray-600">Ongoing enhancement of environmental performance.</p>
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
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-green-600 bg-clip-text text-transparent">ISO 14001 Certification Process</h2>
              <p className="text-lg text-gray-600">
                Our systematic approach to environmental management certification
              </p>
            </div>
            <div className="relative">
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-green-200"></div>
              <div className="grid md:grid-cols-4 gap-16 relative">
                <div className="text-center space-y-4">
                  <div className="relative inline-block"><div className="w-20 h-20 mx-auto bg-green-500 text-white rounded-full flex items-center justify-center text-2xl font-bold">1</div></div>
                  <h3 className="text-xl font-semibold">Gap Analysis</h3>
                  <p className="text-gray-600">Assess current environmental practices against ISO 14001 requirements.</p>
                </div>
                <div className="text-center space-y-4">
                  <div className="relative inline-block"><div className="w-20 h-20 mx-auto bg-green-500 text-white rounded-full flex items-center justify-center text-2xl font-bold">2</div></div>
                  <h3 className="text-xl font-semibold">System Development</h3>
                  <p className="text-gray-600">Develop and implement environmental management system.</p>
                </div>
                <div className="text-center space-y-4">
                  <div className="relative inline-block"><div className="w-20 h-20 mx-auto bg-green-500 text-white rounded-full flex items-center justify-center text-2xl font-bold">3</div></div>
                  <h3 className="text-xl font-semibold">Internal Audit</h3>
                  <p className="text-gray-600">Conduct internal audits to ensure system effectiveness.</p>
                </div>
                <div className="text-center space-y-4">
                  <div className="relative inline-block"><div className="w-20 h-20 mx-auto bg-green-500 text-white rounded-full flex items-center justify-center text-2xl font-bold">4</div></div>
                  <h3 className="text-xl font-semibold">Certification</h3>
                  <p className="text-gray-600">External audit and certification by accredited body.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* CTA Section */}
      <FadeInSection>
        <section className="py-20 bg-gradient-to-r from-green-600 to-green-800 text-white">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto space-y-8">
              <h2 className="text-4xl lg:text-5xl font-bold">Ready to Go Green?</h2>
              <p className="text-xl text-green-100 leading-relaxed">
                Demonstrate your commitment to environmental responsibility with ISO 14001 certification. Join the global movement towards sustainable business practices.
              </p>
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Link href={`/dashboard/trademark-iso-form?service=${encodeURIComponent('ISO 14001')}`} passHref>
                  <Button className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    Start Certification
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href={`/dashboard/trademark-iso-form?service=${encodeURIComponent('ISO 14001')}`} passHref>
                  <Button
                    variant="outline"
                    className="border-2 border-white text-white hover:bg-white hover:text-green-600 px-8 py-4 text-lg rounded-full transition-all duration-300 hover:scale-105 bg-transparent"
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
