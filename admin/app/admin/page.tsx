"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  ArrowRightIcon
} from "@heroicons/react/24/outline";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import api from "@/lib/api-client";

// Types
type DashboardStats = {
  taxFormsPending: number;
  taxFormsReviewed: number;
  taxFormsFiled: number;
  contactMessages: number;
  recentForms: Array<{
    _id: string;
    fullName: string;
    status: 'Pending' | 'Reviewed' | 'Filed';
    createdAt: string;
  }>;
};

const StatusBadge = ({ status }: { status: 'Pending' | 'Reviewed' | 'Filed' }) => {
  const config = {
    Pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: <ClockIcon className="h-4 w-4 mr-1" /> },
    Reviewed: { bg: 'bg-blue-100', text: 'text-blue-800', icon: <ExclamationCircleIcon className="h-4 w-4 mr-1" /> },
    Filed: { bg: 'bg-green-100', text: 'text-green-800', icon: <CheckCircleIcon className="h-4 w-4 mr-1" /> }
  }[status];

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {config.icon}
      {status}
    </span>
  );
};

const StatCard = ({ title, value, icon, linkHref }: { 
  title: string; 
  value: number; 
  icon: React.ReactNode;
  linkHref: string;
}) => (
  <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <div className="p-2 rounded-lg bg-primary/10">
            {icon}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
      <CardFooter className="border-t">
        <a href={linkHref} className="text-sm font-medium text-primary hover:underline flex items-center">
          View all
          <ArrowRightIcon className="ml-1 h-4 w-4" />
        </a>
      </CardFooter>
    </Card>
  </motion.div>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState<Omit<DashboardStats, 'recentForms'>>({ taxFormsPending: 0, taxFormsReviewed: 0, taxFormsFiled: 0, contactMessages: 0 });
  const [recentForms, setRecentForms] = useState<DashboardStats['recentForms']>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Use the new API client to fetch real data
       const response = await api.get("/api/admin/stats");
        if (response.data && typeof response.data === 'object') {
          const { taxForms, contacts, recent } = response.data;
          const transformedStats = {
            taxFormsPending: taxForms?.pending || 0,
            taxFormsReviewed: taxForms?.reviewed || 0,
            taxFormsFiled: taxForms?.filed || 0,
            contactMessages: contacts || 0,
          };
          setStats(transformedStats);
          setRecentForms(recent || []);
        } else {
          console.error('API returned invalid data for stats:', response.data);
          toast({
            title: 'Error',
            description: 'Failed to load dashboard data: invalid response from server.',
            variant: 'destructive',
          });
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
        toast({
          title: 'Error',
          description: 'Failed to load dashboard data. Please make sure you are logged in and the backend is running.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [toast]);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-36 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          title="Pending Tax Forms"
          value={stats.taxFormsPending}
          icon={<DocumentTextIcon className="h-5 w-5 text-yellow-500" />}
          linkHref="/admin/forms?status=pending"
        />
        <StatCard
          title="Reviewed Forms"
          value={stats.taxFormsReviewed}
          icon={<DocumentTextIcon className="h-5 w-5 text-blue-500" />}
          linkHref="/admin/forms?status=reviewed"
        />
        <StatCard
          title="Filed Forms"
          value={stats.taxFormsFiled}
          icon={<DocumentTextIcon className="h-5 w-5 text-green-500" />}
          linkHref="/admin/forms?status=filed"
        />
        <StatCard
          title="Contact Messages"
          value={stats.contactMessages}
          icon={<ChatBubbleLeftRightIcon className="h-5 w-5 text-purple-500" />}
          linkHref="/admin/contact-messages"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Tax Forms</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="text-left">
                  <th className="pb-4">Form ID</th>
                  <th className="pb-4">Submitted By</th>
                  <th className="pb-4">Status</th>
                  <th className="pb-4">Submitted On</th>
                </tr>
              </thead>
              <tbody>
                {recentForms.map((form) => (
                  <tr key={form._id} className="border-t hover:bg-muted/50">
                    <td className="py-4">{form._id.slice(-8)}</td>
                    <td>{form.fullName}</td>
                    <td><StatusBadge status={form.status} /></td>
                    <td>{new Date(form.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
