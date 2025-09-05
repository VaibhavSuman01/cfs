"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Loader2,
  FileText,
  ArrowLeft,
  Download,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api-client";

interface AdminReport {
  _id: string;
  type: string;
  message: string;
  sentAt: string;
  document: {
    fileName: string;
    originalName: string;
    fileType: string;
    contentType: string;
    fileSize: number;
    fileData: any;
    uploadDate: string;
  };
}

interface AdminData {
  reports: AdminReport[];
  documents: any[];
  notes: any[];
}

interface FormData {
  _id: string;
  user: string;
  fullName: string;
  email: string;
  phone: string;
  pan: string;
  service: string;
  subService?: string;
  status: "Pending" | "Reviewed" | "Filed";
  formType: string;
  createdAt: string;
  updatedAt: string;
  
  // Company Formation specific fields
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
  
  // Other Registration specific fields
  businessName?: string;
  businessType?: string;
  businessAddress?: string;
  turnover?: string;
  applicantName?: string;
  applicantPan?: string;
  applicantAadhaar?: string;
  applicantAddress?: string;
  
  // Common fields
  documents?: Array<{
    _id: string;
    filename?: string;
    fileName?: string;
    originalName?: string;
    path?: string;
    uploadedBy?: 'user' | 'admin';
  }>;
  adminData?: AdminData;
  // Legacy reports field for backward compatibility
  reports?: Array<{
    message: string;
    documents: string[];
    createdAt: string;
  }>;
}

export default function FormDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [form, setForm] = useState<FormData | null>(null);
  const [isLoadingForm, setIsLoadingForm] = useState(true);
  const [comment, setComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  useEffect(() => {
    const fetchFormDetails = async () => {
      try {
        setIsLoadingForm(true);
        // Fetch all user submissions and find the specific form by ID
        const response = await api.get('/api/forms/user-submissions');
        const forms = response.data.data;
        const targetForm = forms.find((f: any) => f._id === id);
        
        if (targetForm) {
          setForm(targetForm);
        } else {
          toast.error("Form not found. Please try again.");
          router.push('/dashboard');
        }
      } catch (error) {
        console.error("Failed to fetch form details:", error);
        toast.error("Failed to load form details. Please try again.");
      } finally {
        setIsLoadingForm(false);
      }
    };

    if (id && user) {
      fetchFormDetails();
    }
  }, [id, user, router]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      setIsSubmittingComment(true);
      // Comments API is not implemented on backend; avoid 404 and inform user
      setComment('');
      toast.info('Messaging inside the form is coming soon. Please use Contact Support for now.');
    } catch (error) {
      console.error("Failed to add comment:", error);
      toast.error("Failed to add comment. Please try again.");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const downloadDocument = async (documentId: string, filename: string) => {
    try {
      await api.downloadFile(`/api/forms/download/${documentId}`, filename);
    } catch (error) {
      console.error("Failed to download document:", error);
      toast.error("Failed to download document. Please try again.");
    }
  };

  const downloadAdminReport = async (formId: string, reportId: string, filename: string) => {
    try {
      await api.downloadFile(`/api/forms/download-admin-report/${formId}/${reportId}`, filename);
    } catch (error) {
      console.error("Admin report download failed:", error);
      toast.error("Failed to download the admin report. Please try again.");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Reviewed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Filed":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pending":
        return <Clock className="h-4 w-4" />;
      case "Reviewed":
        return <AlertCircle className="h-4 w-4" />;
      case "Filed":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getFormTypeLabel = (formType: string) => {
    const typeMap: Record<string, string> = {
      'TaxForm': 'Tax Filing',
      'CompanyForm': 'Company Formation',
      'OtherRegistrationForm': 'Other Registration',
      'ROCForm': 'ROC Returns',
      'ReportsForm': 'Reports',
      'TrademarkISOForm': 'Trademark & ISO',
      'AdvisoryForm': 'Advisory'
    };
    return typeMap[formType] || formType;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Safely format currency values and avoid NaN
  const formatCurrency = (value?: string | number) => {
    if (value === undefined || value === null || value === '') return '—';
    const n = typeof value === 'string' ? parseFloat(value) : value;
    if (Number.isNaN(n as number)) return '—';
    return `₹${(n as number).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
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
          <Button
            variant="ghost"
            onClick={() => router.push("/dashboard")}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-16 w-16 text-muted-foreground opacity-50 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Form Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The requested form could not be found.
            </p>
            <Button onClick={() => router.push("/dashboard")}>
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push("/dashboard")}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <h1 className="text-3xl font-bold">{getFormTypeLabel(form.formType)} Details</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{getFormTypeLabel(form.formType)} Information</CardTitle>
                <CardDescription>
                  Submitted on {formatDate(form.createdAt)}
                </CardDescription>
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
                {/* Applicant Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Full Name
                    </h3>
                    <p className="text-base">{form.fullName}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Email
                    </h3>
                    <p className="text-base">{form.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Phone
                    </h3>
                    <p className="text-base">{form.phone}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      PAN
                    </h3>
                    <p className="text-base">{form.pan}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Service
                    </h3>
                    <p className="text-base">{form.service}</p>
                  </div>
                  {form.subService && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Sub Service
                      </h3>
                      <p className="text-base">{form.subService}</p>
                    </div>
                  )}
                </div>

                {/* Company Formation specific fields */}
                {form.formType === 'CompanyForm' && (
                  <>
                    <Separator />
                    <h3 className="text-lg font-semibold">Company Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">
                          Company Name
                        </h4>
                        <p className="text-base">{form.companyName || 'Not provided'}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">
                          Business Activity
                        </h4>
                        <p className="text-base">{form.businessActivity || 'Not provided'}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">
                          Proposed Capital
                        </h4>
                        <p className="text-base">{form.proposedCapital || 'Not provided'}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">
                          Address
                        </h4>
                        <p className="text-base">{form.registeredOfficeAddress || 'Not provided'}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">
                          City
                        </h4>
                        <p className="text-base">{form.city || 'Not provided'}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">
                          State
                        </h4>
                        <p className="text-base">{form.state || 'Not provided'}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">
                          Pincode
                        </h4>
                        <p className="text-base">{form.pincode || 'Not provided'}</p>
                      </div>
                    </div>
                  </>
                )}

                {/* Other Registration specific fields */}
                {form.formType === 'OtherRegistrationForm' && (
                  <>
                    <Separator />
                    <h3 className="text-lg font-semibold">Business Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">
                          Business Name
                        </h4>
                        <p className="text-base">{form.businessName || 'Not provided'}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">
                          Business Type
                        </h4>
                        <p className="text-base">{form.businessType || 'Not provided'}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">
                          Business Address
                        </h4>
                        <p className="text-base">{form.businessAddress || 'Not provided'}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">
                          Turnover
                        </h4>
                        <p className="text-base">{form.turnover || 'Not provided'}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">
                          City
                        </h4>
                        <p className="text-base">{form.city || 'Not provided'}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">
                          State
                        </h4>
                        <p className="text-base">{form.state || 'Not provided'}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">
                          Pincode
                        </h4>
                        <p className="text-base">{form.pincode || 'Not provided'}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
              <CardDescription>
                Supporting documents for your {getFormTypeLabel(form.formType).toLowerCase()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {(() => {
                const userDocs = (form.documents ?? []).filter((d: { uploadedBy?: 'user' | 'admin' }) => (d.uploadedBy ?? 'user') === 'user');
                return userDocs.length > 0 ? (
                <div className="space-y-2">
                  {userDocs.map((doc: { _id: string; filename?: string; fileName?: string; originalName?: string; }) => (
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
                  <p className="mt-2 text-sm text-muted-foreground">
                    No documents attached
                  </p>
                </div>
                );
              })()}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Reports from Admin</CardTitle>
              <CardDescription>Download reports shared by your consultant</CardDescription>
            </CardHeader>
            <CardContent>
              {(() => {
                const adminReports = form.adminData?.reports || [];
                const legacyReports = form.reports || [];
                const hasReports = adminReports.length > 0 || legacyReports.length > 0;
                
                return hasReports ? (
                  <div className="space-y-2">
                    {/* New admin reports */}
                    {adminReports.map((report: AdminReport) => (
                      <div key={report._id} className="flex items-center justify-between bg-muted p-3 rounded-md">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{report.message}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(report.sentAt).toLocaleString()}
                          </span>
                          {report.document && (
                            <span className="text-xs text-muted-foreground">
                              Document attached: {report.document.originalName}
                            </span>
                          )}
                        </div>
                        {report.document && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => downloadAdminReport(form._id, report._id, report.document.originalName)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    
                    {/* Legacy reports for backward compatibility */}
                    {legacyReports.map((r: { message: string; documents: string[]; createdAt: string }, index: number) => (
                      <div key={`legacy-${index}`} className="flex items-center justify-between bg-muted p-3 rounded-md">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{r.message}</span>
                          <span className="text-xs text-muted-foreground">
                            {r.createdAt ? new Date(r.createdAt).toLocaleString() : ''}
                          </span>
                          {r.documents && r.documents.length > 0 && (
                            <span className="text-xs text-muted-foreground">
                              {r.documents.length} document(s) attached
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <FileText className="mx-auto h-8 w-8 text-muted-foreground opacity-50" />
                    <p className="mt-2 text-sm text-muted-foreground">No reports shared yet</p>
                  </div>
                );
              })()}
            </CardContent>
          </Card>
          

        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status Timeline</CardTitle>
              <CardDescription>Track your {getFormTypeLabel(form.formType).toLowerCase()} progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative pl-6 border-l-2 border-muted space-y-6">
                <div className="relative">
                  <div className="absolute -left-[25px] p-1 rounded-full bg-primary">
                    <CheckCircle className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <h3 className="text-base font-medium">Submitted</h3>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(form.createdAt)}
                  </p>
                  <p className="text-sm mt-1">
                    Your {getFormTypeLabel(form.formType).toLowerCase()} has been submitted successfully.
                  </p>
                </div>

                <div className="relative">
                  <div
                    className={`absolute -left-[25px] p-1 rounded-full ${
                      form.status === "Pending" ? "bg-muted" : "bg-primary"
                    }`}
                  >
                    {form.status !== "Pending" ? (
                      <CheckCircle className="h-4 w-4 text-primary-foreground" />
                    ) : (
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <h3 className="text-base font-medium">Under Review</h3>
                  <p className="text-sm text-muted-foreground">
                    {form.status !== "Pending"
                      ? formatDate(form.updatedAt)
                      : "Pending"}
                  </p>
                  <p className="text-sm mt-1">
                    {form.status !== "Pending"
                      ? `Your ${getFormTypeLabel(form.formType).toLowerCase()} has been reviewed by our consultants.`
                      : `Your ${getFormTypeLabel(form.formType).toLowerCase()} is waiting to be reviewed by our consultants.`}
                  </p>
                </div>

                <div className="relative">
                  <div
                    className={`absolute -left-[25px] p-1 rounded-full ${
                      form.status === "Filed" ? "bg-primary" : "bg-muted"
                    }`}
                  >
                    {form.status === "Filed" ? (
                      <CheckCircle className="h-4 w-4 text-primary-foreground" />
                    ) : (
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <h3 className="text-base font-medium">Filed</h3>
                  <p className="text-sm text-muted-foreground">
                    {form.status === "Filed"
                      ? formatDate(form.updatedAt)
                      : "Pending"}
                  </p>
                  <p className="text-sm mt-1">
                    {form.status === "Filed"
                      ? `Your ${getFormTypeLabel(form.formType).toLowerCase()} has been completed.`
                      : `Your ${getFormTypeLabel(form.formType).toLowerCase()} will be completed after review and approval.`}
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
                If you have any questions about your {getFormTypeLabel(form.formType).toLowerCase()}, please contact
                our support team.
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
