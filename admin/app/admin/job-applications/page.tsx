"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import api, { API_PATHS } from "@/lib/api-client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, ExternalLink, Trash2 } from "lucide-react";

type Application = {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  status: "Applied" | "InReview" | "Shortlisted" | "Rejected" | "Hired";
  createdAt: string;
  jobId?: {
    _id: string;
    title: string;
    slug: string;
  };
};

const StatusBadge = ({ status }: { status: Application["status"] }) => {
  const variant = status === "Rejected" ? "destructive" : status === "Hired" ? "default" : "secondary";
  return <Badge variant={variant as any}>{status}</Badge>;
};

export default function JobApplicationsPage() {
  const [items, setItems] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [deleteTarget, setDeleteTarget] = useState<Application | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchApps = async () => {
    try {
      setIsLoading(true);
      const params: any = {};
      if (status !== "all") params.status = status;
      if (search.trim()) params.search = search.trim();

      const res = await api.get(API_PATHS.ADMIN.JOB_APPLICATIONS, { params });
      setItems(res.data.applications || []);
    } catch (e) {
      console.error("Failed to fetch applications:", e);
      toast.error("Failed to load applications.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const deleteApplication = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await api.delete(API_PATHS.ADMIN.JOB_APPLICATION_DELETE(deleteTarget._id));
      toast.success("Application deleted");
      setDeleteTarget(null);
      fetchApps();
    } catch (e: any) {
      console.error("Delete application failed:", e);
      toast.error(e?.response?.data?.message || "Failed to delete application.");
    } finally {
      setIsDeleting(false);
    }
  };

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (a) =>
        (a.fullName || "").toLowerCase().includes(q) ||
        (a.email || "").toLowerCase().includes(q) ||
        (a.jobId?.title || "").toLowerCase().includes(q)
    );
  }, [items, search]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white">Applications</h1>
        <p className="text-sm text-white/70">Filter, review, and respond to applicants.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Job Applications</CardTitle>
          <CardDescription>Search by applicant or job title. Open an application to view resume and email thread.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center">
            <Input placeholder="Search…" value={search} onChange={(e) => setSearch(e.target.value)} />
            <div className="w-full md:w-64">
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="Applied">Applied</SelectItem>
                  <SelectItem value="InReview">InReview</SelectItem>
                  <SelectItem value="Shortlisted">Shortlisted</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                  <SelectItem value="Hired">Hired</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="secondary" onClick={fetchApps}>
              Refresh
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Applicant</TableHead>
                <TableHead>Job</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.length > 0 ? (
                visible.map((a) => (
                  <TableRow key={a._id}>
                    <TableCell className="font-medium">
                      <div className="space-y-1">
                        <div>{a.fullName}</div>
                        <div className="text-xs text-muted-foreground">{a.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{a.jobId?.title || "—"}</TableCell>
                    <TableCell>
                      <StatusBadge status={a.status} />
                    </TableCell>
                    <TableCell>{new Date(a.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/admin/job-applications/${a._id}`}>
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Open
                          </Link>
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => setDeleteTarget(a)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">
                    No applications found.
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
            <DialogTitle>Delete application?</DialogTitle>
            <DialogDescription>
              This will permanently delete the application (including resume metadata and email log). This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={deleteApplication} disabled={isDeleting}>
              {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

