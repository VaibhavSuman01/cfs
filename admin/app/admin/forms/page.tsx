"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/providers/auth-provider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Search,
  FileText,
  MoreHorizontal,
  CheckCircle,
  Clock,
  Eye,
  Edit3,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import api, { API_PATHS } from "@/lib/api-client";
import jsPDF from 'jspdf';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FormSubmission {
  _id: string;
  formType?: string;
  service?: string;
  subService?: string;
  status: "Pending" | "Reviewed" | "Filed";
  createdAt: string;
  updatedAt: string;
  fullName?: string;
  email?: string;
  phone?: string;
  pan?: string;
  companyName?: string;
  businessName?: string;
  // User information fields
  userId?: string;
  userName?: string;
  userEmail?: string;
  userMobile?: string;
  userPan?: string;
  userAadhaar?: string;
  userAddress?: string;
  // Form data and additional fields
  formData?: Record<string, any>;
  documents?: Array<{
    title?: string;
    type?: string;
    size?: number;
    uploadedAt?: string;
  }>;
  reports?: Array<{
    type?: string;
    message?: string;
    sentAt?: string;
  }>;
  comments?: Array<{
    comment?: string;
    by?: string;
    date?: string;
  }>;
}

export default function FormsPage() {
  const { user } = useAuth();
  const [forms, setForms] = useState<FormSubmission[]>([]);
  const [isLoadingForms, setIsLoadingForms] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedForm, setSelectedForm] = useState<FormSubmission | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [newStatus, setNewStatus] = useState<"Pending" | "Reviewed" | "Filed">(
    "Pending"
  );
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [serviceFilter, setServiceFilter] = useState<string>("all");

  const fetchForms = useCallback(async () => {
    try {
      setIsLoadingForms(true);
      console.log("Fetching forms from:", API_PATHS.ADMIN.SERVICE_FORMS);
      console.log("User:", user);
      console.log("User role:", user?.role);
      
      // Test if we can make a simple request first
      try {
        const testResponse = await api.get('/api/health');
        console.log("Health check response:", testResponse.data);
      } catch (healthError) {
        console.error("Health check failed:", healthError);
      }
      
      // Use service-forms endpoint to get all form types
      const response = await api.get(API_PATHS.ADMIN.SERVICE_FORMS);
      console.log("Forms response:", response.data);
      
      if (response.data && response.data.forms) {
        setForms(response.data.forms);
        console.log("Forms loaded successfully:", response.data.forms.length);
      } else {
        console.error("Invalid response format:", response.data);
        toast.error("Invalid response format from server");
      }
    } catch (error: any) {
      console.error("Failed to fetch forms:", error);
      console.error("Error details:", error.response?.data || error.message);
      console.error("Error status:", error.response?.status);
      console.error("Error headers:", error.response?.headers);
      toast.error(`Failed to load forms: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsLoadingForms(false);
    }
  }, [user]);

  useEffect(() => {
    if (user && user.role === "admin") {
      console.log("User is admin, fetching forms...");
      fetchForms();
    } else {
      console.log("User is not admin or not loaded yet:", user);
    }
  }, [user, fetchForms]);

  const openFormDetails = (form: FormSubmission) => {
    setSelectedForm(form);
    setNewStatus(form.status);
    setComment("");
    setIsDialogOpen(true);
  };

  const handleEditForm = (form: FormSubmission) => {
    // Navigate to the appropriate edit page based on form type
    const formType = form.formType?.toLowerCase();
    if (formType === 'companyform') {
      window.open(`/admin/forms/company-information/${form._id}`, '_blank');
    } else if (formType === 'otherregistrationform') {
      window.open(`/admin/forms/other-registration/${form._id}`, '_blank');
    } else if (formType === 'rocform') {
      window.open(`/admin/forms/roc-returns/${form._id}`, '_blank');
    } else if (formType === 'trademarkisoform') {
      window.open(`/admin/forms/trademark-iso/${form._id}`, '_blank');
    } else if (formType === 'advisoryform') {
      window.open(`/admin/forms/advisory/${form._id}`, '_blank');
    } else {
      // Default to general form view
      window.open(`/admin/forms/${form._id}`, '_blank');
    }
  };


  const handleStatusUpdate = async () => {
    if (!selectedForm) return;

    try {
      // Update the form status
      await api.put(API_PATHS.ADMIN.FORM_STATUS(selectedForm._id), {
        status: newStatus,
        comment,
      });

      // Update local state
      setForms(prevForms =>
        prevForms.map(form =>
          form._id === selectedForm._id
            ? { ...form, status: newStatus }
            : form
        )
      );

      toast.success("Form status updated successfully");
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to update form status:", error);
      toast.error("Failed to update form status");
    }
  };

  const getStatusBadge = (status: string) => {
    const config = {
      Pending: { variant: "outline" as const, className: "border-yellow-500 text-yellow-700 bg-yellow-50" },
      Reviewed: { variant: "secondary" as const, className: "bg-blue-100 text-blue-800" },
      Filed: { variant: "default" as const, className: "bg-green-100 text-green-800" }
    };

    const statusConfig = config[status as keyof typeof config] || config.Pending;

    return (
      <Badge variant={statusConfig.variant} className={statusConfig.className}>
        {status}
      </Badge>
    );
  };

  const filteredForms = forms.filter((form) => {
    const searchLower = searchQuery.toLowerCase();
    const userName = form.fullName?.toLowerCase() ?? "";
    const userEmail = form.email?.toLowerCase() ?? "";
    const service = form.service?.toLowerCase() ?? "";
    const formType = form.formType?.toLowerCase() ?? "";
    
    const matchesSearch = 
      userName.includes(searchLower) ||
      userEmail.includes(searchLower) ||
      service.includes(searchLower) ||
      formType.includes(searchLower);
    
    const matchesStatus = statusFilter === "all" || form.status === statusFilter;
    const matchesService = serviceFilter === "all" || form.service === serviceFilter;
    
    return matchesSearch && matchesStatus && matchesService;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getFormTypeLabel = (formType: string) => {
    const typeMap: Record<string, string> = {
      'TaxForm': 'Tax Filing',
      'CompanyForm': 'Company Information',
      'OtherRegistrationForm': 'Other Registration',
      'ROCForm': 'ROC Returns',
      'ReportsForm': 'Reports',
      'TrademarkISOForm': 'Trademark & ISO',
      'AdvisoryForm': 'Advisory'
    };
    return typeMap[formType] || formType;
  };

  if (!user || user.role !== "admin") {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">
              You don't have permission to access this page.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">All Form Submissions</h1>
        <p className="text-gray-600 mt-2">
          Manage and review all user form submissions across all services
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by name, email, service..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Reviewed">Reviewed</SelectItem>
                <SelectItem value="Filed">Filed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={serviceFilter} onValueChange={setServiceFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by service" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Services</SelectItem>
                <SelectItem value="Company Information">Company Information</SelectItem>
                <SelectItem value="Other Registration">Other Registration</SelectItem>
                <SelectItem value="ROC Returns">ROC Returns</SelectItem>
                <SelectItem value="Reports">Reports</SelectItem>
                <SelectItem value="Trademark & ISO">Trademark & ISO</SelectItem>
                <SelectItem value="Advisory">Advisory</SelectItem>
                <SelectItem value="Taxation">Taxation</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              onClick={async () => {
                try {
                  const response = await api.get('/api/admin/test-forms');
                  console.log("Database test response:", response.data);
                  toast.success(`Database has ${response.data.total} total forms`);
                } catch (error) {
                  console.error("Database test failed:", error);
                  toast.error("Failed to test database");
                }
              }}
            >
              Test DB
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Forms Table */}
      <Card>
        <CardHeader>
          <CardTitle>Form Submissions</CardTitle>
          <CardDescription>
            {filteredForms.length} form(s) found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingForms ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Form Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredForms.length > 0 ? (
                    filteredForms.map((form) => (
                      <TableRow key={form._id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {form.fullName ?? "Unknown user"}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {form.email ?? "—"}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{form.service || "—"}</TableCell>
                        <TableCell>{getFormTypeLabel(form.formType || "—")}</TableCell>
                        <TableCell>
                          {getStatusBadge(form.status)}
                        </TableCell>
                        <TableCell>
                          {formatDate(form.createdAt)}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() => openFormDetails(form)}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleEditForm(form)}
                              >
                                <Edit3 className="mr-2 h-4 w-4" />
                                Edit Form
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6">
                        <FileText className="mx-auto h-8 w-8 text-muted-foreground opacity-50" />
                        <p className="mt-2 text-sm text-muted-foreground">
                          {searchQuery || statusFilter !== "all" || serviceFilter !== "all"
                            ? "No forms match your filters"
                            : "No forms found"}
                        </p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Form Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Form Details</DialogTitle>
            <DialogDescription>
              Review and update form status
            </DialogDescription>
          </DialogHeader>
          
          {selectedForm && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    User Name
                  </Label>
                  <p className="text-base font-medium">
                    {selectedForm.fullName ?? "Unknown user"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Email
                  </Label>
                  <p className="text-base">{selectedForm.email ?? "—"}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Service
                  </Label>
                  <p className="text-base">{selectedForm.service ?? "—"}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Form Type
                  </Label>
                  <p className="text-base">{getFormTypeLabel(selectedForm.formType ?? "—")}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Current Status
                  </Label>
                  <p className="text-base">{selectedForm.status}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Submitted On
                  </Label>
                  <p className="text-base">{formatDate(selectedForm.createdAt)}</p>
                </div>
              </div>

              <div>
                <Label htmlFor="status" className="text-sm font-medium">
                  Update Status
                </Label>
                <Select value={newStatus} onValueChange={(value: "Pending" | "Reviewed" | "Filed") => setNewStatus(value)}>
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Reviewed">Reviewed</SelectItem>
                    <SelectItem value="Filed">Filed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="comment" className="text-sm font-medium">
                  Admin Notes
                </Label>
                <Textarea
                  id="comment"
                  placeholder="Add any notes or comments..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="mt-1"
                  rows={3}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleStatusUpdate}>
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
