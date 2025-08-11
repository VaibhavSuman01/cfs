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

  // Data for other charts is not available from the current API response.
  // We pass empty arrays to prevent rendering errors and gracefully handle missing data.
  const usersData: any[] = [];
  const formsTrendData: any[] = [];
  const contactsData: any[] = [];

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-6 text-3xl font-bold">Admin Dashboard</h1>
      
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">Welcome, {user?.name}</h2>
        <p className="text-muted-foreground">Here's an overview of your system</p>
      </div>

      {isLoadingStats ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
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
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                <div className="text-2xl font-bold">{stats?.users || 0}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Forms</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                <div className="text-2xl font-bold">{stats?.taxForms?.total || 0}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending Forms</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                <div className="text-2xl font-bold">{stats?.taxForms?.pending || 0}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Contact Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <MessageSquare className="mr-2 h-4 w-4 text-muted-foreground" />
                <div className="text-2xl font-bold">{stats?.contacts || 0}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {!isLoadingStats && stats && (
        <div className="mt-8">
          <MultiCharts usersData={usersData || []} formsStatusData={formsStatusData || []} formsTrendData={formsTrendData || []} contactsData={contactsData || []} />
        </div>
      )}

      <div className="mt-8">
        <Tabs defaultValue="forms">
          <TabsList className="mb-4">
            <TabsTrigger value="forms">Recent Forms</TabsTrigger>
            <TabsTrigger value="users">Recent Users</TabsTrigger>
            <TabsTrigger value="contacts">Recent Contacts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="forms" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Form Submissions</CardTitle>
                <CardDescription>The latest tax form submissions from users</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Loading recent forms...</p>
                <Button className="mt-4" variant="outline" asChild>
                  <a href="/admin/forms">View All Forms</a>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Users</CardTitle>
                <CardDescription>The latest registered users</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Loading recent users...</p>
                <Button className="mt-4" variant="outline" asChild>
                  <a href="/admin/users">View All Users</a>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="contacts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Contact Messages</CardTitle>
                <CardDescription>The latest contact form submissions</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Loading recent contacts...</p>
                <Button className="mt-4" variant="outline" asChild>
                  <a href="/admin/contacts">View All Contacts</a>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}