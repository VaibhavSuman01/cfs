"use client"

import { EnhancedHeader } from '@/components/enhanced-header';
import { EnhancedFooter } from '@/components/enhanced-footer';
import { FadeInSection } from '@/components/fade-in-section';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Calculator, ClipboardList, TrendingUp, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function FPAPage() {
  const features = [
    { 
      title: "Budgeting & Forecasting", 
      description: "Develop detailed budgets and accurate financial forecasts to guide your strategic decisions and resource allocation.",
      icon: ClipboardList
    },
    { 
      title: "Financial Modeling", 
      description: "Build dynamic financial models for scenario planning, investment analysis, and long-term strategic planning.",
      icon: Calculator
    },
    { 
      title: "Performance Analysis & Reporting", 
      description: "Gain deep insights into your financial performance with custom dashboards and variance analysis reports.",
      icon: PieChart
    },
    { 
      title: "Cash Flow Management", 
      description: "Optimize your working capital and ensure liquidity with robust cash flow forecasting and management strategies.",
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
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-gray-800 bg-clip-text text-transparent pb-4">Financial Planning & Analysis (FP&A)</h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">Drive Performance with Data-Driven Financial Insights</p>
          </div>
        </section>
      </FadeInSection>

      {/* Main Content */}
      <FadeInSection>
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-gray-900">From Financial Data to Strategic Decisions</h2>
                <p className="text-gray-600 leading-relaxed">
                  Effective Financial Planning & Analysis (FP&A) transforms raw financial data into a strategic asset. Our services provide you with the tools and expertise to improve budgeting, generate accurate forecasts, and conduct insightful analysis. We help you understand the story behind the numbers, enabling you to make smarter, data-driven decisions that enhance profitability and drive sustainable growth.
                </p>
                <Link href="/contact" passHref>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full text-lg">
                    Strengthen Your Finances <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
              <div>
                <img src="/images/financial-planning.svg" alt="Financial Planning Illustration" className="w-full h-auto rounded-lg" />
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
              <h2 className="text-3xl font-bold text-gray-900">Our FP&A Services</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">Actionable insights to optimize your financial health.</p>
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
