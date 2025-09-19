"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
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

const companyFormSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  pan: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format"),
  aadhaar: z.string().regex(/^\d{12}$/, "Aadhaar must be exactly 12 digits").optional(),
  companyType: z.string().min(1, "Company type is required"),
  companyName: z.string().min(1, "Company name is required"),
  businessActivity: z.string().min(1, "Business activity is required"),
  proposedCapital: z.string().min(1, "Proposed capital is required"),
  directorsCount: z.string().min(1, "Number of directors is required"),
  registeredOffice: z.string().min(1, "Registered office address is required"),
  description: z.string().optional(),
});

type CompanyFormValues = z.infer<typeof companyFormSchema>;

export default function CompanyFormationPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [aadhaarFile, setAadhaarFile] = useState<File | null>(null);
  const [panFile, setPanFile] = useState<File | null>(null);
  const [addressProofFile, setAddressProofFile] = useState<File | null>(null);
  const [directorPhotosFile, setDirectorPhotosFile] = useState<File | null>(null);
  const [moaFile, setMoaFile] = useState<File | null>(null);
  const [aoaFile, setAoaFile] = useState<File | null>(null);
  const [dinFile, setDinFile] = useState<File | null>(null);
  const [dscFile, setDscFile] = useState<File | null>(null);

  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      fullName: user?.name || "",
      email: user?.email || "",
      phone: user?.mobile || "",
      pan: user?.pan || "",
      aadhaar: user?.aadhaar || "",
      companyType: "",
      companyName: "",
      businessActivity: "",
      proposedCapital: "",
      directorsCount: "",
      registeredOffice: "",
      description: "",
    },
  });

  const onSubmit = async (data: CompanyFormValues) => {
    try {
      setIsSubmitting(true);

      const formData = new FormData();

      // Append form data
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });

      // Append specific document files
      if (aadhaarFile) formData.append("aadhaarFile", aadhaarFile);
      if (panFile) formData.append("panFile", panFile);
      if (addressProofFile) formData.append("addressProofFile", addressProofFile);
      if (directorPhotosFile) formData.append("directorPhotosFile", directorPhotosFile);
      if (moaFile) formData.append("moaFile", moaFile);
      if (aoaFile) formData.append("aoaFile", aoaFile);
      if (dinFile) formData.append("dinFile", dinFile);
      if (dscFile) formData.append("dscFile", dscFile);

      // Append other documents
      files.forEach((file) => {
        formData.append("documents", file);
      });

      await api.post(API_PATHS.FORMS.COMPANY_FORMATION, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Company formation application submitted successfully");
      router.push("/dashboard/company-formation");
    } catch (error) {
      console.error("Failed to submit company formation form:", error);
      toast.error("Failed to submit company formation application. Please try again.");
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

  const handlePanFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPanFile(e.target.files[0]);
    }
  };

  const handleAddressProofFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAddressProofFile(e.target.files[0]);
    }
  };

  const handleDirectorPhotosFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDirectorPhotosFile(e.target.files[0]);
    }
  };

  const handleMoaFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setMoaFile(e.target.files[0]);
    }
  };

  const handleAoaFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAoaFile(e.target.files[0]);
    }
  };

  const handleDinFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDinFile(e.target.files[0]);
    }
  };

  const handleDscFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDscFile(e.target.files[0]);
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
        <h1 className="text-2xl font-bold">Company Formation Application</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Company Formation Form</CardTitle>
          <CardDescription>
            Submit your company formation application with all required details and documents.
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

              {/* Company Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Company Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            <SelectItem value="private-limited">Private Limited Company</SelectItem>
                            <SelectItem value="public-limited">Public Limited Company</SelectItem>
                            <SelectItem value="one-person-company">One Person Company</SelectItem>
                            <SelectItem value="section-8">Section 8 Company</SelectItem>
                            <SelectItem value="nidhi-company">Nidhi Company</SelectItem>
                            <SelectItem value="producer-company">Producer Company</SelectItem>
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
                        <FormLabel>Proposed Company Name *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter proposed company name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="businessActivity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Activity *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Describe your business activity" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="proposedCapital"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Proposed Capital *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter proposed capital amount" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="directorsCount"
                    render={({ field }) => (
                      <><FormItem>
                        <FormLabel>Number of Directors *</FormLabel></FormItem><FormControl>
                          <Input {...field} placeholder="Enter number of directors" />
                        </FormControl><FormMessage />
                      </>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="registeredOffice"
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
                        <Textarea {...field} rows={3} placeholder="Any additional information about your company" />
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
                    <li>• Address Proof (Utility Bill/Bank Statement)</li>
                    <li>• Passport Size Photos of Directors</li>
                    <li>• Memorandum of Association (MOA)</li>
                    <li>• Articles of Association (AOA)</li>
                    <li>• Director Identification Number (DIN)</li>
                    <li>• Digital Signature Certificate (DSC)</li>
                  </ul>
            </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="aadhaar-file">Aadhaar Card (PDF) *</Label>
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
                    <Label htmlFor="pan-file">PAN Card (PDF) *</Label>
                    <Input
                      id="pan-file"
                      type="file"
                      accept=".pdf"
                      onChange={handlePanFileChange}
                      className="mt-1"
                    />
                    {panFile && (
                      <p className="text-sm text-green-600 mt-1">
                        ✓ {panFile.name} selected
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="address-proof-file">Address Proof (PDF) *</Label>
                    <Input
                      id="address-proof-file"
                      type="file"
                      accept=".pdf"
                      onChange={handleAddressProofFileChange}
                      className="mt-1"
                    />
                    {addressProofFile && (
                      <p className="text-sm text-green-600 mt-1">
                        ✓ {addressProofFile.name} selected
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="director-photos-file">Passport Size Photos of Directors (JPG/PNG)</Label>
                    <Input
                      id="director-photos-file"
                      type="file"
                      accept=".jpg,.jpeg,.png"
                      onChange={handleDirectorPhotosFileChange}
                      className="mt-1"
                    />
                    {directorPhotosFile && (
                      <p className="text-sm text-green-600 mt-1">
                        ✓ {directorPhotosFile.name} selected
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="moa-file">Memorandum of Association (PDF)</Label>
                    <Input
                      id="moa-file"
                      type="file"
                      accept=".pdf"
                      onChange={handleMoaFileChange}
                      className="mt-1"
                    />
                    {moaFile && (
                      <p className="text-sm text-green-600 mt-1">
                        ✓ {moaFile.name} selected
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="aoa-file">Articles of Association (PDF)</Label>
                    <Input
                      id="aoa-file"
                      type="file"
                      accept=".pdf"
                      onChange={handleAoaFileChange}
                      className="mt-1"
                    />
                    {aoaFile && (
                      <p className="text-sm text-green-600 mt-1">
                        ✓ {aoaFile.name} selected
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="din-file">Director Identification Number (PDF)</Label>
                    <Input
                      id="din-file"
                      type="file"
                      accept=".pdf"
                      onChange={handleDinFileChange}
                      className="mt-1"
                    />
                    {dinFile && (
                      <p className="text-sm text-green-600 mt-1">
                        ✓ {dinFile.name} selected
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="dsc-file">Digital Signature Certificate (PDF)</Label>
                    <Input
                      id="dsc-file"
                      type="file"
                      accept=".pdf"
                      onChange={handleDscFileChange}
                      className="mt-1"
                    />
                    {dscFile && (
                      <p className="text-sm text-green-600 mt-1">
                        ✓ {dscFile.name} selected
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="documents">Additional Documents (Optional)</Label>
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
                    Submit Company Formation Application
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
