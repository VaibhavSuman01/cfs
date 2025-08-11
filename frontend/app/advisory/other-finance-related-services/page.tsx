"use client";

import { EnhancedHeader } from '@/components/enhanced-header';
import { EnhancedFooter } from '@/components/enhanced-footer';
import { FadeInSection } from '@/components/fade-in-section';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function OtherFinanceServicesPage() {
  const router = useRouter();

  const handleBookService = () => {
    router.push(`/contact?service=Other+Finance+Related+Services`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <EnhancedHeader />
      <main className="container mx-auto px-4 py-16">
        <FadeInSection>
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center">Other Finance Related Services</CardTitle>
              <CardDescription className="text-center text-lg">Comprehensive financial services tailored to your specific needs.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <p>
                Beyond our standard offerings, we provide a range of bespoke financial services to address unique business challenges. Whether you need assistance with financial restructuring, due diligence, or other specialized financial advisory, our team is here to provide expert support.
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
