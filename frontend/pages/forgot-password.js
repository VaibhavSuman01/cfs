import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import httpClient, { API_PATHS } from "../utils/httpClient";
import Layout from "../components/Layout";
import { handleApiErrorWithToast } from "../utils/errorHandler";
import LoadingButton from "../components/LoadingButton";

// Schema for email validation
const EmailSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

export default function ForgotPassword() {
  const router = useRouter();
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Handle request password reset form submission
  const handleRequestReset = async (values, { setSubmitting }) => {
    try {
      await httpClient.post(API_PATHS.AUTH.REQUEST_PASSWORD_RESET, {
        email: values.email,
      });

      setIsSubmitted(true);
      toast.success(
        "If your email is registered, you will receive password reset instructions shortly"
      );
    } catch (error) {
      // Check for network connection issues
      if (!error.response) {
        toast.error("Network connection error. Please check your internet connection and try again. If the problem persists, the server might be temporarily unavailable.");
      } else {
        handleApiErrorWithToast(
          error,
          "Failed to request password reset. Please try again."
        );
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
            Forgot your password?
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {!isSubmitted ? (
              <>Enter your email to receive password reset instructions</>
            ) : (
              <>Check your email for password reset instructions</>
            )}
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {!isSubmitted ? (
              <Formik
                initialValues={{ email: "" }}
                validationSchema={EmailSchema}
                onSubmit={handleRequestReset}
              >
                {({ isSubmitting }) => (
                  <Form className="space-y-6">
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
                      <LoadingButton
                        type="submit"
                        loading={isSubmitting}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        Send Reset Instructions
                      </LoadingButton>
                    </div>

                    <div className="text-sm text-center">
                      <Link
                        href="/login"
                        className="font-medium text-primary-600 hover:text-primary-500"
                      >
                        Back to login
                      </Link>
                    </div>
                  </Form>
                )}
              </Formik>
            ) : (
              <div className="space-y-6">
                <div className="rounded-md bg-blue-50 p-4">
                  <div className="flex">
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">
                        Check your email
                      </h3>
                      <div className="mt-2 text-sm text-blue-700">
                        <p>
                          We've sent password reset instructions to your email address. 
                          Please check your inbox and follow the instructions to reset your password.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-sm text-center">
                  <Link
                    href="/login"
                    className="font-medium text-primary-600 hover:text-primary-500"
                  >
                    Back to login
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}