"use client";

import { EnhancedHeader } from '@/components/enhanced-header';
import { EnhancedFooter } from '@/components/enhanced-footer';
import { FadeInSection } from '@/components/fade-in-section';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ProjectReportsPage() {

  return (
    <div className="min-h-screen bg-gray-50">
      <EnhancedHeader />
      <main className="container mx-auto px-4 py-16">
        <FadeInSection>
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center">Project Reports</CardTitle>
              <CardDescription className="text-center text-lg">Detailed reports to assess the feasibility of a new project or business venture.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <p>
                A Project Report is a comprehensive document that provides a roadmap for a proposed business venture. It covers aspects like financial viability, market analysis, and operational planning, and is often required for securing bank loans and investments.
              </p>
              <Link href={`/contact?service=${encodeURIComponent('Project Reports')}`} passHref>
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
