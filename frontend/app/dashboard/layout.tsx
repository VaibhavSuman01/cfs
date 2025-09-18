"use client";

import { EnhancedHeader } from "@/components/enhanced-header";
import { useAuth } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import BlockedUserComponent from "@/components/ui/blocked-user-component";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/auth");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="text-gray-600">Checking authentication…</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // will redirect
  }

  // Check if user is blocked
  if (user?.isBlocked) {
    return <BlockedUserComponent />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <EnhancedHeader />
      <main className="flex-grow pt-20">
        {children}
      </main>
    </div>
  );
}
