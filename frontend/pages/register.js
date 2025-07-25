import { useState } from "react";
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

// Schema for registration
const RegisterSchema = Yup.object().shape({
  name: Yup.string().required("Full name is required"),
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
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),
});


export default function Register() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      // Prepare registration payload
      const payload = {
        name: values.name,
        email: values.email,
        panCardNo: values.panCardNo,
        dob: values.dob,
        mobile: values.mobile,
        password: values.password,
        role: "user", // Specify user role
      };

      const response = await httpClient.post(API_PATHS.AUTH.REGISTER, payload);

      if (response.data.token) {
        // Store the token and user info
        setAuth(response.data.token, response.data.user);
        toast.success("Registration successful!");

        router.push("/user/dashboard");
      }
    } catch (error) {
      // Check for network connection issues
      if (!error.response) {
        console.error("Network error:", error.message);
        const networkErrorMessage = "Network connection error. Please check your internet connection and try again. If the problem persists, the server might be temporarily unavailable.";
        toast.error(networkErrorMessage);
        setErrors({
          auth: networkErrorMessage
        });
        return;
      }
      
      console.error("Registration API error:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
      });
      
      // Use the improved error handler to get a user-friendly message
      const errorMessage = handleApiError(error, "Failed to register. Please try again.");
      
      // Handle specific error codes
      if (error.response?.data?.code === "EMAIL_IN_USE") {
        setErrors({
          auth: "A user with this email already exists. Please use a different email or login to your existing account."
        });
      } else if (error.response?.data?.code === "PAN_IN_USE") {
        setErrors({
          auth: "A user with this PAN number already exists. Please check your PAN number or contact support if you believe this is an error."
        });
      } else {
        // Don't show toast for validation errors, only for unexpected errors
        if (!error.response?.data?.code) {
          toast.error(errorMessage);
        }
        
        setErrors({
          auth: errorMessage
        });
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
            Create a new account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <Link
              href="/login"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <Formik
              initialValues={{
                name: "",
                email: "",
                panCardNo: "",
                dob: "",
                mobile: "",
                password: "",
                confirmPassword: "",
              }}
              validationSchema={RegisterSchema}
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
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Full Name
                    </label>
                    <div className="mt-1">
                      <Field
                        id="name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      />
                      <ErrorMessage
                        name="name"
                        component="div"
                        className="mt-1 text-sm text-red-600"
                      />
                    </div>
                  </div>

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
                    <label
                      htmlFor="panCardNo"
                      className="block text-sm font-medium text-gray-700"
                    >
                      PAN Card Number
                    </label>
                    <div className="mt-1">
                      <Field
                        id="panCardNo"
                        name="panCardNo"
                        type="text"
                        autoComplete="off"
                        placeholder="ABCDE1234F"
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      />
                      <ErrorMessage
                        name="panCardNo"
                        component="div"
                        className="mt-1 text-sm text-red-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="dob"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Date of Birth
                    </label>
                    <div className="mt-1">
                      <Field
                        id="dob"
                        name="dob"
                        type="date"
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      />
                      <ErrorMessage
                        name="dob"
                        component="div"
                        className="mt-1 text-sm text-red-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="mobile"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Mobile Number
                    </label>
                    <div className="mt-1">
                      <Field
                        id="mobile"
                        name="mobile"
                        type="tel"
                        placeholder="10-digit mobile number"
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      />
                      <ErrorMessage
                        name="mobile"
                        component="div"
                        className="mt-1 text-sm text-red-600"
                      />
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
                        autoComplete="new-password"
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
                    <div className="mt-1">
                      <Field
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
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
                      Register
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
