"use client";

import React, { useState } from "react";
import { Download, MessageSquare, FileText, Calendar, User, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import api from "@/lib/api-client";

interface AdminReport {
  _id?: string;
  message: string;
  createdAt: string;
  documents?: Array<{
    _id?: string;
    fileName?: string;
    originalName?: string;
  }> | string[];
  uploadedBy?: string;
  reportType?: string;
  sentAt?: string;
  sentBy?: string;
}

interface AdminReportSectionProps {
  reports: AdminReport[];
  formId: string;
  formType: string;
  title?: string;
  className?: string;
}

export default function AdminReportSection({ reports, formId, formType, title = "Admin Reports", className }: AdminReportSectionProps) {
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleDownloadAllReports = async () => {
    try {
      setDownloading('all');
      
      const response = await api.post(`/api/forms/download-all-reports/${formId}`, {
        formType
      }, { responseType: 'blob' });
      
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${formType}_${formId}_admin_reports.zip`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Bulk download failed:', error);
    } finally {
      setDownloading(null);
    }
  };

  const handleDownloadReport = async (report: AdminReport) => {
    try {
      const reportId = report._id || 'unknown';
      setDownloading(reportId);
      
      console.log('Attempting to download report:', {
        reportId,
        formId,
        formType,
        report: report,
        documentId: (report as any).documentId
      });
      
      // Check if report has documentId (for non-TaxForm reports)
      if ((report as any).documentId) {
        console.log(`Downloading document ${(report as any).documentId} from form ${formId}`);
        await api.downloadFile(`/api/admin/forms/${formId}/documents/${(report as any).documentId}`, 
          `report-${reportId}.pdf`);
      } else {
        console.warn('No documentId found for report:', report);
      }
    } catch (error) {
      console.error('Failed to download report:', error);
    } finally {
      setDownloading(null);
    }
  };

  if (!reports || reports.length === 0) {
    return null;
  }

  return (
    <Card className={`border-0 shadow-lg ${className || ''}`}>
      <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-green-600" />
              {title}
            </CardTitle>
            <CardDescription>
              {reports.length} report{reports.length !== 1 ? 's' : ''} from admin
            </CardDescription>
          </div>
          {reports.length > 1 && (
            <Button
              onClick={handleDownloadAllReports}
              disabled={downloading === 'all'}
              variant="outline"
              size="sm"
              className="border-green-600 text-green-600 hover:bg-green-50 hover:text-green-700"
            >
              {downloading === 'all' ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Download All
                </>
              )}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {reports.map((report, index) => {
            const hasDocument = report.documents && report.documents.length > 0;
            const hasDocumentId = !!(report as any).documentId;
            const reportDate = report.sentAt || report.createdAt;
            const reportId = report._id || 'unknown';
            
            return (
              <div key={report._id || index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Admin
                      </Badge>
                      {report.reportType && (
                        <Badge variant="outline" className="text-xs">
                          {report.reportType}
                        </Badge>
                      )}
                    </div>
                    <p className="text-gray-900 mb-3">{report.message}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <span className={`px-2 py-1 rounded text-xs ${hasDocument || hasDocumentId ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {hasDocument || hasDocumentId ? 'Has Documents' : 'No Documents'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(reportDate).toLocaleDateString()}</span>
                      </div>
                      {report.sentBy && (
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>{report.sentBy}</span>
                        </div>
                      )}
                      {(hasDocument || hasDocumentId) && (
                        <div className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          <span>{Array.isArray(report.documents) ? report.documents.length : 1} document(s)</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {(hasDocumentId || hasDocument) && (
                    <div className="ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownloadReport(report)}
                        disabled={downloading === reportId}
                        className="border-green-600 text-green-600 hover:bg-green-50 hover:text-green-700"
                      >
                        {downloading === reportId ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Downloading...
                          </>
                        ) : (
                          <>
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
                {index < reports.length - 1 && <Separator className="mt-4" />}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
