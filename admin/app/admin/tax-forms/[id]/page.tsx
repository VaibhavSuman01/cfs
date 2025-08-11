"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Circle, Clock, Download, FileText, Mail, Phone, User, X, Send } from 'lucide-react';

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
  name?: string; // For backward compatibility
  path?: string; // For backward compatibility
}

interface TaxForm {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  pan: string;
  salaryInfo?: string;
  hasIncomeTaxLogin?: boolean;
  incomeTaxLoginId?: string;
  incomeTaxLoginPassword?: string;
  hasHomeLoan?: boolean;
  homeLoanSanctionDate?: string;
  homeLoanAmount?: string;
  homeLoanCurrentDue?: string;
  homeLoanTotalInterest?: string;
  hasPranNumber?: boolean;
  pranNumber?: string;
  status: 'Pending' | 'Reviewed' | 'Filed';
  documents: Document[];
  createdAt: string;
  updatedAt?: string;
}

export default function TaxFormDetailPage() {
  const router = useRouter();
  const { toast } = useToast();
  const params = useParams();
  const id = params.id as string;

  const [form, setForm] = useState<TaxForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [nextStatus, setNextStatus] = useState<TaxForm['status'] | null>(null);
  
  // Send report states
  const [showSendReportDialog, setShowSendReportDialog] = useState(false);
  const [reportMessage, setReportMessage] = useState('');
  const [reportType, setReportType] = useState('ITR');
  const [reportFile, setReportFile] = useState<File | null>(null);
  const [sendingReport, setSendingReport] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchForm = async () => {
        try {
          const response = await api.get(API_PATHS.ADMIN.FORM_DETAIL(id));
          console.log('API Response:', response);
          console.log('Form Data:', response.data);
          
          // Check if response.data is an object with a data property
          if (response.data && response.data.data && typeof response.data.data === 'object') {
            // If API returns { data: { ... } } structure, use the nested data
            setForm(response.data.data);
          } else {
            // Otherwise use the response data directly
            setForm(response.data);
          }
        } catch (error) {
          console.error('Failed to fetch tax form:', error);
          toast({ title: 'Error', description: 'Failed to load tax form details.', variant: 'destructive' });
        } finally {
          setLoading(false);
        }
      };
      fetchForm();
    }
  }, [id, toast]);

  const handleUpdateStatus = async () => {
    if (!nextStatus) return;
    setUpdatingStatus(true);
    try {
      await api.put(API_PATHS.ADMIN.FORM_STATUS(id), { status: nextStatus });
      setForm(prev => prev ? { ...prev, status: nextStatus } : null);
      toast({ title: 'Success', description: `Status updated to ${nextStatus}.` });
    } catch (error) {
      console.error('Failed to update status:', error);
      toast({ title: 'Error', description: 'Failed to update status.', variant: 'destructive' });
    } finally {
      setUpdatingStatus(false);
      setShowConfirmDialog(false);
    }
  };

  const promptUpdateStatus = (status: TaxForm['status']) => {
    setNextStatus(status);
    setShowConfirmDialog(true);
  };

  const handleDownload = async (doc: Document) => {
    if (!doc || !doc._id) {
      toast({ title: 'Download Failed', description: 'Invalid document information.', variant: 'destructive' });
      return;
    }
    
    try {
      // Use the correct API path for document downloads
      const fileName = doc.originalName || doc.fileName || doc.name || `document-${doc._id}`;
      
      // Use the downloadFile method from the API client which handles authentication
      await api.downloadFile(`/api/admin/forms/${id}/documents/${doc._id}`, fileName);
      
      toast({ title: 'Download Started', description: `Downloading ${fileName}` });
    } catch (error) {
      console.error('Download error:', error);
      toast({ title: 'Download Failed', description: 'Could not download the file.', variant: 'destructive' });
    }
  };
  
  const handleSendReport = async () => {
    if (!form) return;
    
    setSendingReport(true);
    try {
      // Get selected attachment IDs
            const formData = new FormData();
      formData.append('reportType', reportType);
      formData.append('message', reportMessage);
      if (reportFile) {
        formData.append('reportFile', reportFile);
      }

      // Send the report
      await api.post(`/api/admin/forms/${id}/send-report`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      toast({ title: 'Success', description: 'Report sent successfully.' });
      setShowSendReportDialog(false);
      setReportMessage('');
      setReportFile(null);
    } catch (error) {
      console.error('Failed to send report:', error);
      toast({ title: 'Error', description: 'Failed to send report.', variant: 'destructive' });
    } finally {
      setSendingReport(false);
    }
  };

  if (loading) {
    return <div className="container mx-auto p-6"><Skeleton className="h-96 w-full" /></div>;
  }

  if (!form) {
    return <div className="container mx-auto p-6 text-center">Tax form not found.</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Button variant="outline" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Forms
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center"><FileText className="mr-2" />Tax Form Details</CardTitle>
                    <CardDescription>Submitted on {new Date(form.createdAt).toLocaleDateString()}</CardDescription>
                  </div>
                  <Badge variant={form.status === 'Filed' ? 'default' : form.status === 'Reviewed' ? 'default' : 'secondary'}>{form.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <InfoSection title="Personal Information" icon={<User/>}>
                  <InfoItem label="Full Name" value={form.fullName} />
                  <InfoItem label="Email" value={form.email} icon={<Mail/>} href={`mailto:${form.email}`} />
                  <InfoItem label="Phone" value={form.phone} icon={<Phone/>} href={`tel:${form.phone}`} />
                  <InfoItem label="PAN" value={form.pan} />
                </InfoSection>

                {form.salaryInfo && (
                  <InfoSection title="Income Details">
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{form.salaryInfo}</p>
                  </InfoSection>
                )}

                {form.hasIncomeTaxLogin && (
                  <InfoSection title="Income Tax Portal Credentials">
                    <InfoItem label="Login ID" value={form.incomeTaxLoginId || 'Not provided'} />
                    <InfoItem label="Password" value={form.incomeTaxLoginPassword || 'Not provided'} />
                  </InfoSection>
                )}
                
                {form.hasHomeLoan && (
                  <InfoSection title="Home Loan Details">
                    <InfoItem label="Sanction Date" value={form.homeLoanSanctionDate ? new Date(form.homeLoanSanctionDate).toLocaleDateString() : 'Not provided'} />
                    <InfoItem label="Loan Amount" value={form.homeLoanAmount ? `₹${parseInt(form.homeLoanAmount).toLocaleString()}` : 'Not provided'} />
                    <InfoItem label="Current Due" value={form.homeLoanCurrentDue ? `₹${parseInt(form.homeLoanCurrentDue).toLocaleString()}` : 'Not provided'} />
                    <InfoItem label="Total Interest" value={form.homeLoanTotalInterest ? `${form.homeLoanTotalInterest}%` : 'Not provided'} />
                  </InfoSection>
                )}
                
                {form.hasPranNumber && (
                  <InfoSection title="PRAN Details">
                    <InfoItem label="PRAN Number" value={form.pranNumber || 'Not provided'} />
                  </InfoSection>
                )}

                <InfoSection title="Uploaded Documents">
                  <ul className="space-y-2">
                    {form.documents && form.documents.length > 0 ? (
                      form.documents.map(doc => (
                        <li key={doc._id} className="flex items-center justify-between p-2 rounded-md border">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">{doc.originalName || doc.fileName || doc.name || 'Document'}</span>
                            {doc.documentType && <span className="text-xs text-muted-foreground capitalize">{doc.documentType.replace(/([A-Z])/g, ' $1').trim()}</span>}
                          </div>
                          <Button size="sm" variant="outline" onClick={() => handleDownload(doc)}><Download className="mr-2 h-4 w-4"/>Download</Button>
                        </li>
                      ))
                    ) : (
                      <li className="p-2 text-sm text-muted-foreground">No documents uploaded</li>
                    )}
                  </ul>
                </InfoSection>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">Update the status of this tax form.</p>
                <div className="flex flex-col space-y-2">
                  <Button onClick={() => promptUpdateStatus('Pending')} disabled={updatingStatus || form.status === 'Pending'}><Clock className="mr-2 h-4 w-4"/>Mark as Pending</Button>
                  <Button onClick={() => promptUpdateStatus('Reviewed')} disabled={updatingStatus || form.status === 'Reviewed'}><Circle className="mr-2 h-4 w-4"/>Mark as Reviewed</Button>
                  <Button onClick={() => promptUpdateStatus('Filed')} disabled={updatingStatus || form.status === 'Filed'}><Check className="mr-2 h-4 w-4"/>Mark as Filed</Button>
                </div>
                
                <div className="pt-4 border-t mt-4">
                  <p className="text-sm text-muted-foreground mb-2">Send a report to the client</p>
                  <Button onClick={() => setShowSendReportDialog(true)} className="w-full"><Send className="mr-2 h-4 w-4"/>Send Report</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Status Change</DialogTitle>
            <DialogDescription>
              Are you sure you want to change the status to "{nextStatus}"?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>Cancel</Button>
            <Button onClick={handleUpdateStatus} disabled={updatingStatus}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={showSendReportDialog} onOpenChange={setShowSendReportDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Send Report to Client</DialogTitle>
            <DialogDescription>
              Send a report to {form?.fullName} at {form?.email}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reportType">Report Type</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ITR">Income Tax Return</SelectItem>
                  <SelectItem value="GST">GST Filing</SelectItem>
                  <SelectItem value="Confirmation">Confirmation</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Enter your message to the client"
                value={reportMessage}
                onChange={(e) => setReportMessage(e.target.value)}
                rows={4}
              />
            </div>
            
                        <div className="space-y-2">
              <Label htmlFor="reportFile">Attach Report File</Label>
              <Input 
                id="reportFile" 
                type="file" 
                onChange={(e) => setReportFile(e.target.files ? e.target.files[0] : null)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSendReportDialog(false)}>Cancel</Button>
            <Button onClick={handleSendReport} disabled={sendingReport || !reportMessage.trim()}>
              {sendingReport ? 'Sending...' : 'Send Report'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const InfoSection = ({ title, icon, children }: { title: string, icon?: React.ReactNode, children: React.ReactNode }) => (
  <div>
    <h3 className="text-lg font-semibold flex items-center mb-2">{icon && <span className="mr-2">{icon}</span>}{title}</h3>
    <div className="space-y-2 pl-4 border-l-2">
      {children}
    </div>
  </div>
);

const InfoItem = ({ label, value, icon, href }: { label: string, value: string, icon?: React.ReactNode, href?: string }) => (
  <div className="flex justify-between items-center">
    <span className="text-sm font-medium text-muted-foreground">{label}</span>
    {href ? (
      <a href={href} className="text-sm text-primary hover:underline flex items-center">
        {icon && <span className="mr-1">{icon}</span>}{value}
      </a>
    ) : (
      <span className="text-sm">{value}</span>
    )}
  </div>
);
