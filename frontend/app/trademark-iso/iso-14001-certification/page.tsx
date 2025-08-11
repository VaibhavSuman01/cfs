"use client";

import { EnhancedHeader } from '@/components/enhanced-header';
import { EnhancedFooter } from '@/components/enhanced-footer';
import { FadeInSection } from '@/components/fade-in-section';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function Iso14001Page() {
  const router = useRouter();

  const handleBookService = () => {
    router.push(`/contact?service=ISO+14001+Certification`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <EnhancedHeader />
      <main className="container mx-auto px-4 py-16">
        <FadeInSection>
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center">ISO 14001 Certification</CardTitle>
              <CardDescription className="text-center text-lg">Demonstrate your commitment to environmental management.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <p>
                ISO 14001 is the international standard for an effective environmental management system (EMS). It provides a framework that an organization can follow, rather than establishing environmental performance requirements. Certification helps organizations improve their environmental performance through more efficient use of resources and reduction of waste.
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
