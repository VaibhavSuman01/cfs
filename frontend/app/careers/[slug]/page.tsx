import { notFound } from "next/navigation";
import { EnhancedHeader } from "@/components/enhanced-header";
import { EnhancedFooter } from "@/components/enhanced-footer";
import { buildPageMetadata } from "@/lib/seo";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ApplyForm } from "./ApplyForm";

type Job = {
  _id: string;
  title: string;
  slug: string;
  department?: string;
  location?: string;
  employmentType?: string;
  experienceLevel?: string;
  description?: string;
  requirements?: string[];
  benefits?: string[];
  publishedAt?: string;
  closingDate?: string | null;
};

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001").replace(/\/+$/, "");

async function getJob(slug: string): Promise<Job | null> {
  const res = await fetch(`${API_BASE}/api/jobs/${encodeURIComponent(slug)}`, { cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) return null;
  const data = await res.json();
  return data.job || null;
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const job = await getJob(slug);

  if (!job) {
    return buildPageMetadata({
      path: `/careers/${slug}`,
      title: "Job not found",
      description: "This role is not available.",
    });
  }

  return buildPageMetadata({
    path: `/careers/${job.slug}`,
    title: `${job.title} – Careers`,
    description: `Apply for ${job.title} at Com Financial Services.`,
  });
}

export default async function CareerDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const job = await getJob(slug);
  if (!job) notFound();

  return (
    <div className="min-h-screen bg-white">
      <EnhancedHeader />

      <section className="pt-24 pb-10 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">{job.title}</h1>
            <div className="mt-4 flex flex-wrap gap-2">
              {job.department && <Badge variant="secondary">{job.department}</Badge>}
              {job.location && <Badge variant="secondary">{job.location}</Badge>}
              {job.employmentType && <Badge variant="outline">{job.employmentType}</Badge>}
              {job.experienceLevel && <Badge variant="outline">{job.experienceLevel}</Badge>}
              {job.closingDate && (
                <Badge variant="outline">Closes {new Date(job.closingDate).toLocaleDateString()}</Badge>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="container mx-auto px-4 grid gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            {job.description && (
              <Card className="border-2 border-blue-100">
                <CardContent className="p-6 space-y-3">
                  <h2 className="text-xl font-semibold text-gray-900">About the role</h2>
                  <div className="text-sm text-gray-700 whitespace-pre-line">{job.description}</div>
                </CardContent>
              </Card>
            )}

            {Array.isArray(job.requirements) && job.requirements.length > 0 && (
              <Card className="border-2 border-blue-100">
                <CardContent className="p-6 space-y-3">
                  <h2 className="text-xl font-semibold text-gray-900">Requirements</h2>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                    {job.requirements.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {Array.isArray(job.benefits) && job.benefits.length > 0 && (
              <Card className="border-2 border-blue-100">
                <CardContent className="p-6 space-y-3">
                  <h2 className="text-xl font-semibold text-gray-900">Benefits</h2>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                    {job.benefits.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Apply now</h2>
              <p className="text-gray-600 mt-1">Fill out the form below. Resume upload is optional.</p>
            </div>
            <ApplyForm jobId={job._id} />
          </div>
        </div>
      </section>

      <EnhancedFooter />
    </div>
  );
}

