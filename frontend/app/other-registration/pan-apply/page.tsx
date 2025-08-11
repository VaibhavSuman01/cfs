"use client";

import { EnhancedHeader } from '@/components/enhanced-header';
import { EnhancedFooter } from '@/components/enhanced-footer';
import { FadeInSection } from '@/components/fade-in-section';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function PanApplyPage() {
  const router = useRouter();

  const handleBookService = () => {
    router.push(`/contact?service=PAN+Apply`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <EnhancedHeader />
      <main className="container mx-auto px-4 py-16">
        <FadeInSection>
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center">PAN Application</CardTitle>
              <CardDescription className="text-center text-lg">Obtain your Permanent Account Number, a crucial document for financial transactions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <p>
                A Permanent Account Number (PAN) is a ten-digit alphanumeric number, issued in the form of a laminated card, by the Income Tax Department of India. It is a mandatory requirement for filing income tax returns, and for a majority of financial transactions such as opening a bank account, and buying or selling property.
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
