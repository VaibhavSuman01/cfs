"use client";

import { EnhancedHeader } from '@/components/enhanced-header';
import { EnhancedFooter } from '@/components/enhanced-footer';
import { FadeInSection } from '@/components/fade-in-section';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function EsicPage() {
  const router = useRouter();

  const handleBookService = () => {
    router.push(`/contact?service=ESIC+Registration`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <EnhancedHeader />
      <main className="container mx-auto px-4 py-16">
        <FadeInSection>
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center">ESIC Registration</CardTitle>
              <CardDescription className="text-center text-lg">Provide your employees with comprehensive health and social security benefits.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-center">
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl my-4 max-w-xs mx-auto">
                <div className="text-2xl font-bold text-blue-600">On Request</div>
                <div className="text-sm text-gray-600">Price</div>
              </div>
              <p className="text-left">
                The Employees' State Insurance (ESI) scheme is a social security and health insurance scheme for Indian workers. Registration is mandatory for employers with 10 or more employees, offering medical care, sickness benefits, and more.
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
