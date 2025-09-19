"use client";

import { EnhancedHeader } from '@/components/enhanced-header';
import { EnhancedFooter } from '@/components/enhanced-footer';
import { FadeInSection } from '@/components/fade-in-section';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PricingDisplay } from '@/components/ui/pricing-display';
import Link from 'next/link';
import {
  Shield,
  CheckCircle,
  ArrowRight,
  Heart,
  FileText,
  Award,
  Zap,
  Users
} from 'lucide-react';

export default function NgoRegistrationPage() {

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
                  Non-Profit Organization
                </Badge>
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 bg-clip-text text-transparent">
                    NGO Registration
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 bg-clip-text text-transparent">
                    Make a Difference
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  A Non-Governmental Organization (NGO) is a non-profit, voluntary citizens' group organized on a local, national or international level. Registering your NGO as a Trust, Society, or Section 8 Company provides it with legal status and makes it eligible for tax exemptions and government funding.
                </p>

                <div className="grid sm:grid-cols-3 gap-4 pt-6">
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">
                      <PricingDisplay serviceName="ngo registration" />
                    </div>
                    <div className="text-sm text-gray-600">Starting Price</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">15-30 Days</div>
                    <div className="text-sm text-gray-600">Processing Time</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">Legal</div>
                    <div className="text-sm text-gray-600">Status</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <Link href={`/dashboard/other-registration?service=${encodeURIComponent('NGO Registration')}`} passHref>
                    <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                      Register NGO
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href={`/dashboard/other-registration?service=${encodeURIComponent('NGO Registration')}`} passHref>
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
                <div className="relative rounded-lg shadow-2xl w-full h-80 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                  <Heart className="h-32 w-32 text-blue-600" />
                </div>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* Document Requirements Section */}
      <FadeInSection>
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Required Documents
              </h2>
              <p className="text-xl text-gray-600">
                Please ensure you have the following documents ready before starting the registration process
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="text-blue-800 flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Identity Documents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      PAN Card (PDF format)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Aadhaar Card (PDF format)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Passport size photo
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Address proof (Utility bill, Bank statement)
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="text-green-800 flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    NGO Documents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Memorandum of Association
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Articles of Association
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Trust Deed (if applicable)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Society Registration Certificate
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-purple-200 bg-purple-50">
                <CardHeader>
                  <CardTitle className="text-purple-800 flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Additional Documents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Bank account details
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Office address proof
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Board resolution (if applicable)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Digital signature certificate
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="mt-12 text-center">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-2xl mx-auto">
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                  Important Notes
                </h3>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• All documents must be in PDF format and clearly readable</li>
                  <li>• File size should not exceed 5MB per document</li>
                  <li>• Documents should be recent (not older than 3 months)</li>
                  <li>• Ensure all signatures are visible and clear</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* What is NGO Section */}
      <FadeInSection>
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto mb-16">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">What is NGO Registration?</h2>
              <p className="text-lg text-gray-600">
                Legal recognition for non-profit organizations
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="text-center p-6 border-2 border-transparent hover:border-blue-200 hover:shadow-xl transition-all">
                <Heart className="mx-auto h-12 w-12 text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Non-Profit Status</h3>
                <p className="text-gray-600">Legal recognition for charitable and social organizations.</p>
              </Card>
              <Card className="text-center p-6 border-2 border-transparent hover:border-blue-200 hover:shadow-xl transition-all">
                <Shield className="mx-auto h-12 w-12 text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Tax Exemptions</h3>
                <p className="text-gray-600">Eligible for tax benefits and government funding.</p>
              </Card>
              <Card className="text-center p-6 border-2 border-transparent hover:border-blue-200 hover:shadow-xl transition-all">
                <Users className="mx-auto h-12 w-12 text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Social Impact</h3>
                <p className="text-gray-600">Ability to work for social causes and community development.</p>
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
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">NGO Registration Process</h2>
              <p className="text-lg text-gray-600">
                Our streamlined process for NGO registration
              </p>
            </div>
            <div className="relative">
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-blue-200"></div>
              <div className="grid md:grid-cols-4 gap-16 relative">
                <div className="text-center space-y-4">
                  <div className="relative inline-block"><div className="w-20 h-20 mx-auto bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl font-bold">1</div></div>
                  <h3 className="text-xl font-semibold">Application</h3>
                  <p className="text-gray-600">Submit NGO registration application with details.</p>
                </div>
                <div className="text-center space-y-4">
                  <div className="relative inline-block"><div className="w-20 h-20 mx-auto bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl font-bold">2</div></div>
                  <h3 className="text-xl font-semibold">Documentation</h3>
                  <p className="text-gray-600">Complete documentation and verification process.</p>
                </div>
                <div className="text-center space-y-4">
                  <div className="relative inline-block"><div className="w-20 h-20 mx-auto bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl font-bold">3</div></div>
                  <h3 className="text-xl font-semibold">Approval</h3>
                  <p className="text-gray-600">Government approval and compliance verification.</p>
                </div>
                <div className="text-center space-y-4">
                  <div className="relative inline-block"><div className="w-20 h-20 mx-auto bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl font-bold">4</div></div>
                  <h3 className="text-xl font-semibold">Registration</h3>
                  <p className="text-gray-600">NGO registration certificate issuance.</p>
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
              <h2 className="text-4xl lg:text-5xl font-bold">Ready to Make a Difference?</h2>
              <p className="text-xl text-blue-100 leading-relaxed">
                Establish your non-profit organization and start working for social causes. Get your NGO registration today and create positive change in society.
              </p>
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Link href={`/dashboard/other-registration?service=${encodeURIComponent('NGO Registration')}`} passHref>
                  <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    Start Registration
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href={`/dashboard/other-registration?service=${encodeURIComponent('NGO Registration')}`} passHref>
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
