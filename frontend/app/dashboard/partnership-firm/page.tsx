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
import { Loader2, Upload, ArrowLeft, FileText, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import api, { API_PATHS } from "@/lib/api-client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const partnershipFormSchema = z.object({
  businessName: z.string().min(1, "Business/Enterprises name is required"),
  businessDetails: z.string().min(1, "Business details are required"),
  addressProofType: z.enum(["rent", "owned"], { required_error: "Please select address proof type" }),
});

type PartnershipFormValues = z.infer<typeof partnershipFormSchema>;

interface Partner {
  name: string;
  email: string;
  phone: string;
  pan: string;
  aadhaar: string;
  photo: File | null;
  signature: File | null;
  aadhaarCard: File | null;
  panCard: File | null;
}

export default function PartnershipFirmPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [partners, setPartners] = useState<Partner[]>([
    { name: "", email: "", phone: "", pan: "", aadhaar: "", photo: null, signature: null, aadhaarCard: null, panCard: null }
  ]);
  const [files, setFiles] = useState<File[]>([]);
  const [rentAgreement, setRentAgreement] = useState<File | null>(null);
  const [electricityBill, setElectricityBill] = useState<File | null>(null);
  const [ownerPanAadhaar, setOwnerPanAadhaar] = useState<File | null>(null);
  const [municipalTaxReceipt, setMunicipalTaxReceipt] = useState<File | null>(null);

  const form = useForm<PartnershipFormValues>({
    resolver: zodResolver(partnershipFormSchema),
    defaultValues: {
      businessName: "",
      businessDetails: "",
      addressProofType: "owned",
    },
  });

  const addressProofType = form.watch("addressProofType");

  const addPartner = () => {
    setPartners([...partners, { name: "", email: "", phone: "", pan: "", aadhaar: "", photo: null, signature: null, aadhaarCard: null, panCard: null }]);
  };

  const removePartner = (index: number) => {
    if (partners.length > 1) {
      setPartners(partners.filter((_, i) => i !== index));
    }
  };

  const updatePartner = (index: number, field: keyof Partner, value: string | File | null) => {
    const updatedPartners = [...partners];
    (updatedPartners[index] as any)[field] = value;
    setPartners(updatedPartners);
  };

  const onSubmit = async (data: PartnershipFormValues) => {
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
      formData.append("service", "Other Registration");
      formData.append("subService", "Partnership Firm Registration");

      // Append partners data with their documents
      partners.forEach((partner, index) => {
        formData.append(`partner_${index}_name`, partner.name);
        formData.append(`partner_${index}_email`, partner.email);
        formData.append(`partner_${index}_phone`, partner.phone);
        formData.append(`partner_${index}_pan`, partner.pan);
        formData.append(`partner_${index}_aadhaar`, partner.aadhaar);
        if (partner.photo) formData.append(`partner_${index}_photo`, partner.photo);
        if (partner.signature) formData.append(`partner_${index}_signature`, partner.signature);
        if (partner.aadhaarCard) formData.append(`partner_${index}_aadhaarCard`, partner.aadhaarCard);
        if (partner.panCard) formData.append(`partner_${index}_panCard`, partner.panCard);
      });

      if (rentAgreement) formData.append("rentAgreement", rentAgreement);
      if (electricityBill) formData.append("electricityBill", electricityBill);
      if (ownerPanAadhaar) formData.append("ownerPanAadhaar", ownerPanAadhaar);
      if (municipalTaxReceipt) formData.append("municipalTaxReceipt", municipalTaxReceipt);

      // Append other documents
      files.forEach((file) => {
        formData.append("documents", file);
      });


      await api.post(API_PATHS.FORMS.PARTNERSHIP_FIRM, formData);

      toast.success("Partnership firm registration application submitted successfully");
      router.push("/dashboard/partnership-firm");
    } catch (error: any) {
      console.error("Failed to submit partnership firm form:", error);
      
      // Handle specific error cases
      if (error.response?.status === 400 && error.response?.data?.message?.includes("already exists")) {
        toast.error("Already submitted for this Year. You can only submit one form per service.");
      } else if (error.response?.status === 409) {
        toast.error("Already submitted for this Year. You can only submit one form per service.");
      } else {
        toast.error("Failed to submit partnership firm application. Please try again.");
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
        <h1 className="text-2xl font-bold">Partnership Firm Registration</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Partnership Firm Registration Form</CardTitle>
          <CardDescription>
            Submit your partnership firm registration application with all required details and documents.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Business Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Business Information</h3>
                <FormField
                  control={form.control}
                  name="businessName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>2. Business/Enterprises Name *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter business/enterprises name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="businessDetails"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>4. Business Details *</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={4} placeholder="Describe your business details and activities" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Partners KYC */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">1. Partners KYC (Upload as JPG/JPEG/PDF/PNG)</h3>
                  <Button type="button" variant="outline" onClick={addPartner}>
                    <Plus className="h-4 w-4 mr-2" /> Add Partner
                  </Button>
                </div>
                {partners.map((partner, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium">Partner {index + 1}</h4>
                      {partners.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removePartner(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>e. Mobile No. *</Label>
                          <Input
                            value={partner.phone}
                            onChange={(e) => updatePartner(index, "phone", e.target.value)}
                            placeholder="Enter mobile number"
                          />
                        </div>
                        <div>
                          <Label>f. Email *</Label>
                          <Input
                            type="email"
                            value={partner.email}
                            onChange={(e) => updatePartner(index, "email", e.target.value)}
                            placeholder="Enter email"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>a. Photo (JPG/JPEG/PDF/PNG) *</Label>
                          <Input
                            type="file"
                            accept=".jpg,.jpeg,.png,.pdf"
                            onChange={(e) => updatePartner(index, "photo", e.target.files?.[0] || null)}
                            className="mt-1"
                          />
                          {partner.photo && (
                            <p className="text-sm text-green-600 mt-1">
                              ✓ {partner.photo.name} selected
                            </p>
                          )}
                        </div>
                        <div>
                          <Label>b. Signature (JPG/JPEG/PDF/PNG) *</Label>
                          <Input
                            type="file"
                            accept=".jpg,.jpeg,.png,.pdf"
                            onChange={(e) => updatePartner(index, "signature", e.target.files?.[0] || null)}
                            className="mt-1"
                          />
                          {partner.signature && (
                            <p className="text-sm text-green-600 mt-1">
                              ✓ {partner.signature.name} selected
                            </p>
                          )}
                        </div>
                        <div>
                          <Label>c. Aadhaar Card (JPG/JPEG/PDF/PNG) *</Label>
                          <Input
                            type="file"
                            accept=".jpg,.jpeg,.png,.pdf"
                            onChange={(e) => updatePartner(index, "aadhaarCard", e.target.files?.[0] || null)}
                            className="mt-1"
                          />
                          {partner.aadhaarCard && (
                            <p className="text-sm text-green-600 mt-1">
                              ✓ {partner.aadhaarCard.name} selected
                            </p>
                          )}
                        </div>
                        <div>
                          <Label>d. PAN Card (JPG/JPEG/PDF/PNG) *</Label>
                          <Input
                            type="file"
                            accept=".jpg,.jpeg,.png,.pdf"
                            onChange={(e) => updatePartner(index, "panCard", e.target.files?.[0] || null)}
                            className="mt-1"
                          />
                          {partner.panCard && (
                            <p className="text-sm text-green-600 mt-1">
                              ✓ {partner.panCard.name} selected
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Business/Enterprises Address */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">3. Business/Enterprises Address (Upload as JPG/JPEG/PDF/PNG)</h3>
                <FormField
                  control={form.control}
                  name="addressProofType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address Proof Type *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select address proof type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="owned">Owned Property</SelectItem>
                          <SelectItem value="rent">Rented Property</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Business/Enterprises Address Documents */}
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Documents For Registration of Partnership Firm:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>1. Partners KYC (Upload as JPG/JPEG/PDF/PNG)</li>
                    <li className="ml-4">a. Photo, b. Signature, c. Aadhaar Card, d. PAN Card, e. Mobile No., f. Email</li>
                    <li>2. Business/Enterprises Name (Text)</li>
                    <li>3. Business/Enterprises Address (Upload as JPG/JPEG/PDF/PNG)</li>
                    <li className="ml-4">a. Rent Agreement, b. Electricity Bill, c. Owner Pan/Aadhaar (if rented), d. Municipal Tax Receipt</li>
                    <li>4. Business Details (Text Box)</li>
                    <li>5. Any Other Documents (Excel, Zip, Pdf, Word)</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>a. Rent Agreement (JPG/JPEG/PDF/PNG) *</Label>
                    <Input
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={(e) => setRentAgreement(e.target.files?.[0] || null)}
                      className="mt-1"
                    />
                    {rentAgreement && (
                      <p className="text-sm text-green-600 mt-1">
                        ✓ {rentAgreement.name} selected
                      </p>
                    )}
                  </div>

                  <div>
                    <Label>b. Electricity Bill (JPG/JPEG/PDF/PNG) *</Label>
                    <Input
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={(e) => setElectricityBill(e.target.files?.[0] || null)}
                      className="mt-1"
                    />
                    {electricityBill && (
                      <p className="text-sm text-green-600 mt-1">
                        ✓ {electricityBill.name} selected
                      </p>
                    )}
                  </div>

                  {addressProofType === "rent" && (
                    <div>
                      <Label>c. Owner Pan/Aadhaar Card (if rented) (JPG/JPEG/PDF/PNG) *</Label>
                      <Input
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={(e) => setOwnerPanAadhaar(e.target.files?.[0] || null)}
                        className="mt-1"
                      />
                      {ownerPanAadhaar && (
                        <p className="text-sm text-green-600 mt-1">
                          ✓ {ownerPanAadhaar.name} selected
                        </p>
                      )}
                    </div>
                  )}

                  <div>
                    <Label>d. Municipal Tax Receipt of property (JPG/JPEG/PDF/PNG) *</Label>
                    <Input
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={(e) => setMunicipalTaxReceipt(e.target.files?.[0] || null)}
                      className="mt-1"
                    />
                    {municipalTaxReceipt && (
                      <p className="text-sm text-green-600 mt-1">
                        ✓ {municipalTaxReceipt.name} selected
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Any Other Documents */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">5. Any Other Documents (Excel, Zip, Pdf, Word)</h3>
                <div>
                  <Label>Any Other Documents</Label>
                  <Input
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

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Submit Partnership Firm Registration
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
