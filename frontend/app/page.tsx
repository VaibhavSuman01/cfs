"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EnhancedHeader } from "@/components/enhanced-header";
import { EnhancedFooter } from "@/components/enhanced-footer";
import { FadeInSection } from "@/components/fade-in-section";
import { FloatingElements } from "@/components/floating-elements";
import { AnimatedBackground } from "@/components/animated-background";
import {
  Building2,
  FileText,
  Shield,
  Users,
  Phone,
  TrendingUp,
  Clock,
  Award,
  MessageCircle,
  BarChart3,
} from "lucide-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Link from "next/link";
export default function HomePage() {
  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <EnhancedHeader />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        <AnimatedBackground />
        <FloatingElements />

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <FadeInSection className="space-y-8">
              <div className="space-y-6">
                <Badge className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 hover:from-blue-200 hover:to-blue-300 animate-pulse border-0 px-4 py-2">
                  2.5k+ Business Registrations Processed
                </Badge>
                <h1 className="text-6xl lg:text-7xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 bg-clip-text text-transparent">
                    Professional Financial
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 bg-clip-text text-transparent animate-gradient">
                    Services
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                  Getting your business started with simple, swift and
                  reasonably priced legal services, online.
                </p>
                <div className="flex items-center space-x-2">
                  <div className="h-1 w-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
                  <p className="text-lg font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent tracking-wider">
                    REGISTRATIONS. FILINGS. COMPLIANCES.
                  </p>
                  <div className="h-1 w-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-1 gap-6 w-full max-w-4xl mx-auto">
                {/* Expert Assistance Card */}
                <Link href="/contact" className="h-full">
                  <Card className="h-full border-2 border-blue-100 hover:border-blue-300 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 cursor-pointer group bg-gradient-to-br from-white to-blue-50">
                    <CardContent className="h-full p-6 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="p-2 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
                            <Users className="h-6 w-6 text-blue-600 group-hover:scale-110 transition-transform" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            Expert Assistance
                          </h3>
                        </div>
                        <p className="text-gray-600 text-sm mb-6">
                          Registration in 24 hours with our expert team handling
                          all the paperwork and compliance.
                        </p>
                      </div>
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white group-hover:scale-[1.02] transition-all duration-300 shadow-md hover:shadow-lg">
                        Contact Us
                        <MessageCircle className="ml-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </FadeInSection>

            <FadeInSection delay={300} className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-200 rounded-3xl blur-3xl opacity-30 animate-pulse-slow"></div>
              <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-blue-100 hover:shadow-3xl transition-all duration-500 backdrop-blur-sm">
                <div className="space-y-6">
                  <DotLottieReact
                    src="https://lottie.host/b67209ae-9f0d-40fd-a5d5-f574778a9aa5/nIkbnsFhO9.lottie"
                    loop
                    autoplay
                  />
                </div>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* Services Navigation */}
      <FadeInSection>
        <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
                Our Services
              </h2>
              <p className="text-xl text-gray-600">
                Choose from our comprehensive range of business services
              </p>
            </div>

            <div className="grid md:grid-cols-6 gap-6">
              {[
                {
                  icon: Building2,
                  title: "Company Registration",
                  href: "/company-information",
                  description:
                    "Start your company with complete legal compliance",
                },
                {
                  icon: FileText,
                  title: "Other Registration",
                  href: "/other-registration",
                  description:
                    "LLP, Partnership, and other business structures",
                },
                {
                  icon: TrendingUp,
                  title: "Taxation",
                  href: "/taxation",
                  description: "GST, Income Tax, and tax planning services",
                },
                {
                  icon: Award,
                  title: "Trademark/ISO",
                  href: "/trademark-iso",
                  description:
                    "Protect your brand and get quality certification",
                },
                {
                  icon: Shield,
                  title: "ROC Returns",
                  href: "/roc-returns",
                  description: "Annual filings and company compliance",
                },
                {
                  icon: BarChart3,
                  title: "Reports",
                  href: "/reports",
                  description: "Business analytics and financial reports",
                },
              ].map((service, index) => (
                <FadeInSection key={index} delay={index * 100}>
                  <Link href={service.href} className="block">
                    <Card className="text-center hover:shadow-2xl transition-all duration-500 hover:-translate-y-4 cursor-pointer group border-2 border-transparent hover:border-blue-200 bg-gradient-to-br from-white to-blue-50/50">
                      <CardContent className="p-8">
                        <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mb-6 group-hover:from-blue-200 group-hover:to-blue-300 transition-all duration-300 group-hover:scale-110">
                          <service.icon className="h-10 w-10 text-blue-600 group-hover:scale-110 transition-transform" />
                        </div>
                        <h3 className="font-bold text-gray-900 text-lg mb-3">
                          {service.title}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {service.description}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                </FadeInSection>
              ))}
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Why Choose Us */}
      <FadeInSection>
        <section className="py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-black relative overflow-hidden">
          <AnimatedBackground />

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center space-y-6 mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold">
                Why Choose Com Financial Services?
              </h2>
              <p className="text-xl text-black-100 max-w-3xl mx-auto font-light">
                India's trusted business registration partner with proven
                expertise and unmatched service quality
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Clock,
                  title: "Lightning Fast Processing",
                  description:
                    "Get your business registered in as little as 24 hours with our streamlined digital process.",
                },
                {
                  icon: Shield,
                  title: "100% Secure & Compliant",
                  description:
                    "Your documents and data are completely secure with our encrypted systems and full legal compliance.",
                },
                {
                  icon: Award,
                  title: "Expert Support Team",
                  description:
                    "Dedicated relationship manager and expert guidance throughout your business journey.",
                },
              ].map((feature, index) => (
                <FadeInSection key={index} delay={index * 200}>
                  <div className="text-center space-y-6 group">
                    <div className="mx-auto w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 group-hover:scale-110">
                      <feature.icon className="h-10 w-10 text-blue-600 group-hover:scale-110 transition-transform" />
                    </div>
                    <h3 className="text-2xl font-semibold">{feature.title}</h3>
                    <p className="text-black-100 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </FadeInSection>
              ))}
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* CTA Section */}
      <FadeInSection>
        <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto space-y-8">
              <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
                Ready to Start Your Business Journey?
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Join thousands of entrepreneurs who have successfully registered
                their companies with us. Get started today and turn your
                business dreams into reality.
              </p>
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Link href="/contact" passHref>
                  <Button className="border-2 border-blue-600 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white hover:text-white px-20 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    Talk to Expert
                    <Phone className="ml-2 h-5 w-5" />
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
