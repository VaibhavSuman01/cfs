import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { jwtDecode } from "jwt-decode";

// Define the base URL for the API (normalize to avoid trailing slash issues)
const RAW_API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
const API_BASE_URL = RAW_API_BASE_URL.replace(/\/+$/, "");

// Create a function to generate API paths
const createUrl = (path: string) => {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${cleanPath}`;
};

// Define API paths
export const API_PATHS = {
  AUTH: {
    LOGIN: createUrl("/api/auth/login"),
    REGISTER: createUrl("/api/auth/register"),
    ME: createUrl("/api/auth/me"),
    PROFILE: createUrl("/api/auth/profile"),
    PROFILE_AVATAR: createUrl("/api/auth/profile/avatar"),
    PASSWORD: createUrl("/api/auth/password"),
    REQUEST_PASSWORD_RESET: createUrl("/api/auth/request-password-reset"),
    RESET_PASSWORD: createUrl("/api/auth/reset-password"),
    REFRESH_TOKEN: createUrl("/api/auth/refresh-token"),
  },
  ADMIN: {
    FORMS: createUrl("/api/admin/forms"),
    FORM_DETAIL: (id: string) => createUrl(`/api/admin/forms/${id}`),
    FORM_STATUS: (id: string) => createUrl(`/api/admin/forms/${id}/status`),
    CONTACTS: createUrl("/api/admin/contacts"),
    STATS: createUrl("/api/admin/stats"),
    USERS: createUrl("/api/admin/users"),
    USERS_DOWNLOAD: createUrl("/api/admin/users/download"),
    SERVICE_FORMS: createUrl("/api/admin/service-forms"),
    DELETE_REPORT: (formId: string, reportId: string, service: string) =>
      createUrl(`/api/admin/service-forms/${formId}/reports/${reportId}?service=${encodeURIComponent(service)}`),
    
    // ROC Returns Admin Routes
    ROC_RETURNS_DETAIL: (id: string) => createUrl(`/api/admin/roc-returns/${id}`),
    ROC_RETURNS_STATUS_UPDATE: (id: string) => createUrl(`/api/admin/roc-returns/${id}/status`),
    ROC_RETURNS_DOWNLOAD: (id: string, documentId: string) => createUrl(`/api/admin/roc-returns/${id}/download/${documentId}`),
  },
  FORMS: {
    TAX: createUrl("/api/forms/tax"),
    CONTACT: createUrl("/api/forms/contact"),
    USER_SUBMISSIONS: createUrl("/api/forms/user-submissions"),
    USER_SUBMISSION_DETAIL: (id: string) =>
      createUrl(`/api/forms/user-submissions/${id}`),
    DELETE_DOCUMENT: (documentId: string) =>
      createUrl(`/api/forms/document/${documentId}`),
    UPLOAD_DOCUMENT: (formId: string) =>
      createUrl(`/api/forms/document/${formId}`),
    CHECK_PAN: (pan: string) => createUrl(`/api/forms/check-pan/${pan}`),
    // Generic service form endpoint
    SERVICE: createUrl("/api/forms/service"),
    // Specific form endpoints
    COMPANY_FORMATION: createUrl("/api/forms/company-formation"),
    OTHER_REGISTRATION: createUrl("/api/forms/other-registration"),
    PARTNERSHIP_FIRM: createUrl("/api/forms/partnership-firm"),
    ROC_RETURNS: createUrl("/api/forms/roc-returns"),
    REPORTS: createUrl("/api/forms/reports"),
    TRADEMARK_ISO: createUrl("/api/forms/trademark-iso"),
    ADVISORY: createUrl("/api/forms/advisory"),

    // Company Formation - user CRUD and documents
    COMPANY_FORMATION_USER_SUBMISSIONS: createUrl("/api/forms/company-formation/user-submissions"),
    COMPANY_FORMATION_DETAIL: (id: string) => createUrl(`/api/forms/company-formation/${id}`),
    COMPANY_FORMATION_UPDATE: (id: string) => createUrl(`/api/forms/company-formation/${id}`),
    COMPANY_FORMATION_UPLOAD_DOC: (formId: string) => createUrl(`/api/forms/company-formation/document/${formId}`),
    COMPANY_FORMATION_DOWNLOAD_DOC: (documentId: string) => createUrl(`/api/forms/company-formation/download/${documentId}`),

    // Other Registration - user CRUD and documents
    OTHER_REGISTRATION_USER_SUBMISSIONS: createUrl("/api/forms/other-registration/user-submissions"),
    OTHER_REGISTRATION_DETAIL: (id: string) => createUrl(`/api/forms/other-registration/${id}`),
    OTHER_REGISTRATION_UPDATE: (id: string) => createUrl(`/api/forms/other-registration/${id}`),
    OTHER_REGISTRATION_UPLOAD_DOC: (formId: string) => createUrl(`/api/forms/other-registration/document/${formId}`),
    OTHER_REGISTRATION_DOWNLOAD_DOC: (documentId: string) => createUrl(`/api/forms/other-registration/download/${documentId}`),

    // ROC Returns - user CRUD and documents
    ROC_RETURNS_USER_SUBMISSIONS: createUrl("/api/forms/roc-returns/user-submissions"),
    ROC_RETURNS_DETAIL: (id: string) => createUrl(`/api/forms/roc-returns/${id}`),
    ROC_RETURNS_UPDATE: (id: string) => createUrl(`/api/forms/roc-returns/${id}`),
    ROC_RETURNS_UPLOAD_DOC: (formId: string) => createUrl(`/api/forms/roc-returns/document/${formId}`),
    ROC_RETURNS_DOWNLOAD_DOC: (documentId: string) => createUrl(`/api/forms/roc-returns/download/${documentId}`),

    // Trademark & ISO - user CRUD and documents
    TRADEMARK_ISO_USER_SUBMISSIONS: createUrl("/api/forms/trademark-iso/user-submissions"),
    TRADEMARK_ISO_DETAIL: (id: string) => createUrl(`/api/forms/trademark-iso/${id}`),
    TRADEMARK_ISO_UPDATE: (id: string) => createUrl(`/api/forms/trademark-iso/${id}`),
    TRADEMARK_ISO_UPLOAD_DOC: (formId: string) => createUrl(`/api/forms/trademark-iso/document/${formId}`),
    TRADEMARK_ISO_DOWNLOAD_DOC: (documentId: string) => createUrl(`/api/forms/trademark-iso/download/${documentId}`),

    // Advisory - user CRUD and documents
    ADVISORY_USER_SUBMISSIONS: createUrl("/api/forms/advisory/user-submissions"),
    ADVISORY_DETAIL: (id: string) => createUrl(`/api/forms/advisory/${id}`),
    ADVISORY_UPDATE: (id: string) => createUrl(`/api/forms/advisory/${id}`),
    ADVISORY_UPLOAD_DOC: (formId: string) => createUrl(`/api/forms/advisory/document/${formId}`),
    ADVISORY_DOWNLOAD_DOC: (documentId: string) => createUrl(`/api/forms/advisory/download/${documentId}`),

    // Reports - user CRUD and documents
    REPORTS_USER_SUBMISSIONS: createUrl("/api/forms/reports/user-submissions"),
    REPORTS_DETAIL: (id: string) => createUrl(`/api/forms/reports/${id}`),
    REPORTS_UPDATE: (id: string) => createUrl(`/api/forms/reports/${id}`),
    REPORTS_UPLOAD_DOC: (formId: string) => createUrl(`/api/forms/reports/document/${formId}`),
    REPORTS_DOWNLOAD_DOC: (documentId: string) => createUrl(`/api/forms/reports/download/${documentId}`),
  },
  SUPPORT: {
    CONTACT: createUrl("/api/support/contact"),
    BLOCK_DETAILS: createUrl("/api/support/block-details"),
  },
};

// Define token types
interface DecodedToken {
  user: {
    id: string;
    role: string;
  };
  exp: number;
  iat: number;
}

// Define user type
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  pan?: string;
  dob?: string;
  mobile?: string;
  aadhaar?: string;
  fatherName?: string;
  address?: string;
  avatarUrl?: string;
  createdAt?: string;
  isBlocked?: boolean;
  blockedAt?: string;
  blockReason?: string;
  blockedBy?: {
    name: string;
    email: string;
  };
}

// Create a class for the API client
class ApiClient {
  private instance: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value?: unknown) => void;
    reject: (reason?: any) => void;
  }> = [];

  constructor() {
    // Create axios instance
    this.instance = axios.create({
      baseURL: API_BASE_URL,
      timeout: 300000, // 5 minutes for large file uploads
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Add request interceptor
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) =>
        this.handleRequest(config) as InternalAxiosRequestConfig,
      this.handleRequestError
    );

    // Add response interceptor
    this.instance.interceptors.response.use(
      this.handleResponse,
      this.handleResponseError
    );
  }

  // Process the queue of failed requests
  private processQueue = (error: Error | null, token: string | null = null) => {
    this.failedQueue.forEach((promise) => {
      if (error) {
        promise.reject(error);
      } else {
        promise.resolve(token);
      }
    });

    this.failedQueue = [];
  };

  // Handle request interceptor
  private handleRequest = (config: AxiosRequestConfig) => {
    // Add token to request if available
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    // Don't override Content-Type for FormData
    if (config.data instanceof FormData && config.headers) {
      delete config.headers["Content-Type"];
    }

    return config;
  };

  // Handle request error
  private handleRequestError = (error: any) => {
    return Promise.reject(error);
  };

  // Handle response
  private handleResponse = (response: AxiosResponse) => {
    return response;
  };

  // Handle response error
  private handleResponseError = async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    // If error is 401 and we haven't tried refreshing the token yet
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      typeof window !== "undefined"
    ) {
      if (this.isRefreshing) {
        // If we're already refreshing, add this request to the queue
        return new Promise((resolve, reject) => {
          this.failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers && token) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return this.instance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      this.isRefreshing = true;

      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        // No refresh token available, redirect to login
        this.logout();
        return Promise.reject(error);
      }

      try {
        // Try to refresh the token
        const response = await this.instance.post(
          API_PATHS.AUTH.REFRESH_TOKEN,
          {
            refreshToken,
          }
        );
        const { token } = response.data;

        // Update token in localStorage
        localStorage.setItem("token", token);

        // Process any requests that were waiting for the token refresh
        this.processQueue(null, token);

        // Update the Authorization header
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${token}`;
        }

        // Return the original request with the new token
        return this.instance(originalRequest);
      } catch (refreshError) {
        // Token refresh failed, redirect to login
        this.processQueue(refreshError as Error, null);
        this.logout();
        return Promise.reject(refreshError);
      } finally {
        this.isRefreshing = false;
      }
    }

    return Promise.reject(error);
  };

  // Logout user
  public logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");

      // Clear token cookie used by Next.js middleware
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

      // Redirect to login page
      window.location.href = "/auth";
    }
  };

  // Check if user is authenticated
  public isAuthenticated = (): boolean => {
    if (typeof window === "undefined") {
      return false;
    }

    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
      // Decode token to check expiration
      const decoded = jwtDecode<DecodedToken>(token);
      const currentTime = Date.now() / 1000;

      // Check if token is expired
      if (decoded.exp < currentTime) {
        this.logout();
        return false;
      }

      return true;
    } catch (error) {
      this.logout();
      return false;
    }
  };

  // Get user from localStorage
  public getUser = (): User | null => {
    if (typeof window === "undefined") {
      return null;
    }

    const userStr = localStorage.getItem("user");
    if (!userStr) return null;

    try {
      const userData = JSON.parse(userStr);
      // Validate that the user data has the required fields
      if (!userData || !userData.role) {
        console.error("Invalid user data in localStorage");
        // Clear invalid data
        localStorage.removeItem("user");
        return null;
      }
      return userData;
    } catch (error) {
      console.error("Error parsing user info:", error);
      // Clear invalid data
      localStorage.removeItem("user");
      return null;
    }
  };

  // Get user role
  public getUserRole = (): string | null => {
    const user = this.getUser();
    // Ensure user and role exist before returning
    return user && user.role ? user.role : null;
  };

  // Set auth token and user info
  public setAuth = (token: string, refreshToken: string, user: User) => {
    if (typeof window !== "undefined") {
      // Validate user data before storing
      if (!user || !user.role) {
        console.error("Invalid user data provided to setAuth");
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(user));
    }
  };

  // API request methods
  public get = <T = any>(url: string, config?: AxiosRequestConfig) => {
    return this.instance.get<T>(url, config);
  };

  public post = <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ) => {
    return this.instance.post<T>(url, data, config);
  };

  public put = <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ) => {
    return this.instance.put<T>(url, data, config);
  };

  public delete = <T = any>(url: string, config?: AxiosRequestConfig) => {
    return this.instance.delete<T>(url, config);
  };

  // Download file with authentication
  public downloadFile = async (url: string, filename: string) => {
    try {
      // Get the token from localStorage
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("Authentication token not found");
        return;
      }

      // Create a fetch request with the authorization header
      const response = await fetch(`${API_BASE_URL}${url}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorMessage = `Download failed: ${response.status} ${response.statusText}`;
        console.error(errorMessage);
        throw new Error(errorMessage);
      }

      // Get the blob from the response
      const blob = await response.blob();

      // Create a download link
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download =
        filename || `download-${new Date().toISOString().split("T")[0]}`;

      // Append to the document, click it, and clean up
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(link);
      return true; // Return success
    } catch (error) {
      console.error("Error downloading file:", error);
      throw error; // Re-throw to allow caller to handle the error
    }
  };
}

// Create and export a singleton instance
const api = new ApiClient();
export default api;
