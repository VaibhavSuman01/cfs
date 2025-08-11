"use client";

import { EnhancedHeader } from '@/components/enhanced-header';
import { EnhancedFooter } from '@/components/enhanced-footer';
import { FadeInSection } from '@/components/fade-in-section';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function CopyrightRegistrationPage() {
  const router = useRouter();

  const handleBookService = () => {
    router.push(`/contact?service=Copyright+Registration`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <EnhancedHeader />
      <main className="container mx-auto px-4 py-16">
        <FadeInSection>
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center">Copyright Registration</CardTitle>
              <CardDescription className="text-center text-lg">Protect your original creative works from unauthorized use.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <p>
                Copyright is a legal right that grants the creator of an original work exclusive rights for its use and distribution. Registering your copyright provides a public record of your ownership and is necessary before you can file a lawsuit for infringement. It protects literary, dramatic, musical, and artistic works.
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
