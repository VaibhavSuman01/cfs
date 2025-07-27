import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import httpClient, { API_PATHS } from "../utils/httpClient";
import { setAuth } from "../utils/auth";
import Layout from "../components/Layout";
import { handleApiError } from "../utils/errorHandler";
import LoadingButton from "../components/LoadingButton";

// Schema for login
const LoginSchema = Yup.object().shape({
  identifier: Yup.string()
    .required("Email or PAN is required"),
  password: Yup.string().required("Password is required"),
});

export default function Login() {
  const router = useRouter();
  const { returnUrl, resetSuccess } = router.query;
  const [showPassword, setShowPassword] = useState(false);
  
  // Show success message if user has reset their password
  useEffect(() => {
    // Only proceed if router is ready
    if (!router.isReady) return;
    
    if (resetSuccess === 'true') {
      toast.success('Your password has been reset. You can now login with your new password.');
      // Remove the query parameter to prevent showing the message again on refresh
      router.replace('/login', undefined, { shallow: true });
    }
  }, [router.isReady, resetSuccess, router]);

  // Handle login form submission
  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      // Prepare login payload
      const payload = {
        identifier: values.identifier,
        password: values.password,
        role: "user", // Specify user role
      };

      console.log("Login payload:", payload);

      try {
        const response = await httpClient.post(API_PATHS.AUTH.LOGIN, payload);
        console.log("Login response:", response.data);

        if (response.data.token) {
          // Store the token, refresh token and user info
          setAuth(response.data.token, response.data.refreshToken, response.data.user);
          toast.success("Login successful!");

          // Redirect to returnUrl if provided, otherwise to dashboard
          if (returnUrl) {
            router.push(decodeURIComponent(returnUrl));
          } else {
            router.push("/user/dashboard");
          }
        }
      } catch (apiError) {
        // Check for network connection issues
        if (!apiError.response) {
          console.error("Network error:", apiError.message);
          // Show a more helpful message for network issues
          throw new Error("Network connection error. Please check your internet connection and try again. If the problem persists, the server might be temporarily unavailable.");
        }
        
        console.error("Login API error:", {
          message: apiError.message,
          status: apiError.response?.status,
          data: apiError.response?.data,
          headers: apiError.response?.headers,
        });
        throw apiError;
      }
    } catch (error) {
      console.error("Login API error:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
      });

      // Use the improved error handler to get a user-friendly message
      const errorMessage = handleApiError(
        error,
        "Failed to sign in. Please try again."
      );

      // Don't show toast for validation errors, only for unexpected errors
      if (
        !error.response?.data?.code &&
        error.response?.data?.message !== "Invalid credentials"
      ) {
        toast.error(errorMessage);
      }

      setErrors({
        auth: errorMessage,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <Link
              href="/register"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              create a new account
            </Link>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <Formik
              initialValues={{ identifier: "", password: "" }}
              validationSchema={LoginSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, errors }) => (
                <Form className="space-y-6">
                  {errors.auth && (
                    <div className="rounded-md bg-red-50 p-4">
                      <div className="flex">
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-red-800">
                            {errors.auth}
                          </h3>
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <label
                      htmlFor="identifier"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email or PAN Number
                    </label>
                    <div className="mt-1">
                      <Field
                        id="identifier"
                        name="identifier"
                        type="text"
                        autoComplete="username"
                        placeholder="Enter your email or PAN number"
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      />
                      <ErrorMessage
                        name="identifier"
                        component="div"
                        className="mt-1 text-sm text-red-600"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        You can sign in using either your registered email address or PAN number
                      </p>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Password
                    </label>
                    <div className="mt-1 relative">
                      <Field
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
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

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="remember-me"
                        className="ml-2 block text-sm text-gray-900"
                      >
                        Remember me
                      </label>
                    </div>

                    <div className="text-sm">
                      <Link
                        href="/forgot-password"
                        className="font-medium text-primary-600 hover:text-primary-500"
                      >
                        Forgot your password?
                      </Link>
                    </div>
                  </div>

                  <div>
                    <LoadingButton
                      type="submit"
                      loading={isSubmitting}
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Sign in
                    </LoadingButton>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </Layout>
  );
}
