"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ArrowLeft, Upload, FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import api, { API_PATHS } from "@/lib/api-client";
import { toast } from "sonner";

const schema = z.object({
  companyName: z.string().min(1, "Company name is required").optional(),
  remarks: z.string().optional(),
});

type Values = z.infer<typeof schema>;

export default function ROCReturnsEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = useMemo(() => (params?.id as string) || "", [params]);

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      companyName: "",
      remarks: "",
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
        const res = await api.get(API_PATHS.FORMS.ROC_RETURNS_DETAIL(id));
        const data = res.data?.data || res.data || {};
        form.reset({
          companyName: data.companyName || "",
          remarks: data.remarks || "",
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

      await api.put(API_PATHS.FORMS.ROC_RETURNS_UPDATE(id), formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Form updated successfully");
      router.push(`/dashboard/roc-returns/${id}`);
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
    <div className="container mx-auto p-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <h1 className="text-2xl font-bold">Edit ROC Returns</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Update Details</CardTitle>
          <CardDescription>Upload additional documents if required. Deletion is disabled.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="companyName" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="remarks" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Remarks</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={3} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <div className="space-y-2">
                <FormLabel>Upload Additional Documents</FormLabel>
                <div>
                  <Input type="file" multiple onChange={(e) => {
                    const arr = Array.from(e.target.files || []);
                    setFiles(arr);
                  }} />
                </div>
                {files.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {files.map((f, i) => (
                      <div key={i} className="flex items-center justify-between bg-muted p-2 rounded-md">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-primary" />
                          <span className="text-sm truncate max-w-[240px]">{f.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" /> Save Changes
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
