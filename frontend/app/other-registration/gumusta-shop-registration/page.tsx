"use client";

import { EnhancedHeader } from "@/components/enhanced-header";
import { EnhancedFooter } from "@/components/enhanced-footer";
import { FadeInSection } from "@/components/fade-in-section";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PricingDisplay } from "@/components/ui/pricing-display";
import Link from "next/link";
import {
  Shield,
  CheckCircle,
  ArrowRight,
  Building,
  FileText,
  Award,
  Zap,
  Store,
} from "lucide-react";

export default function GumustaShopRegistrationPage() {
  return (
    <div className="min-h-screen bg-white">
      <EnhancedHeader />

      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center pt-20">
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <FadeInSection className="space-y-8">
              <div className="space-y-6">
                <Badge className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 hover:from-blue-200 hover:to-blue-300 animate-pulse border-0 px-4 py-2">
                  Shop & Establishment Act
                </Badge>
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 bg-clip-text text-transparent">
                    Gumusta / Shop & Establishment
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 bg-clip-text text-transparent">
                    Registration
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  The Shop and Establishment Act requires all commercial
                  establishments, such as hotels, eateries, and amusement parks,
                  to obtain a registration certificate. This license, often
                  called 'Gumusta' in some regions, is a legal requirement for
                  operating a business and serves as proof of its existence.
                </p>

                <div className="grid sm:grid-cols-3 gap-4 pt-6">
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">
                      <PricingDisplay serviceName="gumusta shop registration" />
                    </div>
                    <div className="text-sm text-gray-600">Starting Price</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">
                      3-5 Days
                    </div>
                    <div className="text-sm text-gray-600">Processing Time</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">
                      Mandatory
                    </div>
                    <div className="text-sm text-gray-600">For All Shops</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <Link
                    href={`/dashboard/other-registration?service=${encodeURIComponent(
                      "Gumusta Shop Registration"
                    )}`}
                    passHref
                  >
                    <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                      Register Shop
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link
                    href={`/dashboard/other-registration?service=${encodeURIComponent(
                      "Gumusta Shop Registration"
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
                <div className="relative rounded-lg w-full h-80 flex items-center justify-center">
                  <Store className="h-32 w-32 text-blue-600" />
                </div>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* What is Gumusta Section */}
      <FadeInSection>
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto mb-16">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">
                What is Gumusta Registration?
              </h2>
              <p className="text-lg text-gray-600">
                Mandatory registration for all commercial establishments under
                the Shop & Establishment Act
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="text-center p-6 border-2 border-transparent hover:border-blue-200 hover:shadow-xl transition-all">
                <Building className="mx-auto h-12 w-12 text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  Commercial Establishments
                </h3>
                <p className="text-gray-600">
                  Required for shops, hotels, eateries, and amusement parks.
                </p>
              </Card>
              <Card className="text-center p-6 border-2 border-transparent hover:border-blue-200 hover:shadow-xl transition-all">
                <Shield className="mx-auto h-12 w-12 text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Legal Compliance</h3>
                <p className="text-gray-600">
                  Mandatory requirement for operating any commercial business.
                </p>
              </Card>
              <Card className="text-center p-6 border-2 border-transparent hover:border-blue-200 hover:shadow-xl transition-all">
                <Award className="mx-auto h-12 w-12 text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Business Proof</h3>
                <p className="text-gray-600">
                  Serves as official proof of business existence and operation.
                </p>
              </Card>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Process Section */}
      <FadeInSection>
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto mb-16">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">
                Registration Process
              </h2>
              <p className="text-lg text-gray-600">
                Our streamlined process for shop and establishment registration
              </p>
            </div>
            <div className="relative">
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-blue-200"></div>
              <div className="grid md:grid-cols-4 gap-16 relative">
                <div className="text-center space-y-4">
                  <div className="relative inline-block">
                    <div className="w-20 h-20 mx-auto bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                      1
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold">Application</h3>
                  <p className="text-gray-600">
                    Submit registration application with business details.
                  </p>
                </div>
                <div className="text-center space-y-4">
                  <div className="relative inline-block">
                    <div className="w-20 h-20 mx-auto bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                      2
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold">Documentation</h3>
                  <p className="text-gray-600">
                    Complete documentation and verification process.
                  </p>
                </div>
                <div className="text-center space-y-4">
                  <div className="relative inline-block">
                    <div className="w-20 h-20 mx-auto bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                      3
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold">Verification</h3>
                  <p className="text-gray-600">
                    Business verification and document validation.
                  </p>
                </div>
                <div className="text-center space-y-4">
                  <div className="relative inline-block">
                    <div className="w-20 h-20 mx-auto bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                      4
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold">Certificate</h3>
                  <p className="text-gray-600">
                    Registration certificate issuance and delivery.
                  </p>
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
                Ready to Register Your Shop?
              </h2>
              <p className="text-xl text-blue-100 leading-relaxed">
                Ensure your commercial establishment operates legally with
                proper registration. Get your Gumusta registration today and
                comply with all legal requirements.
              </p>
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Link
                  href={`/dashboard/other-registration?service=${encodeURIComponent(
                    "Gumusta Shop Registration"
                  )}`}
                  passHref
                >
                  <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    Start Registration
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link
                  href={`/dashboard/other-registration?service=${encodeURIComponent(
                    "Gumusta Shop Registration"
                  )}`}
                  passHref
                >
                  <Button
                    variant="outline"
                    className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg rounded-full transition-all duration-300 hover:scale-105 bg-transparent"
                  >
                    Apply Now
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
