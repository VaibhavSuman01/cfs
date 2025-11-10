"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ArrowLeft, Upload, FileText, Edit3, Save, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import api, { API_PATHS } from "@/lib/api-client";
import { toast } from "sonner";

const schema = z.object({
  advisoryType: z.string().min(1, "Advisory type is required"),
  subject: z.string().min(1, "Subject is required"),
  description: z.string().min(1, "Description is required"),
  priority: z.string().optional(),
});

type Values = z.infer<typeof schema>;

export default function AdvisoryEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = useMemo(() => (params?.id as string) || "", [params]);

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      advisoryType: "",
      subject: "",
      description: "",
      priority: "",
    },
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const res = await api.get(API_PATHS.FORMS.ADVISORY_DETAIL(id));
        const data = res.data?.data || res.data || {};
        form.reset({
          advisoryType: data.advisoryType || "",
          subject: data.subject || "",
          description: data.description || "",
          priority: data.priority || "",
        });
      } catch (e) {
        console.error("Failed to load form detail", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, form]);

  const onSubmit = async (values: Values) => {
    try {
      setSubmitting(true);

      const formData = new FormData();
      Object.entries(values).forEach(([k, v]) => {
        if (v !== undefined && v !== null) formData.append(k, String(v));
      });

      files.forEach((file, idx) => {
        formData.append("documents", file);
        formData.append(`fileId_${idx}`, `file_${idx}`);
      });

      await api.put(API_PATHS.FORMS.ADVISORY_UPDATE(id), formData);

      toast.success("Form updated successfully");
      router.push(`/dashboard/advisory/${id}`);
    } catch (e) {
      console.error("Failed to update form", e);
      toast.error("Update failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()} className="hover:bg-gray-100">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Edit3 className="h-8 w-8 text-blue-600" />
              Edit Advisory Request
            </h1>
            <p className="text-gray-600 mt-1">Update your advisory request details and upload additional documents</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Information Alert */}
        <Alert className="border-blue-200 bg-blue-50">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            You can update your advisory request details and upload additional documents. Existing documents cannot be deleted.
          </AlertDescription>
        </Alert>

        {/* Main Form Card */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Edit3 className="h-6 w-6 text-blue-600" />
              Update Advisory Details
            </CardTitle>
            <CardDescription>Modify your advisory request information and add supporting documents</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Basic Information */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="advisoryType" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">Advisory Type *</FormLabel>
                        <FormControl>
                          <Input {...field} className="h-11" placeholder="Enter advisory type" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="subject" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">Subject *</FormLabel>
                        <FormControl>
                          <Input {...field} className="h-11" placeholder="Enter subject" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Description *</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={4} className="resize-none" placeholder="Describe your advisory request in detail" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="priority" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Priority</FormLabel>
                      <FormControl>
                        <Input {...field} className="h-11" placeholder="Enter priority level" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                {/* Document Upload Section */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Additional Documents</h3>
                  <div className="space-y-4">
                    <div>
                      <FormLabel className="text-sm font-medium text-gray-700">Upload Additional Documents</FormLabel>
                      <p className="text-xs text-gray-500 mt-1">You can upload multiple files at once. Supported formats: PDF, DOC, DOCX, JPG, PNG</p>
                    </div>
                    <div>
                      <Input 
                        type="file" 
                        multiple 
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const arr = Array.from(e.target.files || []);
                          setFiles(arr);
                        }}
                        className="h-11"
                      />
                    </div>
                    {files.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700">Selected Files:</p>
                        <div className="space-y-2">
                          {files.map((f, i) => (
                            <div key={i} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border">
                              <div className="flex items-center gap-3">
                                <FileText className="h-4 w-4 text-blue-600" />
                                <span className="text-sm font-medium text-gray-900 truncate max-w-[300px]">{f.name}</span>
                                <span className="text-xs text-gray-500">({(f.size / 1024 / 1024).toFixed(2)} MB)</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-4 pt-6 border-t">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => router.back()}
                    className="px-6"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={submitting}
                    className="px-8 bg-blue-600 hover:bg-blue-700"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" /> Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
