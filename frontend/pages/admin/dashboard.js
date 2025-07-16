import { useState, useEffect } from "react";
import { withAuth } from "../../utils/auth";
import AdminLayout from "../../components/AdminLayout";
import Link from "next/link";
import {
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  UserGroupIcon,
  UserIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import { SectionLoading } from "../../components/LoadingState";
import { handleApiErrorWithToast } from "../../utils/errorHandler";
import { transformDashboardStats } from "../../utils/transformers";
import httpClient, { API_PATHS } from "../../utils/httpClient";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

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

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch dashboard stats
        const statsResponse = await httpClient.get(API_PATHS.ADMIN.STATS);
        setStats(transformDashboardStats(statsResponse.data));
        
        setLoading(false);
      } catch (error) {
        handleApiErrorWithToast(
          error,
          "Failed to load dashboard data. Please try again.",
          setError
        );
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  
  // Download users data as Excel
  // Removed downloadUsersData function as it's now in the Users page

  // Status badge component
  const StatusBadge = ({ status }) => {
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
  };

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
            <motion.div 
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-white overflow-hidden rounded-xl shadow-sm border border-gray-100 transition-all duration-300"
            >
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 p-3 bg-purple-100 rounded-lg">
                    <UserGroupIcon
                      className="h-6 w-6 text-purple-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <p className="text-sm font-medium text-gray-500 mb-0">
                      Registered Users
                    </p>
                    <h3 className="text-2xl font-semibold text-gray-900 mt-1">
                      {stats.totalUsers}
                    </h3>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-3 border-t border-gray-100">
                <a 
                  href="#user-profiles"
                  className="text-sm font-medium text-primary-600 hover:text-primary-800 flex items-center"
                >
                  View all
                  <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </motion.div>
            
            {/* Pending Tax Forms */}
            <motion.div 
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-white overflow-hidden rounded-xl shadow-sm border border-gray-100 transition-all duration-300"
            >
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 p-3 bg-yellow-100 rounded-lg">
                    <ClockIcon
                      className="h-6 w-6 text-yellow-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <p className="text-sm font-medium text-gray-500 mb-0">
                      Pending Forms
                    </p>
                    <h3 className="text-2xl font-semibold text-gray-900 mt-1">
                      {stats.taxFormsPending}
                    </h3>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-3 border-t border-gray-100">
                <Link href="/admin/tax-forms?status=Pending">
                  <span className="text-sm font-medium text-primary-600 hover:text-primary-800 flex items-center">
                    View all
                    <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </Link>
              </div>
            </motion.div>

            {/* Reviewed Tax Forms */}
            <motion.div 
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-white overflow-hidden rounded-xl shadow-sm border border-gray-100 transition-all duration-300"
            >
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 p-3 bg-blue-100 rounded-lg">
                    <ExclamationCircleIcon
                      className="h-6 w-6 text-blue-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <p className="text-sm font-medium text-gray-500 mb-0">
                      Reviewed Forms
                    </p>
                    <h3 className="text-2xl font-semibold text-gray-900 mt-1">
                      {stats.taxFormsReviewed}
                    </h3>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-3 border-t border-gray-100">
                <Link href="/admin/tax-forms?status=Reviewed">
                  <span className="text-sm font-medium text-primary-600 hover:text-primary-800 flex items-center">
                    View all
                    <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </Link>
              </div>
            </motion.div>

            {/* Filed Tax Forms */}
            <motion.div 
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-white overflow-hidden rounded-xl shadow-sm border border-gray-100 transition-all duration-300"
            >
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 p-3 bg-green-100 rounded-lg">
                    <CheckCircleIcon
                      className="h-6 w-6 text-green-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <p className="text-sm font-medium text-gray-500 mb-0">
                      Filed Forms
                    </p>
                    <h3 className="text-2xl font-semibold text-gray-900 mt-1">
                      {stats.taxFormsFiled}
                    </h3>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-3 border-t border-gray-100">
                <Link href="/admin/tax-forms?status=Filed">
                  <span className="text-sm font-medium text-primary-600 hover:text-primary-800 flex items-center">
                    View all
                    <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </Link>
              </div>
            </motion.div>

            {/* Contact Messages */}
            <motion.div 
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-white overflow-hidden rounded-xl shadow-sm border border-gray-100 transition-all duration-300"
            >
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 p-3 bg-primary-100 rounded-lg">
                    <ChatBubbleLeftRightIcon
                      className="h-6 w-6 text-primary-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <p className="text-sm font-medium text-gray-500 mb-0">
                      Messages
                    </p>
                    <h3 className="text-2xl font-semibold text-gray-900 mt-1">
                      {stats.contactMessages}
                    </h3>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-3 border-t border-gray-100">
                <Link href="/admin/contact-messages">
                  <span className="text-sm font-medium text-primary-600 hover:text-primary-800 flex items-center">
                    View all
                    <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </Link>
              </div>
            </motion.div>
          </motion.div>

          {/* Recent submissions */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-10"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Recent Tax Form Submissions
              </h2>
              <Link href="/admin/tax-forms">
                <span className="text-sm font-medium text-primary-600 hover:text-primary-800 flex items-center">
                  View all submissions
                  <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
            </div>
            <div className="bg-white shadow-sm border border-gray-100 overflow-hidden rounded-xl">
              <ul className="divide-y divide-gray-100">
                {stats.recentForms && stats.recentForms.length > 0 ? (
                  stats.recentForms.map((form) => (
                    <motion.li 
                      key={form._id}
                      whileHover={{ backgroundColor: "#f9fafb" }}
                    >
                      <Link href={`/admin/tax-forms/${form._id}`}>
                        <div className="px-6 py-5 cursor-pointer">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="flex-shrink-0">
                                <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                                  <DocumentTextIcon className="h-5 w-5 text-primary-600" aria-hidden="true" />
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
                  ))
                ) : (
                  <li className="px-6 py-8 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <DocumentTextIcon className="h-12 w-12 text-gray-300 mb-3" />
                      <p className="text-sm">No recent submissions found</p>
                      <p className="text-xs mt-1">New submissions will appear here</p>
                    </div>
                  </li>
                )}
              </ul>
            </div>
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
                    <h2 className="text-lg font-medium text-gray-900">User Profiles</h2>
                    <p className="text-sm text-gray-500">View and manage all registered users</p>
                  </div>
                </div>
                <Link href="/admin/users" legacyBehavior>
                  <motion.a 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200"
                  >
                    View All Users
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
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
