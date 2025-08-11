"use client";

import { EnhancedHeader } from '@/components/enhanced-header';
import { EnhancedFooter } from '@/components/enhanced-footer';
import { FadeInSection } from '@/components/fade-in-section';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { CheckCircle } from 'lucide-react';

export default function NidhiCompanyPage() {
  const router = useRouter();

  const handleBookService = () => {
    router.push(`/contact?service=Nidhi+Company`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <EnhancedHeader />
      <main className="container mx-auto px-4 py-16">
        <FadeInSection>
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center">Nidhi Company Registration</CardTitle>
              <CardDescription className="text-center text-lg">A simple and effective way to foster the habit of thrift and savings among its members.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-center">
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl my-4 max-w-xs mx-auto">
                <div className="text-2xl font-bold text-blue-600">₹29,999</div>
                <div className="text-sm text-gray-600">Starting Price</div>
              </div>
              <p className="text-left">
                A Nidhi Company is a type of company in the Indian non-banking finance sector, recognized under section 406 of the Companies Act, 2013. Their core business is borrowing and lending money between their members. They are also known as Permanent Fund, Benefit Funds, Mutual Benefit Funds, and Mutual Benefit Company.
              </p>
            </CardContent>
          </Card>
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
          <Card className="max-w-4xl mx-auto">
            <CardContent className="space-y-6 text-center">
              <Button onClick={handleBookService} className="w-full">Book This Service</Button>
            </CardContent>
          </Card>
        </FadeInSection>
      </main>
      <EnhancedFooter />
    </div>
  );
}
