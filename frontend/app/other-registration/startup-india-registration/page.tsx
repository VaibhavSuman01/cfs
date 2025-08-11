"use client";

import { EnhancedHeader } from '@/components/enhanced-header';
import { EnhancedFooter } from '@/components/enhanced-footer';
import { FadeInSection } from '@/components/fade-in-section';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function StartupIndiaRegistrationPage() {
  const router = useRouter();

  const handleBookService = () => {
    router.push(`/contact?service=Startup+India+Registration`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <EnhancedHeader />
      <main className="container mx-auto px-4 py-16">
        <FadeInSection>
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center">Start-up India Registration</CardTitle>
              <CardDescription className="text-center text-lg">Join the flagship initiative of the Government of India to foster a strong startup ecosystem.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <p>
                The Startup India scheme aims to promote and support startups in India by providing benefits like tax exemptions, easier compliance, and intellectual property rights protection. Registration under this scheme gives a startup access to a network of mentors, investors, and other startups.
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
