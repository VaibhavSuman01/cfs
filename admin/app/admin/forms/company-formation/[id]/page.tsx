"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Circle, Clock, Download, FileText, Mail, Phone, User, X, Send, Building2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import api from '@/lib/api-client';
import { API_PATHS } from '@/lib/api-client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

// Types
interface Document {
  _id: string;
  fileName?: string;
  originalName?: string;
  documentType?: string;
  fileType?: string;
  fileSize?: number;
  contentType?: string;
  isEdited?: boolean;
  name?: string;
  path?: string;
}

interface CompanyForm {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  pan: string;
  service?: string;
  companyName?: string;
  businessActivity?: string;
  proposedCapital?: string;
  registeredOfficeAddress?: string;
  city?: string;
  state?: string;
  pincode?: string;
  directors?: Array<{
    name: string;
    pan: string;
    aadhaar: string;
    email: string;
    phone: string;
    address: string;
    nationality: string;
    isResident: boolean;
    din: string;
  }>;
  status: 'Pending' | 'Reviewed' | 'Filed';
  documents: Document[];
  reports?: Array<{
    message: string;
    type: string;
    documents: string[];
    createdAt: string;
  }>;
  createdAt: string;
  updatedAt?: string;
}

export default function CompanyFormDetailPage() {
  const router = useRouter();
  const { toast } = useToast();
  const params = useParams();
  const id = params.id as string;

  const [form, setForm] = useState<CompanyForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [nextStatus, setNextStatus] = useState<CompanyForm['status'] | null>(null);
  
  // Send report states
  const [showSendReportDialog, setShowSendReportDialog] = useState(false);
  const [reportMessage, setReportMessage] = useState('');
  const [reportType, setReportType] = useState('Company Registration');
  const [reportFile, setReportFile] = useState<File | null>(null);
  const [sendingReport, setSendingReport] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchForm = async () => {
        try {
          // For now, we'll use the service-forms endpoint and filter
          const response = await api.get(API_PATHS.ADMIN.SERVICE_FORMS);
          const companyForms = response.data.forms.filter((f: any) => f.formType === 'CompanyForm');
          const foundForm = companyForms.find((f: any) => f._id === id);
          
          if (foundForm) {
            setForm(foundForm);
          } else {
            toast({ title: 'Error', description: 'Company formation form not found.', variant: 'destructive' });
          }
        } catch (error) {
          console.error('Failed to fetch company formation form:', error);
          toast({ title: 'Error', description: 'Failed to load company formation form details.', variant: 'destructive' });
        } finally {
          setLoading(false);
        }
      };
      fetchForm();
    }
  }, [id, toast]);

  const handleStatusUpdate = async () => {
    if (!form || !nextStatus) return;

    try {
      setUpdatingStatus(true);
      
      // Update the form status
      await api.put(API_PATHS.ADMIN.FORM_STATUS(form._id), {
        status: nextStatus,
        comment: 'Status updated by admin',
      });

      // Update local state
      setForm(prev => prev ? { ...prev, status: nextStatus } : null);
      setShowConfirmDialog(false);
      setNextStatus(null);
      
      toast({ title: 'Success', description: 'Form status updated successfully.' });
    } catch (error) {
      console.error('Failed to update form status:', error);
      toast({ title: 'Error', description: 'Failed to update form status.', variant: 'destructive' });
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleSendReport = async () => {
    if (!form || !reportMessage) return;

    try {
      setSendingReport(true);
      
      // For now, just update local state since backend endpoint is not implemented
      // TODO: Implement backend endpoint for sending reports
      const newReport = {
        message: reportMessage,
        type: reportType,
        documents: reportFile ? [reportFile.name] : [],
        createdAt: new Date().toISOString()
      };

      // Update local form state to show the new report
      setForm(prev => prev ? {
        ...prev,
        reports: [...(prev.reports || []), newReport]
      } : null);

      setShowSendReportDialog(false);
      setReportMessage('');
      setReportType('Company Registration');
      setReportFile(null);
      
      toast({ title: 'Success', description: 'Report added successfully. (Backend integration pending)' });
    } catch (error) {
      console.error('Failed to add report:', error);
      toast({ title: 'Error', description: 'Failed to add report.', variant: 'destructive' });
    } finally {
      setSendingReport(false);
    }
  };

  const getStatusBadge = (status: CompanyForm['status']) => {
    const config = {
      Pending: { variant: 'secondary', className: 'bg-yellow-100 text-yellow-800' },
      Reviewed: { variant: 'default', className: 'bg-blue-100 text-blue-800' },
      Filed: { variant: 'default', className: 'bg-green-100 text-green-800' }
    };

    const statusConfig = config[status] || config.Pending;

    return (
      <Badge variant={statusConfig.variant as any} className={statusConfig.className}>
        {status}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <div className="grid gap-6 md:grid-cols-2">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="container mx-auto p-6">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <div className="text-center py-12">
          <FileText className="mx-auto h-16 w-16 text-gray-300" />
          <h3 className="mt-4 text-lg font-medium">Form not found</h3>
          <p className="mt-2 text-sm text-gray-500">The company formation form you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => router.back()} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">Company Formation Form</h1>
            <p className="text-muted-foreground text-white">Review and manage company formation application</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Applicant Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                Applicant Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-muted-foreground">Full Name</Label>
                  <p className="font-medium">{form.fullName}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Email</Label>
                  <p className="font-medium">{form.email}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Phone</Label>
                  <p className="font-medium">{form.phone}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">PAN</Label>
                  <p className="font-medium">{form.pan}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Company Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-green-600" />
                Company Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-muted-foreground">Company Name</Label>
                  <p className="font-medium">{form.companyName || '-'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Service Type</Label>
                  <p className="font-medium">{form.service || '-'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Business Activity</Label>
                  <p className="font-medium">{form.businessActivity || '-'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Proposed Capital</Label>
                  <p className="font-medium">{form.proposedCapital || '-'}</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-muted-foreground">Registered Office Address</Label>
                  <p className="font-medium">{form.registeredOfficeAddress || '-'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">City</Label>
                  <p className="font-medium">{form.city || '-'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">State</Label>
                  <p className="font-medium">{form.state || '-'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Pincode</Label>
                  <p className="font-medium">{form.pincode || '-'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Directors Information */}
        {form.directors && form.directors.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Directors Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {form.directors.map((director, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h4 className="font-medium mb-3">Director {index + 1}</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <Label className="text-muted-foreground">Name</Label>
                        <p className="font-medium">{director.name}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">PAN</Label>
                        <p className="font-medium">{director.pan}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Aadhaar</Label>
                        <p className="font-medium">{director.aadhaar}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Email</Label>
                        <p className="font-medium">{director.email}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Phone</Label>
                        <p className="font-medium">{director.phone}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Nationality</Label>
                        <p className="font-medium">{director.nationality}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Status and Actions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Status & Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div>
                <Label className="text-muted-foreground">Current Status</Label>
                <div className="mt-1">{getStatusBadge(form.status)}</div>
              </div>
              <div>
                <Label className="text-muted-foreground">Submitted On</Label>
                <p className="mt-1">{formatDate(form.createdAt)}</p>
              </div>
              {form.updatedAt && new Date(form.updatedAt).getTime() > new Date(form.createdAt).getTime() && (
                <div>
                  <Label className="text-muted-foreground">Last Updated</Label>
                  <p className="mt-1">{formatDate(form.updatedAt)}</p>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => {
                  setNextStatus(form.status === 'Pending' ? 'Reviewed' : 'Filed');
                  setShowConfirmDialog(true);
                }}
                disabled={form.status === 'Filed'}
              >
                {form.status === 'Pending' ? 'Mark as Reviewed' : 'Mark as Filed'}
              </Button>
              
              <Button
                variant="outline"
                onClick={() => setShowSendReportDialog(true)}
              >
                <Send className="mr-2 h-4 w-4" />
                Send Report
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Documents */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            {form.documents && form.documents.length > 0 ? (
              <div className="space-y-2">
                {form.documents.map((doc, index) => (
                  <div key={doc._id || index} className="flex items-center justify-between border rounded-md p-3">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">{doc.originalName || doc.fileName || doc.name || `Document ${index + 1}`}</p>
                        {doc.contentType && (
                          <p className="text-sm text-muted-foreground">{doc.contentType}</p>
                        )}
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No documents uploaded yet.</p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Status Update Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Status Update</DialogTitle>
            <DialogDescription>
              Are you sure you want to update the status to "{nextStatus}"?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleStatusUpdate} disabled={updatingStatus}>
              {updatingStatus ? 'Updating...' : 'Confirm Update'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send Report Dialog */}
      <Dialog open={showSendReportDialog} onOpenChange={setShowSendReportDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Send Report</DialogTitle>
            <DialogDescription>
              Send a report or completion document to the applicant.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="reportType">Report Type</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Company Registration">Company Registration</SelectItem>
                  <SelectItem value="Certificate">Certificate</SelectItem>
                  <SelectItem value="Compliance Report">Compliance Report</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="reportMessage">Message</Label>
              <Textarea
                id="reportMessage"
                placeholder="Enter your message or report details..."
                value={reportMessage}
                onChange={(e) => setReportMessage(e.target.value)}
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="reportFile">Attach Document (Optional)</Label>
              <Input
                id="reportFile"
                type="file"
                onChange={(e) => setReportFile(e.target.files?.[0] || null)}
                accept=".pdf,.doc,.docx,.xls,.xlsx"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSendReportDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendReport} disabled={sendingReport || !reportMessage}>
              {sendingReport ? 'Sending...' : 'Send Report'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
