"use client";

import React, { useState } from "react";
import { Download, FileText, Archive, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api-client";

interface Document {
  _id?: string;
  fileName?: string;
  originalName?: string;
  originalname?: string;
  documentType?: string;
  fileType?: string;
  fileSize?: number;
  contentType?: string;
  mimetype?: string;
  uploadDate?: string;
  uploadedBy?: string;
  name?: string;
  size?: number;
  path?: string;
  filename?: string;
}

interface DocumentDisplayProps {
  documents: Document[];
  formId: string;
  formType: string;
  title?: string;
  showBulkDownload?: boolean;
}

export default function DocumentDisplay({ 
  documents, 
  formId, 
  formType, 
  title = "User Documents",
  showBulkDownload = false 
}: DocumentDisplayProps) {
  const [downloading, setDownloading] = useState<string | null>(null);
  const [downloadingAll, setDownloadingAll] = useState(false);

  // Filter to only show user documents (not admin documents)
  const userDocuments = documents.filter(doc => 
    doc.uploadedBy !== 'admin' && 
    doc.documentType !== 'admin-report'
  );

  const handleDownload = async (doc: Document) => {
    try {
      setDownloading(doc._id || doc.filename || '');
      
      const docId = doc._id || doc.filename;
      if (!docId) {
        console.error('No document ID found');
        return;
      }

      let downloadUrl = '';
      
      // Determine the correct download endpoint based on form type
      switch (formType) {
        case 'AdvisoryForm':
          downloadUrl = `/api/forms/advisory/download/${docId}`;
          break;
        case 'CompanyForm':
          downloadUrl = `/api/forms/company-information/download/${docId}`;
          break;
        case 'OtherRegistrationForm':
          downloadUrl = `/api/forms/other-registration/download/${docId}`;
          break;
        case 'ReportsForm':
          downloadUrl = `/api/forms/reports/download/${docId}`;
          break;
        case 'ROCForm':
          downloadUrl = `/api/forms/roc-returns/download/${docId}`;
          break;
        case 'TrademarkForm':
          downloadUrl = `/api/forms/trademark-iso/download/${docId}`;
          break;
        default:
          downloadUrl = `/api/forms/download/${docId}`;
      }

      const response = await api.get(downloadUrl, { responseType: 'blob' });
      
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', doc.originalName || doc.originalname || doc.fileName || doc.name || 'document');
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

  const handleDownloadAll = async () => {
    try {
      setDownloadingAll(true);
      
      const response = await api.post(`/api/forms/download-all/${formId}`, {
        formType,
        documents: userDocuments
      }, { responseType: 'blob' });
      
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${formType}_${formId}_documents.zip`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Bulk download failed:', error);
    } finally {
      setDownloadingAll(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return '📄';
      case 'doc':
      case 'docx':
        return '📝';
      case 'jpg':
      case 'jpeg':
      case 'png':
        return '🖼️';
      case 'xls':
      case 'xlsx':
        return '📊';
      default:
        return '📎';
    }
  };

  if (userDocuments.length === 0) {
    return (
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            {title}
          </CardTitle>
          <CardDescription>No documents uploaded yet</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">No documents have been uploaded for this form.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              {title}
            </CardTitle>
            <CardDescription>
              {userDocuments.length} document{userDocuments.length !== 1 ? 's' : ''} uploaded
            </CardDescription>
          </div>
          {showBulkDownload && userDocuments.length > 1 && (
            <Button
              onClick={handleDownloadAll}
              disabled={downloadingAll}
              variant="outline"
              size="sm"
              className="border-green-600 text-green-600 hover:bg-green-50 hover:text-green-700"
            >
              {downloadingAll ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                  <Archive className="mr-2 h-4 w-4" />
                  Download All
                </>
              )}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-3">
          {userDocuments.map((doc, index) => {
            const fileName = doc.originalName || doc.originalname || doc.fileName || doc.name || `Document ${index + 1}`;
            const fileSize = doc.fileSize || doc.size || 0;
            const uploadDate = doc.uploadDate;
            const isDownloading = downloading === (doc._id || doc.filename);
            
            return (
              <div
                key={doc._id || doc.filename || index}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-2xl">{getFileIcon(fileName)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{fileName}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      {fileSize > 0 && <span>{formatFileSize(fileSize)}</span>}
                      {uploadDate && (
                        <>
                          <span>•</span>
                          <span>{new Date(uploadDate).toLocaleDateString()}</span>
                        </>
                      )}
                      {doc.uploadedBy && (
                        <>
                          <span>•</span>
                          <Badge variant="outline" className="text-xs">
                            {doc.uploadedBy}
                          </Badge>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => handleDownload(doc)}
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
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
