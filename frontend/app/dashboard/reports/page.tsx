"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Loader2, Upload, ArrowLeft, FileText } from "lucide-react";
import { toast } from "sonner";
import api, { API_PATHS } from "@/lib/api-client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { PersonalInformationDropdown } from "@/components/ui/personal-information-dropdown";

const reportsFormSchema = z.object({
  reportType: z.string().min(1, "Report type is required"),
  subject: z.string().min(1, "Subject is required"),
  description: z.string().min(1, "Description is required"),
  dueDate: z.string().optional(),
  projectDetails: z.string().optional(),
  businessType: z.string().optional(),
});

type ReportsFormValues = z.infer<typeof reportsFormSchema>;

export default function ReportsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [aadhaarFile, setAadhaarFile] = useState<File | null>(null);

  // Map service names from dashboard to report type values
  const serviceToReportType: Record<string, string> = {
    "Project Reports": "project-reports",
    "CMA Reports": "cma-reports",
    "DSCR Reports": "dscr-reports",
    "Bank Reconciliation": "bank-reconciliation",
  };

  // Get service from URL
  const serviceParam = searchParams?.get("service") || "";
  const reportTypeFromUrl = serviceParam ? (serviceToReportType[serviceParam] || "") : "";
  const isServiceFromUrl = !!serviceParam;

  const form = useForm<ReportsFormValues>({
    resolver: zodResolver(reportsFormSchema),
    defaultValues: {
      reportType: reportTypeFromUrl || "",
      subject: "",
      description: "",
      dueDate: "",
      projectDetails: "",
      businessType: "",
    },
  });

  // Set report type from URL (update if URL changes)
  useEffect(() => {
    if (reportTypeFromUrl) {
      form.setValue("reportType", reportTypeFromUrl);
    }
  }, [reportTypeFromUrl, form]);

  const reportType = form.watch("reportType");

  const onSubmit = async (data: ReportsFormValues) => {
    try {
      setIsSubmitting(true);

      const formData = new FormData();

      // Append form data
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });

      // Append user profile data (non-editable fields)
      if (user) {
        formData.append("fullName", user.name || "");
        formData.append("email", user.email || "");
        formData.append("phone", user.mobile || "");
        formData.append("pan", user.pan || "");
        if (user.aadhaar) {
          formData.append("aadhaar", user.aadhaar);
        }
      }

      // Add service and subService fields for backend compatibility
      formData.append("service", "Reports");
      formData.append("subService", data.reportType);
      
      // Map frontend field names to backend expectations
      formData.append("businessName", data.subject); // Use subject as business name
      formData.append("businessType", data.businessType || "Other");
      formData.append("businessAddress", "Not provided");
      formData.append("reportPeriod", "Current Year");
      formData.append("reportPurpose", data.description);

      // Append Aadhaar file if uploaded
      if (aadhaarFile) {
        formData.append("aadhaarFile", aadhaarFile);
      }

      // Append other documents
      files.forEach((file) => {
        formData.append("documents", file);
      });

      await api.post(API_PATHS.FORMS.REPORTS, formData);

      toast.success("Report request submitted successfully");
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Failed to submit reports form:", error);
      
      // Handle specific error cases
      if (error.response?.status === 400 && error.response?.data?.message?.includes("already exists")) {
        toast.error("Already submitted for this Year. You can only submit one form per service.");
      } else if (error.response?.status === 409) {
        toast.error("Already submitted for this Year. You can only submit one form per service.");
      } else {
        toast.error("Failed to submit report request. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      setFiles(fileArray);
    }
  };

  const handleAadhaarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAadhaarFile(e.target.files[0]);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <h1 className="text-2xl font-bold">
          {reportType ? (reportType === "project-reports" ? "Project Reports" : reportType === "cma-reports" ? "CMA Reports" : reportType === "dscr-reports" ? "DSCR Reports" : reportType === "bank-reconciliation" ? "Bank Reconciliation" : serviceParam || "Reports") : (serviceParam || "Reports")}
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {reportType ? (reportType === "project-reports" ? "Project Reports" : reportType === "cma-reports" ? "CMA Reports" : reportType === "dscr-reports" ? "DSCR Reports" : reportType === "bank-reconciliation" ? "Bank Reconciliation" : serviceParam || "Reports") : (serviceParam || "Reports")} Form
          </CardTitle>
          <CardDescription>
            Submit your report request with all required details and documents.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Personal Information */}
              <PersonalInformationDropdown />

              {/* Report Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Report Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="reportType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Report Type *</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select report type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="project-reports">Project Reports</SelectItem>
                            <SelectItem value="cma-reports">CMA Reports</SelectItem>
                            <SelectItem value="dscr-reports">DSCR Reports</SelectItem>
                            <SelectItem value="bank-reconciliation">Bank Reconciliation</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="businessType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select business type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="manufacturing">Manufacturing</SelectItem>
                            <SelectItem value="trading">Trading</SelectItem>
                            <SelectItem value="services">Services</SelectItem>
                            <SelectItem value="agriculture">Agriculture</SelectItem>
                            <SelectItem value="construction">Construction</SelectItem>
                            <SelectItem value="technology">Technology</SelectItem>
                            <SelectItem value="healthcare">Healthcare</SelectItem>
                            <SelectItem value="education">Education</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Due Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Brief subject of your report request" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description *</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={4} placeholder="Detailed description of your report request" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="projectDetails"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Details</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={3} placeholder="Specific details about the project or business for which the report is needed" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Document Upload */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Document Requirements</h3>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Required Documents:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Aadhaar Card (PDF)</li>
                    <li>• PAN Card (PDF)</li>
                    <li>• Business Registration Certificate</li>
                    <li>• Financial Statements (if applicable)</li>
                    <li>• Project Proposal/Details</li>
                    <li>• Bank Statements</li>
                    <li>• Previous Reports (if any)</li>
                    <li>• Any supporting documents related to your report request</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="aadhaar-file">Aadhaar Card (PDF)</Label>
                    <Input
                      id="aadhaar-file"
                      type="file"
                      accept=".pdf"
                      onChange={handleAadhaarFileChange}
                      className="mt-1"
                    />
                    {aadhaarFile && (
                      <p className="text-sm text-green-600 mt-1">
                        ✓ {aadhaarFile.name} selected
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="documents">Additional Documents</Label>
                    <Input
                      id="documents"
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                      className="mt-1"
                    />
                    {files.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {files.map((file, index) => (
                          <div key={index} className="flex items-center text-sm text-green-600">
                            <FileText className="h-4 w-4 mr-2" />
                            ✓ {file.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Submit Report Request
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
