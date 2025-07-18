import { useState, useEffect, memo, useMemo } from "react";
import { withAuth } from "../../utils/auth";
import dynamic from 'next/dynamic';
import Link from "next/link";
import {
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { SectionLoading } from "../../components/LoadingState";
import { handleApiErrorWithToast } from "../../utils/errorHandler";
import { transformDashboardStats } from "../../utils/transformers";
import httpClient, { API_PATHS } from "../../utils/httpClient";
import useSmartApiCache from "../../utils/useSmartApiCache";
import useLazyLoad from "../../utils/useLazyLoad";

import { motion } from "framer-motion";

// Dynamically import AdminLayout with no SSR to improve initial load time
const AdminLayout = dynamic(
  () => import("../../components/AdminLayout"),
  { ssr: false }
);

function Dashboard() {
  const [stats, setStats] = useState({
    taxFormsPending: 0,
    taxFormsReviewed: 0,
    taxFormsFiled: 0,
    contactMessages: 0,
    recentForms: [],
  });
  // Removed userData state as it's now in the Users page
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use the custom hook for API caching with optimized transformation
  const fetchDashboardStats = async () => {
    const response = await httpClient.get(API_PATHS.ADMIN.STATS);
    return transformDashboardStats(response.data, {
      optimizeForStorage: true,
      maxRecentForms: 5, // Limit to 5 most recent forms for dashboard display
      aggressiveOptimization: false // Will automatically switch to true if needed
    });
  };

  const { data: dashboardStats, loading: apiLoading, error: apiError, isCached } = useSmartApiCache(
    'dashboardStats',
    fetchDashboardStats,
    5 * 60 * 1000, // 5 minutes cache time
    {
      maxSizeKB: 500, // Limit dashboard stats to 500KB
      skipCacheForLargeData: true, // Skip caching if data is too large
      autoCleanup: true,
      cleanupThreshold: 70 // Be more aggressive with cleanup threshold
    }
  );
  
  // Log caching status for debugging
  useEffect(() => {
    if (dashboardStats) {
      console.info(`Dashboard stats ${isCached ? 'loaded from cache' : 'freshly fetched'}`);
    }
  }, [dashboardStats, isCached]);

  // Update state when data from cache hook changes
  useEffect(() => {
    if (dashboardStats) {
      setStats(dashboardStats);
    }
    setLoading(apiLoading);
    if (apiError) {
      setError(apiError);
    }
  }, [dashboardStats, apiLoading, apiError]);

  // No additional data fetching needed as we're using the useApiCache hook

  // Format date for display
  const formatDate = useMemo(() => {
    return (dateString) => {
      if (!dateString) return "N/A";
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    };
  }, []);

  // Download users data as Excel
  // Removed downloadUsersData function as it's now in the Users page

  // Status badge component - memoized to prevent unnecessary re-renders
  const StatusBadge = memo(({ status }) => {
    let bgColor = "";
    let textColor = "";
    let icon = null;

    switch (status) {
      case "Pending":
        bgColor = "bg-yellow-100";
        textColor = "text-yellow-800";
        icon = <ClockIcon className="h-4 w-4 mr-1" />;
        break;
      case "Reviewed":
        bgColor = "bg-blue-100";
        textColor = "text-blue-800";
        icon = <ExclamationCircleIcon className="h-4 w-4 mr-1" />;
        break;
      case "Filed":
        bgColor = "bg-green-100";
        textColor = "text-green-800";
        icon = <CheckCircleIcon className="h-4 w-4 mr-1" />;
        break;
      default:
        bgColor = "bg-gray-100";
        textColor = "text-gray-800";
    }

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}
      >
        {icon}
        {status}
      </span>
    );
  });

  if (loading) {
    return (
      <AdminLayout>
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <SectionLoading message="Loading dashboard data..." />
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mt-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <ExclamationCircleIcon
                    className="h-5 w-5 text-red-400"
                    aria-hidden="true"
                  />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // Memoized stat card component to prevent unnecessary re-renders
  const StatCard = memo(({ title, value, icon, linkHref, linkText = "View all" }) => {
    return (
      <motion.div
        whileHover={{ y: -5, transition: { duration: 0.2 } }}
        className="bg-white overflow-hidden rounded-xl shadow-sm border border-gray-100 transition-all duration-300"
      >
        <div className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 bg-purple-100 rounded-lg">
              {icon}
            </div>
            <div className="ml-5 w-0 flex-1">
              <p className="text-sm font-medium text-gray-500 mb-0">
                {title}
              </p>
              <h3 className="text-2xl font-semibold text-gray-900 mt-1">
                {value}
              </h3>
            </div>
          </div>
        </div>
        {linkHref && (
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-100">
            <Link href={linkHref} className="text-sm font-medium text-primary-600 hover:text-primary-800 flex items-center">
              {linkText}
              <svg
                className="ml-1 w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        )}
      </motion.div>
    );
  });
  
  // Memoized form item component to prevent unnecessary re-renders
  const FormItem = memo(({ form }) => {
    // Add console log to debug form ID and entire form object
    console.log('Form ID in dashboard:', form._id);
    console.log('Form object in dashboard:', form);
    
    // Ensure form._id exists and is valid before creating the link
    const formId = form._id || 'invalid-id';
    console.log('Using form ID:', formId);
    
    return (
      <motion.li
        whileHover={{ backgroundColor: "#f9fafb" }}
      >
        <Link href={`/admin/tax-forms/${formId}`} className="block">
          <div className="px-6 py-5 cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                    <DocumentTextIcon
                      className="h-5 w-5 text-primary-600"
                      aria-hidden="true"
                    />
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    {form.fullName}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {form.pan}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <StatusBadge status={form.status} />
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {form.documents?.length || 0} document(s)
                </span>
              </div>
            </div>
            <div className="mt-3 flex justify-between text-xs text-gray-500">
              <div className="flex items-center">
                <ChatBubbleLeftRightIcon
                  className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400"
                  aria-hidden="true"
                />
                {form.email}
              </div>
              <div className="flex items-center">
                <ClockIcon
                  className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400"
                  aria-hidden="true"
                />
                <span>
                  Submitted on {formatDate(form.createdAt)}
                </span>
              </div>
            </div>
          </div>
        </Link>
      </motion.li>
    );
  });
  
  // LazyLoaded component for Recent Tax Form Submissions
  const LazyLoadedTaxForms = memo(({ stats, formatDate }) => {
    const { ref, inView } = useLazyLoad({ rootMargin: '200px' });
    
    return (
      <div ref={ref} className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Recent Tax Form Submissions</h2>
          <Link href="/admin/tax-forms" className="text-sm font-medium text-primary-600 hover:text-primary-500 flex items-center">
            View all
            <svg
              className="ml-1 w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
        
        {inView ? (
          <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {stats.recentForms && stats.recentForms.length > 0 ? (
                 stats.recentForms.map((form) => (
                   <FormItem key={form._id} form={form} formatDate={formatDate} />
                 ))
               ) : (
                <li className="px-6 py-4 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center py-4">
                    <DocumentTextIcon className="h-12 w-12 text-gray-300 mb-3" />
                    <p className="text-sm">No recent submissions found</p>
                  </div>
                </li>
              )}
            </ul>
          </div>
        ) : (
          <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-md h-64 flex items-center justify-center">
            <p className="text-gray-400">Loading recent submissions...</p>
          </div>
        )}
      </div>
    );
  });

  return (
    <AdminLayout>
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-gray-900 mb-6"
          >
            Dashboard Overview
          </motion.h1>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          {/* Stats cards */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5"
          >
            {/* Total Users */}
            <StatCard 
              title="Registered Users"
              value={stats.totalUsers}
              icon={
                <UserGroupIcon
                  className="h-6 w-6 text-purple-600"
                  aria-hidden="true"
                />
              }
              linkHref="/admin/users"
            />

            {/* Pending Tax Forms */}
            <StatCard 
              title="Pending Forms"
              value={stats.taxFormsPending}
              icon={
                <ClockIcon
                  className="h-6 w-6 text-yellow-600"
                  aria-hidden="true"
                />
              }
              linkHref="/admin/tax-forms?status=Pending"
            />

            {/* Reviewed Tax Forms */}
            <StatCard 
              title="Reviewed Forms"
              value={stats.taxFormsReviewed}
              icon={
                <ExclamationCircleIcon
                  className="h-6 w-6 text-blue-600"
                  aria-hidden="true"
                />
              }
              linkHref="/admin/tax-forms?status=Reviewed"
            />

            {/* Filed Tax Forms */}
            <StatCard 
              title="Filed Forms"
              value={stats.taxFormsFiled}
              icon={
                <CheckCircleIcon
                  className="h-6 w-6 text-green-600"
                  aria-hidden="true"
                />
              }
              linkHref="/admin/tax-forms?status=Filed"
            />

            {/* Contact Messages */}
            <StatCard 
              title="Contact Messages"
              value={stats.contactMessages}
              icon={
                <ChatBubbleLeftRightIcon
                  className="h-6 w-6 text-primary-600"
                  aria-hidden="true"
                />
              }
              linkHref="/admin/contact-messages"
            />
          </motion.div>

          {/* Recent submissions - Lazy Loaded */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-10"
          >
            <LazyLoadedTaxForms stats={stats} formatDate={formatDate} />
          </motion.div>

          {/* User Profiles Card with Link to Users Page */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10"
          >
            <div className="bg-white shadow-sm border border-gray-100 overflow-hidden rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center bg-purple-100 rounded-full">
                    <UserGroupIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-lg font-medium text-gray-900">
                      User Profiles
                    </h2>
                    <p className="text-sm text-gray-500">
                      View and manage all registered users
                    </p>
                  </div>
                </div>
                <Link href="/admin/users" legacyBehavior>
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200"
                  >
                    View All Users
                    <svg
                      className="ml-2 w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </motion.a>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default withAuth(Dashboard, "admin");
