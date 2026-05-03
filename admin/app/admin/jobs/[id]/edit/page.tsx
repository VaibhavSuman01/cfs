"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import api, { API_PATHS } from "@/lib/api-client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, ArrowLeft, Save, Upload, EyeOff, Archive } from "lucide-react";

type JobPosting = {
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
  closingDate?: string | null;
  isPublished: boolean;
  isArchived?: boolean;
};

const joinLines = (arr?: string[]) => (Array.isArray(arr) ? arr.join("\n") : "");
const splitLines = (v: string) =>
  v
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

export default function EditJobPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params?.id;

  const [job, setJob] = useState<JobPosting | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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

  const isArchived = !!job?.isArchived;

  const dirty = useMemo(() => {
    if (!job) return false;
    return (
      form.title !== (job.title || "") ||
      form.slug !== (job.slug || "") ||
      form.department !== (job.department || "") ||
      form.location !== (job.location || "") ||
      form.employmentType !== (job.employmentType || "") ||
      form.experienceLevel !== (job.experienceLevel || "") ||
      form.description !== (job.description || "") ||
      form.requirementsText !== joinLines(job.requirements) ||
      form.benefitsText !== joinLines(job.benefits) ||
      form.closingDate !== (job.closingDate ? job.closingDate.slice(0, 10) : "")
    );
  }, [form, job]);

  const load = async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      const res = await api.get(API_PATHS.ADMIN.JOB_DETAIL(id));
      const j = res.data.job as JobPosting;
      setJob(j);
      setForm({
        title: j.title || "",
        slug: j.slug || "",
        department: j.department || "",
        location: j.location || "",
        employmentType: j.employmentType || "",
        experienceLevel: j.experienceLevel || "",
        description: j.description || "",
        requirementsText: joinLines(j.requirements),
        benefitsText: joinLines(j.benefits),
        closingDate: j.closingDate ? j.closingDate.slice(0, 10) : "",
      });
    } catch (e) {
      console.error("Load job failed:", e);
      toast.error("Failed to load job.");
      router.push("/admin/jobs");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const save = async () => {
    if (!id) return;
    if (!form.title.trim()) {
      toast.error("Title is required.");
      return;
    }
    if (!form.slug.trim()) {
      toast.error("Slug is required.");
      return;
    }
    setIsSaving(true);
    try {
      const res = await api.put(API_PATHS.ADMIN.JOB_DETAIL(id), {
        title: form.title.trim(),
        slug: form.slug.trim(),
        department: form.department.trim(),
        location: form.location.trim(),
        employmentType: form.employmentType.trim(),
        experienceLevel: form.experienceLevel.trim(),
        description: form.description.trim(),
        requirements: splitLines(form.requirementsText),
        benefits: splitLines(form.benefitsText),
        closingDate: form.closingDate || null,
      });
      setJob(res.data.job);
      toast.success("Saved");
    } catch (e: any) {
      console.error("Save job failed:", e);
      toast.error(e?.response?.data?.message || "Failed to save.");
    } finally {
      setIsSaving(false);
    }
  };

  const publish = async () => {
    if (!id) return;
    try {
      await api.put(API_PATHS.ADMIN.JOB_PUBLISH(id));
      toast.success("Published");
      load();
    } catch (e) {
      console.error("Publish job failed:", e);
      toast.error("Failed to publish.");
    }
  };

  const unpublish = async () => {
    if (!id) return;
    try {
      await api.put(API_PATHS.ADMIN.JOB_UNPUBLISH(id));
      toast.success("Unpublished");
      load();
    } catch (e) {
      console.error("Unpublish job failed:", e);
      toast.error("Failed to unpublish.");
    }
  };

  const archiveJob = async () => {
    if (!id) return;
    try {
      await api.put(API_PATHS.ADMIN.JOB_ARCHIVE(id));
      toast.success("Archived");
      load();
    } catch (e) {
      console.error("Archive job failed:", e);
      toast.error("Failed to archive.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!job) return null;

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex items-center justify-between gap-3">
        <Button variant="outline" asChild>
          <Link href="/admin/jobs">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          {!isArchived && !job.isPublished && (
            <Button variant="default" onClick={publish}>
              <Upload className="mr-2 h-4 w-4" />
              Publish
            </Button>
          )}
          {!isArchived && job.isPublished && (
            <Button variant="secondary" onClick={unpublish}>
              <EyeOff className="mr-2 h-4 w-4" />
              Unpublish
            </Button>
          )}
          {!isArchived && (
            <Button variant="destructive" onClick={archiveJob}>
              <Archive className="mr-2 h-4 w-4" />
              Archive
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Job</CardTitle>
          <CardDescription>
            {job.isArchived ? "Archived" : job.isPublished ? "Published" : "Draft"} • Slug: /{job.slug}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="title">Title*</Label>
            <Input id="title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="slug">Slug*</Label>
            <Input id="slug" value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={form.department}
                onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="employmentType">Employment type</Label>
              <Input
                id="employmentType"
                value={form.employmentType}
                onChange={(e) => setForm((f) => ({ ...f, employmentType: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="experienceLevel">Experience level</Label>
              <Input
                id="experienceLevel"
                value={form.experienceLevel}
                onChange={(e) => setForm((f) => ({ ...f, experienceLevel: e.target.value }))}
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
            <div className="flex flex-col items-end gap-1">
            <Button onClick={save} disabled={isSaving || isArchived || !dirty}>
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save
            </Button>
              {isArchived ? (
                <p className="text-xs text-muted-foreground">Archived jobs can’t be edited. Create a new job instead.</p>
              ) : !dirty ? (
                <p className="text-xs text-muted-foreground">No changes to save.</p>
              ) : null}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

