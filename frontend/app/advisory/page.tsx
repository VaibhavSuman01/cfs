"use client"

import { EnhancedHeader } from "@/components/enhanced-header";
import { EnhancedFooter } from "@/components/enhanced-footer";
import { FadeInSection } from "@/components/fade-in-section"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { getBasePrice } from "@/lib/pricing"
import { getServiceCardClasses, getServiceBackgroundColor, getServiceIconColor, getServicePriceColor, getServicePageHeroBackground } from "@/lib/service-colors"
import { 
  TrendingUp, 
  Users, 
  Target, 
  BarChart3, 
  Lightbulb, 
  Shield, 
  Briefcase, 
  Calculator,
  ArrowRight,
  CheckCircle,
  Star,
  Zap,
  Clock
} from "lucide-react"
export default function AdvisoryPage() {
  return (
    <div className="min-h-screen bg-white">
      <EnhancedHeader />
      {/* Hero Section */}
      <section className={`relative overflow-hidden ${getServicePageHeroBackground("Advisory")} py-20`}>
        <div className="container mx-auto px-4">
          <FadeInSection className="text-center space-y-8">
            <h1 className="text-5xl font-bold text-gray-900">Business Advisory Services</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Strategic business consulting and advisory services to help your business grow, optimize operations, and
              achieve long-term success.
            </p>
          </FadeInSection>
        </div>
      </section>

      {/* Advisory Services */}
      <FadeInSection>
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-4xl font-bold text-gray-900">Our Advisory Services</h2>
              <p className="text-xl text-gray-600">Expert guidance for every aspect of your business</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: TrendingUp,
                  title: "Business Strategy Consulting",
                  slug: "business-strategy-consulting",
                  description: "Develop comprehensive business strategies for growth and market expansion",
                  features: [
                    "Market analysis and research",
                    "Competitive positioning",
                    "Growth strategy development",
                    "Business model optimization",
                    "Performance metrics setup",
                  ],
                  price: "As per request",
                  timeline: "2-3 weeks",
                },
                {
                  icon: Shield,
                  title: "Legal & Compliance Advisory",
                  slug: "legal-compliance-advisory",
                  description: "Navigate complex legal requirements and ensure regulatory compliance",
                  features: [
                    "Regulatory compliance audit",
                    "Legal risk assessment",
                    "Contract review and drafting",
                    "Intellectual property strategy",
                    "Dispute resolution support",
                  ],
                  price: "As per request",
                  timeline: "1-2 weeks",
                },
                {
                  icon: Users,
                  title: "HR & Organizational Development",
                  slug: "hr-organizational-development",
                  description: "Build strong teams and optimize organizational structure",
                  features: [
                    "Organizational restructuring",
                    "HR policy development",
                    "Performance management systems",
                    "Employee engagement strategies",
                    "Leadership development",
                  ],
                  price: "As per request",
                  timeline: "2-4 weeks",
                },
                {
                  icon: Target,
                  title: "Financial Planning & Analysis",
                  slug: "financial-planning-analysis",
                  description: "Optimize financial performance and plan for sustainable growth",
                  features: [
                    "Financial health assessment",
                    "Cash flow optimization",
                    "Investment planning",
                    "Cost reduction strategies",
                    "Financial reporting systems",
                  ],
                  price: "As per request",
                  timeline: "1-3 weeks",
                },
                {
                  icon: Lightbulb,
                  title: "Digital Transformation",
                  slug: "digital-transformation",
                  description: "Modernize operations with technology and digital solutions",
                  features: [
                    "Technology assessment",
                    "Digital strategy roadmap",
                    "Process automation",
                    "System integration planning",
                    "Change management support",
                  ],
                  price: "As per request",
                  timeline: "3-4 weeks",
                },
                {
                  icon: Briefcase,
                  title: "Startup Mentoring",
                  slug: "startup-mentoring",
                  description: "Comprehensive guidance for startups from ideation to scaling with expert mentorship",
                  features: [
                    "Business plan development",
                    "Funding strategy and support",
                    "Market entry planning",
                    "Operational setup guidance",
                    "Investor pitch preparation",
                    "Growth and scaling strategies",
                  ],
                  price: "As per request",
                  timeline: "1-2 weeks",
                },
                {
                  icon: Calculator,
                  title: "Tax Plan Analysis",
                  slug: "tax-plan-analysis",
                  description: "Optimize your tax strategy and maximize savings with expert tax planning and analysis",
                  features: [
                    "Tax strategy development",
                    "Deduction optimization",
                    "Tax planning for businesses",
                    "Investment tax analysis",
                    "Compliance review",
                    "Tax saving recommendations",
                  ],
                  price: "As per request",
                  timeline: "1-2 weeks",
                },
                {
                  icon: BarChart3,
                  title: "Other Finance Related Services",
                  slug: "other-finance-related-services",
                  description: "Comprehensive financial services to support your business growth and financial success",
                  features: [
                    "Investment analysis and planning",
                    "Financial risk management",
                    "Budget planning and forecasting",
                    "Financial modeling",
                    "Cost analysis and optimization",
                    "Financial reporting and analysis",
                  ],
                  price: "As per request",
                  timeline: "2-3 weeks",
                },
              ].map((service, index) => (
                <FadeInSection key={index} delay={index * 100}>
                  <Card className={getServiceCardClasses('Advisory')}>
                    <CardHeader className="text-center">
                      <div className={getServiceBackgroundColor('Advisory')}>
                        <service.icon className={getServiceIconColor('Advisory')} />
                      </div>
                      <CardTitle className="text-xl text-gray-900">{service.title}</CardTitle>
                      <div className="space-y-2">
                        <div className={getServicePriceColor('Advisory')}>{service.price}</div>
                        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                          <Clock className="h-4 w-4" />
                          <span>{service.timeline}</span>
                        </div>
                      </div>
                      <CardDescription className="text-gray-600">{service.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        {service.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-blue-500" />
                            <span className="text-sm text-gray-600">{feature}</span>
                          </div>
                        ))}
                      </div>
                      <Link href={`/advisory/${service.slug}`} passHref>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3">
                          Book Service <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </FadeInSection>
              ))}
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Why Choose Our Advisory */}
      <FadeInSection>
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-4xl font-bold text-gray-900">Why Choose Our Advisory Services?</h2>
              <p className="text-xl text-gray-600">Experience the difference with our expert guidance</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: Star,
                  title: "Expert Team",
                  description: "Experienced consultants with industry expertise",
                },
                {
                  icon: Target,
                  title: "Customized Solutions",
                  description: "Tailored strategies for your specific business needs",
                },
                {
                  icon: Clock,
                  title: "Quick Turnaround",
                  description: "Fast delivery without compromising on quality",
                },
                {
                  icon: Shield,
                  title: "Confidential",
                  description: "Complete confidentiality and data protection",
                },
              ].map((benefit, index) => (
                <FadeInSection key={index} delay={index * 100}>
                  <Card className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
                    <CardContent className="p-6">
                      <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                        <benefit.icon className="h-8 w-8 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                      <p className="text-gray-600 text-sm">{benefit.description}</p>
                    </CardContent>
                  </Card>
                </FadeInSection>
              ))}
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Process */}
      <FadeInSection>
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-4xl font-bold text-gray-900">Our Advisory Process</h2>
              <p className="text-xl text-gray-600">Structured approach to deliver maximum value</p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  step: "01",
                  title: "Discovery",
                  description: "Understand your business, challenges, and objectives",
                  icon: Target,
                },
                {
                  step: "02",
                  title: "Analysis",
                  description: "Conduct thorough analysis and identify opportunities",
                  icon: TrendingUp,
                },
                {
                  step: "03",
                  title: "Strategy",
                  description: "Develop customized strategies and action plans",
                  icon: Lightbulb,
                },
                {
                  step: "04",
                  title: "Implementation",
                  description: "Support implementation and monitor progress",
                  icon: CheckCircle,
                },
              ].map((step, index) => (
                <FadeInSection key={index} delay={index * 150}>
                  <div className="text-center space-y-4">
                    <div className="mx-auto w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                      {step.step}
                    </div>
                    <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <step.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </FadeInSection>
              ))}
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Industries We Serve */}
      <FadeInSection>
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-4xl font-bold text-gray-900">Industries We Serve</h2>
              <p className="text-xl text-gray-600">Specialized expertise across various sectors</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                "Technology & Software",
                "Manufacturing",
                "Healthcare & Pharmaceuticals",
                "Financial Services",
                "Retail & E-commerce",
                "Real Estate",
                "Education",
                "Food & Beverage",
                "Professional Services",
              ].map((industry, index) => (
                <FadeInSection key={index} delay={index * 100}>
                  <Card className="text-center hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900">{industry}</h3>
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
        <section className="py-20 bg-blue-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <div className="space-y-8">
              <h2 className="text-4xl font-bold">Ready to Transform Your Business?</h2>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                Get expert advisory services tailored to your business needs and accelerate your growth
              </p>
              <div className="flex justify-center space-x-4">
                      <Link href={`/contact?service=${encodeURIComponent("Advisory")}&subService=${encodeURIComponent("Business Advisory Services")}`} passHref>
                  <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg">
                    Schedule Consultation
                  </Button>
                </Link>
                
              </div>
            </div>
          </div>
        </section>
      </FadeInSection>
      <EnhancedFooter />
    </div>
  )
}
