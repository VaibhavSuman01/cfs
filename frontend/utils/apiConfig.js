/**
 * Centralized API endpoint configuration
 * This file provides a single source of truth for all API endpoints
 * to prevent mismatches between frontend and backend
 */

export const API_PATHS = {
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    ME: "/api/auth/me",
    PROFILE: "/api/auth/profile",
    PASSWORD: "/api/auth/password",
    REQUEST_PASSWORD_RESET: "/api/auth/request-password-reset",
    RESET_PASSWORD: "/api/auth/reset-password",
  },
  ADMIN: {
    FORMS: "/api/admin/forms",
    FORM_DETAIL: (id) => `/api/admin/forms/${id}`,
    FORM_STATUS: (id) => `/api/admin/forms/${id}/status`,
    CONTACTS: "/api/admin/contacts",
    STATS: "/api/admin/stats",
    USERS: "/api/admin/users",
    USERS_DOWNLOAD: "/api/admin/users/download",
  },
  FORMS: {
    TAX: "/api/forms/tax",
    CONTACT: "/api/forms/contact",
    USER_SUBMISSIONS: "/api/forms/user-submissions",
    USER_SUBMISSION_DETAIL: (id) => `/api/forms/user-submissions/${id}`,
    DELETE_DOCUMENT: (documentId) => `/api/forms/document/${documentId}`,
    UPLOAD_DOCUMENT: (formId) => `/api/forms/document/${formId}`,
    CHECK_PAN: (pan) => `/api/forms/check-pan/${pan}`,
  },
};

export default API_PATHS;
