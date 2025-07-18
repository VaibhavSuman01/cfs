import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Layout from "../../components/Layout";
import { withAuth } from "../../utils/auth";
import httpClient, { API_PATHS } from "../../utils/httpClient";
import { handleApiErrorWithToast } from "../../utils/errorHandler";
import { SectionLoading } from "../../components/LoadingState";
import {
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

function UserSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [profileComplete, setProfileComplete] = useState(false);
  const router = useRouter();

  // Check if user profile is complete
  const checkProfileComplete = (user) => {
    // Check if all required fields are filled
    return !!(
      user &&
      user.name &&
      user.email &&
      user.pan &&
      user.dob &&
      user.mobile &&
      user.aadhaar &&
      user.fatherName &&
      user.address
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch user data
        const userResponse = await httpClient.get(API_PATHS.AUTH.ME);
        setUser(userResponse.data);

        // Check if profile is complete
        const isComplete = checkProfileComplete(userResponse.data);
        setProfileComplete(isComplete);

        // Fetch submissions
        console.log(
          "Fetching submissions from:",
          API_PATHS.FORMS.USER_SUBMISSIONS
        );
        console.log("Auth token:", localStorage.getItem("token"));
        console.log("User:", localStorage.getItem("user"));
        const submissionsResponse = await httpClient.get(
          API_PATHS.FORMS.USER_SUBMISSIONS
        );
        console.log("Submissions response:", submissionsResponse.data);
        setSubmissions(submissionsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        console.error("Error details:", {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
          stack: error.stack,
        });
        handleApiErrorWithToast(error, "Failed to load your data");
        setError("Failed to load your data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper function to get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <ClockIcon className="-ml-0.5 mr-1.5 h-3 w-3 text-yellow-400" />
            Pending
          </span>
        );
      case "In Review":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <DocumentTextIcon className="-ml-0.5 mr-1.5 h-3 w-3 text-blue-400" />
            In Review
          </span>
        );
      case "Completed":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircleIcon className="-ml-0.5 mr-1.5 h-3 w-3 text-green-400" />
            Completed
          </span>
        );
      case "Rejected":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <ExclamationCircleIcon className="-ml-0.5 mr-1.5 h-3 w-3 text-red-400" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex justify-center items-center">
          <SectionLoading text="Loading your submissions..." />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
          <button
            onClick={() => router.reload()}
            className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
          >
            Try Again
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {!profileComplete && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-yellow-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    Your profile is incomplete. Please
                    <Link
                      href="/user/profile"
                      className="font-medium underline text-yellow-700 hover:text-yellow-600 ml-1"
                    >
                      update your profile
                    </Link>
                    <span className="ml-1">
                      before filing taxes or using other services.
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">
              My Submissions
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              View all your tax filing submissions and their status
            </p>
          </div>

          {submissions.length === 0 ? (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 text-center">
              <p className="text-gray-500 mb-4">
                You haven't submitted any tax forms yet.
              </p>
              <Link
                href="/user/tax-filing"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
              >
                File Your Taxes Now
              </Link>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <ul className="divide-y divide-gray-200">
                {submissions.map((submission) => (
                  <li key={submission._id}>
                    <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col sm:flex-row sm:items-center">
                          <p className="text-sm font-medium text-primary-600 truncate mr-2">
                            {submission.fullName}
                          </p>
                          <p className="text-sm text-gray-500 sm:mt-0 mt-1">
                            PAN: {submission.pan}
                          </p>
                        </div>
                        <div className="ml-2 flex-shrink-0 flex">
                          {getStatusBadge(submission.status)}
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            <DocumentTextIcon
                              className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                              aria-hidden="true"
                            />
                            Submitted on {formatDate(submission.createdAt)}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <Link
                            href={`/user/submission/${submission._id}`}
                            className="inline-flex items-center text-primary-600 hover:text-primary-900"
                          >
                            View Details
                            <ChevronRightIcon
                              className="ml-1 h-5 w-5 text-primary-500"
                              aria-hidden="true"
                            />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default withAuth(UserSubmissions, "user");
