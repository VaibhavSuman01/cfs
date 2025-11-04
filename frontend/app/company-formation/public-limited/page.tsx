"use client";

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
  FileText,
  Briefcase,
  BarChart,
} from "lucide-react";

export default function PublicLimitedCompanyPage() {
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
                  Ideal for Large-Scale Enterprises
                </Badge>
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 bg-clip-text text-transparent">
                    Public Limited
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 bg-clip-text text-transparent">
                    Company Registration
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Establish your large-scale enterprise with a Public Limited
                  Company, enabling you to raise capital from the public and
                  list on stock exchanges. Our experts ensure a seamless
                  registration process.
                </p>

                <div className="grid sm:grid-cols-3 gap-4 pt-6">
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">
                      <PricingDisplay serviceName="public limited company" />
                    </div>
                    <div className="text-sm text-gray-600">Starting Price</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">
                      20-30 Days
                    </div>
                    <div className="text-sm text-gray-600">Processing Time</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">
                      99.5%
                    </div>
                    <div className="text-sm text-gray-600">Success Rate</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <Link
                    href={`/dashboard/company-formation?service=${encodeURIComponent(
                      "Public Limited Company"
                    )}`}
                    passHref
                  >
                    <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                      Start Your Company Now
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link
                    href={`/dashboard/company-formation?service=${encodeURIComponent(
                      "Public Limited Company"
                    )}`}
                    passHref
                  >
                    <Button
                      variant="outline"
                      className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-3 rounded-full transition-all duration-300 hover:scale-105 bg-transparent"
                    >
                      Consult an Expert
                    </Button>
                  </Link>
                </div>
              </div>
            </FadeInSection>
            <FadeInSection className="hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-transparent rounded-full -translate-x-10 -translate-y-10"></div>
                <img
                  src="/images/public-limited-hero.png"
                  alt="Public Limited Company Illustration"
                  className="relative rounded-lg w-full h-auto"
                />
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* What is a Public Limited Company Section */}
      <FadeInSection>
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto mb-16">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">
                What is a Public Limited Company?
              </h2>
              <p className="text-lg text-gray-600">
                A Public Limited Company is a form of company that offers its
                shares to the general public. It's a voluntary association of
                members that is incorporated under company law, with a separate
                legal identity and limited liability for its members.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="text-center p-6 border-2 border-transparent hover:border-blue-200 hover:shadow-xl transition-all">
                <Building2 className="mx-auto h-12 w-12 text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  Not a Private Company
                </h3>
                <p className="text-gray-600">
                  By definition, it is a company that is not a private company
                  and can invite the public to subscribe to its shares.
                </p>
              </Card>
              <Card className="text-center p-6 border-2 border-transparent hover:border-blue-200 hover:shadow-xl transition-all">
                <Users className="mx-auto h-12 w-12 text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Minimum Members</h3>
                <p className="text-gray-600">
                  Requires a minimum of 7 shareholders to start, with no upper
                  limit on the number of members.
                </p>
              </Card>
              <Card className="text-center p-6 border-2 border-transparent hover:border-blue-200 hover:shadow-xl transition-all">
                <Shield className="mx-auto h-12 w-12 text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  No Minimum Capital
                </h3>
                <p className="text-gray-600">
                  As per the Companies Act, 2013, there is no minimum paid-up
                  share capital requirement to form a Public Limited Company.
                </p>
              </Card>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Pricing Packages Section */}
      <FadeInSection>
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto mb-16">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">
                Choose Your Public Limited Package
              </h2>
              <p className="text-lg text-gray-600">
                Select the package that best fits your public limited company
                registration requirements
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <Card className="border-2 border-blue-200 hover:border-blue-400 hover:shadow-xl transition-all duration-300">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl font-bold text-blue-600">
                    Basic
                  </CardTitle>
                  <div className="text-4xl font-bold text-gray-900">
                    ₹14,999
                  </div>
                  <p className="text-sm text-gray-600">Starting Price</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3 text-left">
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
                      <span>Company Registration</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
                      <span>DSC & DPIN</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
                      <span>Basic Documentation</span>
                    </li>
                  </ul>
                  <Button
                    onClick={() =>
                      (window.location.href =
                        "/dashboard/company-formation?service=Public+Limited+Company")
                    }
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    Choose Basic
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-2 border-blue-400 hover:border-blue-600 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl font-bold text-blue-600">
                    Standard
                  </CardTitle>
                  <div className="text-4xl font-bold text-gray-900">
                    ₹24,999
                  </div>
                  <p className="text-sm text-gray-600">Most Popular</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3 text-left">
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
                      <span>Everything in Basic</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
                      <span>Priority Processing</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
                      <span>Expert Consultation</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
                      <span>Bank Account Setup</span>
                    </li>
                  </ul>
                  <Button
                    onClick={() =>
                      (window.location.href =
                        "/dashboard/company-formation?service=Public+Limited+Company")
                    }
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    Choose Standard
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-2 border-blue-200 hover:border-blue-400 hover:shadow-xl transition-all duration-300">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl font-bold text-blue-600">
                    Premium
                  </CardTitle>
                  <div className="text-4xl font-bold text-gray-900">
                    ₹30,999
                  </div>
                  <p className="text-sm text-gray-600">Complete Solution</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3 text-left">
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
                      <span>Everything in Standard</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
                      <span>GST Registration</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
                      <span>Compliance Setup</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
                      <span>1 Year Support</span>
                    </li>
                  </ul>
                  <Button
                    onClick={() =>
                      (window.location.href =
                        "/dashboard/company-formation?service=Public+Limited+Company")
                    }
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    Choose Premium
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Registration Process Section */}
      <FadeInSection>
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto mb-16">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">
                Streamlined Registration Process
              </h2>
              <p className="text-lg text-gray-600">
                We follow a structured and transparent process to get your
                Public Limited Company registered swiftly.
              </p>
            </div>
            <div className="relative">
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5"></div>
              <div className="grid md:grid-cols-3 gap-16 relative">
                <div className="text-center space-y-4">
                  <div className="relative inline-block">
                    <div className="w-20 h-20 mx-auto bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                      1
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold">
                    Apply for Company Name
                  </h3>
                  <p className="text-gray-600">
                    File an application for your business name via the SPICE+
                    PART A form. We help you choose a unique name that gets
                    approved quickly.
                  </p>
                </div>
                <div className="text-center space-y-4">
                  <div className="relative inline-block">
                    <div className="w-20 h-20 mx-auto bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                      2
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold">
                    Prepare & File Documents
                  </h3>
                  <p className="text-gray-600">
                    We prepare and file essential documents like SPICE+, eMOA,
                    and eAOA, all attested with the digital signatures of
                    directors and shareholders.
                  </p>
                </div>
                <div className="text-center space-y-4">
                  <div className="relative inline-block">
                    <div className="w-20 h-20 mx-auto bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                      3
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold">
                    Processing & Incorporation
                  </h3>
                  <p className="text-gray-600">
                    The CRC processes the documents and upon approval, issues
                    the Certificate of Incorporation along with PAN, TAN, and
                    other mandatory registrations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Documents Required Section */}
      <FadeInSection>
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto mb-16">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">
                Documents Required
              </h2>
              <p className="text-lg text-gray-600">
                Ensure a smooth registration process by keeping these documents
                ready. All documents need to be self-attested.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="p-6">
                <CardTitle className="mb-4 text-blue-600">
                  For Directors & Shareholders
                </CardTitle>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-500 mr-3 mt-1 flex-shrink-0" />
                    <span>PAN Card (mandatory for Indian nationals).</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-500 mr-3 mt-1 flex-shrink-0" />
                    <span>Passport (mandatory for foreign nationals).</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-500 mr-3 mt-1 flex-shrink-0" />
                    <span>
                      Identity Proof: Aadhaar Card, Driving License, or Voter
                      ID.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-500 mr-3 mt-1 flex-shrink-0" />
                    <span>
                      Latest Address Proof: Utility bill or bank statement (not
                      older than 2 months).
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-500 mr-3 mt-1 flex-shrink-0" />
                    <span>INC-9 Declaration by all subscribers.</span>
                  </li>
                </ul>
              </Card>
              <Card className="p-6">
                <CardTitle className="mb-4 text-blue-600">
                  For Registered Office
                </CardTitle>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-500 mr-3 mt-1 flex-shrink-0" />
                    <span>
                      Address Proof: Latest utility bill
                      (Electricity/Telephone).
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-500 mr-3 mt-1 flex-shrink-0" />
                    <span>
                      No Objection Certificate (NOC) from the property owner if
                      the office is rented/leased.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-500 mr-3 mt-1 flex-shrink-0" />
                    <span>Rent agreement (if the property is rented).</span>
                  </li>
                </ul>
              </Card>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* FAQ Section */}
      <FadeInSection>
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto mb-16">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-gray-600">
                Have questions? We have answers. Here are some common queries
                about Public Limited Company registration.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {[
                {
                  question:
                    "What is the minimum number of members for a Public Limited Company?",
                  answer:
                    "A Public Limited Company must have a minimum of seven shareholders (members). There is no maximum limit on the number of shareholders.",
                },
                {
                  question: "What is the minimum number of directors required?",
                  answer:
                    "A minimum of three directors are required to form a Public Limited Company. A company can have up to 15 directors, which can be increased by passing a special resolution.",
                },
                {
                  question:
                    "Is a prospectus mandatory for all Public Limited Companies?",
                  answer:
                    "A prospectus is a legal document that must be issued if the company intends to raise capital from the public. If not raising funds publicly, a 'statement in lieu of prospectus' must be filed with the ROC.",
                },
                {
                  question: "What are the annual compliance requirements?",
                  answer:
                    "Public Limited Companies have more stringent compliance requirements, including statutory audits, conducting at least four board meetings and one AGM annually, and filing various forms like MGT-7 and AOC-4 with the ROC.",
                },
              ].map((faq, index) => (
                <FadeInSection key={index} delay={index * 100}>
                  <Card className="border-2 border-blue-100 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-gray-900 mb-3 text-lg">
                        {faq.question}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {faq.answer}
                      </p>
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
              <h2 className="text-4xl font-bold text-gray-900">
                Documents Required
              </h2>
              <p className="text-xl text-gray-600">
                Keep these documents ready for quick registration
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-gray-900">
                  For Directors
                </h3>
                <div className="space-y-4">
                  {[
                    "PAN Card of all Directors",
                    "Aadhaar Card of all Directors",
                    "Passport size photographs",
                    "Residential proof (Passport or Driving License or Voter ID card)",
                    "Mobile number and Email ID",
                  ].map((doc, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-blue-500" />
                      <span className="text-gray-700">{doc}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-gray-900">
                  For Company
                </h3>
                <div className="space-y-4">
                  {[
                    "Rent agreement (if rented)",
                    "NOC from property owner",
                    "Utility bill of registered office",
                    "Proposed company names (1-2 options)",
                  ].map((doc, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-blue-500" />
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
              <h2 className="text-4xl lg:text-5xl font-bold">
                Ready to Go Public?
              </h2>
              <p className="text-xl text-blue-100 leading-relaxed">
                Let our experts guide you through every step of forming your
                Public Limited Company. Get started today for a compliant and
                successful launch.
              </p>
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Link
                  href={`/dashboard/company-formation?service=${encodeURIComponent(
                    "Public Limited Company"
                  )}`}
                  passHref
                >
                  <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    Start Registration Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link
                  href={`/dashboard/company-formation?service=${encodeURIComponent(
                    "Public Limited Company"
                  )}`}
                  passHref
                >
                  <Button
                    variant="outline"
                    className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg rounded-full transition-all duration-300 hover:scale-105 bg-transparent"
                  >
                    Apply Now
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
