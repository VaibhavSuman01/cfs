"use client";

import { EnhancedHeader } from '@/components/enhanced-header';
import { EnhancedFooter } from '@/components/enhanced-footer';
import { FadeInSection } from '@/components/fade-in-section';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function FassaiFoodLicensePage() {
  const router = useRouter();

  const handleBookService = () => {
    router.push(`/contact?service=FSSAI+Food+License`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <EnhancedHeader />
      <main className="container mx-auto px-4 py-16">
        <FadeInSection>
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center">FSSAI Food License Registration</CardTitle>
              <CardDescription className="text-center text-lg">Ensure your food business complies with the food safety standards in India.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-center">
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl my-4 max-w-xs mx-auto">
                <div className="text-2xl font-bold text-blue-600">On Request</div>
                <div className="text-sm text-gray-600">Price</div>
              </div>
              <p className="text-left">
                The Food Safety and Standards Authority of India (FSSAI) is an autonomous body established under the Ministry of Health & Family Welfare. An FSSAI license is mandatory for any food business operator in India, ensuring the food products undergo quality checks and are safe for consumption.
              </p>
              <Button onClick={handleBookService} className="w-full">Book This Service</Button>
            </CardContent>
          </Card>
        </FadeInSection>
      </main>
      <EnhancedFooter />
    </div>
  );
}
