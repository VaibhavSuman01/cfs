"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import api, { API_PATHS } from "@/lib/api-client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, ArrowLeft, Save } from "lucide-react";

const splitLines = (v: string) =>
  v
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

export default function NewJobPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    department: "",
    location: "",
    employmentType: "",
    experienceLevel: "",
    description: "",
    requirementsText: "",
    benefitsText: "",
    closingDate: "",
  });

  const save = async () => {
    if (!form.title.trim()) {
      toast.error("Title is required.");
      return;
    }

    setIsSaving(true);
    try {
      const res = await api.post(API_PATHS.ADMIN.JOBS, {
        title: form.title.trim(),
        slug: form.slug.trim() || undefined,
        department: form.department.trim() || undefined,
        location: form.location.trim() || undefined,
        employmentType: form.employmentType.trim() || undefined,
        experienceLevel: form.experienceLevel.trim() || undefined,
        description: form.description.trim() || undefined,
        requirements: splitLines(form.requirementsText),
        benefits: splitLines(form.benefitsText),
        closingDate: form.closingDate || undefined,
      });

      toast.success("Job created");
      const id = res.data.job?._id;
      router.push(id ? `/admin/jobs/${id}/edit` : "/admin/jobs");
    } catch (e: any) {
      console.error("Create job failed:", e);
      toast.error(e?.response?.data?.message || "Failed to create job.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex items-center justify-between gap-3">
        <Button variant="outline" asChild>
          <Link href="/admin/jobs">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New Job</CardTitle>
          <CardDescription>Create a job posting in draft mode. Publish it when ready.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="title">Title*</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="e.g. Senior Full-Stack Engineer"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="slug">Slug (optional)</Label>
            <Input
              id="slug"
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              placeholder="e.g. senior-full-stack-engineer"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={form.department}
                onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}
                placeholder="e.g. Engineering"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={form.location}
                onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                placeholder="e.g. Patna / Remote"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="employmentType">Employment type</Label>
              <Input
                id="employmentType"
                value={form.employmentType}
                onChange={(e) => setForm((f) => ({ ...f, employmentType: e.target.value }))}
                placeholder="e.g. Full-time"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="experienceLevel">Experience level</Label>
              <Input
                id="experienceLevel"
                value={form.experienceLevel}
                onChange={(e) => setForm((f) => ({ ...f, experienceLevel: e.target.value }))}
                placeholder="e.g. 3–5 years"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="closingDate">Closing date (optional)</Label>
            <Input
              id="closingDate"
              type="date"
              value={form.closingDate}
              onChange={(e) => setForm((f) => ({ ...f, closingDate: e.target.value }))}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description (Markdown)</Label>
            <Textarea
              id="description"
              className="min-h-[180px]"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Role overview, responsibilities, etc."
            />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="requirements">Requirements (one per line)</Label>
              <Textarea
                id="requirements"
                className="min-h-[160px]"
                value={form.requirementsText}
                onChange={(e) => setForm((f) => ({ ...f, requirementsText: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="benefits">Benefits (one per line)</Label>
              <Textarea
                id="benefits"
                className="min-h-[160px]"
                value={form.benefitsText}
                onChange={(e) => setForm((f) => ({ ...f, benefitsText: e.target.value }))}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={save} disabled={isSaving}>
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save draft
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

