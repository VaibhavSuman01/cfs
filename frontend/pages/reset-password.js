import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import httpClient, { API_PATHS } from "../utils/httpClient";
import Layout from "../components/Layout";
import { handleApiErrorWithToast } from "../utils/errorHandler";
import LoadingButton from "../components/LoadingButton";

// Schema for password reset validation
const ResetPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .required("New password is required")
    .min(6, "Password must be at least 6 characters"),
  confirmPassword: Yup.string()
    .required("Confirm password is required")
    .oneOf([Yup.ref("password")], "Passwords must match"),
});

export default function ResetPassword() {
  const router = useRouter();
  const { token } = router.query;
  const [showPassword, setShowPassword] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    // Only proceed if router is ready
    if (!router.isReady) return;

    // Check if token is present
    if (!token) {
      setIsTokenValid(false);
      toast.error("Invalid or missing reset token");
    }
  }, [router.isReady, token]);

  // Handle reset password form submission
  const handleResetPassword = async (values, { setSubmitting }) => {
    try {
      await httpClient.post(API_PATHS.AUTH.RESET_PASSWORD, {
        token,
        password: values.password,
      });

      setIsSubmitted(true);
      toast.success("Password has been reset successfully");
      
      // Redirect to login after a short delay
      setTimeout(() => {
        router.push("/login?resetSuccess=true");
      }, 2000);
    } catch (error) {
      // Check for network connection issues
      if (!error.response) {
        toast.error("Network connection error. Please check your internet connection and try again.");
      } else {
        handleApiErrorWithToast(
          error,
          "Failed to reset password. The link may be invalid or expired."
        );
        
        // If token is invalid, mark it as such
        if (error.response?.status === 400) {
          setIsTokenValid(false);
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Reset your password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isTokenValid && !isSubmitted
              ? "Enter your new password below"
              : isSubmitted
              ? "Your password has been reset successfully"
              : "Invalid or expired reset link"}
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {isTokenValid && !isSubmitted ? (
              <Formik
                initialValues={{
                  password: "",
                  confirmPassword: "",
                }}
                validationSchema={ResetPasswordSchema}
                onSubmit={handleResetPassword}
              >
                {({ isSubmitting }) => (
                  <Form className="space-y-6">
                    <div>
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700"
                      >
                        New Password
                      </label>
                      <div className="mt-1 relative">
                        <Field
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? "Hide" : "Show"}
                        </button>
                        <ErrorMessage
                          name="password"
                          component="div"
                          className="mt-1 text-sm text-red-600"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="confirmPassword"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Confirm Password
                      </label>
                      <div className="mt-1 relative">
                        <Field
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showPassword ? "text" : "password"}
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        />
                        <ErrorMessage
                          name="confirmPassword"
                          component="div"
                          className="mt-1 text-sm text-red-600"
                        />
                      </div>
                    </div>

                    <div>
                      <LoadingButton
                        type="submit"
                        loading={isSubmitting}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        Reset Password
                      </LoadingButton>
                    </div>
                  </Form>
                )}
              </Formik>
            ) : (
              <div className="space-y-6">
                <div
                  className={`rounded-md ${isSubmitted ? "bg-green-50" : "bg-red-50"} p-4`}
                >
                  <div className="flex">
                    <div className="ml-3">
                      <h3
                        className={`text-sm font-medium ${isSubmitted ? "text-green-800" : "text-red-800"}`}
                      >
                        {isSubmitted
                          ? "Password Reset Successful"
                          : "Invalid Reset Link"}
                      </h3>
                      <div
                        className={`mt-2 text-sm ${isSubmitted ? "text-green-700" : "text-red-700"}`}
                      >
                        <p>
                          {isSubmitted
                            ? "Your password has been reset successfully. You will be redirected to the login page."
                            : "The password reset link is invalid or has expired. Please request a new password reset link."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-sm text-center">
                  {isSubmitted ? (
                    <Link
                      href="/login"
                      className="font-medium text-primary-600 hover:text-primary-500"
                    >
                      Go to login
                    </Link>
                  ) : (
                    <Link
                      href="/forgot-password"
                      className="font-medium text-primary-600 hover:text-primary-500"
                    >
                      Request a new reset link
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}