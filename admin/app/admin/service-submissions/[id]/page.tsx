'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, DocumentIcon, ArrowDownTrayIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';

import api from '@/lib/api-client';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select } from 'react-day-picker';


interface Document {
  _id: string;
  documentType: string;
  fileName: string;
  contentType: string;
  uploadDate: string;
}

interface ServiceSubmission {
  _id: string;
  service: {
    _id: string;
    name: string;
    category: string;
    subcategory: string;
  };
  user: {
    _id: string;
    name: string;
    email: string;
  };
  fullName: string;
  email: string;
  phone: string;
  formData: Record<string, any>;
  documents: Document[];
  status: string;
  adminNotes: string;
  createdAt: string;
  updatedAt: string;
}

const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case 'pending':
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
    case 'in_progress':
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">In Progress</Badge>;
    case 'completed':
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completed</Badge>;
    case 'rejected':
      return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejected</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default function ServiceSubmissionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [submission, setSubmission] = useState<ServiceSubmission | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [uploadingReport, setUploadingReport] = useState(false);
  const [status, setStatus] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [reportFile, setReportFile] = useState<File | null>(null);

  useEffect(() => {
    fetchSubmission();
  }, [id]);

  const fetchSubmission = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/admin/services/submissions/${id}`);
      setSubmission(response.data);
      setStatus(response.data.status);
      setAdminNotes(response.data.adminNotes || '');
      setLoading(false);
    } catch (error) {
      console.error('Error fetching submission:', error);
      toast.error('Failed to load submission details');
      setLoading(false);
    }
  };

  const handleDownload = async (doc: Document) => {
    try {
      await api.downloadFile(
        `/api/admin/services/submissions/${id}/documents/${doc._id}`,
        doc.fileName
      );
      toast.success('Download started');
    } catch (error) {
      console.error('Error downloading document:', error);
      toast.error('Failed to download document');
    }
  };

  const handleUpdateStatus = async () => {
    try {
      setUpdating(true);
      await api.put(`/api/admin/services/submissions/${id}/status`, {
        status,
        adminNotes
      });
      toast.success('Status updated successfully');
      fetchSubmission();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const handleReportFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setReportFile(e.target.files[0]);
    }
  };

  const handleSendReport = async () => {
    if (!reportFile) {
      toast.error('Please select a file to upload');
      return;
    }

    try {
      setUploadingReport(true);
      
      const formData = new FormData();
      formData.append('reportFile', reportFile);
      
      await api.post(
        `/api/admin/services/submissions/${id}/report`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      toast.success('Report sent successfully');
      setReportFile(null);
      
      // Reset file input
      const fileInput = document.getElementById('reportFile') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
      fetchSubmission();
    } catch (error) {
      console.error('Error sending report:', error);
      toast.error('Failed to send report');
    } finally {
      setUploadingReport(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Circle size="lg" />
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-8">
          <p className="text-red-500">Submission not found</p>
          <Button
            variant="outline"
            onClick={() => router.push('/admin/service-submissions')}
            className="mt-4"
          >
            Back to Submissions
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push('/admin/service-submissions')}
          className="mr-4"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">
          Service Application Details
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{submission.service.name}</CardTitle>
                  <CardDescription>
                    {submission.service.category} &gt; {submission.service.subcategory}
                  </CardDescription>
                </div>
                <StatusBadge status={submission.status} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Applicant Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Full Name</p>
                      <p className="font-medium">{submission.fullName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{submission.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{submission.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Submission Date</p>
                      <p className="font-medium">
                        {format(new Date(submission.createdAt), 'dd MMM yyyy, HH:mm')}
                      </p>
                    </div>
                  </div>
                </div>

                {Object.keys(submission.formData).length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium mb-2">Form Data</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(submission.formData).map(([key, value]) => (
                        <div key={key}>
                          <p className="text-sm text-gray-500">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </p>
                          <p className="font-medium">
                            {typeof value === 'boolean' 
                              ? (value ? 'Yes' : 'No')
                              : (value || 'N/A')}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {submission.documents.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium mb-2">Uploaded Documents</h3>
                    <div className="grid grid-cols-1 gap-3">
                      {submission.documents.map(doc => (
                        <motion.div
                          key={doc._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center justify-between p-3 border rounded-md"
                        >
                          <div className="flex items-center">
                            <DocumentIcon className="h-5 w-5 mr-3 text-blue-500" />
                            <div>
                              <div className="font-medium">{doc.fileName}</div>
                              <div className="text-sm text-gray-500">
                                {doc.documentType} • {format(new Date(doc.uploadDate), 'dd MMM yyyy')}
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownload(doc)}
                          >
                            <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Update Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <Select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="rejected">Rejected</option>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Admin Notes</label>
                  <Textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows={4}
                    placeholder="Add notes about this application"
                  />
                </div>

                <Button
                  onClick={handleUpdateStatus}
                  disabled={updating}
                  className="w-full"
                >
                  {updating && <Circle size="sm" className="mr-2" />}
                  Update Status
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Send Report</CardTitle>
              <CardDescription>
                Upload and send a report file to the applicant
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Report File</label>
                  <input
                    id="reportFile"
                    type="file"
                    onChange={handleReportFileChange}
                    className="w-full border rounded-md p-2"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Upload PDF, Excel or Word document (Max 10MB)
                  </p>
                </div>

                <Button
                  onClick={handleSendReport}
                  disabled={!reportFile || uploadingReport}
                  className="w-full"
                >
                  {uploadingReport ? (
                    <Circle size="sm" className="mr-2" />
                  ) : (
                    <PaperAirplaneIcon className="h-4 w-4 mr-2" />
                  )}
                  Send Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}