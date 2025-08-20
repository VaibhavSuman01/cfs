"use client";

import { EnhancedHeader } from '@/components/enhanced-header';
import { EnhancedFooter } from '@/components/enhanced-footer';
import { FadeInSection } from '@/components/fade-in-section';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function NgoRegistrationPage() {

  return (
    <div className="min-h-screen bg-gray-50">
      <EnhancedHeader />
      <main className="container mx-auto px-4 py-16">
        <FadeInSection>
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center">NGO Registration</CardTitle>
              <CardDescription className="text-center text-lg">Establish your non-profit organization and start making a difference.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <p>
                A Non-Governmental Organization (NGO) is a non-profit, voluntary citizens' group organized on a local, national or international level. Registering your NGO as a Trust, Society, or Section 8 Company provides it with legal status and makes it eligible for tax exemptions and government funding.
              </p>
              <Link href={`/contact?service=${encodeURIComponent('NGO Registration')}`} passHref>
                <Button className="w-full">Book This Service</Button>
              </Link>
            </CardContent>
          </Card>
        </FadeInSection>
      </main>
      <EnhancedFooter />
    </div>
  );
}
