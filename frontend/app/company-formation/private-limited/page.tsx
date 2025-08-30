"use client"

import { useRouter } from "next/navigation";
import Link from "next/link";
import { EnhancedHeader } from "@/components/enhanced-header"
import { EnhancedFooter } from "@/components/enhanced-footer"
import { FadeInSection } from "@/components/fade-in-section"
import { AnimatedBackground } from "@/components/animated-background"
import { FloatingElements } from "@/components/floating-elements"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { getBasePrice, getPackages } from "@/lib/pricing"
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
} from "lucide-react"

export default function PrivateLimitedCompanyPage() {
  const router = useRouter();

  const handleBookService = () => {
    router.push('/contact?service=Private+Limited+Company');
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
                <Badge className="bg-gradient-to-r from-green-100 to-green-200 text-green-800 hover:from-green-200 hover:to-green-300 animate-pulse border-0 px-4 py-2">
                  Most Popular Choice for Startups
                </Badge>
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 bg-clip-text text-transparent">
                    Private Limited
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 bg-clip-text text-transparent">
                    Company Registration
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Start your Private Limited Company with complete legal compliance, limited liability protection, and
                  easy fund-raising capabilities. Get registered in just 7-15 days with our expert assistance.
                </p>

                <div className="grid sm:grid-cols-3 gap-4 pt-6">
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">{getBasePrice("private limited company") ?? "—"}</div>
                    <div className="text-sm text-gray-600">Starting Price</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">7-15 Days</div>
                    <div className="text-sm text-gray-600">Processing Time</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">99.9%</div>
                    <div className="text-sm text-gray-600">Success Rate</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <Link href={`/dashboard/company-formation-form?service=${encodeURIComponent("Private Limited Company")}`} passHref>
                    <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                      Start Registration Now
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>

                </div>
              </div>
            </FadeInSection>

            {/* Contact Form */}
            <FadeInSection delay={300} className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-200 rounded-3xl blur-3xl opacity-30 animate-pulse-slow"></div>
              <Card className="relative bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-blue-100 hover:shadow-3xl transition-all duration-500">
                <CardHeader className="text-center pb-6">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-4">
                    <Building2 className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
                    Get Your Quote Now
                  </CardTitle>
                  <p className="text-gray-600">Fill the form below and get instant quote for Private Limited Company</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-gray-700 font-medium">
                        Name*
                      </Label>
                      <Input
                        id="name"
                        placeholder="Enter your name"
                        className="mt-2 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-gray-700 font-medium">
                        Email*
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        className="mt-2 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-gray-700 font-medium">
                      Phone*
                    </Label>
                    <Input
                      id="phone"
                      placeholder="Enter your phone number"
                      className="mt-2 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                    />
                  </div>

                  <div>
                    <Label htmlFor="service" className="text-gray-700 font-medium">
                      Service Required*
                    </Label>
                    <Input
                      id="service"
                      value="Private Limited Company"
                      readOnly
                      className="mt-2 border-2 border-gray-200 bg-blue-50 text-blue-800 font-medium"
                    />
                  </div>

                  <div>
                    <Label htmlFor="address" className="text-gray-700 font-medium">
                      Address*
                    </Label>
                    <Textarea
                      id="address"
                      placeholder="Enter your complete address"
                      className="mt-2 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="additional" className="text-gray-700 font-medium">
                      Additional Requirements
                    </Label>
                    <Textarea
                      id="additional"
                      placeholder="In case you wish to avail any other services than the one selected above, please drop us a note here."
                      className="mt-2 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                      rows={3}
                    />
                  </div>

                  <Link href={`/dashboard/company-formation-form?service=${encodeURIComponent("Private Limited Company")}`} passHref>
                    <Button className="w-full bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                      Apply Now
                    </Button>
                  </Link>

                  <div className="text-center text-sm text-gray-500">
                    <p>🔒 Your information is 100% secure and confidential</p>
                  </div>
                </CardContent>
              </Card>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* What is Private Limited Company */}
      <FadeInSection>
        <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center space-y-6 mb-16">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
                  What is a Private Limited Company?
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mx-auto"></div>
              </div>

              <div className="space-y-8 text-gray-600 leading-relaxed text-lg">
                <p>
                  A Private Limited Company is a type of business entity that is privately held by a small number of
                  shareholders. The liability of the shareholders is limited to the amount of shares held by them. It is
                  the most popular form of business registration in India due to its numerous advantages and legal
                  protections.
                </p>

                <p>
                  Private Limited Companies are governed by the Companies Act, 2013, and are required to have a minimum
                  of 2 directors and 2 shareholders (which can be the same individuals). The maximum number of
                  shareholders is limited to 200, and shares cannot be freely transferred or traded publicly.
                </p>

                <p>
                  This business structure provides the perfect balance between operational flexibility and legal
                  protection, making it ideal for startups, small to medium enterprises, and businesses looking to raise
                  funds from investors.
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
                Key Features of Private Limited Company
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Understanding the fundamental characteristics that make Private Limited Company the preferred choice
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Shield,
                  title: "Limited Liability Protection",
                  description:
                    "Personal assets of shareholders are protected from business liabilities. Liability is limited to the amount invested in shares.",
                },
                {
                  icon: Building2,
                  title: "Separate Legal Entity",
                  description:
                    "Company exists independently of its owners, can own property, enter contracts, and sue or be sued in its own name.",
                },
                {
                  icon: TrendingUp,
                  title: "Easy Fund Raising",
                  description:
                    "Can raise capital by issuing shares to investors, making it attractive for startups and growing businesses.",
                },
                {
                  icon: Users,
                  title: "Perpetual Succession",
                  description:
                    "Company continues to exist even if shareholders or directors change, ensuring business continuity.",
                },
                {
                  icon: Star,
                  title: "Tax Benefits",
                  description:
                    "Eligible for various tax deductions and benefits under Income Tax Act, including lower corporate tax rates.",
                },
                {
                  icon: Award,
                  title: "Enhanced Credibility",
                  description:
                    "Higher credibility with customers, suppliers, and financial institutions compared to other business forms.",
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
              <h2 className="text-4xl font-bold">Private Limited Company Registration Process</h2>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                Our streamlined 6-step process ensures quick and hassle-free company registration
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: "Digital Signature Certificate",
                  description: "Obtain DSC for all directors to digitally sign documents",
                  timeline: "1-2 days",
                },
                {
                  step: "02",
                  title: "Director Identification Number",
                  description: "Apply for DIN for all proposed directors of the company",
                  timeline: "1-2 days",
                },
                {
                  step: "03",
                  title: "Name Reservation",
                  description: "Reserve unique company name through RUN (Reserve Unique Name)",
                  timeline: "1-2 days",
                },
                {
                  step: "04",
                  title: "File Incorporation Documents",
                  description: "Submit MOA, AOA, and other incorporation documents to ROC",
                  timeline: "3-5 days",
                },
                {
                  step: "05",
                  title: "Certificate of Incorporation",
                  description: "Receive Certificate of Incorporation from Registrar of Companies",
                  timeline: "2-3 days",
                },
                {
                  step: "06",
                  title: "Post-Incorporation Compliance",
                  description: "Bank account opening assistance",
                  timeline: "3-5 days",
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
                    For Directors & Shareholders
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    "PAN Card of all Directors and Shareholders",
                    "Aadhaar Card of all Directors and Shareholders",
                    "Passport size photographs (recent)",
                    "Address proof (Utility bill/Bank statement - not older than 2 months)",
                    "Mobile number and Email ID (active)",
                    "Bank account statement (last 3 months)",
                  ].map((doc, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
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
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{doc}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <div className="mt-12 text-center">
              <Card className="border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-orange-100 max-w-4xl mx-auto">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm">!</span>
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-orange-800 mb-2">Important Note:</h3>
                      <p className="text-orange-700 text-sm leading-relaxed">
                        All documents should be clear, legible, and not older than 2 months (except PAN and Aadhaar).
                        Foreign nationals require additional documents including passport, visa, and address proof from
                        home country.
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
                Benefits of Private Limited Company
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Discover why Private Limited Company is the preferred choice for entrepreneurs and businesses
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                {[
                  {
                    title: "Limited Liability Protection",
                    description:
                      "Personal assets of directors and shareholders are protected from business debts and liabilities.",
                  },
                  {
                    title: "Easy Access to Funding",
                    description:
                      "Can raise capital through equity, venture capital, angel investors, and bank loans more easily.",
                  },
                  {
                    title: "Tax Advantages",
                    description:
                      "Lower corporate tax rates, various deductions, and tax planning opportunities available.",
                  },
                  {
                    title: "Business Continuity",
                    description:
                      "Company continues to exist regardless of changes in ownership or management structure.",
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
                          <span className="font-bold text-blue-600">7-15 Days</span>
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

      {/* Pricing */}
      <FadeInSection>
        <section className="py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-6 mb-16">
              <h2 className="text-4xl font-bold">Transparent Pricing</h2>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                No hidden charges. What you see is what you pay. Choose the package that suits your needs.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                {
                  name: "Basic Package",
                  price: getPackages("private limited company")?.BASIC ?? "—",
                  popular: false,
                  features: [
                    "Company Name Search & Reservation",
                    "DSC for 2 Directors",
                    "DIN for 2 Directors",
                    "MOA & AOA Drafting",
                    "Company Incorporation",
                    "Certificate of Incorporation",
                    "PAN & TAN Application",
                  ],
                },
                {
                  name: "Standard Package",
                  price: getPackages("private limited company")?.STANDARD ?? "—",
                  popular: true,
                  features: [
                    "Company Name Search & Reservation",
                    "DSC for 2 Directors",
                    "DIN for 2 Directors",
                    "MOA & AOA Drafting",
                    "Company Incorporation",
                    "Certificate of Incorporation",
                    "PAN & TAN Application",
                    "GST Filing",

                  ],
                },
                {
                  name: "Premium Package",
                  price: getPackages("private limited company")?.PREMIUM ?? "—",
                  popular: false,
                  features: [
                    "Company Name Search & Reservation",
                    "DSC for 2 Directors",
                    "DIN for 2 Directors",
                    "MOA & AOA Drafting",
                    "Company Incorporation",
                    "Certificate of Incorporation",
                    "PAN & TAN Application",
                    "GST Filing",
                    "EPFO Registration",
                    "ESI Registration",
                    "PT Tax Registration",
                    "Bank Account Opening Assistance",
                    "Detailed MOA & AOA Drafting",
                    "Expert Assistance"
                  ],
                },
              ].map((pkg, index) => (
                <FadeInSection key={index} delay={index * 100}>
                  <Card
                    className={`relative border-2 hover:shadow-2xl transition-all duration-300 hover:scale-105 ${
                      pkg.popular
                        ? "border-yellow-400 bg-white/15 backdrop-blur-sm"
                        : "border-white/20 bg-white/10 backdrop-blur-sm"
                    }`}
                  >
                    {pkg.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-yellow-400 text-yellow-900 px-4 py-1">Most Popular</Badge>
                      </div>
                    )}
                    <CardHeader className="text-center">
                      <CardTitle className="text-2xl font-bold">{pkg.name}</CardTitle>
                      <div className="text-4xl font-bold text-yellow-400 my-4">{pkg.price}</div>
                      <p className="text-blue-100">One-time payment</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {pkg.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                          <span className="text-blue-100 text-sm">{feature}</span>
                        </div>
                      ))}
                      <Link href={`/dashboard/company-formation-form?service=${encodeURIComponent("Private Limited Company")}`} passHref>
                        <Button
                          className={`w-full mt-6 ${
                            pkg.popular
                              ? "bg-yellow-400 text-yellow-900 hover:bg-yellow-300"
                              : "bg-white/20 text-white hover:bg-white/30"
                          } transition-all duration-300 hover:scale-105`}
                        >
                          Choose This Package
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

      {/* FAQ */}
      <FadeInSection>
        <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-6 mb-16">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Get answers to common questions about Private Limited Company registration
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {[
                {
                  question: "What is the minimum capital required for Private Limited Company?",
                  answer:
                    "There is no minimum capital requirement for Private Limited Company registration in India. You can start with as low as ₹0 as authorized capital.",
                },
                {
                  question: "How many directors are required for Private Limited Company?",
                  answer:
                    "A minimum of 2 directors and maximum of 200 directors are required for Private Limited Company. At least one director must be an Indian resident.",
                },
                {
                  question: "Can a single person start a Private Limited Company?",
                  answer:
                    "No, a minimum of 2 directors and 2 shareholders are required. However, the same individuals can be both directors and shareholders.",
                },
                {
                  question: "What is the difference between authorized and paid-up capital?",
                  answer:
                    "Authorized capital is the maximum amount of capital a company can raise, while paid-up capital is the actual amount invested by shareholders.",
                },
                {
                  question: "Is it mandatory to have a physical office for registration?",
                  answer:
                    "Yes, a registered office address is mandatory. It can be residential or commercial property with proper address proof and owner consent.",
                },
                {
                  question: "How long is the company name reservation valid?",
                  answer:
                    "Company name reservation is valid for 15 days from the date of approval. You must complete incorporation within this period.",
                },
                {
                  question: "Can foreign nationals be directors in Indian Private Limited Company?",
                  answer:
                    "Yes, foreign nationals can be directors, but at least one director must be an Indian resident. Additional documentation is required for foreign directors.",
                },
                {
                  question: "What are the annual compliance requirements?",
                  answer:
                    "Annual compliance includes filing annual returns (MGT-7 or 7A), financial statements (AOC-4), conducting board meetings, and maintaining statutory registers.",
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

      {/* Documents Required */}
      <FadeInSection>
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-4xl font-bold text-gray-900">Documents Required</h2>
              <p className="text-xl text-gray-600">Keep these documents ready for quick registration</p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-gray-900">For Directors</h3>
                <div className="space-y-4">
                  {[
                    "PAN Card of all Directors",
                    "Aadhaar Card of all Directors",
                    "Passport size photographs",
                    "Residential proof (Passport or Driving License or Voter ID card)",
                    "Mobile number and Email ID",
                  ].map((doc, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-gray-700">{doc}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-gray-900">For Company</h3>
                <div className="space-y-4">
                  {[
                    "Rent agreement (if rented)",
                    "NOC from property owner",
                    "Utility bill of registered office",
                    "Proposed company names (1-2 options)",
                  ].map((doc, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-gray-700">{doc}</span>
                    </div>
                  ))}
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
              <h2 className="text-4xl lg:text-5xl font-bold">Ready to Start Your Private Limited Company?</h2>
              <p className="text-xl text-blue-100 leading-relaxed">
                Join thousands of successful entrepreneurs who have registered their companies with Com Financial
                Services. Get started today with our expert guidance and support.
              </p>
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Link href={`/dashboard/company-formation-form?service=${encodeURIComponent("Private Limited Company")}`} passHref>
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
  )
}
