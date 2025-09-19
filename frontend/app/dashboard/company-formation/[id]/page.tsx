"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Download, CheckCircle, MessageSquare, FileText, Calendar, User, Building, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import api, { API_PATHS } from "@/lib/api-client";
import { useAuth } from "@/providers/auth-provider";
import DocumentDisplay from "@/components/ui/document-display";
import AdminReportSection from "@/components/ui/admin-report-section";

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
  businessActivity?: string;
  registeredOfficeAddress?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  documents?: CFDocument[];
  reports?: Array<{
    message: string;
    type?: string;
    documents?: string[];
    createdAt: string;
    uploadedBy?: string;
  }>;
  remarks?: string;
  completionNotes?: string;
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
    const url = `/api/forms/company-formation/download/${documentId}`;
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
            <h1 className="text-3xl font-bold text-gray-900">Company Formation Details</h1>
            <p className="text-gray-600 mt-1">Track your company formation application progress and communications</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {getStatusBadge(form.status)}
          <Button 
            onClick={() => router.push(`/dashboard/company-formation/${form._id}/edit`)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Edit Form
          </Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Form Information */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Building className="h-6 w-6 text-blue-600" />
                Company Formation Information
              </CardTitle>
              <CardDescription>ID: {form._id}</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Company Name</p>
                      <p className="text-lg font-semibold text-gray-900">{form.companyName || "Not specified"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Company Type</p>
                      <p className="text-lg font-semibold text-gray-900">{form.companyType || "Not specified"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Proposed Capital</p>
                      <p className="text-lg font-semibold text-gray-900">{form.proposedCapital || "Not specified"}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Directors Count</p>
                      <p className="text-lg font-semibold text-gray-900">{form.directorsCount || "Not specified"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">CIN</p>
                      <p className="text-lg font-semibold text-gray-900">{form.cin || "Not specified"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Financial Year</p>
                      <p className="text-lg font-semibold text-gray-900">{form.financialYear || "Not specified"}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {form.businessActivity && (
                <div className="mt-6 pt-6 border-t">
                  <p className="text-sm font-medium text-gray-500 mb-2">Business Activity</p>
                  <p className="text-gray-900 leading-relaxed">{form.businessActivity}</p>
                </div>
              )}

              {form.registeredOfficeAddress && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-500 mb-2">Registered Office Address</p>
                  <p className="text-gray-900 leading-relaxed">{form.registeredOfficeAddress}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Admin Reports Section */}
          {form.reports && form.reports.length > 0 && (
            <AdminReportSection 
              reports={form.reports}
              formId={form._id}
              formType="CompanyForm"
            />
          )}

          {/* User Documents Section */}
          <DocumentDisplay 
            documents={form.documents || []}
            formId={form._id}
            formType="CompanyForm"
            title="Your Uploaded Documents"
            showBulkDownload={true}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Card */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Status Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Current Status</span>
                  {getStatusBadge(form.status)}
                </div>
                <Separator />
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Created</p>
                      <p className="text-sm font-medium">{new Date(form.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Last Updated</p>
                      <p className="text-sm font-medium">{new Date(form.updatedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Admin Communication */}
          {(form.remarks || form.completionNotes) && (
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-amber-50 to-yellow-50">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-amber-600" />
                  Admin Communication
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {form.remarks && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Remarks</p>
                      <div className="p-3 bg-amber-50 rounded-lg text-sm text-gray-800">
                        {form.remarks}
                      </div>
                    </div>
                  )}
                  {form.completionNotes && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Completion Notes</p>
                      <div className="p-3 bg-green-50 rounded-lg text-sm text-gray-800">
                        {form.completionNotes}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}