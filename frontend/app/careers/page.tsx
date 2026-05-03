import Link from "next/link";
import { EnhancedHeader } from "@/components/enhanced-header";
import { EnhancedFooter } from "@/components/enhanced-footer";
import { buildPageMetadata } from "@/lib/seo";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata = buildPageMetadata({
  path: "/careers",
  title: "Careers",
  description: "Explore open roles at Com Financial Services and apply online.",
});

type Job = {
  _id: string;
  title: string;
  slug: string;
  department?: string;
  location?: string;
  employmentType?: string;
  experienceLevel?: string;
  publishedAt?: string;
  closingDate?: string | null;
};

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001").replace(/\/+$/, "");

async function getJobs(): Promise<Job[]> {
  const res = await fetch(`${API_BASE}/api/jobs`, { cache: "no-store" });
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data.jobs) ? data.jobs : [];
}

export default async function CareersPage() {
  const jobs = await getJobs();

  return (
    <div className="min-h-screen bg-white">
      <EnhancedHeader />

      <section className="pt-24 pb-16 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold text-gray-900">Careers</h1>
            <p className="mt-4 text-lg text-gray-600">
              Join Com Financial Services. Browse open roles and apply in minutes.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          {jobs.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {jobs.map((job) => (
                <Card key={job._id} className="border-2 border-blue-100 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">{job.title}</h2>
                        <div className="mt-1 text-sm text-gray-600">
                          {job.department ? job.department : "—"} • {job.location ? job.location : "—"}
                        </div>
                      </div>
                      <Badge variant="secondary">Open</Badge>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {job.employmentType && <Badge variant="outline">{job.employmentType}</Badge>}
                      {job.experienceLevel && <Badge variant="outline">{job.experienceLevel}</Badge>}
                      {job.closingDate && (
                        <Badge variant="outline">
                          Closes {new Date(job.closingDate).toLocaleDateString()}
                        </Badge>
                      )}
                    </div>

                    <div className="pt-2">
                      <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Link href={`/careers/${job.slug}`}>View & Apply</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-2 border-blue-100">
              <CardContent className="p-10 text-center">
                <h2 className="text-xl font-semibold text-gray-900">No open roles right now</h2>
                <p className="mt-2 text-gray-600">Please check back soon.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      <EnhancedFooter />
    </div>
  );
}

