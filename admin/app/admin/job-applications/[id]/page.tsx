"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import api, { API_PATHS } from "@/lib/api-client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, ArrowLeft, Download, Mail, Send, StickyNote, Trash2 } from "lucide-react";

type EmailLog = {
  subject: string;
  message: string;
  sentAt: string;
  sentBy?: { name?: string; email?: string };
};

type AdminNote = {
  note: string;
  addedAt: string;
  addedBy?: { name?: string; email?: string };
};

type Application = {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  linkedIn?: string;
  portfolio?: string;
  coverLetter?: string;
  status: "Applied" | "InReview" | "Shortlisted" | "Rejected" | "Hired";
  resume?: { originalName?: string; fileName?: string; contentType?: string; size?: number };
  jobId?: { _id: string; title: string; slug: string };
  adminNotes?: AdminNote[];
  emailLog?: EmailLog[];
  createdAt: string;
};

export default function JobApplicationDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [app, setApp] = useState<Application | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [note, setNote] = useState("");

  // Email dialog
  const [isEmailOpen, setIsEmailOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const load = async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      const res = await api.get(API_PATHS.ADMIN.JOB_APPLICATION_DETAIL(id));
      const data = res.data.application as Application;
      setApp(data);
      setEmailSubject(`Re: Your application – ${data.jobId?.title || "Job"}`);
    } catch (e) {
      console.error("Load application failed:", e);
      toast.error("Failed to load application.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const hasResume = !!app?.resume?.originalName || !!app?.resume?.fileName;

  const thread = useMemo(() => (Array.isArray(app?.emailLog) ? app!.emailLog : []), [app]);
  const notes = useMemo(() => (Array.isArray(app?.adminNotes) ? app!.adminNotes : []), [app]);

  const updateStatus = async (status: Application["status"]) => {
    if (!id) return;
    setIsUpdatingStatus(true);
    try {
      await api.put(API_PATHS.ADMIN.JOB_APPLICATION_STATUS(id), {
        status,
        note: note.trim() || undefined,
      });
      setNote("");
      toast.success("Status updated");
      await load();
    } catch (e) {
      console.error("Update status failed:", e);
      toast.error("Failed to update status.");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const addNote = async () => {
    if (!id) return;
    const v = note.trim();
    if (!v) {
      toast.error("Write a note first.");
      return;
    }
    try {
      await api.post(API_PATHS.ADMIN.JOB_APPLICATION_NOTES(id), { note: v });
      setNote("");
      toast.success("Note added");
      load();
    } catch (e) {
      console.error("Add note failed:", e);
      toast.error("Failed to add note.");
    }
  };

  const downloadResume = async () => {
    if (!id || !app) return;
    const filename = app.resume?.originalName || app.resume?.fileName || "resume";
    try {
      await api.downloadFile(API_PATHS.ADMIN.JOB_APPLICATION_RESUME(id), filename);
    } catch (e) {
      console.error("Resume download failed:", e);
      toast.error("Failed to download resume.");
    }
  };

  const sendEmail = async () => {
    if (!id || !app) return;
    if (!emailSubject.trim() || !emailMessage.trim()) {
      toast.error("Subject and message are required.");
      return;
    }
    setIsSendingEmail(true);
    try {
      await api.post(API_PATHS.ADMIN.JOB_APPLICATION_EMAIL(id), {
        subject: emailSubject.trim(),
        message: emailMessage.trim(),
      });
      toast.success("Email sent");
      setIsEmailOpen(false);
      setEmailMessage("");
      load();
    } catch (e) {
      console.error("Send email failed:", e);
      toast.error("Failed to send email.");
    } finally {
      setIsSendingEmail(false);
    }
  };

  const deleteApplication = async () => {
    if (!id) return;
    setIsDeleting(true);
    try {
      await api.delete(API_PATHS.ADMIN.JOB_APPLICATION_DELETE(id));
      toast.success("Application deleted");
      window.location.href = "/admin/job-applications";
    } catch (e: any) {
      console.error("Delete application failed:", e);
      toast.error(e?.response?.data?.message || "Failed to delete application.");
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

  if (!app) return null;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between gap-3">
        <Button variant="outline" asChild>
          <Link href="/admin/job-applications">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          {hasResume && (
            <Button variant="secondary" onClick={downloadResume}>
              <Download className="mr-2 h-4 w-4" />
              Download Resume
            </Button>
          )}
          <Button onClick={() => setIsEmailOpen(true)}>
            <Mail className="mr-2 h-4 w-4" />
            Email Applicant
          </Button>
          <Button variant="destructive" onClick={() => setIsDeleteOpen(true)}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Application</CardTitle>
          <CardDescription>
            {app.jobId?.title || "Job"} • Submitted {new Date(app.createdAt).toLocaleString()}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3">
            <div>
              <div className="text-sm text-muted-foreground">Applicant</div>
              <div className="text-base font-medium">{app.fullName}</div>
              <div className="text-sm text-muted-foreground">{app.email}</div>
            </div>
            {app.phone && (
              <div>
                <div className="text-sm text-muted-foreground">Phone</div>
                <div className="text-sm">{app.phone}</div>
              </div>
            )}
            {app.linkedIn && (
              <div>
                <div className="text-sm text-muted-foreground">LinkedIn</div>
                <a className="text-sm underline" href={app.linkedIn} target="_blank" rel="noreferrer">
                  {app.linkedIn}
                </a>
              </div>
            )}
            {app.portfolio && (
              <div>
                <div className="text-sm text-muted-foreground">Portfolio</div>
                <a className="text-sm underline" href={app.portfolio} target="_blank" rel="noreferrer">
                  {app.portfolio}
                </a>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <div className="text-sm text-muted-foreground mb-2">Status</div>
              <div className="flex items-center gap-3">
                <Badge variant={app.status === "Rejected" ? "destructive" : app.status === "Hired" ? "default" : "secondary"}>
                  {app.status}
                </Badge>
                <div className="w-56">
                  <Select value={app.status} onValueChange={(v) => updateStatus(v as any)} disabled={isUpdatingStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Applied">Applied</SelectItem>
                      <SelectItem value="InReview">InReview</SelectItem>
                      <SelectItem value="Shortlisted">Shortlisted</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                      <SelectItem value="Hired">Hired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="note">Add admin note</Label>
              <Textarea
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Internal note (not visible to applicant)…"
                className="min-h-[120px]"
              />
              <div className="flex gap-2">
                <Button variant="secondary" onClick={addNote}>
                  <StickyNote className="mr-2 h-4 w-4" />
                  Add Note
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {app.coverLetter && (
        <Card>
          <CardHeader>
            <CardTitle>Cover Letter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="whitespace-pre-line text-sm">{app.coverLetter}</div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Admin Notes</CardTitle>
          <CardDescription>Internal notes are stored and audited with author + timestamp.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {notes.length > 0 ? (
            notes
              .slice()
              .reverse()
              .map((n, idx) => (
                <div key={idx} className="rounded-md border p-3">
                  <div className="text-xs text-muted-foreground mb-2">
                    {new Date(n.addedAt).toLocaleString()} • {n.addedBy?.name || n.addedBy?.email || "Admin"}
                  </div>
                  <div className="whitespace-pre-line text-sm">{n.note}</div>
                </div>
              ))
          ) : (
            <div className="text-sm text-muted-foreground">No notes yet.</div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Email Thread</CardTitle>
          <CardDescription>Every email sent from admin is logged here.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {thread.length > 0 ? (
            thread
              .slice()
              .reverse()
              .map((m, idx) => (
                <div key={idx} className="rounded-md border p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-medium text-sm">{m.subject}</div>
                    <div className="text-xs text-muted-foreground">{new Date(m.sentAt).toLocaleString()}</div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Sent by {m.sentBy?.name || m.sentBy?.email || "Admin"}
                  </div>
                  <div className="whitespace-pre-line text-sm mt-3">{m.message}</div>
                </div>
              ))
          ) : (
            <div className="text-sm text-muted-foreground">No emails sent yet.</div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isEmailOpen} onOpenChange={setIsEmailOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Email Applicant</DialogTitle>
            <DialogDescription>Send an email and automatically log it to this application.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={emailMessage}
                onChange={(e) => setEmailMessage(e.target.value)}
                className="min-h-[200px]"
                placeholder="Type your message…"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEmailOpen(false)}>
              Cancel
            </Button>
            <Button onClick={sendEmail} disabled={isSendingEmail}>
              {isSendingEmail ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
              Send Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Delete application?</DialogTitle>
            <DialogDescription>
              This will permanently delete the application (including resume metadata and email log). This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)} disabled={isDeleting}>
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

