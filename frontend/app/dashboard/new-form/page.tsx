'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
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

export default function NewFormPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const form = useForm<TaxFormValues>({
    resolver: zodResolver(taxFormSchema),
    defaultValues: {
      fullName: user?.name || '',
      email: user?.email || '',
      phone: user?.mobile || '',
      pan: user?.pan || '',
      service: '',
      year: '',
      hasIncomeTaxLogin: false,
      incomeTaxLoginId: '',
      incomeTaxLoginPassword: '',
      hasHomeLoan: false,
      homeLoanSanctionDate: '',
      homeLoanAmount: '',
      homeLoanCurrentDue: '',
      homeLoanTotalInterest: '',
      hasPranNumber: false,
      pranNumber: '',
    },
  });

  const hasIncomeTaxLogin = form.watch('hasIncomeTaxLogin');
  const hasHomeLoan = form.watch('hasHomeLoan');
  const hasPranNumber = form.watch('hasPranNumber');

  const onSubmit = async (data: TaxFormValues) => {
    try {
      setIsSubmitting(true);

      const formData = new FormData();

      // Append form data
      Object.entries(data).forEach(([key, value]) => {
        if (typeof value === 'boolean') {
          formData.append(key, String(value));
        } else if (value) {
          formData.append(key, value);
        }
      });

      // Append files
      files.forEach(file => {
        formData.append('documents', file);
      });

      await api.post('/api/forms/tax', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Tax form submitted successfully');
      router.push('/dashboard');
    } catch (error) {
      console.error('Failed to submit tax form:', error);
      toast.error('Failed to submit tax form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
        <h1 className="text-3xl font-bold">New Tax Form</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Submit a New Tax Form</CardTitle>
          <CardDescription>Fill in the details for your tax filing</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="fullName" render={({ field }) => (<FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="email" render={({ field }) => (<FormItem><FormLabel>Email</FormLabel><FormControl><Input {...field} type="email" /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="phone" render={({ field }) => (<FormItem><FormLabel>Phone</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="pan" render={({ field }) => (<FormItem><FormLabel>PAN</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField
                  control={form.control}
                  name="service"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a service" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Income Tax Filing">Income Tax Filing</SelectItem>
                          <SelectItem value="GST Registration & Filing">GST Registration & Filing</SelectItem>
                          <SelectItem value="TDS Returns">TDS Returns</SelectItem>
                          <SelectItem value="Corporate Tax Filing">Corporate Tax Filing</SelectItem>
                          <SelectItem value="Payroll Tax">Payroll Tax</SelectItem>
                          <SelectItem value="EPFO Filing">EPFO Filing</SelectItem>
                          <SelectItem value="ESIC Filing">ESIC Filing</SelectItem>
                          <SelectItem value="PT Tax Filing">PT Tax Filing</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Financial Year</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a financial year" />
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

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Tax Form'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}