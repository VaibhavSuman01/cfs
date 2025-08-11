"use client"

import { EnhancedHeader } from "@/components/enhanced-header"
import { EnhancedFooter } from "@/components/enhanced-footer"
import { FadeInSection } from "@/components/fade-in-section"
import { AnimatedBackground } from "@/components/animated-background"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Award, Target, Heart, Shield, Zap, Globe, CheckCircle, Star } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <EnhancedHeader />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        <AnimatedBackground />

        <div className="container mx-auto px-4 py-20 relative z-10">
          <FadeInSection className="text-center space-y-8 max-w-4xl mx-auto">
            <h1 className="text-6xl lg:text-7xl font-bold">
              <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 bg-clip-text text-transparent">
                About
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 bg-clip-text text-transparent">
                Com Financial Services
              </span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              We are India's leading business registration and compliance platform, dedicated to making business
              formation simple, swift, and affordable for entrepreneurs across the country.
            </p>
          </FadeInSection>
        </div>
      </section>

      {/* Our Story */}
      <FadeInSection>
        <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
                  Our Story
                </h2>
                <div className="space-y-6 text-gray-600 leading-relaxed">
                  <p>
                    Founded with a vision to democratize business registration in India, Com Financial Services has been
                    at the forefront of simplifying complex legal processes for entrepreneurs and established businesses
                    alike.
                  </p>
                  <p>
                    What started as a small team of legal and business experts has grown into India's most trusted
                    platform for business registrations, serving over 10,000+ clients and processing business
                    registrations worth ₹50+ Crores.
                  </p>
                  <p>
                    Our commitment to excellence, transparency, and customer satisfaction has made us the preferred
                    choice for businesses ranging from startups to large enterprises.
                  </p>
                </div>
                <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-full">
                  Learn More About Our Services
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-200 rounded-3xl blur-3xl opacity-30"></div>
                <Card className="relative bg-white/80 backdrop-blur-sm border-2 border-blue-100 shadow-2xl">
                  <CardContent className="p-8">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600 mb-2">10K+</div>
                        <div className="text-gray-600">Happy Clients</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600 mb-2">₹50+ Cr</div>
                        <div className="text-gray-600">Business Value</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600 mb-2">99.9%</div>
                        <div className="text-gray-600">Success Rate</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600 mb-2">24 Hrs</div>
                        <div className="text-gray-600">Processing</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Our Mission & Vision */}
      <FadeInSection>
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12">
              <Card className="border-2 border-blue-100 hover:border-blue-300 transition-all duration-300 hover:shadow-xl">
                <CardContent className="p-8 text-center">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-6">
                    <Target className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
                  <p className="text-gray-600 leading-relaxed">
                    To empower entrepreneurs and businesses by providing simple, swift, and reasonably priced legal
                    services that enable them to focus on what they do best - building great businesses.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-blue-100 hover:border-blue-300 transition-all duration-300 hover:shadow-xl">
                <CardContent className="p-8 text-center">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-6">
                    <Globe className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
                  <p className="text-gray-600 leading-relaxed">
                    To become India's most trusted and comprehensive platform for business services, making business
                    formation and compliance accessible to every entrepreneur in the country.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Our Values */}
      <FadeInSection>
        <section className="py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-6 mb-16">
              <h2 className="text-4xl font-bold">Our Core Values</h2>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto">The principles that guide everything we do</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: Heart,
                  title: "Customer First",
                  description: "Every decision we make is centered around our customers' success and satisfaction.",
                },
                {
                  icon: Shield,
                  title: "Trust & Transparency",
                  description: "We believe in complete transparency in our processes, pricing, and communication.",
                },
                {
                  icon: Zap,
                  title: "Speed & Efficiency",
                  description: "We leverage technology to deliver fast, efficient, and accurate services.",
                },
                {
                  icon: Award,
                  title: "Excellence",
                  description: "We strive for excellence in every service we provide and every interaction we have.",
                },
              ].map((value, index) => (
                <FadeInSection key={index} delay={index * 100}>
                  <div className="text-center space-y-4 group">
                    <div className="mx-auto w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/20 transition-all duration-300 group-hover:scale-110">
                      <value.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold">{value.title}</h3>
                    <p className="text-blue-100 text-sm leading-relaxed">{value.description}</p>
                  </div>
                </FadeInSection>
              ))}
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Why Choose Us */}
      <FadeInSection>
        <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-6 mb-16">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
                Why Businesses Choose Us
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Discover what makes us different from other service providers
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Expert Team",
                  description: "Our team consists of qualified CAs, CSs, and legal experts with years of experience.",
                  icon: Users,
                },
                {
                  title: "Technology Driven",
                  description: "We use cutting-edge technology to streamline processes and ensure accuracy.",
                  icon: Zap,
                },
                {
                  title: "Transparent Pricing",
                  description: "No hidden costs. What you see is what you pay - simple and transparent.",
                  icon: CheckCircle,
                },
                {
                  title: "24/7 Support",
                  description: "Our customer support team is available round the clock to assist you.",
                  icon: Shield,
                },
                {
                  title: "Pan-India Presence",
                  description: "We serve clients across all states and union territories of India.",
                  icon: Globe,
                },
                {
                  title: "Proven Track Record",
                  description: "Over 10,000 successful registrations with 99.9% customer satisfaction rate.",
                  icon: Star,
                },
              ].map((feature, index) => (
                <FadeInSection key={index} delay={index * 100}>
                  <Card className="border-2 border-blue-100 hover:border-blue-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
                    <CardContent className="p-6 text-center">
                      <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mb-4 group-hover:from-blue-200 group-hover:to-blue-300 transition-colors">
                        <feature.icon className="h-8 w-8 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
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
            <div className="max-w-3xl mx-auto space-y-8">
              <h2 className="text-4xl font-bold">Ready to Start Your Business Journey?</h2>
              <p className="text-xl text-blue-100">
                Join thousands of entrepreneurs who trust Com Financial Services for their business needs.
              </p>
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg rounded-full">
                  Get Started Today
                </Button>
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg rounded-full bg-transparent"
                >
                  Contact Our Team
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
