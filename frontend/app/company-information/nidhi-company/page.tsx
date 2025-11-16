"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { EnhancedHeader } from "@/components/enhanced-header";
import { EnhancedFooter } from "@/components/enhanced-footer";
import { FadeInSection } from "@/components/fade-in-section";
import { AnimatedBackground } from "@/components/animated-background";
import { FloatingElements } from "@/components/floating-elements";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PricingDisplay } from "@/components/ui/pricing-display";
import {
  Building2,
  CheckCircle,
  Shield,
  Users,
  ArrowRight,
  Star,
  TrendingUp,
  Award,
  Phone,
  Mail,
  MapPin,
  PiggyBank,
} from "lucide-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function NidhiCompanyPage() {
  const router = useRouter();

  const handleBookService = () => {
    router.push('/contact?service=Nidhi+Company');
  };

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
                  Promoting Thrift & Savings
                </Badge>
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 bg-clip-text text-transparent">
                    Nidhi Company
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 bg-clip-text text-transparent">
                    Registration
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  A Nidhi Company is a mutual benefit society that promotes thrift and savings among its members. 
                  Get registered under Section 406 of the Companies Act, 2013 with our expert assistance.
                </p>

                <div className="grid sm:grid-cols-3 gap-4 pt-6">
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">
                      <PricingDisplay serviceName="nidhi company" />
                    </div>
                    <div className="text-sm text-gray-600">Starting Price</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">30-45 Days</div>
                    <div className="text-sm text-gray-600">Processing Time</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">99.9%</div>
                    <div className="text-sm text-gray-600">Success Rate</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <Link href={`/dashboard/company-information?service=${encodeURIComponent("Nidhi Company")}`} passHref>
                    <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                      Start Registration Now
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </FadeInSection>

            <FadeInSection delay={300} className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-200 rounded-3xl blur-3xl opacity-30 animate-pulse-slow"></div>
              <div className="relative rounded-lg w-full h-auto">
                <DotLottieReact
                  src="/lottie/Book a 1_1.lottie"
                  loop
                  autoplay
                />
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* What is Nidhi Company */}
      <FadeInSection>
        <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center space-y-6 mb-16">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
                  What is a Nidhi Company?
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mx-auto"></div>
              </div>

              <div className="space-y-8 text-gray-600 leading-relaxed text-lg">
                <p>
                  A Nidhi Company is a type of company in the Indian non-banking finance sector, recognized under 
                  Section 406 of the Companies Act, 2013. Their core business is borrowing and lending money between 
                  their members. They are also known as Permanent Fund, Benefit Funds, Mutual Benefit Funds, and 
                  Mutual Benefit Company.
                </p>

                <p>
                  Nidhi Companies are specifically designed to promote the habit of thrift and savings among their members 
                  and provide financial security through mutual assistance. They operate on the principle of mutual benefit, 
                  where members can both deposit money and borrow from the company at reasonable rates.
                </p>

                <p>
                  These companies are regulated by the Ministry of Corporate Affairs and must comply with the Nidhi Rules, 
                  2014. They are ideal for community-based financial organizations that want to help members save and 
                  provide credit facilities within the member community.
                </p>
              </div>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Key Features */}
      <FadeInSection>
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-6 mb-16">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
                Key Features of Nidhi Company
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Understanding the fundamental characteristics that make Nidhi Company ideal for mutual benefit societies
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: PiggyBank,
                  title: "Promotes Thrift & Savings",
                  description:
                    "Encourages members to develop saving habits and build financial security through regular deposits.",
                },
                {
                  icon: Shield,
                  title: "Member-Focused Operations",
                  description:
                    "Only members can deposit and borrow money, ensuring mutual benefit and financial security within the community.",
                },
                {
                  icon: Users,
                  title: "Minimum 7 Members",
                  description:
                    "Requires at least 7 members to start, fostering community-based financial cooperation.",
                },
                {
                  icon: Building2,
                  title: "Separate Legal Entity",
                  description:
                    "Company exists independently of its members, can own property, and operate as a legal entity.",
                },
                {
                  icon: Star,
                  title: "Lower Regulatory Burden",
                  description:
                    "Simpler compliance requirements compared to other NBFCs, making it easier to manage and operate.",
                },
                {
                  icon: Award,
                  title: "Community Trust",
                  description:
                    "Builds trust within the community through transparent operations and member-focused services.",
                },
              ].map((feature, index) => (
                <FadeInSection key={index} delay={index * 100}>
                  <Card className="border-2 border-blue-100 hover:border-blue-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
                    <CardContent className="p-6 text-center">
                      <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mb-4 group-hover:from-blue-200 group-hover:to-blue-300 transition-colors">
                        <feature.icon className="h-8 w-8 text-blue-600 group-hover:scale-110 transition-transform" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">{feature.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                    </CardContent>
                  </Card>
                </FadeInSection>
              ))}
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Registration Process */}
      <FadeInSection>
        <section className="py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-6 mb-16">
              <h2 className="text-4xl font-bold">Nidhi Company Registration Process</h2>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                Our streamlined process ensures quick and hassle-free Nidhi Company registration
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  step: "01",
                  title: "Company Incorporation",
                  description: "Incorporate as a Public Limited Company first",
                  timeline: "7-15 days",
                },
                {
                  step: "02",
                  title: "Minimum Members",
                  description: "Ensure minimum 7 members and 3 directors",
                  timeline: "1-2 days",
                },
                {
                  step: "03",
                  title: "Minimum Capital",
                  description: "Ensure minimum paid-up capital of ₹10 lakhs",
                  timeline: "1-2 days",
                },
                {
                  step: "04",
                  title: "Nidhi Application",
                  description: "Apply for Nidhi status with ROC after one year",
                  timeline: "30-45 days",
                },
              ].map((step, index) => (
                <FadeInSection key={index} delay={index * 150}>
                  <Card className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 group">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-xl font-bold">
                          {step.step}
                        </div>
                        <div className="text-sm text-blue-200">{step.timeline}</div>
                      </div>
                      <h3 className="text-lg font-semibold mb-3 group-hover:text-blue-200 transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-blue-100 text-sm leading-relaxed">{step.description}</p>
                    </CardContent>
                  </Card>
                </FadeInSection>
              ))}
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Documents Required */}
      <FadeInSection>
        <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-6 mb-16">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
                Documents Required for Registration
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Keep these documents ready for quick and smooth company registration process
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              <Card className="border-2 border-blue-100 shadow-xl hover:shadow-2xl transition-shadow">
                <CardHeader>
                  <CardTitle className="text-2xl text-blue-600 flex items-center">
                    <Users className="h-6 w-6 mr-3" />
                    For Directors & Members
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    "PAN Card of all Directors and Members",
                    "Aadhaar Card of all Directors and Members",
                    "Passport size photographs (recent)",
                    "Address proof (Utility bill/Bank statement - not older than 2 months)",
                    "Mobile number and Email ID (active)",
                    "Bank account statement (last 3 months)",
                  ].map((doc, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{doc}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-2 border-blue-100 shadow-xl hover:shadow-2xl transition-shadow">
                <CardHeader>
                  <CardTitle className="text-2xl text-blue-600 flex items-center">
                    <Building2 className="h-6 w-6 mr-3" />
                    For Registered Office
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    "Rent agreement (if office is rented)",
                    "NOC from property owner",
                    "Utility bill of registered office (Electricity/Water)",
                    "Property tax receipt or Municipal khata copy",
                    "Sale deed (if owned property)",
                  ].map((doc, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{doc}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <div className="mt-12 text-center">
              <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100 max-w-4xl mx-auto">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm">!</span>
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-blue-800 mb-2">Important Note:</h3>
                      <p className="text-blue-700 text-sm leading-relaxed">
                        All documents should be clear, legible, and not older than 2 months (except PAN and Aadhaar). 
                        Nidhi Company must be incorporated as a Public Limited Company first, and then apply for Nidhi 
                        status after one year of operations.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Benefits */}
      <FadeInSection>
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-6 mb-16">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
                Benefits of Nidhi Company
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Discover why Nidhi Company is the preferred choice for mutual benefit societies
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                {[
                  {
                    title: "Promotes Savings Culture",
                    description:
                      "Encourages members to develop regular saving habits and build financial security over time.",
                  },
                  {
                    title: "Member-Friendly Lending",
                    description:
                      "Provides easy access to credit facilities for members at reasonable interest rates.",
                  },
                  {
                    title: "Lower Regulatory Compliance",
                    description:
                      "Simpler compliance requirements compared to other NBFCs, reducing operational burden.",
                  },
                  {
                    title: "Community Development",
                    description:
                      "Fosters community-based financial cooperation and mutual assistance among members.",
                  },
                ].map((benefit, index) => (
                  <FadeInSection key={index} delay={index * 100}>
                    <div className="flex items-start space-x-4 group">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <CheckCircle className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                        <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                      </div>
                    </div>
                  </FadeInSection>
                ))}
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-200 rounded-3xl blur-3xl opacity-30"></div>
                <Card className="relative bg-white/80 backdrop-blur-sm border-2 border-blue-100 shadow-2xl">
                  <CardContent className="p-8">
                    <div className="text-center space-y-6">
                      <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                        <TrendingUp className="h-10 w-10 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">Why Choose Us?</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Success Rate</span>
                          <span className="font-bold text-blue-600">99.9%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Average Processing</span>
                          <span className="font-bold text-blue-600">30-45 Days</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Expert Support</span>
                          <span className="font-bold text-blue-600">24/7</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Happy Clients</span>
                          <span className="font-bold text-blue-600">2,500+</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* FAQ */}
      <FadeInSection>
        <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-6 mb-16">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Get answers to common questions about Nidhi Company registration
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {[
                {
                  question: "What is the minimum capital required for Nidhi Company?",
                  answer:
                    "A Nidhi Company must have a minimum paid-up capital of ₹10 lakhs. The authorized capital should be at least ₹10 lakhs.",
                },
                {
                  question: "How many members are required for Nidhi Company?",
                  answer:
                    "A minimum of 7 members is required to start a Nidhi Company. There is no maximum limit on the number of members.",
                },
                {
                  question: "Can Nidhi Company accept deposits from non-members?",
                  answer:
                    "No, Nidhi Companies can only accept deposits from their members. They cannot accept deposits from the general public.",
                },
                {
                  question: "What are the restrictions on lending by Nidhi Company?",
                  answer:
                    "Nidhi Companies can only lend money to their members. They cannot provide loans to non-members or engage in other business activities.",
                },
                {
                  question: "When can a company apply for Nidhi status?",
                  answer:
                    "A company must be incorporated as a Public Limited Company first and operate for at least one year before applying for Nidhi status with the ROC.",
                },
                {
                  question: "What are the compliance requirements for Nidhi Company?",
                  answer:
                    "Nidhi Companies must file annual returns, maintain proper books of accounts, hold annual general meetings, and comply with the Nidhi Rules, 2014.",
                },
                {
                  question: "Can Nidhi Company issue shares to the public?",
                  answer:
                    "Yes, Nidhi Companies are incorporated as Public Limited Companies, so they can issue shares, but they are restricted from accepting deposits from non-members.",
                },
                {
                  question: "What is the difference between Nidhi Company and Chit Fund?",
                  answer:
                    "Nidhi Company is a mutual benefit society that promotes savings and provides loans, while Chit Fund is a savings scheme where members contribute and bid for the pooled amount.",
                },
              ].map((faq, index) => (
                <FadeInSection key={index} delay={index * 100}>
                  <Card className="border-2 border-blue-100 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-gray-900 mb-3 text-lg">{faq.question}</h3>
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
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
            <div className="max-w-4xl mx-auto space-y-8">
              <h2 className="text-4xl lg:text-5xl font-bold">Ready to Start Your Nidhi Company?</h2>
              <p className="text-xl text-blue-100 leading-relaxed">
                Join thousands of successful organizations that have registered their Nidhi Companies with Com Financial
                Services. Get started today with our expert guidance and support.
              </p>
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Link href={`/dashboard/company-information?service=${encodeURIComponent("Nidhi Company")}`} passHref>
                  <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    Start Registration Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/contact" passHref>
                  <Button
                    variant="outline"
                    className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg rounded-full transition-all duration-300 hover:scale-105 bg-transparent"
                  >
                    Talk to Expert
                    <Phone className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>

              <div className="grid md:grid-cols-3 gap-8 mt-16">
                <div className="flex items-center justify-center space-x-3">
                  <Phone className="h-6 w-6 text-blue-200" />
                  <span className="text-blue-100">0612-4535604</span>
                </div>
                <div className="flex items-center justify-center space-x-3">
                  <Mail className="h-6 w-6 text-blue-200" />
                  <span className="text-blue-100">info@comfinserv.co</span>
                </div>
                <div className="flex items-center justify-center space-x-3">
                  <MapPin className="h-6 w-6 text-blue-200" />
                  <span className="text-blue-100">HO: 211, NP EXHIBITION ROAD PATNA, BIHAR-800001</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </FadeInSection>

      <EnhancedFooter />
    </div>
  );
}
