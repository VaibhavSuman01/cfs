"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, FileText, Pencil, Eye } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import api, { API_PATHS } from "@/lib/api-client";
import { useAuth } from "@/providers/auth-provider";

interface CFFormSummary {
  _id: string;
  service?: string;
  companyName?: string;
  status: "Pending" | "Reviewed" | "Filed" | string;
  createdAt: string;
  updatedAt: string;
}

export default function CompanyFormationListPage() {
  const { user, isLoading } = useAuth();
  const [forms, setForms] = useState<CFFormSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await api.get(API_PATHS.FORMS.COMPANY_FORMATION_USER_SUBMISSIONS);
        const data = (res.data?.data || []) as CFFormSummary[];
        setForms(data);
      } catch (e) {
        console.error("Failed to load company formation submissions", e);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchData();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">My Company Formation Submissions</h1>
        <p className="text-sm text-muted-foreground">View, track status, and upload additional documents. Deletion is disabled.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Submissions</CardTitle>
          <CardDescription>Your recent applications</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex h-32 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : forms.length === 0 ? (
            <div className="text-center py-10 text-sm text-muted-foreground">
              <FileText className="mx-auto h-10 w-10 mb-3 text-muted-foreground" />
              No submissions yet.
            </div>
          ) : (
            <div className="space-y-4">
              {forms.map((f) => (
                <div key={f._id} className="flex items-center justify-between border rounded-lg p-4">
                  <div>
                    <div className="font-semibold">{f.companyName || f.service || "Company Formation"}</div>
                    <div className="text-xs text-muted-foreground">Created {new Date(f.createdAt).toLocaleDateString()} • Status: {f.status}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm" asChild>
                      <Link href={`/dashboard/company-formation/${f._id}`}>
                        <Eye className="mr-2 h-4 w-4" /> View
                      </Link>
                    </Button>
                    <Button size="sm" asChild>
                      <Link href={`/dashboard/company-formation/${f._id}/edit`}>
                        <Pencil className="mr-2 h-4 w-4" /> Edit
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
