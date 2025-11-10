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
}

export default function AdminReportSection({ reports, formId, formType }: AdminReportSectionProps) {
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleDownloadReport = async (report: AdminReport) => {
    try {
      setDownloading(report._id || '');
      
      // Find the document associated with this report
      const documentId = Array.isArray(report.documents) && report.documents.length > 0 
        ? (typeof report.documents[0] === 'string' ? report.documents[0] : report.documents[0]._id)
        : null;
      
      if (!documentId) {
        console.error('No document found for this report');
        return;
      }

      let downloadUrl = '';
      
      // Determine the correct download endpoint based on form type
      switch (formType) {
        case 'AdvisoryForm':
          downloadUrl = `/api/forms/advisory/download/${documentId}`;
          break;
        case 'CompanyForm':
          downloadUrl = `/api/forms/company-information/download/${documentId}`;
          break;
        case 'OtherRegistrationForm':
          downloadUrl = `/api/forms/other-registration/download/${documentId}`;
          break;
        case 'ReportsForm':
          downloadUrl = `/api/forms/reports/download/${documentId}`;
          break;
        case 'ROCForm':
          downloadUrl = `/api/forms/roc-returns/download/${documentId}`;
          break;
        case 'TrademarkForm':
          downloadUrl = `/api/forms/trademark-iso/download/${documentId}`;
          break;
        default:
          downloadUrl = `/api/forms/download/${documentId}`;
      }

      const response = await api.get(downloadUrl, { responseType: 'blob' });
      
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Generate filename
      const reportDate = report.sentAt || report.createdAt;
      const dateStr = reportDate ? new Date(reportDate).toISOString().split('T')[0] : 'unknown';
      const fileName = `admin_report_${dateStr}_${documentId}`;
      
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setDownloading(null);
    }
  };

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

  if (!reports || reports.length === 0) {
    return null;
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-green-600" />
              Admin Reports
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
            const isDownloading = downloading === report._id;
            const reportDate = report.sentAt || report.createdAt;
            
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
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(reportDate).toLocaleDateString()}</span>
                      </div>
                      {report.sentBy && (
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>{report.sentBy}</span>
                        </div>
                      )}
                      {hasDocument && (
                        <div className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          <span>{Array.isArray(report.documents) ? report.documents.length : 1} document(s)</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {hasDocument && (
                    <Button
                      onClick={() => handleDownloadReport(report)}
                      disabled={isDownloading}
                      variant="outline"
                      size="sm"
                      className="ml-3"
                    >
                      {isDownloading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Download className="h-4 w-4" />
                      )}
                    </Button>
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
