import { useState, useEffect } from "react";
import { withAuth } from "../../utils/auth";
import AdminLayout from "../../components/AdminLayout";
import { UserIcon, UserGroupIcon, ArrowDownTrayIcon, ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { SectionLoading } from "../../components/LoadingState";
import { handleApiErrorWithToast } from "../../utils/errorHandler";
import { transformUsersData } from "../../utils/transformers";
import httpClient, { API_PATHS } from "../../utils/httpClient";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

function Users() {
  const [userData, setUserData] = useState({
    users: [],
    pagination: {
      total: 0,
      page: 1,
      limit: 10, // Increased from 5 to show more users
      pages: 1,
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewAll, setViewAll] = useState(false);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async (fetchAll = false) => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch users data
      const usersResponse = await httpClient.get(API_PATHS.ADMIN.USERS);
      setUserData(transformUsersData(usersResponse.data));
      
      // If fetchAll is true, fetch all users without pagination
      if (fetchAll) {
        // This is a simplified approach. In a real-world scenario, you might want to
        // implement server-side pagination or lazy loading for large datasets
        const allUsersResponse = await httpClient.get(`${API_PATHS.ADMIN.USERS}?limit=${usersResponse.data.pagination.total}`);
        setAllUsers(allUsersResponse.data.users || []);
      }
    } catch (error) {
      console.error("Error fetching users data:", error);
      setError("Failed to load users data. Please try again later.");
      handleApiErrorWithToast(error);
    } finally {
      setLoading(false);
    }
  };
  
  // Function to toggle between paginated view and view all
  const toggleViewAll = async () => {
    if (!viewAll && allUsers.length === 0) {
      // Only fetch all users if we haven't already
      await fetchUsers(true);
    }
    setViewAll(!viewAll);
  };

  const downloadUsersData = async () => {
    const loadingToast = toast.loading("Downloading user data...");
    
    try {
      // Generate a filename with current date
      const date = new Date();
      const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      const filename = `users_data_${formattedDate}.xlsx`;
      
      console.log("Attempting to download from:", API_PATHS.ADMIN.USERS_DOWNLOAD);
      
      await httpClient.downloadFileWithAuth(
        API_PATHS.ADMIN.USERS_DOWNLOAD,
        filename
      );
      
      toast.dismiss(loadingToast);
      toast.success("User data downloaded successfully");
    } catch (error) {
      console.error("Error downloading user data:", error);
      toast.dismiss(loadingToast);
      toast.error(`Failed to download user data: ${error.message || 'Unknown error'}`); 
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <h1 className="text-2xl font-semibold text-gray-900">User Profiles</h1>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <SectionLoading text="Loading user data..." />
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
            <h1 className="text-2xl font-semibold text-gray-900">User Profiles</h1>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mt-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
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
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">User Profiles</h1>
          <p className="mt-1 text-sm text-gray-500">
            View and manage all registered users in the system.
          </p>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mt-6" 
          >
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-lg font-medium text-gray-900">
                  All Registered Users
                </h2>
                <p className="text-sm text-gray-500">
                  Total: {userData.pagination.total} users
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={downloadUsersData}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200"
              >
                <ArrowDownTrayIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                Download Excel
              </motion.button>
            </div>
            <div className="bg-white shadow-sm border border-gray-100 overflow-hidden rounded-xl">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-100">
                  <thead>
                    <tr className="bg-gray-50">
                      <th
                        scope="col"
                        className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                      >
                        Father Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                      >
                        Mobile No.
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                      >
                        Email ID
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                      >
                        Address
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                      >
                        PAN
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                      >
                        Registered On
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {(viewAll ? allUsers : userData.users) && (viewAll ? allUsers : userData.users).length > 0 ? (
                      (viewAll ? allUsers : userData.users).map((user, index) => (
                        <motion.tr 
                          key={user._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.05 * index, duration: 0.3 }}
                          whileHover={{ backgroundColor: "#f9fafb" }}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-purple-100 rounded-full">
                                <UserIcon className="h-5 w-5 text-purple-600" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {user.name || "N/A"}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-700">
                              {user.fatherName || "Not provided"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-700">
                              {user.mobile || "Not provided"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-700">
                              {user.email}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-700 max-w-xs truncate">
                              {user.address || "Not provided"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-700">
                              {user.pan || "Not provided"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(user.createdAt)}
                          </td>
                        </motion.tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="7"
                          className="px-6 py-10 text-center"
                        >
                          <div className="flex flex-col items-center justify-center text-gray-500">
                            <UserGroupIcon className="h-12 w-12 text-gray-300 mb-3" />
                            <p className="text-sm">No users found</p>
                            <p className="text-xs mt-1">Registered users will appear here</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-700">
                    {viewAll 
                      ? `Showing all ${allUsers.length} users` 
                      : `Showing ${userData.users.length} of ${userData.pagination.total} users`
                    }
                  </div>
                  <div className="flex items-center space-x-4">
                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
                    >
                      <svg className="mr-1 w-4 h-4 rotate-270" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                      Top
                    </motion.a>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={toggleViewAll}
                      className="flex items-center text-sm font-medium text-primary-600 hover:text-primary-800"
                    >
                      {viewAll ? (
                        <>
                          <ChevronUpIcon className="mr-1 w-4 h-4" />
                          Show Less
                        </>
                      ) : (
                        <>
                          <ChevronDownIcon className="mr-1 w-4 h-4" />
                          View All
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default withAuth(Users, "admin");