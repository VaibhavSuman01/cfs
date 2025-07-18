import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Layout from "../../components/Layout";
import { withAuth } from "../../utils/auth";
import httpClient, { API_PATHS } from "../../utils/httpClient";
import { handleApiErrorWithToast } from "../../utils/errorHandler";
import { SectionLoading } from "../../components/LoadingState";

function UserDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
  
  // Get first name from full name
  const getFirstName = (fullName) => {
    if (!fullName) return "";
    return fullName.split(" ")[0];
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Add a timestamp to prevent caching
        const timestamp = new Date().getTime();
        const response = await httpClient.get(
          `${API_PATHS.AUTH.ME}?_=${timestamp}`
        );
        setUser(response.data);
        // Check if profile is complete
        const isComplete = checkProfileComplete(response.data);
        setProfileComplete(isComplete);
        // Toast removed to prevent showing on every page reload
      } catch (error) {
        console.error("Error fetching user data:", error);
        handleApiErrorWithToast(error, "Failed to load user data");
        setError("Failed to load user data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();

    // This ensures user data is refreshed when returning from profile page
  }, [router.asPath]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex justify-center items-center">
          <SectionLoading />
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
                  <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    Your profile is incomplete. Please
                    <Link href="/user/profile" className="font-medium underline text-yellow-700 hover:text-yellow-600 ml-1">
                      update your profile
                    </Link>
                    <span className="ml-1">before filing taxes or using other services.</span>
                  </p>
                </div>
              </div>
            </div>
          )}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
            <div className="px-4 py-5 sm:px-6 bg-primary-50">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Hi {getFirstName(user?.name)}
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Your personal dashboard
              </p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">
                    Full name
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">{user?.name}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">
                    Email address
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">{user?.email}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">
                    PAN Number
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {user?.pan ? (
                      user.pan
                    ) : (
                      <span className="text-gray-400 italic">Not provided</span>
                    )}
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">
                    Mobile Number
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {user?.mobile ? (
                      user.mobile
                    ) : (
                      <span className="text-gray-400 italic">Not provided</span>
                    )}
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">
                    Aadhaar Number
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {user?.aadhaar ? (
                      user.aadhaar
                    ) : (
                      <span className="text-gray-400 italic">Not provided</span>
                    )}
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">
                    Date of Birth
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {user?.dob ? (
                      new Date(user.dob).toLocaleDateString()
                    ) : (
                      <span className="text-gray-400 italic">Not provided</span>
                    )}
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">
                    Father Name
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {user?.fatherName ? (
                      user.fatherName
                    ) : (
                      <span className="text-gray-400 italic">Not provided</span>
                    )}
                  </dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">
                    Full Address
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {user?.address ? (
                      user.address
                    ) : (
                      <span className="text-gray-400 italic">Not provided</span>
                    )}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Tax Filing Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-primary-100 rounded-md p-3">
                    <svg
                      className="h-6 w-6 text-primary-600"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Tax Filing
                      </dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">
                          File your taxes
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <Link
                    href="/user/tax-filing"
                    className="font-medium text-primary-600 hover:text-primary-500"
                  >
                    File now
                  </Link>
                </div>
              </div>
            </div>

            {/* My Submissions Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-primary-100 rounded-md p-3">
                    <svg
                      className="h-6 w-6 text-primary-600"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        My Submissions
                      </dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">
                          View your tax filings
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <Link
                    href="/user/submissions"
                    className="font-medium text-primary-600 hover:text-primary-500"
                  >
                    View all
                  </Link>
                </div>
              </div>
            </div>

            {/* Profile Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-primary-100 rounded-md p-3">
                    <svg
                      className="h-6 w-6 text-primary-600"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Profile
                      </dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">
                          Manage your account
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <Link
                    href="/user/profile"
                    className="font-medium text-primary-600 hover:text-primary-500"
                  >
                    Update profile
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default withAuth(UserDashboard, "user");
