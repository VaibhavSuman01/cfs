/**
 * Centralized validation schemas
 * Provides consistent validation rules across the application
 */

import * as Yup from "yup";

// Tax Filing Schema removed

/**
 * Validation schema for contact form
 */
export const ContactSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  message: Yup.string().required("Message is required"),
});

/**
 * Validation schema for user login
 */
export const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
});

/**
 * Validation schema for user registration
 */
export const RegisterSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  panCardNo: Yup.string()
    .required("PAN Card Number is required")
    .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN Card format")
    .uppercase(),
  dob: Yup.date()
    .required("Date of Birth is required")
    .max(new Date(), "Date of Birth cannot be in the future"),
  mobile: Yup.string()
    .required("Mobile number is required")
    .matches(/^[6-9]\d{9}$/, "Invalid mobile number format"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),
});

/**
 * Validation schema for password change
 */
export const PasswordChangeSchema = Yup.object().shape({
  currentPassword: Yup.string().required("Current password is required"),
  newPassword: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("New password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
    .required("Confirm password is required"),
});

/**
 * Validation schema for profile update
 */
export const ProfileSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  pan: Yup.string()
    .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format")
    .nullable(),
  dob: Yup.date()
    .max(new Date(), "Date of Birth cannot be in the future")
    .nullable(),
  mobile: Yup.string()
    .matches(/^[0-9]{10}$/, "Mobile number must be 10 digits")
    .nullable(),
  aadhaar: Yup.string()
    .matches(/^\d{12}$/, "Aadhaar number must be 12 digits")
    .nullable(),
  fatherName: Yup.string()
    .nullable(),
  address: Yup.string()
    .nullable(),
});
