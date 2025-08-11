"use client"

import { EnhancedHeader } from '@/components/enhanced-header';
import { EnhancedFooter } from '@/components/enhanced-footer';
import { FadeInSection } from '@/components/fade-in-section';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, ArrowRight, Lightbulb, Target, BarChart, Users } from 'lucide-react';
import Link from 'next/link';

export default function BusinessStrategyPage() {
  const features = [
    { 
      title: "Market Analysis & Opportunity Identification", 
      description: "We conduct in-depth market research to identify emerging trends, customer needs, and untapped opportunities for growth.",
      icon: Lightbulb
    },
    { 
      title: "Competitive Landscape Assessment", 
      description: "Understand your competitors' strengths and weaknesses to carve out a unique and defensible market position.",
      icon: Target
    },
    { 
      title: "Strategic Planning & Goal Setting", 
      description: "We help you define a clear vision and set actionable, measurable goals (KPIs) that align with your long-term objectives.",
      icon: BarChart
    },
    { 
      title: "Business Model Innovation", 
      description: "Re-evaluate and innovate your business model to create new value propositions and revenue streams.",
      icon: Users
    }
  ];

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <EnhancedHeader />

      {/* Hero Section */}
      <FadeInSection>
        <section className="relative bg-gradient-to-br from-blue-50 via-white to-blue-100 py-20 md:py-32">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-gray-800 bg-clip-text text-transparent pb-4">Business Strategy Consulting</h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">Chart a Course for Sustainable Growth and Market Leadership</p>
          </div>
        </section>
      </FadeInSection>

      {/* Main Content */}
      <FadeInSection>
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-gray-900">Navigate Complexity, Achieve Clarity</h2>
                <p className="text-gray-600 leading-relaxed">
                  In today's dynamic marketplace, a clear and robust strategy is not just an advantage—it's a necessity. Our Business Strategy Consulting services are designed to help you cut through the noise, make informed decisions, and build a resilient framework for long-term success. We partner with you to analyze your current position, identify future opportunities, and create a detailed roadmap to guide your journey.
                </p>
                <Link href="/contact" passHref>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full text-lg">
                    Consult an Expert <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
              <div>
                <img src="/images/strategy-consulting.svg" alt="Business Strategy Illustration" className="w-full h-auto rounded-lg" />
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
              <h2 className="text-3xl font-bold text-gray-900">Our Strategic Approach</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">We provide a comprehensive framework to build and execute your strategy.</p>
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
