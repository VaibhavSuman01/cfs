"use client"

import { EnhancedHeader } from '@/components/enhanced-header';
import { EnhancedFooter } from '@/components/enhanced-footer';
import { FadeInSection } from '@/components/fade-in-section';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Rocket, Lightbulb, Network, DollarSign, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function StartupMentoringPage() {
  const features = [
    { 
      title: "Idea Validation & Business Modeling", 
      description: "Refine your business idea, validate your market assumptions, and build a robust and scalable business model.",
      icon: Lightbulb
    },
    { 
      title: "Go-to-Market Strategy", 
      description: "Develop a powerful launch plan to effectively reach your target audience and gain early traction.",
      icon: Rocket
    },
    { 
      title: "Fundraising Guidance", 
      description: "Navigate the complexities of fundraising, from perfecting your pitch deck to connecting with potential investors.",
      icon: DollarSign
    },
    { 
      title: "Networking & Connections", 
      description: "Leverage our network of industry experts, investors, and partners to accelerate your growth.",
      icon: Network
    }
  ];

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <EnhancedHeader />

      {/* Hero Section */}
      <FadeInSection>
        <section className="relative bg-gradient-to-br from-blue-50 via-white to-blue-100 py-20 md:py-32">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-gray-800 bg-clip-text text-transparent pb-4">Startup Mentoring</h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">Guidance for Founders, By Founders</p>
          </div>
        </section>
      </FadeInSection>

      {/* Main Content */}
      <FadeInSection>
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-gray-900">Turn Your Vision into a Thriving Business</h2>
                <p className="text-gray-600 leading-relaxed">
                  The startup journey is challenging, but you don't have to navigate it alone. Our mentoring program provides aspiring and early-stage entrepreneurs with the guidance, resources, and support needed to overcome obstacles and accelerate growth. We connect you with experienced mentors who have been in your shoes and can offer practical advice to help you succeed.
                </p>
                <Link href="/contact" passHref>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full text-lg">
                    Find a Mentor <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
              <div>
                <img src="/images/startup-mentoring.svg" alt="Startup Mentoring Illustration" className="w-full h-auto rounded-lg" />
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
              <h2 className="text-3xl font-bold text-gray-900">How We Support You</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">Actionable guidance at every stage of your startup journey.</p>
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
