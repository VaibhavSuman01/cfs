'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Loader2, FileText, Upload, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api-client';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const taxFormSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  pan: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format'),
  service: z.string().min(1, 'Please select a service'),
  year: z.string().min(4, 'Please select a financial year'),
  hasIncomeTaxLogin: z.boolean().optional(),
  incomeTaxLoginId: z.string().optional(),
  incomeTaxLoginPassword: z.string().optional(),
  hasHomeLoan: z.boolean().optional(),
  homeLoanSanctionDate: z.string().optional(),
  homeLoanAmount: z.string().optional(),
  homeLoanCurrentDue: z.string().optional(),
  homeLoanTotalInterest: z.string().optional(),
  hasPranNumber: z.boolean().optional(),
  pranNumber: z.string().optional(),
});

type TaxFormValues = z.infer<typeof taxFormSchema>;

interface Document {
  _id: string;
  originalName: string;
  uploadedBy?: 'user' | 'admin';
}

export default function EditFormPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [existingDocuments, setExistingDocuments] = useState<Document[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);

  const form = useForm<TaxFormValues>({
    resolver: zodResolver(taxFormSchema),
  });

  const hasIncomeTaxLogin = form.watch('hasIncomeTaxLogin');
  const hasHomeLoan = form.watch('hasHomeLoan');
  const hasPranNumber = form.watch('hasPranNumber');

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await api.get(`/api/forms/user-submissions/${id}`);
        const formData = response.data.data;
        form.reset(formData); // Populate form with fetched data
        // Only show user-uploaded documents in the edit view
        setExistingDocuments(
          Array.isArray(formData.documents)
            ? formData.documents.filter((d: Document) => (d.uploadedBy ?? 'user') === 'user')
            : []
        );
      } catch (error) {
        console.error('Failed to fetch form data:', error);
        toast.error('Failed to load form data. Please try again.');
        router.push('/dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchForm();
    }
  }, [id, form, router]);

  const onSubmit = async (data: TaxFormValues) => {
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

      // Append new files
      newFiles.forEach(file => {
        formData.append('documents', file);
      });

      // Append IDs of documents to keep
      existingDocuments.forEach(doc => {
        formData.append('existingDocuments', doc._id);
      });

      await api.put(`/api/forms/tax/${id}`, formData);
      
      toast.success('Tax form updated successfully');
      router.push('/dashboard');
    } catch (error) {
      console.error('Failed to update tax form:', error);
      toast.error('Failed to update tax form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      
      // Validate files
      const validFiles: File[] = [];
      const maxSize = 10 * 1024 * 1024; // 10MB
      const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/jpg',
        'image/png',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ];

      for (const file of fileArray) {
        if (file.size > maxSize) {
          toast.error(`File "${file.name}" is too large. Maximum size is 10MB.`);
          continue;
        }
        
        if (!allowedTypes.includes(file.type)) {
          toast.error(`File "${file.name}" has an unsupported format. Please upload PDF, Word, Excel, or image files.`);
          continue;
        }
        
        validFiles.push(file);
      }
      
      if (validFiles.length > 0) {
        setNewFiles(prev => [...prev, ...validFiles]);
        toast.success(`${validFiles.length} file(s) added successfully.`);
      }
      
      // Clear the input
      e.target.value = '';
    }
  };

  const removeNewFile = (index: number) => {
    setNewFiles(prev => prev.filter((_, i) => i !== index));
    toast.success('File removed successfully.');
  };

  // Prevent admins from editing user forms (redirect them away)
  useEffect(() => {
    if (user && user.role === 'admin') {
      toast.error('Admins cannot edit user forms.');
      router.push('/dashboard');
    }
  }, [user, router]);

  if (isAuthLoading || isLoading) {
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
          Back to Dashboard
        </Button>
        <h1 className="text-3xl font-bold">Edit Tax Form</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Update Your Tax Form</CardTitle>
          <CardDescription>Make changes to your submission details and documents.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="fullName" render={({ field }) => (<FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="email" render={({ field }) => (<FormItem><FormLabel>Email</FormLabel><FormControl><Input {...field} type="email" /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="phone" render={({ field }) => (<FormItem><FormLabel>Phone</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="pan" render={({ field }) => (<FormItem><FormLabel>PAN</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="service" render={({ field }) => (<FormItem><FormLabel>Service</FormLabel><FormControl><Input {...field} disabled /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="year" render={({ field }) => (<FormItem><FormLabel>Financial Year</FormLabel><FormControl><Input {...field} disabled /></FormControl><FormMessage /></FormItem>)} />
              </div>

              {/* Conditional Fields */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="hasIncomeTaxLogin"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Do you have an Income Tax login?</FormLabel>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                {hasIncomeTaxLogin && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-4 border-l-2">
                    <FormField control={form.control} name="incomeTaxLoginId" render={({ field }) => (<FormItem><FormLabel>Login ID</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="incomeTaxLoginPassword" render={({ field }) => (<FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  </div>
                )}
              </div>

              <div className="space-y-4">
                 <FormField
                  control={form.control}
                  name="hasHomeLoan"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Do you have a Home Loan?</FormLabel>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                {hasHomeLoan && (
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-4 border-l-2">
                    <FormField control={form.control} name="homeLoanSanctionDate" render={({ field }) => (<FormItem><FormLabel>Sanction Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="homeLoanAmount" render={({ field }) => (<FormItem><FormLabel>Loan Amount</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="homeLoanCurrentDue" render={({ field }) => (<FormItem><FormLabel>Current Due</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="homeLoanTotalInterest" render={({ field }) => (<FormItem><FormLabel>Total Interest Paid</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="hasPranNumber"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Do you have a PRAN Number?</FormLabel>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                {hasPranNumber && (
                  <div className="pl-4 border-l-2">
                    <FormField control={form.control} name="pranNumber" render={({ field }) => (<FormItem><FormLabel>PRAN Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Uploaded Documents</Label>
                {existingDocuments.length > 0 ? (
                  <div className="space-y-2">
                    {existingDocuments.map((doc) => (
                      <div key={doc._id} className="flex items-center bg-gray-100 p-2 rounded-md">
                        <FileText className="h-4 w-4 mr-2 text-gray-600" />
                        <span className="text-sm truncate max-w-[260px]">{doc.originalName}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No documents were uploaded.</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="file-upload">Upload New Documents</Label>
                <div className="flex items-center">
                  <Input 
                    id="file-upload" 
                    type="file" 
                    multiple 
                    onChange={handleFileChange} 
                    className="hidden"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                  />
                  <Button type="button" variant="outline" onClick={() => document.getElementById('file-upload')?.click()}>
                    <Upload className="h-4 w-4 mr-2" />
                    Select Files
                  </Button>
                  <span className="ml-4 text-sm text-muted-foreground">
                    {newFiles.length} {newFiles.length === 1 ? 'file' : 'files'} selected
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Supported formats: PDF, Word, Excel, JPG, PNG (Max 10MB per file)
                </p>
                
                {newFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {newFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-muted p-2 rounded-md">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-primary" />
                          <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                        </div>
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeNewFile(index)} className="h-8 w-8 p-0">
                          &times;
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
                    Updating...
                  </>
                ) : (
                  'Update Tax Form'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
