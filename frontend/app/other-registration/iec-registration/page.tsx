"use client";

import { EnhancedHeader } from '@/components/enhanced-header';
import { EnhancedFooter } from '@/components/enhanced-footer';
import { FadeInSection } from '@/components/fade-in-section';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function IecRegistrationPage() {
  const router = useRouter();

  const handleBookService = () => {
    router.push(`/contact?service=IEC+Registration`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <EnhancedHeader />
      <main className="container mx-auto px-4 py-16">
        <FadeInSection>
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center">IEC Registration</CardTitle>
              <CardDescription className="text-center text-lg">Unlock global markets with your Import Export Code.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-center">
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl my-4 max-w-xs mx-auto">
                <div className="text-2xl font-bold text-blue-600">On Request</div>
                <div className="text-sm text-gray-600">Price</div>
              </div>
              <p className="text-left">
                An Importer-Exporter Code (IEC) is a key business identification number which is mandatory for exports or imports. No person shall make any import or export except under an IEC Number granted by the DGFT. It is a 10-digit code that is required by anyone looking to start an import/export business in the country.
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
