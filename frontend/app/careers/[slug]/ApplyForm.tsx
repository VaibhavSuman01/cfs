"use client";

import { useState } from "react";
import api from "@/lib/api-client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Send } from "lucide-react";

export function ApplyForm({ jobId }: { jobId: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [resume, setResume] = useState<File | null>(null);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    linkedIn: "",
    portfolio: "",
    coverLetter: "",
  });

  const validate = () => {
    if (!form.fullName.trim()) return "Full name is required.";
    if (!form.email.trim()) return "Email is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return "Enter a valid email.";
    if (!resume) return "Resume is required.";
    const max = 10 * 1024 * 1024;
    if (resume.size > max) return "Resume too large. Maximum size is 10MB.";
    const allowed = [".pdf", ".doc", ".docx"];
    const name = resume.name.toLowerCase();
    if (!allowed.some((ext) => name.endsWith(ext))) return "Resume must be PDF, DOC, or DOCX.";
    return null;
  };

  const submit = async () => {
    const err = validate();
    if (err) {
      toast.error(err);
      return;
    }

    const resumeFile = resume;
    if (!resumeFile) return;

    setIsSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("fullName", form.fullName.trim());
      fd.append("email", form.email.trim().toLowerCase());
      if (form.phone.trim()) fd.append("phone", form.phone.trim());
      if (form.linkedIn.trim()) fd.append("linkedIn", form.linkedIn.trim());
      if (form.portfolio.trim()) fd.append("portfolio", form.portfolio.trim());
      if (form.coverLetter.trim()) fd.append("coverLetter", form.coverLetter.trim());
      fd.append("resume", resumeFile);

      await api.post(`/api/jobs/${jobId}/apply`, fd);

      setIsSuccess(true);
      setForm({
        fullName: "",
        email: "",
        phone: "",
        linkedIn: "",
        portfolio: "",
        coverLetter: "",
      });
      setResume(null);
      toast.success("Application submitted successfully!");
    } catch (e: any) {
      console.error("Apply failed:", e);
      toast.error(e?.response?.data?.message || "Failed to submit application.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <Card className="border-2 border-blue-100 bg-blue-50">
        <CardContent className="p-8 text-center space-y-3">
          <h3 className="text-2xl font-bold text-blue-700">Application submitted</h3>
          <p className="text-blue-700/80">Thank you. Our team will review your application and reach out via email.</p>
          <Button variant="secondary" onClick={() => setIsSuccess(false)}>
            Submit another application
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-blue-100 shadow-xl">
      <CardContent className="p-8 space-y-6">
        <div className="grid gap-2">
          <Label htmlFor="fullName">Full name*</Label>
          <Input
            id="fullName"
            value={form.fullName}
            onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
            placeholder="Your name"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email*</Label>
          <Input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            placeholder="you@example.com"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="phone">Phone (optional)</Label>
          <Input
            id="phone"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            placeholder="Phone number"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="linkedIn">LinkedIn (optional)</Label>
          <Input
            id="linkedIn"
            value={form.linkedIn}
            onChange={(e) => setForm((f) => ({ ...f, linkedIn: e.target.value }))}
            placeholder="https://linkedin.com/in/…"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="portfolio">Portfolio (optional)</Label>
          <Input
            id="portfolio"
            value={form.portfolio}
            onChange={(e) => setForm((f) => ({ ...f, portfolio: e.target.value }))}
            placeholder="https://…"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="coverLetter">Cover letter (optional)</Label>
          <Textarea
            id="coverLetter"
            value={form.coverLetter}
            onChange={(e) => setForm((f) => ({ ...f, coverLetter: e.target.value }))}
            className="min-h-[140px]"
            placeholder="Tell us why you’re a great fit…"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="resume">Resume* (PDF/DOC/DOCX, max 10MB)</Label>
          <Input
            id="resume"
            type="file"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            aria-required="true"
            onChange={(e) => setResume(e.target.files?.[0] || null)}
          />
        </div>
        <Button onClick={submit} disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting…
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" /> Submit application
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

