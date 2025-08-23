"use client";

import React, { useEffect, useState } from "react";
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
  XCircle,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import api, { API_PATHS } from "@/lib/api-client";
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

interface TaxForm {
  _id: string;
  userId?: {
    _id?: string;
    name?: string;
    email?: string;
  };
  taxYear: string;
  incomeType?: string;
  grossIncome: string;
  deductions: string;
  additionalNotes: string;
  status: "Pending" | "Reviewed" | "Filed";
  createdAt: string;
  updatedAt: string;
}

export default function FormsPage() {
  const { user } = useAuth();
  const [forms, setForms] = useState<TaxForm[]>([]);
  const [isLoadingForms, setIsLoadingForms] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedForm, setSelectedForm] = useState<TaxForm | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [newStatus, setNewStatus] = useState<"Pending" | "Reviewed" | "Filed">(
    "Pending"
  );

  useEffect(() => {
    const fetchForms = async () => {
      try {
        setIsLoadingForms(true);
        const response = await api.get(API_PATHS.ADMIN.FORMS);
        setForms(response.data.forms || []);
      } catch (error) {
        console.error("Failed to fetch forms:", error);
        toast.error("Failed to load forms. Please try again.");
      } finally {
        setIsLoadingForms(false);
      }
    };

    if (user && user.role === "admin") {
      fetchForms();
    }
  }, [user]);

  const handleUpdateFormStatus = async () => {
    if (!selectedForm) return;

    try {
      await api.put(API_PATHS.ADMIN.FORM_STATUS(selectedForm._id), {
        status: newStatus,
        comment: comment.trim() ? comment : undefined,
      });

      // Update local state
      setForms(
        forms.map((form) =>
          form._id === selectedForm._id ? { ...form, status: newStatus } : form
        )
      );

      setIsDialogOpen(false);
      setComment("");
      toast.success("Form status updated successfully");
    } catch (error) {
      console.error("Failed to update form status:", error);
      toast.error("Failed to update form status. Please try again.");
    }
  };

  const openFormDetails = (form: TaxForm) => {
    setSelectedForm(form);
    setNewStatus(form.status);
    setIsDialogOpen(true);
  };

  const filteredForms = forms.filter((form) => {
    const searchLower = searchQuery.toLowerCase();
    const userName = form.userId?.name?.toLowerCase() ?? "";
    const userEmail = form.userId?.email?.toLowerCase() ?? "";
    const incomeLower = form.incomeType?.toLowerCase() ?? "";
    return (
      userName.includes(searchLower) ||
      userEmail.includes(searchLower) ||
      form.taxYear.includes(searchQuery) ||
      incomeLower.includes(searchLower)
    );
  });

  const formatIncomeType = (value?: string): string => {
    if (!value) return "—";
    return value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
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
        return <CheckCircle className="h-4 w-4" />;
      case "Filed":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (value: string) => {
    return `₹${parseInt(value).toLocaleString("en-IN")}`;
  };

  if (isLoadingForms) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-6 text-3xl font-bold">Tax Forms Management</h1>

      <div className="flex justify-between items-center mb-6">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search forms..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-blue-800">Tax Forms</CardTitle>
          <CardDescription className="text-blue-800">Manage user tax form submissions</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingForms ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Tax Year</TableHead>
                  <TableHead>Income Type</TableHead>
                  <TableHead>Gross Income</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredForms.length > 0 ? (
                  filteredForms.map((form) => (
                    <TableRow key={form._id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {form.userId?.name ?? "Unknown user"}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {form.userId?.email ?? "—"}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{form.taxYear}</TableCell>
                      <TableCell>{formatIncomeType(form.incomeType)}</TableCell>
                      <TableCell>{formatCurrency(form.grossIncome)}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getStatusColor(form.status)}
                        >
                          <span className="flex items-center">
                            {getStatusIcon(form.status)}
                            <span className="ml-1">{form.status}</span>
                          </span>
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(form.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => openFormDetails(form)}
                            >
                              <FileText className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6">
                      <FileText className="mx-auto h-8 w-8 text-muted-foreground opacity-50" />
                      <p className="mt-2 text-sm text-muted-foreground">
                        {searchQuery
                          ? "No forms match your search"
                          : "No forms found"}
                      </p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Form Details Dialog */}
      {selectedForm && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Tax Form Details</DialogTitle>
              <DialogDescription>
                Review and update the status of this tax form submission
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Submitted By
                  </h3>
                  <p className="text-base font-medium">
                    {selectedForm.userId?.name ?? "Unknown user"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedForm.userId?.email ?? "—"}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Submission Date
                  </h3>
                  <p className="text-base">
                    {formatDate(selectedForm.createdAt)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Tax Year
                  </h3>
                  <p className="text-base">{selectedForm.taxYear}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Income Type
                  </h3>
                  <p className="text-base">
                    {formatIncomeType(selectedForm.incomeType)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Gross Income
                  </h3>
                  <p className="text-base">
                    {formatCurrency(selectedForm.grossIncome)}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Deductions
                  </h3>
                  <p className="text-base">
                    {selectedForm.deductions
                      ? formatCurrency(selectedForm.deductions)
                      : "None"}
                  </p>
                </div>
              </div>

              {selectedForm.additionalNotes && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Additional Notes
                  </h3>
                  <p className="text-base whitespace-pre-line">
                    {selectedForm.additionalNotes}
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="status">Update Status</Label>
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant={newStatus === "Pending" ? "default" : "outline"}
                    onClick={() => setNewStatus("Pending")}
                    className="flex-1"
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    Pending
                  </Button>
                  <Button
                    type="button"
                    variant={newStatus === "Reviewed" ? "default" : "outline"}
                    onClick={() => setNewStatus("Reviewed")}
                    className="flex-1"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Reviewed
                  </Button>
                  <Button
                    type="button"
                    variant={newStatus === "Filed" ? "default" : "outline"}
                    onClick={() => setNewStatus("Filed")}
                    className="flex-1"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Filed
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="comment">Add Comment (Optional)</Label>
                <Textarea
                  id="comment"
                  placeholder="Add a comment or note about this status update"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateFormStatus}>Update Status</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
