"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { EnhancedHeader } from "@/components/enhanced-header";
import { EnhancedFooter } from "@/components/enhanced-footer";
import { FadeInSection } from "@/components/fade-in-section";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import api, { API_PATHS } from "@/lib/api-client";
import axios from "axios";

export default function TaxFormPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading, isAuthenticated } = useAuth();

  const [service, setService] = useState("");
  const [year, setYear] = useState<string>(new Date().getFullYear().toString());
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pan, setPan] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth");
    }
    if (user) {
      setFullName(user.name);
      setEmail(user.email);
      if (user.mobile) {
        setPhone(user.mobile);
      }
    }
    const serviceParam = searchParams.get("service");
    if (serviceParam) {
      setService(serviceParam);
    }
  }, [user, isLoading, isAuthenticated, router, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields with specific error messages
    const missingFields = [];
    if (!service) missingFields.push("Service");
    if (!year) missingFields.push("Year");
    if (!fullName) missingFields.push("Full Name");
    if (!email) missingFields.push("Email");
    if (!phone) missingFields.push("Phone");
    if (!pan) missingFields.push("PAN");
    
    if (missingFields.length > 0) {
      const fieldList = missingFields.join(", ");
      const message = missingFields.length === 1 
        ? `Please fill in the ${fieldList} field.`
        : `Please fill in the following required fields: ${fieldList}.`;
      toast.error(message);
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    
    // Validate phone format (basic validation)
    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
    if (!phoneRegex.test(phone)) {
      toast.error("Please enter a valid phone number (at least 10 digits).");
      return;
    }
    
    // Validate PAN format (Indian PAN format: AAAAA9999A)
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panRegex.test(pan.toUpperCase())) {
      toast.error("Please enter a valid PAN number (format: AAAAA9999A).");
      return;
    }

    // Validate file types (PDF, PNG, JPG, ZIP, Excel formats allowed)
    if (files) {
      const allowedTypes = [
        'application/pdf',
        'image/png', 
        'image/jpg', 
        'image/jpeg',
        'application/zip',
        'application/x-zip-compressed',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
        'application/vnd.ms-excel', // .xls
        'text/csv'
      ];
      const invalidFiles = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!allowedTypes.includes(file.type)) {
          invalidFiles.push(file.name);
        }
      }
      
      if (invalidFiles.length > 0) {
        const fileList = invalidFiles.join(", ");
        const message = invalidFiles.length === 1
          ? `The file "${fileList}" is not supported. Please upload only PDF, PNG, JPG, ZIP, or Excel files (XLSX, XLS, CSV).`
          : `The following files are not supported: ${fileList}. Please upload only PDF, PNG, JPG, ZIP, or Excel files (XLSX, XLS, CSV).`;
        toast.error(message);
        return;
      }
    }

    // Validate total file size (50MB limit)
    if (files) {
      const maxTotalSize = 50 * 1024 * 1024; // 50MB in bytes
      let totalSize = 0;
      
      for (let i = 0; i < files.length; i++) {
        totalSize += files[i].size;
      }
      
      if (totalSize > maxTotalSize) {
        const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);
        toast.error(`Total file size (${totalSizeMB}MB) exceeds the 50MB limit. Please reduce the file sizes or remove some files.`);
        return;
      }
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("service", service);
    formData.append("fullName", fullName);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("pan", pan);
    formData.append("year", year);
    if (files) {
      for (let i = 0; i < files.length; i++) {
        formData.append("documents", files[i]);
      }
    }

    try {
      await api.post(API_PATHS.FORMS.TAX, formData);
      toast.success("Tax form submitted successfully!");
      router.push("/dashboard");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const data: any = error.response?.data;
        const messages = Array.isArray(data?.errors)
          ? data.errors
              .map((e: any) => e.msg || e.message)
              .filter(Boolean)
              .join(", ")
          : undefined;
        const fallback = "Failed to submit tax form. Please try again later.";
        let errorMessage = data?.message || messages;
        
        if (!errorMessage) {
          switch (status) {
            case 400:
              errorMessage = "Invalid form data. Please check your entries and try again.";
              break;
            case 401:
              errorMessage = "Your session has expired. Please log in again to continue.";
              break;
            case 403:
              errorMessage = "You don't have permission to submit this form. Please contact support if you believe this is an error.";
              break;
            case 404:
              errorMessage = "The form submission service is currently unavailable. Please try again later.";
              break;
            case 409:
              errorMessage = "You have already submitted a form for this service for the current year. You can view your existing submission in the dashboard.";
              break;
            case 413:
              errorMessage = "The uploaded files are too large. Please ensure the total file size is under 50MB and try again.";
              break;
            case 422:
              errorMessage = "Some required information is missing or invalid. Please review your form and try again.";
              break;
            case 429:
              errorMessage = "Too many submission attempts. Please wait a few minutes before trying again.";
              break;
            case 500:
            case 502:
            case 503:
            case 504:
              errorMessage = "Our servers are experiencing issues. Please try again in a few minutes.";
              break;
            default:
              errorMessage = fallback;
          }
        }
        
        // Only log console errors for unexpected status codes (exclude handled user-facing errors)
        const handledStatusCodes = [400, 401, 403, 404, 409, 413, 422, 429, 500, 502, 503, 504];
        if (!handledStatusCodes.includes(status || 0)) {
          console.error(
            `Error submitting tax form (status ${status}): ${errorMessage}`
          );
        }
        
        toast.error(errorMessage);
        
        // Handle specific redirects based on error type
        if (status === 409) {
          // Redirect to dashboard if form already exists
          setTimeout(() => {
            router.push("/dashboard");
          }, 2000); // Give user time to read the error message
        } else if (status === 401) {
          // Redirect to login if session expired
          setTimeout(() => {
            router.push("/login");
          }, 2000); // Give user time to read the error message
        }
      } else {
        // Handle non-Axios errors
        console.error(
          "An unexpected error occurred while submitting the tax form."
        );
        toast.error("An unexpected error occurred. Please try again later.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <EnhancedHeader />
      <main className="container mx-auto px-4 py-16">
        <FadeInSection>
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center">
                Tax Filing Form
              </CardTitle>
              <CardDescription className="text-center">
                Please fill out the form below to file your taxes for {service}.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-2">
                  <Label htmlFor="service">Service</Label>
                  <Input id="service" value={service} disabled />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="pan">PAN Card Number</Label>
                  <Input
                    id="pan"
                    value={pan}
                    onChange={(e) => setPan(e.target.value.toUpperCase())}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="documents">Upload Documents</Label>
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="documents"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-10 h-10 mb-3 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">
                          PDF, PNG, JPG, ZIP, Excel (XLSX, XLS, CSV) - MAX. 50MB total
                        </p>
                      </div>
                      <Input
                        id="documents"
                        type="file"
                        className="hidden"
                        multiple
                        accept=".pdf,.png,.jpg,.jpeg,.zip,.xlsx,.xls,.csv,application/pdf,image/png,image/jpeg,application/zip,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv"
                        onChange={(e) => setFiles(e.target.files)}
                      />
                    </label>
                  </div>
                  {files && (
                    <div className="mt-3 space-y-2">
                      <p className="text-sm font-medium text-gray-700">
                        {files.length} file(s) selected:
                      </p>
                      <div className="space-y-1 max-h-32 overflow-y-auto">
                        {Array.from(files).map((file, index) => (
                          <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded text-xs">
                            <span className="truncate flex-1 mr-2" title={file.name}>
                              {file.name}
                            </span>
                            <span className="text-gray-500 whitespace-nowrap">
                              {(file.size / (1024 * 1024)).toFixed(2)}MB
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="text-sm text-gray-600 font-medium pt-1 border-t">
                        Total size: {(
                          Array.from(files).reduce((total, file) => total + file.size, 0) / (1024 * 1024)
                        ).toFixed(2)}MB / 50MB
                      </div>
                    </div>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Submit
                </Button>
              </form>
            </CardContent>
          </Card>
        </FadeInSection>
      </main>
      <EnhancedFooter />
    </div>
  );
}
