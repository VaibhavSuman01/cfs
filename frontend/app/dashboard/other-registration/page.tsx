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

const otherRegistrationSchema = z.object({
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  registrationType: z.string().min(1, "Registration type is required"),
  businessName: z.string().min(1, "Business name is required"),
  businessDetails: z.string().min(1, "Business details/descriptions are required"),
});

type OtherRegistrationValues = z.infer<typeof otherRegistrationSchema>;

export default function OtherRegistrationPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [aadhaarFile, setAadhaarFile] = useState<File | null>(null);
  const [panFile, setPanFile] = useState<File | null>(null);
  const [cancelCheckFile, setCancelCheckFile] = useState<File | null>(null);
  const [gstFile, setGstFile] = useState<File | null>(null);
  const [electricityBillFile, setElectricityBillFile] = useState<File | null>(null);
  const [rentAgreementFile, setRentAgreementFile] = useState<File | null>(null);

  const form = useForm<OtherRegistrationValues>({
    resolver: zodResolver(otherRegistrationSchema),
    defaultValues: {
      email: "",
      phone: "",
      registrationType: "",
      businessName: "",
      businessDetails: "",
    },
    mode: "onChange",
  });

  const registrationType = form.watch("registrationType");

  // Map registration type values to display names
  const registrationTypeNames: Record<string, string> = {
    "llp-registration": "LLP Registration",
    "partnership-firm": "Partnership Firm",
    "sole-proprietorship": "Sole Proprietorship",
    "msme-udyam": "MSME/Udyam Registration",
    "epfo": "EPFO Registration",
    "esic": "ESIC Registration",
    "pt-tax": "PT Tax Registration",
    "iec-registration": "IEC Registration",
    "gumusta-shop": "Gumusta / Shop Registration",
    "fassai-food": "Fassai (Food) Licence",
    "industry-license": "Industry Licence",
    "ngo-registration": "NGO Registration",
    "pan-apply": "PAN Application",
    "tan-apply": "TAN Application",
    "startup-india": "Start-up India Registration",
    "digital-signature": "Digital Signature",
    "gst-registration": "GST Registration",
  };

  // Map service names from dashboard to registration type values
  const serviceToRegistrationType: Record<string, string> = {
    "GST Registration": "gst-registration",
    "LLP Registration": "llp-registration",
    "Partnership Firm": "partnership-firm",
    "Proprietorship": "sole-proprietorship",
    "MSME/Udyam Registration": "msme-udyam",
    "EPFO": "epfo",
    "ESIC": "esic",
    "PT Tax": "pt-tax",
    "IEC Registration": "iec-registration",
    "Gumusta / Form-3 / Shop Registration": "gumusta-shop",
    "Fassai (Food) Licence / Register": "fassai-food",
    "Industry Licence / register": "industry-license",
    "NGO Registration": "ngo-registration",
    "PAN Apply": "pan-apply",
    "TAN Apply": "tan-apply",
    "Start-up India Registration": "startup-india",
    "Digital Registration": "digital-signature",
  };

  // Get service from URL
  const serviceParam = searchParams?.get("service") || "";
  const registrationTypeFromUrl = serviceParam ? (serviceToRegistrationType[serviceParam] || "") : "";
  const isServiceFromUrl = !!serviceParam;

  // Reset form when user data is loaded
  useEffect(() => {
    if (user) {
      form.reset({
        email: user.email || "",
        phone: user.mobile || "",
        registrationType: registrationTypeFromUrl || "",
        businessName: "",
        businessDetails: "",
      });
    }
  }, [user, form, registrationTypeFromUrl]);

  // Set registration type from URL
  useEffect(() => {
    if (registrationTypeFromUrl) {
      form.setValue("registrationType", registrationTypeFromUrl);
    }
  }, [registrationTypeFromUrl, form]);

  const onSubmit = async (data: OtherRegistrationValues) => {
    try {
      setIsSubmitting(true);

      const formData = new FormData();

      // Append form data
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });

      // Add service and subService fields for backend compatibility
      formData.append("service", "Other Registration");
      formData.append("subService", data.registrationType);

      // Append required document files
      if (aadhaarFile) formData.append("aadhaarFile", aadhaarFile);
      if (panFile) formData.append("panFile", panFile);
      if (cancelCheckFile) formData.append("cancelCheckFile", cancelCheckFile);
      if (gstFile) formData.append("gstFile", gstFile);
      if (electricityBillFile) formData.append("electricityBillFile", electricityBillFile);
      if (rentAgreementFile) formData.append("rentAgreementFile", rentAgreementFile);

      // Append other documents
      files.forEach((file) => {
        formData.append("documents", file);
      });

      await api.post(API_PATHS.FORMS.OTHER_REGISTRATION, formData);

      toast.success("Registration application submitted successfully");
      router.push("/dashboard/other-registration");
    } catch (error: any) {
      console.error("Failed to submit registration form:", error);
      
      // Handle specific error cases
      if (error?.response?.status === 400 && error?.response?.data?.message?.includes("already exists")) {
        toast.error("Already submitted for this Year. You can only submit one form per service.");
      } else if (error?.response?.status === 409) {
        toast.error("Already submitted for this Year. You can only submit one form per service.");
      } else {
        toast.error("Failed to submit registration application. Please try again.");
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

  const handlePanFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPanFile(e.target.files[0]);
    }
  };

  const handleGstFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setGstFile(e.target.files[0]);
    }
  };

  const handleElectricityBillFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setElectricityBillFile(e.target.files[0]);
    }
  };

  const handleRentAgreementFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setRentAgreementFile(e.target.files[0]);
    }
  };

  const handleCancelCheckFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCancelCheckFile(e.target.files[0]);
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
        <div>
          <h1 className="text-2xl font-bold">Other Registration Application</h1>
          {registrationType && (
            <p className="text-lg text-muted-foreground mt-1">
              {registrationTypeNames[registrationType] || registrationType}
            </p>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Other Registration Form
            {registrationType && (
              <span className="text-base font-normal text-muted-foreground ml-2">
                - {registrationTypeNames[registrationType] || registrationType}
              </span>
            )}
          </CardTitle>
          <CardDescription>
            Submit your registration application with all required details and documents.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        <FormLabel>Mobile No. *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter mobile number" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="registrationType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Registration Type *</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          value={field.value}
                          disabled={isServiceFromUrl}
                        >
                          <FormControl>
                            <SelectTrigger className={isServiceFromUrl ? "bg-muted cursor-not-allowed" : ""}>
                              <SelectValue placeholder="Select registration type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="llp-registration">LLP Registration</SelectItem>
                            <SelectItem value="partnership-firm">Partnership Firm</SelectItem>
                            <SelectItem value="sole-proprietorship">Sole Proprietorship</SelectItem>
                            <SelectItem value="msme-udyam">MSME/Udyam Registration</SelectItem>
                            <SelectItem value="epfo">EPFO Registration</SelectItem>
                            <SelectItem value="esic">ESIC Registration</SelectItem>
                            <SelectItem value="pt-tax">PT Tax Registration</SelectItem>
                            <SelectItem value="iec-registration">IEC Registration</SelectItem>
                            <SelectItem value="gumusta-shop">Gumusta / Shop Registration</SelectItem>
                            <SelectItem value="fassai-food">Fassai (Food) Licence</SelectItem>
                            <SelectItem value="industry-license">Industry Licence</SelectItem>
                            <SelectItem value="ngo-registration">NGO Registration</SelectItem>
                            <SelectItem value="pan-apply">PAN Application</SelectItem>
                            <SelectItem value="tan-apply">TAN Application</SelectItem>
                            <SelectItem value="startup-india">Start-up India Registration</SelectItem>
                            <SelectItem value="digital-signature">Digital Signature</SelectItem>
                            <SelectItem value="gst-registration">GST Registration</SelectItem>
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
                    name="businessName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Name *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter business name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="businessDetails"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Details/Descriptions *</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={4} placeholder="Describe your business details and activities" />
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
                  <h4 className="font-medium text-blue-900 mb-2">Required Documents (Upload as JPG/JPEG/PDF/PNG):</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>1. Aadhaar Card</li>
                    <li>2. PAN Card</li>
                    <li>3. Mobile No. (Text)</li>
                    <li>4. Email (Text)</li>
                    <li>5. Bank Statement / Cancel Check</li>
                    <li>6. GST (If available)</li>
                    <li>7. Electricity Bill</li>
                    <li>8. Rent Agreement</li>
                    <li>9. Business Name (Text)</li>
                    <li>10. Business Detail/Descriptions (Text Box)</li>
                    <li>11. Any Other Documents (Excel, Zip, Pdf, Word)</li>
                  </ul>
                  <p className="text-xs text-blue-700 mt-3 italic">
                    Note: Required documents shall be subject to change from time to time in accordance with applicable laws, acts, rules, notifications, circulars, court judgments, and other provisions issued by the Government of India.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="aadhaar-file">1. Aadhaar Card (JPG/JPEG/PDF/PNG) *</Label>
                    <Input
                      id="aadhaar-file"
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
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
                    <Label htmlFor="pan-file">2. PAN Card (JPG/JPEG/PDF/PNG) *</Label>
                    <Input
                      id="pan-file"
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
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
                    <Label htmlFor="cancel-check-file">5. Bank Statement / Cancel Check (JPG/JPEG/PDF/PNG) *</Label>
                    <Input
                      id="cancel-check-file"
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={handleCancelCheckFileChange}
                      className="mt-1"
                    />
                    {cancelCheckFile && (
                      <p className="text-sm text-green-600 mt-1">
                        ✓ {cancelCheckFile.name} selected
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="gst-file">6. GST Certificate (If available) (JPG/JPEG/PDF/PNG)</Label>
                    <Input
                      id="gst-file"
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={handleGstFileChange}
                      className="mt-1"
                    />
                    {gstFile && (
                      <p className="text-sm text-green-600 mt-1">
                        ✓ {gstFile.name} selected
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="electricity-bill-file">7. Electricity Bill (JPG/JPEG/PDF/PNG) *</Label>
                    <Input
                      id="electricity-bill-file"
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={handleElectricityBillFileChange}
                      className="mt-1"
                    />
                    {electricityBillFile && (
                      <p className="text-sm text-green-600 mt-1">
                        ✓ {electricityBillFile.name} selected
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="rent-agreement-file">8. Rent Agreement (JPG/JPEG/PDF/PNG) *</Label>
                    <Input
                      id="rent-agreement-file"
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={handleRentAgreementFileChange}
                      className="mt-1"
                    />
                    {rentAgreementFile && (
                      <p className="text-sm text-green-600 mt-1">
                        ✓ {rentAgreementFile.name} selected
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="documents">11. Any Other Documents (Excel, Zip, Pdf, Word)</Label>
                    <Input
                      id="documents"
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.zip"
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
                    Submit Registration Application
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
