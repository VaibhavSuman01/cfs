"use client";

import React, { useState, useEffect } from "react";
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

const otherRegistrationSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  pan: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format"),
  aadhaar: z.string().min(1, "Aadhaar is required").regex(/^\d{12}$/, "Aadhaar must be exactly 12 digits"),
  registrationType: z.string().min(1, "Registration type is required"),
  businessName: z.string().min(1, "Business name is required"),
  businessActivity: z.string().min(1, "Business activity is required"),
  businessAddress: z.string().min(1, "Business address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  pincode: z.string().min(6, "Pincode must be at least 6 digits"),
  registrationPurpose: z.string().optional(),
  description: z.string().optional(),
});

type OtherRegistrationValues = z.infer<typeof otherRegistrationSchema>;

export default function OtherRegistrationPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [aadhaarFile, setAadhaarFile] = useState<File | null>(null);
  const [panFile, setPanFile] = useState<File | null>(null);
  const [addressProofFile, setAddressProofFile] = useState<File | null>(null);
  const [businessAddressProofFile, setBusinessAddressProofFile] = useState<File | null>(null);
  const [identityProofFile, setIdentityProofFile] = useState<File | null>(null);
  const [partnershipDeedFile, setPartnershipDeedFile] = useState<File | null>(null);
  const [mouFile, setMouFile] = useState<File | null>(null);
  const [bankAccountFile, setBankAccountFile] = useState<File | null>(null);
  const [businessRegistrationFile, setBusinessRegistrationFile] = useState<File | null>(null);
  const [gstFile, setGstFile] = useState<File | null>(null);
  const [electricityBillFile, setElectricityBillFile] = useState<File | null>(null);
  const [rentAgreementFile, setRentAgreementFile] = useState<File | null>(null);
  const [cancelCheckFile, setCancelCheckFile] = useState<File | null>(null);

  const form = useForm<OtherRegistrationValues>({
    resolver: zodResolver(otherRegistrationSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      pan: "",
      aadhaar: "",
      registrationType: "",
      businessName: "",
      businessActivity: "",
      businessAddress: "",
      city: "",
      state: "",
      pincode: "",
      registrationPurpose: "",
      description: "",
    },
    mode: "onChange",
  });

  // Reset form when user data is loaded
  useEffect(() => {
    if (user) {
      form.reset({
        fullName: user.name || "",
        email: user.email || "",
        phone: user.mobile || "",
        pan: user.pan || "",
        aadhaar: user.aadhaar || "",
        registrationType: "",
        businessName: "",
        businessActivity: "",
        businessAddress: "",
        city: "",
        state: "",
        pincode: "",
        registrationPurpose: "",
        description: "",
      });
    }
  }, [user, form]);

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

      // Append specific document files
      if (aadhaarFile) formData.append("aadhaarFile", aadhaarFile);
      if (panFile) formData.append("panFile", panFile);
      if (addressProofFile) formData.append("addressProofFile", addressProofFile);
      if (businessAddressProofFile) formData.append("businessAddressProofFile", businessAddressProofFile);
      if (identityProofFile) formData.append("identityProofFile", identityProofFile);
      if (partnershipDeedFile) formData.append("partnershipDeedFile", partnershipDeedFile);
      if (mouFile) formData.append("mouFile", mouFile);
      if (bankAccountFile) formData.append("bankAccountFile", bankAccountFile);
      if (businessRegistrationFile) formData.append("businessRegistrationFile", businessRegistrationFile);
      if (gstFile) formData.append("gstFile", gstFile);
      if (electricityBillFile) formData.append("electricityBillFile", electricityBillFile);
      if (rentAgreementFile) formData.append("rentAgreementFile", rentAgreementFile);
      if (cancelCheckFile) formData.append("cancelCheckFile", cancelCheckFile);

      // Append other documents
      files.forEach((file) => {
        formData.append("documents", file);
      });

      await api.post(API_PATHS.FORMS.OTHER_REGISTRATION, formData);

      toast.success("Registration application submitted successfully");
      router.push("/dashboard/other-registration");
    } catch (error) {
      console.error("Failed to submit registration form:", error);
      
      // Handle specific error cases
      if (error.response?.status === 400 && error.response?.data?.message?.includes("already exists")) {
        toast.error("Already submitted for this Year. You can only submit one form per service.");
      } else if (error.response?.status === 409) {
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

  const handleAddressProofFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAddressProofFile(e.target.files[0]);
    }
  };

  const handleBusinessAddressProofFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setBusinessAddressProofFile(e.target.files[0]);
    }
  };

  const handleIdentityProofFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIdentityProofFile(e.target.files[0]);
    }
  };

  const handlePartnershipDeedFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPartnershipDeedFile(e.target.files[0]);
    }
  };

  const handleMouFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setMouFile(e.target.files[0]);
    }
  };

  const handleBankAccountFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setBankAccountFile(e.target.files[0]);
    }
  };

  const handleBusinessRegistrationFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setBusinessRegistrationFile(e.target.files[0]);
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
        <h1 className="text-2xl font-bold">Other Registration Application</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Other Registration Form</CardTitle>
          <CardDescription>
            Submit your registration application with all required details and documents.
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
                        <FormLabel>Aadhaar Number *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="123456789012" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Registration Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Registration Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="registrationType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Registration Type *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
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
                    name="registrationPurpose"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Registration Purpose</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Purpose of registration" />
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
                      <FormLabel>Business Address *</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={3} placeholder="Enter complete business address" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter city" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter state" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="pincode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pincode *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter pincode" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Information</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={3} placeholder="Any additional information about your registration" />
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
                    <li>• Aadhaar Card (JPG/PNG/PDF)</li>
                    <li>• PAN Card (JPG/PNG/PDF)</li>
                    <li>• Bank Statement / Cancel Check (PDF)</li>
                    <li>• GST Certificate (If available) (PDF)</li>
                    <li>• Electricity Bill (PDF)</li>
                    <li>• Rent Agreement (PDF)</li>
                    <li>• Business Name (Text)</li>
                    <li>• Business Detail/Descriptions (Text Box)</li>
                    <li>• Any Other Documents (Excel, Zip, Pdf, Word)</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="aadhaar-file">Aadhaar Card (JPG/PNG/PDF) *</Label>
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
                    <Label htmlFor="pan-file">PAN Card (JPG/PNG/PDF) *</Label>
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
                    <Label htmlFor="business-address-proof-file">Business Address Proof (PDF) *</Label>
                    <Input
                      id="business-address-proof-file"
                      type="file"
                      accept=".pdf"
                      onChange={handleBusinessAddressProofFileChange}
                      className="mt-1"
                    />
                    {businessAddressProofFile && (
                      <p className="text-sm text-green-600 mt-1">
                        ✓ {businessAddressProofFile.name} selected
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="identity-proof-file">Identity Proof of Partners/Directors (PDF)</Label>
                    <Input
                      id="identity-proof-file"
                      type="file"
                      accept=".pdf"
                      onChange={handleIdentityProofFileChange}
                      className="mt-1"
                    />
                    {identityProofFile && (
                      <p className="text-sm text-green-600 mt-1">
                        ✓ {identityProofFile.name} selected
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="partnership-deed-file">Partnership Deed (PDF) - For Partnership Firm</Label>
                    <Input
                      id="partnership-deed-file"
                      type="file"
                      accept=".pdf"
                      onChange={handlePartnershipDeedFileChange}
                      className="mt-1"
                    />
                    {partnershipDeedFile && (
                      <p className="text-sm text-green-600 mt-1">
                        ✓ {partnershipDeedFile.name} selected
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="mou-file">Memorandum of Understanding (PDF) - For LLP</Label>
                    <Input
                      id="mou-file"
                      type="file"
                      accept=".pdf"
                      onChange={handleMouFileChange}
                      className="mt-1"
                    />
                    {mouFile && (
                      <p className="text-sm text-green-600 mt-1">
                        ✓ {mouFile.name} selected
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="bank-account-file">Bank Account Details (PDF)</Label>
                    <Input
                      id="bank-account-file"
                      type="file"
                      accept=".pdf"
                      onChange={handleBankAccountFileChange}
                      className="mt-1"
                    />
                    {bankAccountFile && (
                      <p className="text-sm text-green-600 mt-1">
                        ✓ {bankAccountFile.name} selected
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="business-registration-file">Business Registration Certificate (PDF)</Label>
                    <Input
                      id="business-registration-file"
                      type="file"
                      accept=".pdf"
                      onChange={handleBusinessRegistrationFileChange}
                      className="mt-1"
                    />
                    {businessRegistrationFile && (
                      <p className="text-sm text-green-600 mt-1">
                        ✓ {businessRegistrationFile.name} selected
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="gst-file">GST Certificate (If available) (PDF)</Label>
                    <Input
                      id="gst-file"
                      type="file"
                      accept=".pdf"
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
                    <Label htmlFor="electricity-bill-file">Electricity Bill (PDF)</Label>
                    <Input
                      id="electricity-bill-file"
                      type="file"
                      accept=".pdf"
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
                    <Label htmlFor="rent-agreement-file">Rent Agreement (PDF)</Label>
                    <Input
                      id="rent-agreement-file"
                      type="file"
                      accept=".pdf"
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
                    <Label htmlFor="cancel-check-file">Bank Statement / Cancel Check (PDF)</Label>
                    <Input
                      id="cancel-check-file"
                      type="file"
                      accept=".pdf"
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
                    <Label htmlFor="documents">Any Other Documents (Excel, Zip, Pdf, Word)</Label>
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
