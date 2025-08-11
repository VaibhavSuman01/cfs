"use client"

import { EnhancedHeader } from '@/components/enhanced-header';
import { EnhancedFooter } from '@/components/enhanced-footer';
import { FadeInSection } from '@/components/fade-in-section';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, FileText, Landmark, TrendingUp, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function LegalCompliancePage() {
  const features = [
    { 
      title: "Regulatory Compliance", 
      description: "We help you understand and adhere to all relevant laws, regulations, and industry standards to prevent costly penalties.",
      icon: ShieldCheck
    },
    { 
      title: "Contract Drafting & Review", 
      description: "Protect your interests with professionally drafted and reviewed business contracts, agreements, and policies.",
      icon: FileText
    },
    { 
      title: "Corporate Governance", 
      description: "Establish robust governance frameworks to ensure accountability, fairness, and transparency in your operations.",
      icon: Landmark
    },
    { 
      title: "Risk Management & Mitigation", 
      description: "Proactively identify potential legal and compliance risks and implement effective strategies to mitigate them.",
      icon: TrendingUp
    }
  ];

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <EnhancedHeader />

      {/* Hero Section */}
      <FadeInSection>
        <section className="relative bg-gradient-to-br from-blue-50 via-white to-blue-100 py-20 md:py-32">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-gray-800 bg-clip-text text-transparent pb-4">Legal & Compliance Advisory</h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">Safeguarding Your Business, Ensuring Full Compliance</p>
          </div>
        </section>
      </FadeInSection>

      {/* Main Content */}
      <FadeInSection>
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-gray-900">Navigate the Regulatory Maze with Confidence</h2>
                <p className="text-gray-600 leading-relaxed">
                  In a complex and ever-changing regulatory landscape, staying compliant is critical to mitigating risk and building a trustworthy brand. Our advisory services provide comprehensive legal and compliance support, helping you navigate complex regulations, manage contracts, and establish strong corporate governance with confidence and peace of mind.
                </p>
                <Link href="/contact" passHref>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full text-lg">
                    Get Legal Advice <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
              <div>
                <img src="/images/legal-advisory.svg" alt="Legal & Compliance Illustration" className="w-full h-auto rounded-lg" />
              </div>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Features Section */}
      <FadeInSection>
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl font-bold text-gray-900">Our Core Legal Services</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">Comprehensive support to protect and empower your business.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="text-center p-6 border-2 border-transparent hover:border-blue-500 hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <div className="mx-auto w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                      <feature.icon className="w-8 h-8" />
                    </div>
                    <CardTitle className="text-xl font-semibold text-gray-900">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </FadeInSection>

      <EnhancedFooter />
    </div>
  );
}
