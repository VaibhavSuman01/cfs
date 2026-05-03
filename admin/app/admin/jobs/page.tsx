"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/providers/auth-provider";
import api, { API_PATHS } from "@/lib/api-client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, MoreHorizontal, Plus, Archive, EyeOff, Upload, Trash2 } from "lucide-react";

type JobPosting = {
  _id: string;
  title: string;
  slug: string;
  department?: string;
  location?: string;
  employmentType?: string;
  experienceLevel?: string;
  isPublished: boolean;
  publishedAt?: string;
  closingDate?: string | null;
  isArchived?: boolean;
  updatedAt?: string;
};

export default function AdminJobsPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<JobPosting | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const canLoad = user && user.role === "admin";

  const filteredJobs = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return jobs;
    return jobs.filter((j) => (j.title || "").toLowerCase().includes(q) || (j.slug || "").toLowerCase().includes(q));
  }, [jobs, search]);

  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      const res = await api.get(API_PATHS.ADMIN.JOBS);
      setJobs(res.data.jobs || []);
    } catch (e) {
      console.error("Failed to fetch jobs:", e);
      toast.error("Failed to load jobs. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (canLoad) fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canLoad]);

  const publish = async (id: string) => {
    try {
      await api.put(API_PATHS.ADMIN.JOB_PUBLISH(id));
      toast.success("Job published");
      fetchJobs();
    } catch (e) {
      console.error("Publish job failed:", e);
      toast.error("Failed to publish job.");
    }
  };

  const unpublish = async (id: string) => {
    try {
      await api.put(API_PATHS.ADMIN.JOB_UNPUBLISH(id));
      toast.success("Job unpublished");
      fetchJobs();
    } catch (e) {
      console.error("Unpublish job failed:", e);
      toast.error("Failed to unpublish job.");
    }
  };

  const archiveJob = async (id: string) => {
    try {
      await api.put(API_PATHS.ADMIN.JOB_ARCHIVE(id));
      toast.success("Job archived");
      fetchJobs();
    } catch (e) {
      console.error("Archive job failed:", e);
      toast.error("Failed to archive job.");
    }
  };

  const deleteJob = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await api.delete(API_PATHS.ADMIN.JOB_DELETE(deleteTarget._id));
      toast.success("Job deleted permanently");
      setDeleteTarget(null);
      fetchJobs();
    } catch (e: any) {
      console.error("Delete job failed:", e);
      toast.error(e?.response?.data?.message || "Failed to delete job.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-white">Jobs</h1>
          <p className="text-sm text-white/70">Create, publish, and archive job postings.</p>
        </div>
        <Button asChild>
          <Link href="/admin/jobs/new">
            <Plus className="mr-2 h-4 w-4" />
            New Job
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Job Postings</CardTitle>
          <CardDescription>Drafts never appear publicly until published.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-3">
            <Input placeholder="Search by title or slug…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Dept / Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <TableRow key={job._id}>
                    <TableCell className="font-medium">
                      <div className="space-y-1">
                        <div>{job.title}</div>
                        <div className="text-xs text-muted-foreground">/{job.slug}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{job.department || "—"}</div>
                      <div className="text-xs text-muted-foreground">{job.location || "—"}</div>
                    </TableCell>
                    <TableCell>
                      {job.isArchived ? (
                        <Badge variant="secondary">Archived</Badge>
                      ) : job.isPublished ? (
                        <Badge variant="default">Published</Badge>
                      ) : (
                        <Badge variant="secondary">Draft</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/jobs/${job._id}/edit`}>Edit</Link>
                          </DropdownMenuItem>
                          {!job.isArchived && !job.isPublished && (
                            <DropdownMenuItem onClick={() => publish(job._id)}>
                              <Upload className="mr-2 h-4 w-4" />
                              Publish
                            </DropdownMenuItem>
                          )}
                          {!job.isArchived && job.isPublished && (
                            <DropdownMenuItem onClick={() => unpublish(job._id)}>
                              <EyeOff className="mr-2 h-4 w-4" />
                              Unpublish
                            </DropdownMenuItem>
                          )}
                          {!job.isArchived && (
                            <DropdownMenuItem onClick={() => archiveJob(job._id)}>
                              <Archive className="mr-2 h-4 w-4" />
                              Archive
                            </DropdownMenuItem>
                          )}
                          {job.isArchived && (
                            <DropdownMenuItem onClick={() => setDeleteTarget(job)}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete permanently
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="py-10 text-center text-sm text-muted-foreground">
                    No jobs found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!deleteTarget} onOpenChange={(open) => (!open ? setDeleteTarget(null) : undefined)}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Delete job permanently?</DialogTitle>
            <DialogDescription>
              This will permanently delete the archived job. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={deleteJob} disabled={isDeleting}>
              {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

