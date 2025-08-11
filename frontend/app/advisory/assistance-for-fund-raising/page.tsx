"use client";

import { EnhancedHeader } from '@/components/enhanced-header';
import { EnhancedFooter } from '@/components/enhanced-footer';
import { FadeInSection } from '@/components/fade-in-section';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function FundRaisingPage() {
  const router = useRouter();

  const handleBookService = () => {
    router.push(`/contact?service=Assistance+for+Fund+Raising`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <EnhancedHeader />
      <main className="container mx-auto px-4 py-16">
        <FadeInSection>
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center">Assistance for Fund Raising</CardTitle>
              <CardDescription className="text-center text-lg">Navigate the complexities of raising capital for your business.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <p>
                Securing funding is a critical step for business growth. We provide expert guidance on developing a compelling business plan, preparing investor pitches, and connecting with potential investors. Our assistance covers everything from seed funding to venture capital, helping you secure the capital you need to succeed.
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
