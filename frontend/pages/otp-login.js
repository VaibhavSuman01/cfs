import { useRouter } from "next/router";
import Link from "next/link";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import httpClient, { API_PATHS } from "../utils/httpClient";
import { setAuth } from "../utils/auth";
import Layout from "../components/Layout";
import { handleApiErrorWithToast, handleApiError } from "../utils/errorHandler";
import LoadingButton from "../components/LoadingButton";

// Schema for OTP login
const OTPLoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  otp: Yup.string()
    .required("OTP is required")
    .matches(/^\d{6}$/, "OTP must be 6 digits"),
});

export default function OTPLogin() {
  const router = useRouter();
  const { returnUrl, email } = router.query;

  // Handle OTP login form submission
  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      // Prepare login payload
      const payload = {
        email: values.email,
        otp: values.otp,
        role: "user", // Specify user role
      };

      console.log("OTP Login payload:", payload);

      try {
        const response = await httpClient.post(API_PATHS.AUTH.OTP_LOGIN, payload);
        console.log("Login response:", response.data);

        if (response.data.token) {
          // Store the token and user info
          setAuth(response.data.token, response.data.user);
          toast.success("Login successful!");

          // Redirect to returnUrl if provided, otherwise to dashboard
          if (returnUrl) {
            router.push(decodeURIComponent(returnUrl));
          } else {
            router.push("/user/dashboard");
          }
        }
      } catch (apiError) {
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

      // Check if the error is due to wrong authentication method
      if (error.response?.data?.authMethod) {
        if (error.response.data.authMethod === "password") {
          // Redirect to regular login with return URL preserved
          const loginUrl = `/login?email=${encodeURIComponent(values.email)}${returnUrl ? `&returnUrl=${encodeURIComponent(returnUrl)}` : ''}`;
          router.push(loginUrl);
          return;
        }

        setErrors({
          auth: error.response.data.message,
        });
      } else {
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
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Handle request OTP
  const handleRequestOTP = async (email) => {
    try {
      await httpClient.post(API_PATHS.AUTH.REQUEST_OTP, { email });
      toast.success("OTP sent to your email");
    } catch (error) {
      handleApiErrorWithToast(error, "Failed to send OTP. Please try again.");
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in with OTP
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <Link
              href="/login"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              sign in with password
            </Link>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <Formik
              initialValues={{ email: email || "", otp: "" }}
              validationSchema={OTPLoginSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, errors, values }) => (
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
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email address
                    </label>
                    <div className="mt-1">
                      <Field
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      />
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="mt-1 text-sm text-red-600"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="otp"
                        className="block text-sm font-medium text-gray-700"
                      >
                        One-Time Password (OTP)
                      </label>
                      <button
                        type="button"
                        onClick={() => handleRequestOTP(values.email)}
                        className="text-sm font-medium text-primary-600 hover:text-primary-500"
                      >
                        Request OTP
                      </button>
                    </div>
                    <div className="mt-1">
                      <Field
                        id="otp"
                        name="otp"
                        type="text"
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        placeholder="Enter 6-digit OTP"
                      />
                      <ErrorMessage
                        name="otp"
                        component="div"
                        className="mt-1 text-sm text-red-600"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
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
                      Sign in with OTP
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
