"use client";

import { EnhancedHeader } from '@/components/enhanced-header';
import { EnhancedFooter } from '@/components/enhanced-footer';
import { FadeInSection } from '@/components/fade-in-section';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getBasePrice } from '@/lib/pricing';
import { useRouter } from 'next/navigation';
import {
  Shield,
  CheckCircle,
  ArrowRight,
  Building,
  FileText,
  Award,
  Zap,
  TrendingUp
} from 'lucide-react';

export default function MsmeUdyamPage() {
  const router = useRouter();
  const basePrice = getBasePrice("msme udyam registration") ?? "As per request";

  const handleBookService = () => {
    router.push(`/contact?service=MSME+Udyam+Registration`);
  };

  return (
    <div className="min-h-screen bg-white">
      <EnhancedHeader />

      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center pt-20">
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <FadeInSection className="space-y-8">
              <div className="space-y-6">
                <Badge className="bg-gradient-to-r from-teal-100 to-teal-200 text-teal-800 hover:from-teal-200 hover:to-teal-300 animate-pulse border-0 px-4 py-2">
                  Micro, Small & Medium Enterprise
                </Badge>
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-gray-900 via-teal-800 to-gray-900 bg-clip-text text-transparent">
                    MSME/Udyam
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-teal-600 via-teal-500 to-teal-700 bg-clip-text text-transparent">
                    Registration
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Udyam Registration, also known as MSME Registration, is a government registration for MSMEs providing them with a unique identity number and a recognition certificate. This registration provides numerous benefits, including access to government schemes, subsidies, and easier access to credit.
                </p>

                <div className="grid sm:grid-cols-3 gap-4 pt-6">
                  <div className="text-center p-4 bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl">
                    <div className="text-2xl font-bold text-teal-600">{basePrice}</div>
                    <div className="text-sm text-gray-600">Starting Price</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl">
                    <div className="text-2xl font-bold text-teal-600">3-5 Days</div>
                    <div className="text-sm text-gray-600">Processing Time</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl">
                    <div className="text-2xl font-bold text-teal-600">Government</div>
                    <div className="text-sm text-gray-600">Recognition</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <Button onClick={handleBookService} className="bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    Register MSME
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleBookService}
                    className="border-2 border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white px-8 py-3 rounded-full transition-all duration-300 hover:scale-105 bg-transparent"
                  >
                    Consult an Expert
                  </Button>
                </div>
              </div>
            </FadeInSection>
            <FadeInSection className="hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-teal-100 to-transparent rounded-full -translate-x-10 -translate-y-10"></div>
                <div className="relative rounded-lg shadow-2xl w-full h-80 bg-gradient-to-br from-teal-50 to-teal-100 flex items-center justify-center">
                  <TrendingUp className="h-32 w-32 text-teal-600" />
                </div>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* What is MSME Section */}
      <FadeInSection>
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto mb-16">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-teal-600 bg-clip-text text-transparent">What is MSME Registration?</h2>
              <p className="text-lg text-gray-600">
                Government recognition for Micro, Small, and Medium Enterprises
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="text-center p-6 border-2 border-transparent hover:border-teal-200 hover:shadow-xl transition-all">
                <Building className="mx-auto h-12 w-12 text-teal-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Business Recognition</h3>
                <p className="text-gray-600">Official government recognition as an MSME enterprise.</p>
              </Card>
              <Card className="text-center p-6 border-2 border-transparent hover:border-teal-200 hover:shadow-xl transition-all">
                <Shield className="mx-auto h-12 w-12 text-teal-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Government Benefits</h3>
                <p className="text-gray-600">Access to schemes, subsidies, and government tenders.</p>
              </Card>
              <Card className="text-center p-6 border-2 border-transparent hover:border-teal-200 hover:shadow-xl transition-all">
                <Award className="mx-auto h-12 w-12 text-teal-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Credit Access</h3>
                <p className="text-gray-600">Easier access to loans and financial assistance.</p>
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
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-teal-600 bg-clip-text text-transparent">MSME Registration Process</h2>
              <p className="text-lg text-gray-600">
                Our streamlined process for MSME Udyam registration
              </p>
            </div>
            <div className="relative">
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-teal-200"></div>
              <div className="grid md:grid-cols-4 gap-16 relative">
                <div className="text-center space-y-4">
                  <div className="relative inline-block"><div className="w-20 h-20 mx-auto bg-teal-500 text-white rounded-full flex items-center justify-center text-2xl font-bold">1</div></div>
                  <h3 className="text-xl font-semibold">Application</h3>
                  <p className="text-gray-600">Submit MSME application with business details.</p>
                </div>
                <div className="text-center space-y-4">
                  <div className="relative inline-block"><div className="w-20 h-20 mx-auto bg-teal-500 text-white rounded-full flex items-center justify-center text-2xl font-bold">2</div></div>
                  <h3 className="text-xl font-semibold">Documentation</h3>
                  <p className="text-gray-600">Complete documentation and verification process.</p>
                </div>
                <div className="text-center space-y-4">
                  <div className="relative inline-block"><div className="w-20 h-20 mx-auto bg-teal-500 text-white rounded-full flex items-center justify-center text-2xl font-bold">3</div></div>
                  <h3 className="text-xl font-semibold">Verification</h3>
                  <p className="text-gray-600">Business verification and document validation.</p>
                </div>
                <div className="text-center space-y-4">
                  <div className="relative inline-block"><div className="w-20 h-20 mx-auto bg-teal-500 text-white rounded-full flex items-center justify-center text-2xl font-bold">4</div></div>
                  <h3 className="text-xl font-semibold">Certificate</h3>
                  <p className="text-gray-600">MSME certificate issuance and delivery.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* CTA Section */}
      <FadeInSection>
        <section className="py-20 bg-gradient-to-r from-teal-600 to-teal-800 text-white">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto space-y-8">
              <h2 className="text-4xl lg:text-5xl font-bold">Ready to Get MSME Recognition?</h2>
              <p className="text-xl text-teal-100 leading-relaxed">
                Unlock government benefits, subsidies, and easier credit access with MSME registration. Get your Udyam registration today and grow your business with official recognition.
              </p>
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Button onClick={handleBookService} className="bg-white text-teal-600 hover:bg-gray-100 px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  Start Registration
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  onClick={handleBookService}
                  className="border-2 border-white text-white hover:bg-white hover:text-teal-600 px-8 py-4 text-lg rounded-full transition-all duration-300 hover:scale-105 bg-transparent"
                >
                  Expert Consultation
                </Button>
              </div>
            </div>
          </div>
        </section>
      </FadeInSection>

      <EnhancedFooter />
    </div>
  );
}
