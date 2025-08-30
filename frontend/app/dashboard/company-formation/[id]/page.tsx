"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Download } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import api, { API_PATHS } from "@/lib/api-client";
import { useAuth } from "@/providers/auth-provider";

interface CFDocument {
  _id?: string;
  documentId?: string;
  originalName?: string;
  filename?: string;
  fileName?: string;
  name?: string;
  contentType?: string;
  uploadedAt?: string;
}

interface CFFormDetail {
  _id: string;
  service?: string;
  companyName?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  documents?: CFDocument[];
  [key: string]: any;
}

export default function CompanyFormationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isLoading: authLoading } = useAuth();
  const id = useMemo(() => (params?.id as string) || "", [params]);

  const [form, setForm] = useState<CFFormDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const res = await api.get(API_PATHS.FORMS.COMPANY_FORMATION_DETAIL(id));
        setForm(res.data?.data || res.data);
      } catch (e) {
        console.error("Failed to fetch company formation detail", e);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const getDocTitle = (d: CFDocument) => d.originalName || d.fileName || d.filename || d.name || d.documentId || d._id || "Document";
  const getDocId = (d: CFDocument) => d.documentId || d._id || "";

  const handleDownload = async (doc: CFDocument) => {
    const documentId = getDocId(doc);
    if (!documentId) return;
    const filename = getDocTitle(doc);
    // Use relative URL for downloadFile helper
    const url = `/api/forms/company-formation/download/${documentId}`;
    await api.downloadFile(url, filename);
  };

  if (authLoading || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!form) {
    return (
      <div className="container mx-auto p-6">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <div className="text-sm text-muted-foreground">Form not found.</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <h1 className="text-2xl font-bold">Company Formation - Details</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
            <CardDescription>ID: {form._id}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div><span className="font-medium">Service:</span> {form.service || "Company Formation"}</div>
            <div><span className="font-medium">Company Name:</span> {form.companyName || "-"}</div>
            <div><span className="font-medium">Status:</span> {form.status}</div>
            <div><span className="font-medium">Created:</span> {new Date(form.createdAt).toLocaleString()}</div>
            <div><span className="font-medium">Updated:</span> {new Date(form.updatedAt).toLocaleString()}</div>
            <div className="pt-2">
              <Button size="sm" onClick={() => router.push(`/dashboard/company-formation/${form._id}/edit`)}>Edit Form</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Documents</CardTitle>
            <CardDescription>Download only. Deletion disabled.</CardDescription>
          </CardHeader>
          <CardContent>
            {(form.documents?.length || 0) === 0 ? (
              <div className="text-sm text-muted-foreground">No documents uploaded yet.</div>
            ) : (
              <div className="space-y-2">
                {form.documents!.map((d, idx) => (
                  <div key={getDocId(d) || idx} className="flex items-center justify-between border rounded-md p-2">
                    <div className="text-sm">
                      {getDocTitle(d)}
                      {d.contentType ? <span className="ml-2 text-xs text-muted-foreground">({d.contentType})</span> : null}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleDownload(d)}>
                        <Download className="mr-2 h-4 w-4" /> Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
