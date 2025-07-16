/**
 * HTTP client for making API requests
 * Provides a consistent interface for API calls with error handling
 */

import axios from "axios";
import { getConfig } from "./config";
import { handleApiError } from "./errorHandler";
import API_PATHS from "./apiConfig";

// Create axios instance with default config
const httpClient = axios.create({
  baseURL: getConfig("api.baseUrl"),
  timeout: getConfig("api.timeout"),
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for adding auth token
httpClient.interceptors.request.use(
  (config) => {
    // Add token to request if available
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    // Only log in development environment
    if (process.env.NODE_ENV === 'development') {
      console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }

    return config;
  },
  (error) => {
    if (process.env.NODE_ENV === 'development') {
      console.error("API Request Error:", error);
    }
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
httpClient.interceptors.response.use(
  (response) => {
    // Only log in development environment
    if (process.env.NODE_ENV === 'development') {
      console.log(`API Response: ${response.status} ${response.config.url}`);
    }

    return response;
  },
  (error) => {
    // Only log in development environment
    if (process.env.NODE_ENV === 'development') {
      console.error(`API Response Error: ${error.config?.url}`);
    }

    // Handle 401 Unauthorized errors (token expired)
    if (error.response && error.response.status === 401) {
      // Clear auth data and redirect to login if not already there
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.includes("/login")
      ) {
        localStorage.removeItem("token");
        localStorage.removeItem("userInfo");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

/**
 * API request wrapper with error handling
 * @param {Function} apiCall - Axios request function to execute
 * @param {string} errorMessage - Default error message
 * @returns {Promise} - Promise resolving to the API response data
 */
export const apiRequest = async (
  apiCall,
  errorMessage = "An error occurred"
) => {
  try {
    const response = await apiCall();
    return response.data;
  } catch (error) {
    const message = handleApiError(error, errorMessage);
    throw new Error(message);
  }
};

// Export the client and API paths
export { httpClient, API_PATHS };

/**
 * Downloads a file from the given URL
 * @param {string} url - The URL to download from
 * @param {string} filename - The filename to save as
 */
export const downloadFile = (url, filename) => {
  // Create a link element
  const link = document.createElement("a");
  link.href = url;
  link.download = filename || "download";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Downloads a file with authentication
 * @param {string} url - The URL to download from
 * @param {string} filename - The filename to save as
 */
export const downloadFileWithAuth = async (url, filename) => {
  try {
    // Get the token from localStorage
    const token = localStorage.getItem("token");
    
    if (!token) {
      console.error("Authentication token not found");
      return;
    }
    
    // Create a fetch request with the authorization header and prepend the base URL
    const baseUrl = getConfig("api.baseUrl");
    const fullUrl = `${baseUrl}${url}`;
    console.log("Downloading from URL:", fullUrl);
    
    const response = await fetch(fullUrl, {
      headers: {
        Authorization: `Bearer ${token}`
      }
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
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename || `download-${new Date().toISOString().split('T')[0]}`;
    
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

// Export convenience methods
export default {
  get: (url, config) => httpClient.get(url, config),
  post: (url, data, config) => httpClient.post(url, data, config),
  put: (url, data, config) => httpClient.put(url, data, config),
  delete: (url, config) => httpClient.delete(url, config),
  apiRequest,
  downloadFile,
  downloadFileWithAuth
};
