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
import { AxiosError } from "axios";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const trademarkFormSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  pan: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format"),
  aadhaar: z.string().regex(/^\d{12}$/, "Aadhaar must be exactly 12 digits").optional(),
  serviceType: z.string().min(1, "Service type is required"),
  trademarkName: z.string().min(1, "Trademark name is required"),
  trademarkClass: z.string().min(1, "Trademark class is required"),
  applicantName: z.string().min(1, "Applicant name is required"),
  applicationType: z.string().min(1, "Application type is required"),
  description: z.string().optional(),
  priorityDate: z.string().optional(),
  businessAddress: z.string().optional(),
});

type TrademarkFormValues = z.infer<typeof trademarkFormSchema>;

export default function TrademarkISOPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [aadhaarFile, setAadhaarFile] = useState<File | null>(null);

  // Map service names from dashboard to service type values
  const serviceToServiceType: Record<string, string> = {
    "Trademark Registration": "trademark-registration",
    "ISO 9001 Certification": "iso-9001",
    "ISO 14001 Certification": "iso-14001",
    "Copyright Registration": "copyright-registration",
  };

  // Get service from URL
  const serviceParam = searchParams?.get("service") || "";
  const serviceTypeFromUrl = serviceParam ? (serviceToServiceType[serviceParam] || "") : "";
  const isServiceFromUrl = !!serviceParam;

  const form = useForm<TrademarkFormValues>({
    resolver: zodResolver(trademarkFormSchema),
    defaultValues: {
      fullName: user?.name || "",
      email: user?.email || "",
      phone: user?.mobile || "",
      pan: user?.pan || "",
      aadhaar: user?.aadhaar || "",
      serviceType: "",
      trademarkName: "",
      trademarkClass: "",
      applicantName: "",
      applicationType: "",
      description: "",
      priorityDate: "",
      businessAddress: "",
    },
  });

  // Set service type from URL
  useEffect(() => {
    if (serviceTypeFromUrl) {
      form.setValue("serviceType", serviceTypeFromUrl);
    }
  }, [serviceTypeFromUrl, form]);

  const onSubmit = async (data: TrademarkFormValues) => {
    try {
      setIsSubmitting(true);

      const formData = new FormData();

      // Append form data
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });

      // Add service and subService fields
      formData.append("service", "Trademark & ISO");
      formData.append("subService", data.serviceType);

      // Append Aadhaar file if uploaded
      if (aadhaarFile) {
        formData.append("aadhaarFile", aadhaarFile);
      }

      // Append other documents
      files.forEach((file) => {
        formData.append("documents", file);
      });

      await api.post(API_PATHS.FORMS.TRADEMARK_ISO, formData);

      toast.success("Trademark & ISO application submitted successfully");
      router.push("/dashboard/trademark-iso");
    } catch (error) {
      console.error("Failed to submit trademark form:", error);
      
      // Handle specific error cases
      if (error instanceof AxiosError) {
        if (error.response?.status === 400 && error.response?.data?.message?.includes("already exists")) {
          toast.error("Already submitted for this Year. You can only submit one form per service.");
        } else if (error.response?.status === 409) {
          toast.error("Already submitted for this Year. You can only submit one form per service.");
        } else {
          toast.error("Failed to submit trademark application. Please try again.");
        }
      } else {
        toast.error("Failed to submit trademark application. Please try again.");
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
        <h1 className="text-2xl font-bold">Trademark & ISO Application</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Trademark & ISO Application Form</CardTitle>
          <CardDescription>
            Submit your trademark and ISO application with all required details and documents.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name *</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email *</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone *</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="pan"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>PAN *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="ABCDE1234F" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="aadhaar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Aadhaar Number</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="123456789012" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Service Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Service Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="serviceType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Service Type *</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          value={field.value}
                          disabled={isServiceFromUrl}
                        >
                          <FormControl>
                            <SelectTrigger className={isServiceFromUrl ? "bg-muted cursor-not-allowed" : ""}>
                              <SelectValue placeholder="Select service type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="trademark-registration">Trademark Registration</SelectItem>
                            <SelectItem value="iso-9001">ISO 9001 Certification</SelectItem>
                            <SelectItem value="iso-14001">ISO 14001 Certification</SelectItem>
                            <SelectItem value="copyright-registration">Copyright Registration</SelectItem>
                            <SelectItem value="patent-filing">Patent Filing</SelectItem>
                            <SelectItem value="design-registration">Design Registration</SelectItem>
                            <SelectItem value="geographical-indication">Geographical Indication</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                        {isServiceFromUrl && (
                          <p className="text-xs text-muted-foreground">This field is pre-selected based on the service you chose</p>
                        )}
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="applicationType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Application Type *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select application type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="individual">Individual</SelectItem>
                            <SelectItem value="company">Company</SelectItem>
                            <SelectItem value="partnership">Partnership</SelectItem>
                            <SelectItem value="llp">LLP</SelectItem>
                            <SelectItem value="trust">Trust</SelectItem>
                            <SelectItem value="society">Society</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="trademarkName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Trademark Name *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter trademark name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="trademarkClass"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Trademark Class *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select trademark class" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1">Class 1 - Chemicals</SelectItem>
                            <SelectItem value="2">Class 2 - Paints</SelectItem>
                            <SelectItem value="3">Class 3 - Cosmetics</SelectItem>
                            <SelectItem value="4">Class 4 - Industrial oils</SelectItem>
                            <SelectItem value="5">Class 5 - Pharmaceuticals</SelectItem>
                            <SelectItem value="6">Class 6 - Common metals</SelectItem>
                            <SelectItem value="7">Class 7 - Machines</SelectItem>
                            <SelectItem value="8">Class 8 - Hand tools</SelectItem>
                            <SelectItem value="9">Class 9 - Scientific instruments</SelectItem>
                            <SelectItem value="10">Class 10 - Medical apparatus</SelectItem>
                            <SelectItem value="11">Class 11 - Environmental control</SelectItem>
                            <SelectItem value="12">Class 12 - Vehicles</SelectItem>
                            <SelectItem value="13">Class 13 - Firearms</SelectItem>
                            <SelectItem value="14">Class 14 - Jewelry</SelectItem>
                            <SelectItem value="15">Class 15 - Musical instruments</SelectItem>
                            <SelectItem value="16">Class 16 - Paper goods</SelectItem>
                            <SelectItem value="17">Class 17 - Rubber goods</SelectItem>
                            <SelectItem value="18">Class 18 - Leather goods</SelectItem>
                            <SelectItem value="19">Class 19 - Building materials</SelectItem>
                            <SelectItem value="20">Class 20 - Furniture</SelectItem>
                            <SelectItem value="21">Class 21 - Household utensils</SelectItem>
                            <SelectItem value="22">Class 22 - Ropes</SelectItem>
                            <SelectItem value="23">Class 23 - Yarns</SelectItem>
                            <SelectItem value="24">Class 24 - Textiles</SelectItem>
                            <SelectItem value="25">Class 25 - Clothing</SelectItem>
                            <SelectItem value="26">Class 26 - Lace</SelectItem>
                            <SelectItem value="27">Class 27 - Carpets</SelectItem>
                            <SelectItem value="28">Class 28 - Games</SelectItem>
                            <SelectItem value="29">Class 29 - Foods</SelectItem>
                            <SelectItem value="30">Class 30 - Staple foods</SelectItem>
                            <SelectItem value="31">Class 31 - Agricultural products</SelectItem>
                            <SelectItem value="32">Class 32 - Beers</SelectItem>
                            <SelectItem value="33">Class 33 - Alcoholic beverages</SelectItem>
                            <SelectItem value="34">Class 34 - Tobacco</SelectItem>
                            <SelectItem value="35">Class 35 - Advertising</SelectItem>
                            <SelectItem value="36">Class 36 - Insurance</SelectItem>
                            <SelectItem value="37">Class 37 - Construction</SelectItem>
                            <SelectItem value="38">Class 38 - Telecommunications</SelectItem>
                            <SelectItem value="39">Class 39 - Transportation</SelectItem>
                            <SelectItem value="40">Class 40 - Treatment of materials</SelectItem>
                            <SelectItem value="41">Class 41 - Education</SelectItem>
                            <SelectItem value="42">Class 42 - Scientific services</SelectItem>
                            <SelectItem value="43">Class 43 - Food services</SelectItem>
                            <SelectItem value="44">Class 44 - Medical services</SelectItem>
                            <SelectItem value="45">Class 45 - Legal services</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="applicantName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Applicant Name *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Name of the applicant" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="priorityDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority Date</FormLabel>
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
                  name="businessAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Address</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={3} placeholder="Enter complete business address" />
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
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={3} placeholder="Describe your trademark or ISO requirements" />
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
                    <li>• Trademark logo/design (if applicable)</li>
                    <li>• Business registration documents</li>
                    <li>• Power of Attorney (if applicable)</li>
                    <li>• User Affidavit (if applicable)</li>
                    <li>• Form 48 (if applicable)</li>
                    <li>• Any supporting documents related to your application</li>
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
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
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
                    Submit Trademark & ISO Application
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
