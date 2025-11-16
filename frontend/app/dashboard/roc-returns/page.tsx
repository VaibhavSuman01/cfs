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

const rocReturnsSchema = z.object({
  returnType: z.string().min(1, "Return type is required"),
  companyName: z.string().min(1, "Company name is required"),
  cinNumber: z.string().min(1, "CIN number is required"),
  companyType: z.string().min(1, "Company type is required"),
  registeredOfficeAddress: z.string().min(1, "Registered office address is required"),
  financialYear: z.string().min(1, "Financial year is required"),
  dueDate: z.string().optional(),
  description: z.string().optional(),
});

type ROCReturnsValues = z.infer<typeof rocReturnsSchema>;

export default function ROCReturnsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [aadhaarFile, setAadhaarFile] = useState<File | null>(null);
  const [panFile, setPanFile] = useState<File | null>(null);
  const [companyRegistrationFile, setCompanyRegistrationFile] = useState<File | null>(null);
  const [boardResolutionFile, setBoardResolutionFile] = useState<File | null>(null);
  const [financialStatementsFile, setFinancialStatementsFile] = useState<File | null>(null);
  const [directorKycFile, setDirectorKycFile] = useState<File | null>(null);
  const [shareTransferDeedFile, setShareTransferDeedFile] = useState<File | null>(null);
  const [previousReturnsFile, setPreviousReturnsFile] = useState<File | null>(null);
  const [dscFile, setDscFile] = useState<File | null>(null);

  // Map service names from dashboard to return type values
  const serviceToReturnType: Record<string, string> = {
    "Annual Filing": "annual-filing",
    "Board Resolutions": "board-resolutions",
    "Director Changes": "director-changes",
    "Share Transfer": "share-transfer",
  };

  // Get service from URL
  const serviceParam = searchParams?.get("service") || "";
  const returnTypeFromUrl = serviceParam ? (serviceToReturnType[serviceParam] || "") : "";
  const isServiceFromUrl = !!serviceParam;

  const form = useForm<ROCReturnsValues>({
    resolver: zodResolver(rocReturnsSchema),
    defaultValues: {
      returnType: returnTypeFromUrl || "",
      companyName: "",
      cinNumber: "",
      companyType: "",
      registeredOfficeAddress: "",
      financialYear: "",
      dueDate: "",
      description: "",
    },
  });

  // Set return type from URL (update if URL changes)
  useEffect(() => {
    if (returnTypeFromUrl) {
      form.setValue("returnType", returnTypeFromUrl);
    }
  }, [returnTypeFromUrl, form]);

  const returnType = form.watch("returnType");

  const onSubmit = async (data: ROCReturnsValues) => {
    try {
      setIsSubmitting(true);

      const formData = new FormData();

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
      formData.append("service", "ROC Returns");
      formData.append("subService", data.returnType);
      
      // Append company details - map frontend field names to backend expectations
      formData.append("companyName", data.companyName);
      formData.append("cin", data.cinNumber); // Map cinNumber to cin
      formData.append("cinNumber", data.cinNumber); // Also send as cinNumber for compatibility
      formData.append("companyType", data.companyType);
      formData.append("registeredOfficeAddress", data.registeredOfficeAddress);
      formData.append("financialYear", data.financialYear);
      if (data.dueDate) {
        formData.append("dueDate", data.dueDate);
      }
      if (data.description) {
        formData.append("description", data.description);
      }

      // Append Aadhaar file if uploaded
      if (aadhaarFile) {
        formData.append("aadhaarFile", aadhaarFile);
      }

      // Append other documents
      files.forEach((file) => {
        formData.append("documents", file);
      });

      await api.post(API_PATHS.FORMS.ROC_RETURNS, formData);

      toast.success("ROC returns application submitted successfully");
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Failed to submit ROC returns form:", error);
      
      // Handle specific error cases
      if (error.response?.status === 400 && error.response?.data?.message?.includes("already exists")) {
        toast.error("Already submitted for this Year. You can only submit one form per service.");
      } else if (error.response?.status === 409) {
        toast.error("Already submitted for this Year. You can only submit one form per service.");
      } else {
        toast.error("Failed to submit ROC returns application. Please try again.");
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
          {returnType ? (returnType === "annual-filing" ? "Annual Filing" : returnType === "board-resolutions" ? "Board Resolutions" : returnType === "director-changes" ? "Director Changes" : returnType === "share-transfer" ? "Share Transfer" : serviceParam || "ROC Returns") : (serviceParam || "ROC Returns")}
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {returnType ? (returnType === "annual-filing" ? "Annual Filing" : returnType === "board-resolutions" ? "Board Resolutions" : returnType === "director-changes" ? "Director Changes" : returnType === "share-transfer" ? "Share Transfer" : serviceParam || "ROC Returns") : (serviceParam || "ROC Returns")} Form
          </CardTitle>
          <CardDescription>
            Submit your ROC returns application with all required details and documents.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Personal Information */}
              <PersonalInformationDropdown />

              {/* ROC Returns Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">ROC Returns Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="returnType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Return Type *</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select return type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="annual-filing">Annual Filing</SelectItem>
                            <SelectItem value="board-resolutions">Board Resolutions</SelectItem>
                            <SelectItem value="director-changes">Director Changes</SelectItem>
                            <SelectItem value="share-transfer">Share Transfer</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter company name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cinNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CIN Number *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter CIN number" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="companyType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Type *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select company type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Private Limited">Private Limited</SelectItem>
                            <SelectItem value="Public Limited">Public Limited</SelectItem>
                            <SelectItem value="One Person Company">One Person Company</SelectItem>
                            <SelectItem value="Limited Liability Partnership">Limited Liability Partnership</SelectItem>
                            <SelectItem value="Partnership">Partnership</SelectItem>
                            <SelectItem value="Sole Proprietorship">Sole Proprietorship</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="financialYear"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Financial Year *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select financial year" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="2024-25">2024-25</SelectItem>
                            <SelectItem value="2023-24">2023-24</SelectItem>
                            <SelectItem value="2022-23">2022-23</SelectItem>
                            <SelectItem value="2021-22">2021-22</SelectItem>
                            <SelectItem value="2020-21">2020-21</SelectItem>
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
                  name="registeredOfficeAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Registered Office Address *</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={3} placeholder="Enter complete registered office address" />
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
                      <FormLabel>Additional Information</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={3} placeholder="Any additional information about your ROC returns" />
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
                    <li>• Company Registration Certificate</li>
                    <li>• Board Resolution (if applicable)</li>
                    <li>• Audited Financial Statements</li>
                    <li>• Director's KYC Documents</li>
                    <li>• Share Transfer Deed (if applicable)</li>
                    <li>• Previous Year ROC Returns</li>
                    <li>• Digital Signature Certificate (DSC)</li>
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
                    Submit ROC Returns Application
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
