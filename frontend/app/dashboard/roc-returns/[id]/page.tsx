"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Download, CheckCircle, MessageSquare, FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import api, { API_PATHS } from "@/lib/api-client";

interface Doc {
  _id?: string;
  documentId?: string;
  originalName?: string;
  filename?: string;
  fileName?: string;
  name?: string;
  contentType?: string;
  uploadedAt?: string;
  isCompletionDocument?: boolean;
}

interface ROCDetail {
  _id: string;
  service?: string;
  subService?: string;
  companyName?: string;
  cin?: string;
  companyType?: string;
  financialYear?: string;
  status: string;
  remarks?: string;
  completionNotes?: string;
  createdAt: string;
  updatedAt: string;
  documents?: Doc[];
  completionDocuments?: Doc[];
  [key: string]: any;
}

export default function ROCReturnsDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = useMemo(() => (params?.id as string) || "", [params]);

  const [form, setForm] = useState<ROCDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const res = await api.get(API_PATHS.FORMS.ROC_RETURNS_DETAIL(id));
        setForm(res.data?.data || res.data);
      } catch (e) {
        console.error("Failed to fetch ROC returns detail", e);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const getDocTitle = (d: Doc) => d.originalName || d.fileName || d.filename || d.name || d.documentId || d._id || "Document";
  const getDocId = (d: Doc) => d.documentId || d._id || "";

  const handleDownload = async (doc: Doc) => {
    const documentId = getDocId(doc);
    if (!documentId) return;
    const filename = getDocTitle(doc);
    const url = `/api/forms/roc-returns/download/${documentId}`;
    await api.downloadFile(url, filename);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case 'Reviewed':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Reviewed</Badge>
      case 'Filed':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Filed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  };

  if (loading) {
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
        <h1 className="text-2xl font-bold">ROC Returns - Details</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Summary Card */}
        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
            <CardDescription>ID: {form._id}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div><span className="font-medium">Service:</span> {form.service || "ROC Returns"}</div>
            {form.subService && form.subService !== form.service && (
              <div><span className="font-medium">Sub Service:</span> {form.subService}</div>
            )}
            <div><span className="font-medium">Company Name:</span> {form.companyName || "-"}</div>
            <div><span className="font-medium">CIN:</span> {form.cin || "-"}</div>
            <div><span className="font-medium">Company Type:</span> {form.companyType || "-"}</div>
            <div><span className="font-medium">Financial Year:</span> {form.financialYear || "-"}</div>
            <div><span className="font-medium">Status:</span> {getStatusBadge(form.status)}</div>
            <div><span className="font-medium">Created:</span> {new Date(form.createdAt).toLocaleString()}</div>
            <div><span className="font-medium">Updated:</span> {new Date(form.updatedAt).toLocaleString()}</div>
            <div className="pt-2">
              <Button size="sm" onClick={() => router.push(`/dashboard/roc-returns/${form._id}/edit`)}>Edit Form</Button>
            </div>
          </CardContent>
        </Card>

        {/* Company Details Card */}
        <Card>
          <CardHeader>
            <CardTitle>Company Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div><span className="font-medium">Registered Office:</span> {form.registeredOfficeAddress || "-"}</div>
            {form.boardMeetingDate && (
              <div><span className="font-medium">Board Meeting Date:</span> {form.boardMeetingDate}</div>
            )}
            {form.lastFilingDate && (
              <div><span className="font-medium">Last Filing Date:</span> {form.lastFilingDate}</div>
            )}
            {form.pendingCompliances && (
              <div><span className="font-medium">Pending Compliances:</span> {form.pendingCompliances}</div>
            )}
            <div className="pt-2">
              <div className="font-medium">Additional Requirements:</div>
              <div className="flex flex-wrap gap-2 mt-1">
                {form.requiresAudit && <Badge variant="outline">Audit Required</Badge>}
                {form.requiresDigitalSignature && <Badge variant="outline">Digital Signature</Badge>}
                {form.requiresExpertConsultation && <Badge variant="outline">Expert Consultation</Badge>}
                {form.requiresComplianceSetup && <Badge variant="outline">Compliance Setup</Badge>}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admin Remarks and Completion Notes */}
      {(form.remarks || form.completionNotes) && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              Admin Communication
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {form.remarks && (
              <div>
                <div className="font-medium text-sm mb-2">Remarks:</div>
                <div className="p-3 bg-gray-50 rounded-md text-sm">{form.remarks}</div>
              </div>
            )}
            {form.completionNotes && (
              <div>
                <div className="font-medium text-sm mb-2">Completion Notes:</div>
                <div className="p-3 bg-green-50 rounded-md text-sm">{form.completionNotes}</div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* User Documents */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Your Documents
          </CardTitle>
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

      {/* Completion Documents (if status is Filed) */}
      {form.status === 'Filed' && form.completionDocuments && form.completionDocuments.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Completion Documents
            </CardTitle>
            <CardDescription>Documents provided upon completion of your filing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {form.completionDocuments.map((d, idx) => (
                <div key={getDocId(d) || idx} className="flex items-center justify-between border rounded-md p-2 bg-green-50">
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
          </CardContent>
        </Card>
      )}
    </div>
  );
}
