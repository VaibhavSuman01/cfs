"use client";

import { EnhancedHeader } from '@/components/enhanced-header';
import { EnhancedFooter } from '@/components/enhanced-footer';
import { FadeInSection } from '@/components/fade-in-section';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function GumustaShopRegistrationPage() {
  const router = useRouter();

  const handleBookService = () => {
    router.push(`/contact?service=Gumusta+Shop+Registration`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <EnhancedHeader />
      <main className="container mx-auto px-4 py-16">
        <FadeInSection>
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center">Gumusta / Shop & Establishment Registration</CardTitle>
              <CardDescription className="text-center text-lg">A mandatory registration for all shops and commercial establishments.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-center">
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl my-4 max-w-xs mx-auto">
                <div className="text-2xl font-bold text-blue-600">₹999</div>
                <div className="text-sm text-gray-600">Starting Price</div>
              </div>
              <p className="text-left">
                The Shop and Establishment Act requires all commercial establishments, such as hotels, eateries, and amusement parks, to obtain a registration certificate. This license, often called 'Gumusta' in some regions, is a legal requirement for operating a business and serves as proof of its existence.
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
