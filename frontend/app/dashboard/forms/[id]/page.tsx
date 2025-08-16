'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Loader2, FileText, ArrowLeft, Download, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api-client';

interface TaxForm {
  _id: string;
  userId: string;
  taxYear: string;
  incomeType: string;
  grossIncome: string;
  deductions: string;
  additionalNotes: string;
  status: 'Pending' | 'Reviewed' | 'Filed';
  createdAt: string;
  updatedAt: string;
  documents?: Array<{
    _id: string;
    filename?: string;
    fileName?: string;
    originalName?: string;
    path?: string;
  }>;
  comments?: {
    _id: string;
    text: string;
    createdAt: string;
    createdBy: string;
    isAdmin: boolean;
  }[];
  reports?: Array<{
    documentId?: string;
    type?: string;
    message?: string;
    sentAt?: string;
  }>;
}

export default function FormDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [form, setForm] = useState<TaxForm | null>(null);
  const [isLoadingForm, setIsLoadingForm] = useState(true);
  const [comment, setComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  useEffect(() => {
    const fetchFormDetails = async () => {
      try {
        setIsLoadingForm(true);
                const response = await api.get(`/api/forms/user-submissions/${id}`);
        setForm(response.data.data);
      } catch (error) {
        console.error('Failed to fetch form details:', error);
        toast.error('Failed to load form details. Please try again.');
      } finally {
        setIsLoadingForm(false);
      }
    };

    if (id && user) {
      fetchFormDetails();
    }
  }, [id, user]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      setIsSubmittingComment(true);
      // Comments API is not implemented on backend; avoid 404 and inform user
      setComment('');
      toast.info('Messaging inside the form is coming soon. Please use Contact Support for now.');
    } catch (error) {
      console.error('Failed to add comment:', error);
      toast.error('Failed to add comment. Please try again.');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const downloadDocument = async (documentId: string, filename: string) => {
    try {
      await api.downloadFile(`/api/forms/download/${documentId}`, filename);
    } catch (error) {
      console.error('Failed to download document:', error);
      toast.error('Failed to download document. Please try again.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Reviewed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Filed':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending':
        return <Clock className="h-4 w-4" />;
      case 'Reviewed':
        return <AlertCircle className="h-4 w-4" />;
      case 'Filed':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading || isLoadingForm) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!form) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => router.push('/dashboard')} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-16 w-16 text-muted-foreground opacity-50 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Form Not Found</h2>
            <p className="text-muted-foreground mb-6">The requested tax form could not be found.</p>
            <Button onClick={() => router.push('/dashboard')}>Return to Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => router.push('/dashboard')} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <h1 className="text-3xl font-bold">Tax Form Details</h1>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Tax Form Information</CardTitle>
                <CardDescription>Submitted on {formatDate(form.createdAt)}</CardDescription>
              </div>
              <Badge variant="outline" className={getStatusColor(form.status)}>
                <span className="flex items-center">
                  {getStatusIcon(form.status)}
                  <span className="ml-1">{form.status}</span>
                </span>
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Tax Year</h3>
                    <p className="text-base">{form.taxYear}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Income Type</h3>
                    <p className="text-base">{form.incomeType ? form.incomeType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'None'}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Gross Income</h3>
                    <p className="text-base">₹{parseInt(form.grossIncome).toLocaleString('en-IN')}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Deductions</h3>
                    <p className="text-base">
                      {form.deductions ? `₹${parseInt(form.deductions).toLocaleString('en-IN')}` : 'None'}
                    </p>
                  </div>
                </div>
                
                {form.additionalNotes && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Additional Notes</h3>
                    <p className="text-base whitespace-pre-line">{form.additionalNotes}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
              <CardDescription>Supporting documents for your tax form</CardDescription>
            </CardHeader>
            <CardContent>
              {form.documents && form.documents.length > 0 ? (
                <div className="space-y-2">
                  {form.documents.map((doc: { _id: string; filename?: string; fileName?: string; originalName?: string; }) => (
                    <div key={doc._id} className="flex items-center justify-between bg-muted p-3 rounded-md">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-primary" />
                        <span className="text-sm">{doc.originalName || doc.fileName || doc.filename || 'Document'}</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => downloadDocument(doc._id, (doc.originalName || doc.fileName || doc.filename || `document-${doc._id}`))}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <FileText className="mx-auto h-8 w-8 text-muted-foreground opacity-50" />
                  <p className="mt-2 text-sm text-muted-foreground">No documents attached</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Reports from Admin</CardTitle>
              <CardDescription>Download reports shared by your consultant</CardDescription>
            </CardHeader>
            <CardContent>
              {form.reports && form.reports.length > 0 && form.reports.some((r: { documentId?: string }) => r.documentId) ? (
                <div className="space-y-2">
                  {form.reports.filter((r: { documentId?: string }) => r.documentId).map((r: { documentId?: string; type?: string; sentAt?: string }) => (
                    <div key={r.documentId} className="flex items-center justify-between bg-muted p-3 rounded-md">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{r.type || 'Report'}</span>
                        <span className="text-xs text-muted-foreground">{r.sentAt ? new Date(r.sentAt).toLocaleString() : ''}</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => downloadDocument(r.documentId as string, `${r.type || 'report'}-${r.documentId}.pdf`)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <FileText className="mx-auto h-8 w-8 text-muted-foreground opacity-50" />
                  <p className="mt-2 text-sm text-muted-foreground">No reports shared yet</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Comments</CardTitle>
              <CardDescription>Communication regarding your tax form</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {form.comments && form.comments.length > 0 ? (
                  <div className="space-y-4">
                    {form.comments.map((comment) => (
                      <div key={comment._id} className={`p-3 rounded-md ${comment.isAdmin ? 'bg-primary/10 ml-8' : 'bg-muted mr-8'}`}>
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-sm font-medium">
                            {comment.isAdmin ? 'Tax Consultant' : 'You'}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(comment.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm">{comment.text}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-sm text-muted-foreground">No comments yet</p>
                  </div>
                )}
                
                <Separator className="my-4" />
                
                <form onSubmit={handleSubmitComment} className="space-y-2">
                  <textarea
                    className="w-full min-h-[100px] p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Add a comment or question..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <Button type="submit" disabled={isSubmittingComment || !comment.trim()}>
                    {isSubmittingComment ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      'Add Comment'
                    )}
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status Timeline</CardTitle>
              <CardDescription>Track your tax form progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative pl-6 border-l-2 border-muted space-y-6">
                <div className="relative">
                  <div className="absolute -left-[25px] p-1 rounded-full bg-primary">
                    <CheckCircle className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <h3 className="text-base font-medium">Submitted</h3>
                  <p className="text-sm text-muted-foreground">{formatDate(form.createdAt)}</p>
                  <p className="text-sm mt-1">Your tax form has been submitted successfully.</p>
                </div>
                
                <div className="relative">
                  <div className={`absolute -left-[25px] p-1 rounded-full ${form.status === 'Pending' ? 'bg-muted' : 'bg-primary'}`}>
                    {form.status !== 'Pending' ? (
                      <CheckCircle className="h-4 w-4 text-primary-foreground" />
                    ) : (
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <h3 className="text-base font-medium">Under Review</h3>
                  <p className="text-sm text-muted-foreground">
                    {form.status !== 'Pending' ? formatDate(form.updatedAt) : 'Pending'}
                  </p>
                  <p className="text-sm mt-1">
                    {form.status !== 'Pending' 
                      ? 'Your tax form has been reviewed by our consultants.'
                      : 'Your tax form is waiting to be reviewed by our consultants.'}
                  </p>
                </div>
                
                <div className="relative">
                  <div className={`absolute -left-[25px] p-1 rounded-full ${form.status === 'Filed' ? 'bg-primary' : 'bg-muted'}`}>
                    {form.status === 'Filed' ? (
                      <CheckCircle className="h-4 w-4 text-primary-foreground" />
                    ) : (
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <h3 className="text-base font-medium">Filed</h3>
                  <p className="text-sm text-muted-foreground">
                    {form.status === 'Filed' ? formatDate(form.updatedAt) : 'Pending'}
                  </p>
                  <p className="text-sm mt-1">
                    {form.status === 'Filed' 
                      ? 'Your tax form has been filed with the tax authorities.'
                      : 'Your tax form will be filed after review and approval.'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
              <CardDescription>Contact our support team</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                If you have any questions about your tax form, please contact our support team.
              </p>
              <Button variant="outline" className="w-full" asChild>
                <a href="/contact">Contact Support</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}