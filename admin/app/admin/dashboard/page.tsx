'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/providers/auth-provider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Users, FileText, MessageSquare, BarChart3 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import api from '@/lib/api-client';
import MultiCharts from './AnalyticsChart';

interface DashboardStats {
  taxForms: {
    total: number;
    pending: number;
    reviewed: number;
    filed: number;
  };
  contacts: number;
  users: number;
  recent: any[];
  usersMonthly: Array<{ month: string; users: number }>;
  formsTrendMonthly: Array<{ month: string; pending: number; reviewed: number; filed: number }>;
  contactsMonthly: Array<{ month: string; contacts: number }>;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoadingStats(true);
        const response = await api.get('/api/admin/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setIsLoadingStats(false);
      }
    };

    if (user) {
      fetchStats();
    }
  }, [user]);

  const formsStatusData = stats
    ? [
        { name: 'Pending', count: stats.taxForms.pending },
        { name: 'Reviewed', count: stats.taxForms.reviewed },
        { name: 'Filed', count: stats.taxForms.filed }
      ]
    : [];

  // Map new API series
  const usersData = stats?.usersMonthly || [];
  const formsTrendData = stats?.formsTrendMonthly || [];
  const contactsData = stats?.contactsMonthly || [];

  return (
    <div className="bg-gradient-to-br from-blue-700 via-blue-800 to-white/5">
      {/* Header - blue glassmorphism */}
      <div className="rounded-2xl bg-blue-600/20 backdrop-blur border border-white/20 p-6 mb-8 shadow-[0_8px_30px_rgba(31,76,255,0.15)]">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-sm text-white/80 mt-1">Welcome{user?.name ? `, ${user.name}` : ''}. Here’s your system overview.</p>
      </div>

      {/* KPI cards */}
      {isLoadingStats ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="border-blue-100">
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card variant="glass" className="hover:shadow-lg transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-white/90">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Users className="mr-2 h-4 w-4 text-white/80" />
                <div className="text-2xl font-bold text-white">{stats?.users || 0}</div>
              </div>
            </CardContent>
          </Card>
          <Card variant="glass" className="hover:shadow-lg transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-white/90">Total Forms</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <FileText className="mr-2 h-4 w-4 text-white/80" />
                <div className="text-2xl font-bold text-white">{stats?.taxForms?.total || 0}</div>
              </div>
            </CardContent>
          </Card>
          <Card variant="glass" className="hover:shadow-lg transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-white/90">Pending Forms</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <FileText className="mr-2 h-4 w-4 text-white/80" />
                <div className="text-2xl font-bold text-white">{stats?.taxForms?.pending || 0}</div>
              </div>
            </CardContent>
          </Card>
          <Card variant="glass" className="hover:shadow-lg transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-white/90">Contact Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <MessageSquare className="mr-2 h-4 w-4 text-white/80" />
                <div className="text-2xl font-bold text-white">{stats?.contacts || 0}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Removed duplicate KPI block to avoid duplicacy */}

      {!isLoadingStats && stats && (
        <div className="mt-8">
          <MultiCharts usersData={usersData} formsStatusData={formsStatusData} formsTrendData={formsTrendData} contactsData={contactsData} />
        </div>
      )}

    </div>
  );
}