"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Download, CheckCircle, MessageSquare, FileText, Calendar, User, Building, Clock, FileSpreadsheet, Edit3, Hash } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import api, { API_PATHS } from "@/lib/api-client";
import { useAuth } from "@/providers/auth-provider";
import DocumentDisplay from "@/components/ui/document-display";
import AdminReportSection from "@/components/ui/admin-report-section";

interface ROCDocument {
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

interface ROCFormDetail {
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
  documents?: ROCDocument[];
  completionDocuments?: ROCDocument[];
  reports?: Array<{
    message: string;
    type?: string;
    documents?: string[];
    createdAt: string;
    uploadedBy?: string;
  }>;
  [key: string]: any;
}

export default function ROCReturnsDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isLoading: authLoading } = useAuth();
  const id = useMemo(() => (params?.id as string) || "", [params]);

  const [form, setForm] = useState<ROCFormDetail | null>(null);
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

  const getDocTitle = (d: ROCDocument) => d.originalName || d.fileName || d.filename || d.name || d.documentId || d._id || "Document";
  const getDocId = (d: ROCDocument) => d.documentId || d._id || "";

  const handleDownload = async (doc: ROCDocument) => {
    const documentId = getDocId(doc);
    if (!documentId) return;
    const filename = getDocTitle(doc);
    const url = `/api/forms/roc-returns/download/${documentId}`;
    await api.downloadFile(url, filename);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Pending</Badge>
      case 'Reviewed':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Reviewed</Badge>
      case 'Filed':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Filed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
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
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()} className="hover:bg-gray-100">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="h-8 w-8 text-blue-600" />
              ROC Returns - Details
            </h1>
            <p className="text-gray-600 mt-1">View and manage your ROC returns filing details</p>
          </div>
        </div>
        <Button onClick={() => router.push(`/dashboard/roc-returns/${form._id}/edit`)} className="bg-blue-600 hover:bg-blue-700">
          <Edit3 className="h-4 w-4 mr-2" /> Edit Form
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Summary Card */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
              <CardTitle className="flex items-center gap-2 text-xl">
                <FileText className="h-6 w-6 text-blue-600" />
                Filing Summary
              </CardTitle>
              <CardDescription>Overview of your ROC returns filing</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Building className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Company Name</p>
                      <p className="text-lg font-semibold text-gray-900">{form.companyName || "-"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Service</p>
                      <p className="text-lg font-semibold text-gray-900">{form.service || "ROC Returns"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Financial Year</p>
                      <p className="text-lg font-semibold text-gray-900">{form.financialYear || "-"}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Hash className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">CIN</p>
                      <p className="text-lg font-semibold text-gray-900">{form.cin || "-"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Building className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Company Type</p>
                      <p className="text-lg font-semibold text-gray-900">{form.companyType || "-"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Status</p>
                      <div className="mt-1">{getStatusBadge(form.status)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Company Details Card */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Building className="h-6 w-6 text-green-600" />
                Company Details
              </CardTitle>
              <CardDescription>Detailed information about your company</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Registered Office Address</h4>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{form.registeredOfficeAddress || "-"}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {form.boardMeetingDate && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Board Meeting Date</h4>
                      <p className="text-gray-700">{form.boardMeetingDate}</p>
                    </div>
                  )}
                  {form.lastFilingDate && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Last Filing Date</h4>
                      <p className="text-gray-700">{form.lastFilingDate}</p>
                    </div>
                  )}
                </div>

                {form.pendingCompliances && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Pending Compliances</h4>
                    <p className="text-gray-700 bg-yellow-50 p-3 rounded-lg border border-yellow-200">{form.pendingCompliances}</p>
                  </div>
                )}

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Additional Requirements</h4>
                  <div className="flex flex-wrap gap-2">
                    {form.requiresAudit && <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Audit Required</Badge>}
                    {form.requiresDigitalSignature && <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Digital Signature</Badge>}
                    {form.requiresExpertConsultation && <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">Expert Consultation</Badge>}
                    {form.requiresComplianceSetup && <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Compliance Setup</Badge>}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Admin Communication */}
          {(form.remarks || form.completionNotes) && (
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <MessageSquare className="h-6 w-6 text-purple-600" />
                  Admin Communication
                </CardTitle>
                <CardDescription>Messages and updates from our team</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {form.remarks && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Remarks</h4>
                      <div className="p-4 bg-gray-50 rounded-lg border">
                        <p className="text-gray-700">{form.remarks}</p>
                      </div>
                    </div>
                  )}
                  {form.completionNotes && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Completion Notes</h4>
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-gray-700">{form.completionNotes}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Admin Reports */}
          <AdminReportSection 
            reports={form.reports as any}
            formId={form._id}
            formType="ROCForm"
          />

          {/* User Documents */}
          <DocumentDisplay 
            documents={form.documents || []}
            formId={form._id}
            formType="ROCForm"
            title="Your Uploaded Documents"
            showBulkDownload={true}
          />

          {/* Completion Documents (if status is Filed) */}
          {form.status === 'Filed' && form.completionDocuments && form.completionDocuments.length > 0 && (
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  Completion Documents
                </CardTitle>
                <CardDescription>Documents provided upon completion of your filing</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {form.completionDocuments.map((d, idx) => (
                    <div key={getDocId(d) || idx} className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium text-gray-900">{getDocTitle(d)}</p>
                          {d.contentType && (
                            <p className="text-sm text-gray-500">{d.contentType}</p>
                          )}
                        </div>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => handleDownload(d)} className="border-green-300 text-green-700 hover:bg-green-100">
                        <Download className="mr-2 h-4 w-4" /> Download
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Form Info */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50 border-b">
              <CardTitle className="text-lg">Form Information</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Form ID</p>
                  <p className="text-sm font-mono text-gray-900 break-all">{form._id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Created</p>
                  <p className="text-sm text-gray-900">{new Date(form.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Last Updated</p>
                  <p className="text-sm text-gray-900">{new Date(form.updatedAt).toLocaleString()}</p>
                </div>
                {form.subService && form.subService !== form.service && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Sub Service</p>
                    <p className="text-sm text-gray-900">{form.subService}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                <Button 
                  onClick={() => router.push(`/dashboard/roc-returns/${form._id}/edit`)} 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <Edit3 className="h-4 w-4 mr-2" /> Edit Form
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => router.back()} 
                  className="w-full"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}