'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Loader2, FileText, Upload, ArrowLeft, Plus, Trash2, Building2, Shield } from 'lucide-react';
import { toast } from 'sonner';
import api, { API_PATHS } from '@/lib/api-client';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const otherRegistrationFormSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  pan: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format'),
  service: z.string().min(1, 'Please select a service'),
  businessName: z.string().min(1, 'Business name is required'),
  businessType: z.string().min(1, 'Business type is required'),
  businessAddress: z.string().min(1, 'Business address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  pincode: z.string().min(6, 'Pincode must be at least 6 digits'),
  applicantName: z.string().min(1, 'Applicant name is required'),
  applicantPan: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid applicant PAN format'),
  applicantAadhaar: z.string().min(12, 'Aadhaar must be at least 12 digits'),
  applicantAddress: z.string().min(1, 'Applicant address is required'),
  selectedPackage: z.string().min(1, 'Please select a package'),
});

type OtherRegistrationFormValues = z.infer<typeof otherRegistrationFormSchema>;

export default function OtherRegistrationFormPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [customDocs, setCustomDocs] = useState<Array<{ title: string; file: File | null }>>([]);

  // Suggested required documents by service
  const serviceDocMap: Record<string, string[]> = useMemo(() => ({
    'GST Registration': [
      'PAN Card of Applicant',
      'Aadhaar Card of Applicant',
      'Address Proof (Passport/Driving License/Voter ID)',
      'Bank Account Details',
      'Business Address Proof',
      'Partnership Deed (if applicable)',
      'Board Resolution (if company)',
    ],
    'MSME Registration': [
      'PAN Card of Applicant',
      'Aadhaar Card of Applicant',
      'Business Address Proof',
      'Bank Account Details',
      'Business Registration Certificate',
      'Partnership Deed (if applicable)',
    ],
    'FSSAI Food License': [
      'PAN Card of Applicant',
      'Aadhaar Card of Applicant',
      'Business Address Proof',
      'Food Business Details',
      'Kitchen Layout Plan',
      'Food Safety Management System',
      'Employee Health Certificates',
    ],
    'Digital Signature': [
      'PAN Card of Applicant',
      'Aadhaar Card of Applicant',
      'Address Proof',
      'Passport Size Photograph',
      'Identity Proof',
    ],
    'EPFO Registration': [
      'PAN Card of Applicant',
      'Aadhaar Card of Applicant',
      'Business Registration Certificate',
      'Employee Master List',
      'Bank Account Details',
      'Address Proof',
    ],
    'ESIC Registration': [
      'PAN Card of Applicant',
      'Aadhaar Card of Applicant',
      'Business Registration Certificate',
      'Employee Master List',
      'Bank Account Details',
      'Address Proof',
    ],
    'IEC Registration': [
      'PAN Card of Applicant',
      'Aadhaar Card of Applicant',
      'Business Registration Certificate',
      'Bank Account Details',
      'Address Proof',
      'Import/Export Business Plan',
    ],
    'NGO Registration': [
      'PAN Card of Applicant',
      'Aadhaar Card of Applicant',
      'Trust Deed/Society Registration',
      'Address Proof',
      'Bank Account Details',
      'Charitable Objects Details',
    ],
    'LLP Registration': [
      'PAN Card of all Partners',
      'Aadhaar Card of all Partners',
      'Address Proof of all Partners',
      'LLP Agreement',
      'Business Address Proof',
      'Bank Account Details',
    ],
    'Partnership Firm': [
      'PAN Card of all Partners',
      'Aadhaar Card of all Partners',
      'Address Proof of all Partners',
      'Partnership Deed',
      'Business Address Proof',
      'Bank Account Details',
    ],
    'Sole Proprietorship': [
      'PAN Card of Proprietor',
      'Aadhaar Card of Proprietor',
      'Address Proof',
      'Business Address Proof',
      'Bank Account Details',
    ],
    'Startup India Registration': [
      'PAN Card of Applicant',
      'Aadhaar Card of Applicant',
      'Business Registration Certificate',
      'Business Plan',
      'Innovation Certificate',
      'Address Proof',
    ],
    'Producer Company': [
      'PAN Card of all Members',
      'Aadhaar Card of all Members',
      'Address Proof of all Members',
      'Producer Company Rules',
      'Business Address Proof',
      'Bank Account Details',
    ],
    'Professional Tax': [
      'PAN Card of Applicant',
      'Aadhaar Card of Applicant',
      'Business Registration Certificate',
      'Employee Count Details',
      'Address Proof',
      'Bank Account Details',
    ],
    'Trade License': [
      'PAN Card of Applicant',
      'Aadhaar Card of Applicant',
      'Business Registration Certificate',
      'Business Address Proof',
      'Property Documents',
      'NOC from Local Authority',
    ],
    'PSARA License': [
      'PAN Card of Applicant',
      'Aadhaar Card of Applicant',
      'Business Registration Certificate',
      'Security Agency Details',
      'Employee Background Checks',
      'Address Proof',
    ],
    'Industry License': [
      'PAN Card of Applicant',
      'Aadhaar Card of Applicant',
      'Business Registration Certificate',
      'Industry Type Details',
      'Environmental Clearance',
      'Address Proof',
    ],
  }), []);

  const form = useForm<OtherRegistrationFormValues>({
    resolver: zodResolver(otherRegistrationFormSchema),
    defaultValues: {
      fullName: user?.name || '',
      email: user?.email || '',
      phone: user?.mobile || '',
      pan: user?.pan || '',
      service: '',
      businessName: '',
      businessType: '',
      businessAddress: '',
      city: '',
      state: '',
      pincode: '',
      applicantName: user?.name || '',
      applicantPan: user?.pan || '',
      applicantAadhaar: '',
      applicantAddress: '',
      selectedPackage: 'Basic',
    },
  });

  const selectedService = form.watch('service');

  // Preselect service from query param
  useEffect(() => {
    const qpService = searchParams.get('service');
    if (qpService) {
      form.setValue('service', qpService);
    }
  }, [searchParams, form]);

  const onSubmit = async (data: OtherRegistrationFormValues) => {
    try {
      setIsSubmitting(true);

      const formData = new FormData();

      // Append form data
      Object.entries(data).forEach(([key, value]) => {
        if (typeof value === 'boolean') {
          formData.append(key, String(value));
        } else if (value !== undefined && value !== null) {
          formData.append(key, value);
        } else {
          // Append empty string for undefined/null values to ensure all fields are sent
          formData.append(key, '');
        }
      });

      // Append service-specific fields
      if (selectedService === 'GST Registration') {
        formData.append('turnover', '0'); // Will be filled by user
      }
      if (selectedService === 'EPFO Registration' || selectedService === 'ESIC Registration') {
        formData.append('employeeCount', '0'); // Will be filled by user
      }
      if (selectedService === 'MSME Registration') {
        formData.append('businessCategory', 'Manufacturing'); // Will be filled by user
      }
      if (selectedService === 'FSSAI Food License') {
        formData.append('foodBusinessType', 'Restaurant'); // Will be filled by user
      }
      if (selectedService === 'IEC Registration') {
        formData.append('importExportCode', ''); // Will be filled by user
      }

      // Append files
      let fileIndex = 0;
      files.forEach((file) => {
        const fileId = `file_${fileIndex}`;
        formData.append('documents', file);
        formData.append(`fileId_${fileIndex}`, fileId);
        fileIndex += 1;
      });

      customDocs.forEach((entry) => {
        if (entry.file) {
          const fileId = `file_${fileIndex}`;
          formData.append('documents', entry.file);
          formData.append(`fileId_${fileIndex}`, fileId);
          formData.append(`documentType_${fileId}`, entry.title || entry.file.name);
          fileIndex += 1;
        }
      });

      await api.post(API_PATHS.FORMS.OTHER_REGISTRATION, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Other registration form submitted successfully');
      router.push('/dashboard');
    } catch (error) {
      console.error('Failed to submit other registration form:', error);
      toast.error('Failed to submit other registration form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addCustomDoc = () => {
    setCustomDocs(prev => [...prev, { title: '', file: null }]);
  };

  const updateCustomDocTitle = (idx: number, title: string) => {
    setCustomDocs(prev => prev.map((c, i) => i === idx ? { ...c, title } : c));
  };

  const updateCustomDocFile = (idx: number, file: File | null) => {
    setCustomDocs(prev => prev.map((c, i) => i === idx ? { ...c, file } : c));
  };

  const removeCustomDoc = (idx: number) => {
    setCustomDocs(prev => prev.filter((_, i) => i !== idx));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      setFiles(prev => [...prev, ...fileArray]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
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
        <Button variant="ghost" onClick={() => router.push('/dashboard')} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">Other Registration Form</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Submit Other Registration Application</CardTitle>
          <CardDescription>Fill in the details for your other registration service</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField control={form.control} name="fullName" render={({ field }) => (<FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="email" render={({ field }) => (<FormItem><FormLabel>Email</FormLabel><FormControl><Input {...field} type="email" /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="phone" render={({ field }) => (<FormItem><FormLabel>Phone</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="pan" render={({ field }) => (<FormItem><FormLabel>PAN</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                </div>
              </div>

              {/* Service Selection */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Service Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="service"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Service Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a service" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="GST Registration">GST Registration</SelectItem>
                            <SelectItem value="MSME Registration">MSME Registration</SelectItem>
                            <SelectItem value="FSSAI Food License">FSSAI Food License</SelectItem>
                            <SelectItem value="Digital Signature">Digital Signature</SelectItem>
                            <SelectItem value="EPFO Registration">EPFO Registration</SelectItem>
                            <SelectItem value="ESIC Registration">ESIC Registration</SelectItem>
                            <SelectItem value="IEC Registration">IEC Registration</SelectItem>
                            <SelectItem value="NGO Registration">NGO Registration</SelectItem>
                            <SelectItem value="LLP Registration">LLP Registration</SelectItem>
                            <SelectItem value="Partnership Firm">Partnership Firm</SelectItem>
                            <SelectItem value="Sole Proprietorship">Sole Proprietorship</SelectItem>
                            <SelectItem value="Startup India Registration">Startup India Registration</SelectItem>
                            <SelectItem value="Producer Company">Producer Company</SelectItem>
                            <SelectItem value="Professional Tax">Professional Tax</SelectItem>
                            <SelectItem value="Trade License">Trade License</SelectItem>
                            <SelectItem value="PSARA License">PSARA License</SelectItem>
                            <SelectItem value="Industry License">Industry License</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="selectedPackage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Package Selection</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a package" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Basic">Basic</SelectItem>
                            <SelectItem value="Standard">Standard</SelectItem>
                            <SelectItem value="Premium">Premium</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Business Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Business Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField control={form.control} name="businessName" render={({ field }) => (<FormItem><FormLabel>Business Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
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
                            <SelectItem value="Proprietorship">Proprietorship</SelectItem>
                            <SelectItem value="Partnership">Partnership</SelectItem>
                            <SelectItem value="Private Limited Company">Private Limited Company</SelectItem>
                            <SelectItem value="Public Limited Company">Public Limited Company</SelectItem>
                            <SelectItem value="LLP">LLP</SelectItem>
                            <SelectItem value="Society">Society</SelectItem>
                            <SelectItem value="Trust">Trust</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField control={form.control} name="businessAddress" render={({ field }) => (<FormItem><FormLabel>Business Address</FormLabel><FormControl><Textarea {...field} rows={3} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="city" render={({ field }) => (<FormItem><FormLabel>City</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="state" render={({ field }) => (<FormItem><FormLabel>State</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="pincode" render={({ field }) => (<FormItem><FormLabel>Pincode</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                </div>
              </div>

              {/* Applicant Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Applicant Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField control={form.control} name="applicantName" render={({ field }) => (<FormItem><FormLabel>Applicant Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="applicantPan" render={({ field }) => (<FormItem><FormLabel>Applicant PAN</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="applicantAadhaar" render={({ field }) => (<FormItem><FormLabel>Applicant Aadhaar</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="applicantAddress" render={({ field }) => (<FormItem><FormLabel>Applicant Address</FormLabel><FormControl><Textarea {...field} rows={3} /></FormControl><FormMessage /></FormItem>)} />
                </div>
              </div>

              {/* Service Specific Fields */}
              {selectedService && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Service Specific Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {selectedService === 'GST Registration' && (
                      <div>
                        <Label>Annual Turnover</Label>
                        <Input placeholder="e.g., ₹20,00,000" />
                      </div>
                    )}
                    {(selectedService === 'EPFO Registration' || selectedService === 'ESIC Registration') && (
                      <div>
                        <Label>Number of Employees</Label>
                        <Input placeholder="e.g., 25" />
                      </div>
                    )}
                    {selectedService === 'MSME Registration' && (
                      <div>
                        <Label>Business Category</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                            <SelectItem value="Service">Service</SelectItem>
                            <SelectItem value="Trading">Trading</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    {selectedService === 'FSSAI Food License' && (
                      <div>
                        <Label>Food Business Type</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Restaurant">Restaurant</SelectItem>
                            <SelectItem value="Catering">Catering</SelectItem>
                            <SelectItem value="Food Manufacturing">Food Manufacturing</SelectItem>
                            <SelectItem value="Food Retail">Food Retail</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    {selectedService === 'IEC Registration' && (
                      <div>
                        <Label>Import/Export Code (if any)</Label>
                        <Input placeholder="Existing IEC code" />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Suggested Documents */}
              {selectedService && serviceDocMap[selectedService] && (
                <div className="space-y-2">
                  <Label>Suggested Documents for {selectedService}</Label>
                  <ul className="list-disc pl-6 text-sm text-muted-foreground">
                    {serviceDocMap[selectedService].map((doc) => (
                      <li key={doc}>{doc}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* File Upload */}
              <div className="space-y-2">
                <Label htmlFor="file-upload">Upload Supporting Documents</Label>
                <div className="flex items-center">
                  <Input
                    id="file-upload"
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Button type="button" variant="outline" onClick={() => document.getElementById('file-upload')?.click()}>
                    <Upload className="h-4 w-4 mr-2" />
                    Select Files
                  </Button>
                  <span className="ml-4 text-sm text-muted-foreground">
                    {files.length} {files.length === 1 ? 'file' : 'files'} selected
                  </span>
                </div>

                {files.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-muted p-2 rounded-md">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-primary" />
                          <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          className="h-8 w-8 p-0"
                        >
                          &times;
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Custom Documents */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Add Custom Documents (title + file)</Label>
                  <Button type="button" variant="secondary" size="sm" onClick={addCustomDoc}>
                    <Plus className="h-4 w-4 mr-1" /> Add
                  </Button>
                </div>
                {customDocs.length > 0 && (
                  <div className="space-y-3">
                    {customDocs.map((cd, idx) => (
                      <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
                        <Input
                          placeholder="Document Title (e.g., Additional Proof)"
                          value={cd.title}
                          onChange={(e) => updateCustomDocTitle(idx, e.target.value)}
                        />
                        <Input
                          type="file"
                          onChange={(e) => updateCustomDocFile(idx, e.target.files?.[0] || null)}
                        />
                        <Button type="button" variant="ghost" onClick={() => removeCustomDoc(idx)} className="md:justify-self-start">
                          <Trash2 className="h-4 w-4 mr-1" /> Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Other Registration Form'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
