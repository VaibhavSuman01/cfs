import React, { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/router";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";
import Layout from "../../components/Layout";
import { withAuth } from "../../utils/auth";
import { httpClient, API_PATHS } from "../../utils/httpClient";
import { handleApiErrorWithToast } from "../../utils/errorHandler";
import LoadingButton from "../../components/LoadingButton";
import { formatFileSize, isAllowedFileType } from "../../utils/fileUtils";

// Define types for form values
interface TaxFilingFormValues {
  fullName: string;
  email: string;
  phone: string;
  pan: string;
  hasIncomeTaxLogin: boolean;
  incomeTaxLoginId: string;
  incomeTaxLoginPassword: string;
  hasHomeLoan: boolean;
  homeLoanSanctionDate: string;
  homeLoanAmount: string;
  homeLoanCurrentDue: string;
  homeLoanTotalInterest: string;
  hasTradingSummary: boolean;
  hasPranNumber: boolean;
  pranNumber: string;
}

// Define validation schema
const TaxFilingSchema = Yup.object().shape({
  fullName: Yup.string().required("Full name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
    .required("Phone number is required"),
  pan: Yup.string()
    .matches(
      /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
      "Invalid PAN format. Must be 5 letters, 4 numbers, 1 letter"
    )
    .required("PAN is required")
    .test("valid-pan-format", "PAN must be in format AAAAA0000A", (value) => {
      if (!value) return true; // Let the required validation handle this
      // Check if it follows the pattern: 5 letters + 4 numbers + 1 letter
      return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value);
    }),
  hasIncomeTaxLogin: Yup.boolean(),
  incomeTaxLoginId: Yup.string().when("hasIncomeTaxLogin", {
    is: true,
    then: () => Yup.string().required("Income Tax Login ID is required"),
  }),
  incomeTaxLoginPassword: Yup.string().when("hasIncomeTaxLogin", {
    is: true,
    then: () => Yup.string().required("Income Tax Login Password is required"),
  }),
  hasHomeLoan: Yup.boolean(),
  homeLoanSanctionDate: Yup.string().when("hasHomeLoan", {
    is: true,
    then: () => Yup.string().required("Date of Loan Sanction is required"),
  }),
  homeLoanAmount: Yup.string().when("hasHomeLoan", {
    is: true,
    then: () => Yup.string().required("Total Loan Amount is required"),
  }),
  homeLoanCurrentDue: Yup.string().when("hasHomeLoan", {
    is: true,
    then: () => Yup.string().required("Current Due Amount is required"),
  }),
  homeLoanTotalInterest: Yup.string().when("hasHomeLoan", {
    is: true,
    then: () => Yup.string().required("Total Interest is required"),
  }),
  hasTradingSummary: Yup.boolean(),
  hasPranNumber: Yup.boolean(),
  pranNumber: Yup.string().when("hasPranNumber", {
    is: true,
    then: () =>
      Yup.string()
        .matches(/^[0-9]{12}$/, "PRAN number must be 12 digits")
        .required("PRAN number is required"),
  }),
});

// Allowed file types
const ALLOWED_FILE_TYPES = ["pdf", "png", "jpg", "jpeg", "zip"];

// Maximum file size (50MB)
const MAX_FILE_SIZE = 50 * 1024 * 1024;

// Document types mapping
const DOCUMENT_TYPES = [
  { value: "form16", label: "Form 16" },
  { value: "bankStatement", label: "Bank Statements" },
  { value: "investmentProof", label: "Investment Proof (FY 2024-25)" },
  { value: "salarySlip", label: "Salary Slip (March 2025)" },
  { value: "aadharCard", label: "AADHAR Card (Both Sides)" },
  { value: "homeLoanCertificate", label: "Home Loan Certificate" },
  { value: "tradingSummary", label: "Trading Summary" },
  { value: "other", label: "Other Documents" },
];

// Document list for display
const REQUIRED_DOCUMENTS = DOCUMENT_TYPES.map((doc) => doc.label);

function TaxFilingForm(): React.ReactElement {
  const router = useRouter();

  const [files, setFiles] = useState<File[]>([]);
  const [totalSize, setTotalSize] = useState<number>(0);
  const [fileError, setFileError] = useState<string>("");
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch user data when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await httpClient.get(API_PATHS.AUTH.ME);
        setUserData(response.data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        // Fallback to localStorage if API fails
        if (typeof window !== "undefined") {
          const localUserData = JSON.parse(
            localStorage.getItem("user") || "{}"
          );
          if (localUserData) {
            setUserData(localUserData);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Handle file drop
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // Check file types
      const invalidFiles = acceptedFiles.filter(
        (file) => !isAllowedFileType(file.name, ALLOWED_FILE_TYPES)
      );

      if (invalidFiles.length > 0) {
        setFileError(
          `Invalid file type(s): ${invalidFiles
            .map((f) => f.name)
            .join(", ")}. Only ${ALLOWED_FILE_TYPES.join(
            ", "
          )} files are allowed.`
        );
        return;
      }

      // Calculate new total size
      const newTotalSize =
        totalSize + acceptedFiles.reduce((sum, file) => sum + file.size, 0);

      // Check total size limit
      if (newTotalSize > MAX_FILE_SIZE) {
        setFileError(
          `Total file size exceeds the limit of ${formatFileSize(
            MAX_FILE_SIZE
          )}`
        );
        return;
      }

      // Clear any previous errors
      setFileError("");

      // Add files to state
      setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
      setTotalSize(newTotalSize);
    },
    [totalSize]
  );

  // Configure dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
  });

  // Remove a file
  const removeFile = (index: number): void => {
    setFiles((prevFiles) => {
      const newFiles = [...prevFiles];
      setTotalSize(totalSize - newFiles[index].size);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  // Handle form submission
  const handleSubmit = async (
    values: TaxFilingFormValues,
    { setSubmitting, resetForm }: FormikHelpers<TaxFilingFormValues>
  ): Promise<void> => {
    try {
      // Check if files were uploaded
      if (files.length === 0) {
        setFileError("Please upload at least one document");
        setSubmitting(false);
        return;
      }

      // Create form data for file upload
      const formData = new FormData();

      // Add form values to formData
      Object.keys(values).forEach((key) => {
        formData.append(
          key,
          values[key as keyof TaxFilingFormValues].toString()
        );
      });

      // Add files to formData with document types
      files.forEach((file, index) => {
        formData.append(`documents`, file);
        formData.append(`fileId_${index}`, `file_${index}`);
        formData.append(
          `documentType_file_${index}`,
          "other" // Set default document type to "other" since dropdown was removed
        );
      });

      // Submit form
      const response = await httpClient.post(API_PATHS.FORMS.TAX, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Tax filing form submitted successfully");

      // Reset form and files
      resetForm();
      setFiles([]);
      setTotalSize(0);

      // Redirect to submissions page
      router.push("/user/submissions");
    } catch (error) {
      handleApiErrorWithToast(
        error,
        "Failed to submit tax filing form. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-primary-800 mb-4">
            Income Tax Filing Service
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our expert team will help you file your income tax returns
            accurately and efficiently, maximizing your tax benefits while
            ensuring full compliance with tax regulations.
          </p>
        </div>
        <div className="mb-5 text-center">
          <h2 className="text-3xl md:text-3xl font-extrabold text-purple-900 mb-2">
            Filing For A.Y 2025
          </h2>
        </div>

        {/* Form Section */}
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="p-6">
            {loading ? (
              <div className="flex justify-center items-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
              </div>
            ) : (
              <Formik
                initialValues={{
                  fullName: userData?.name || "",
                  email: userData?.email || "",
                  phone: userData?.mobile || "",
                  pan: userData?.pan || "",
                  hasIncomeTaxLogin: false,
                  incomeTaxLoginId: "",
                  incomeTaxLoginPassword: "",
                  hasHomeLoan: false,
                  homeLoanSanctionDate: "",
                  homeLoanAmount: "",
                  homeLoanCurrentDue: "",
                  homeLoanTotalInterest: "",
                  hasTradingSummary: false,
                  hasPranNumber: false,
                  pranNumber: "",
                }}
                validationSchema={TaxFilingSchema}
                onSubmit={handleSubmit}
                enableReinitialize={true}
              >
                {({ isSubmitting, values, setFieldValue }) => {
                  // Set Income Tax Login ID to PAN when checkbox is checked
                  useEffect(() => {
                    if (values.hasIncomeTaxLogin && values.pan) {
                      setFieldValue("incomeTaxLoginId", values.pan);
                    }
                  }, [values.hasIncomeTaxLogin, values.pan, setFieldValue]);

                  return (
                    <Form className="space-y-6">
                      {/* Personal Information Section */}
                      <div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                          Personal Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label
                              htmlFor="fullName"
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              Full Name
                            </label>
                            <Field
                              type="text"
                              name="fullName"
                              id="fullName"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                              placeholder="Enter your full name"
                            />
                            <ErrorMessage
                              name="fullName"
                              component="div"
                              className="mt-1 text-sm text-red-600"
                            />
                          </div>

                          <div>
                            <label
                              htmlFor="email"
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              Email Address
                            </label>
                            <Field
                              type="email"
                              name="email"
                              id="email"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                              placeholder="Enter your email address"
                            />
                            <ErrorMessage
                              name="email"
                              component="div"
                              className="mt-1 text-sm text-red-600"
                            />
                          </div>

                          <div>
                            <label
                              htmlFor="phone"
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              Phone Number
                            </label>
                            <Field
                              type="text"
                              name="phone"
                              id="phone"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                              placeholder="Enter your 10-digit phone number"
                            />
                            <ErrorMessage
                              name="phone"
                              component="div"
                              className="mt-1 text-sm text-red-600"
                            />
                          </div>

                          <div>
                            <label
                              htmlFor="pan"
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              PAN Number
                            </label>
                            <Field
                              type="text"
                              name="pan"
                              id="pan"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                              placeholder="Enter your PAN (e.g., ABCDE1234F)"
                            />
                            <ErrorMessage
                              name="pan"
                              component="div"
                              className="mt-1 text-sm text-red-600"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Income Tax Login Section */}
                      <div>
                        <div className="flex items-center mb-4">
                          <Field
                            type="checkbox"
                            name="hasIncomeTaxLogin"
                            id="hasIncomeTaxLogin"
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                          <label
                            htmlFor="hasIncomeTaxLogin"
                            className="ml-2 block text-sm font-medium text-gray-700"
                          >
                            I have Income Tax Login Credentials
                          </label>
                        </div>

                        {values.hasIncomeTaxLogin && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 p-4 bg-gray-50 rounded-md">
                            <div>
                              <label
                                htmlFor="incomeTaxLoginId"
                                className="block text-sm font-medium text-gray-700 mb-1"
                              >
                                Income Tax Login ID
                              </label>
                              <Field
                                type="text"
                                name="incomeTaxLoginId"
                                id="incomeTaxLoginId"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                placeholder="Enter your Income Tax Login ID"
                                value={values.pan}
                                disabled
                              />
                              <ErrorMessage
                                name="incomeTaxLoginId"
                                component="div"
                                className="mt-1 text-sm text-red-600"
                              />
                            </div>

                            <div>
                              <label
                                htmlFor="incomeTaxLoginPassword"
                                className="block text-sm font-medium text-gray-700 mb-1"
                              >
                                Income Tax Login Password
                              </label>
                              <Field
                                type="password"
                                name="incomeTaxLoginPassword"
                                id="incomeTaxLoginPassword"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                placeholder="Enter your Income Tax Login Password"
                              />
                              <ErrorMessage
                                name="incomeTaxLoginPassword"
                                component="div"
                                className="mt-1 text-sm text-red-600"
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Home Loan Section */}
                      <div>
                        <div className="flex items-center mb-4">
                          <Field
                            type="checkbox"
                            name="hasHomeLoan"
                            id="hasHomeLoan"
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                          <label
                            htmlFor="hasHomeLoan"
                            className="ml-2 block text-sm font-medium text-gray-700"
                          >
                            I have a Home Loan
                          </label>
                        </div>

                        {values.hasHomeLoan && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 p-4 bg-gray-50 rounded-md">
                            <div>
                              <label
                                htmlFor="homeLoanSanctionDate"
                                className="block text-sm font-medium text-gray-700 mb-1"
                              >
                                Date of Loan Sanction
                              </label>
                              <Field
                                type="date"
                                name="homeLoanSanctionDate"
                                id="homeLoanSanctionDate"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                              />
                              <ErrorMessage
                                name="homeLoanSanctionDate"
                                component="div"
                                className="mt-1 text-sm text-red-600"
                              />
                            </div>

                            <div>
                              <label
                                htmlFor="homeLoanAmount"
                                className="block text-sm font-medium text-gray-700 mb-1"
                              >
                                Total Loan Amount
                              </label>
                              <Field
                                type="text"
                                name="homeLoanAmount"
                                id="homeLoanAmount"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                placeholder="Enter total loan amount"
                              />
                              <ErrorMessage
                                name="homeLoanAmount"
                                component="div"
                                className="mt-1 text-sm text-red-600"
                              />
                            </div>

                            <div>
                              <label
                                htmlFor="homeLoanCurrentDue"
                                className="block text-sm font-medium text-gray-700 mb-1"
                              >
                                Current Due Amount
                              </label>
                              <Field
                                type="text"
                                name="homeLoanCurrentDue"
                                id="homeLoanCurrentDue"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                placeholder="Enter current due amount"
                              />
                              <ErrorMessage
                                name="homeLoanCurrentDue"
                                component="div"
                                className="mt-1 text-sm text-red-600"
                              />
                            </div>

                            <div>
                              <label
                                htmlFor="homeLoanTotalInterest"
                                className="block text-sm font-medium text-gray-700 mb-1"
                              >
                                Total Interest Paid (FY 2023-24)
                              </label>
                              <Field
                                type="text"
                                name="homeLoanTotalInterest"
                                id="homeLoanTotalInterest"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                placeholder="Enter total interest paid"
                              />
                              <ErrorMessage
                                name="homeLoanTotalInterest"
                                component="div"
                                className="mt-1 text-sm text-red-600"
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Trading Summary Section */}
                      <div>
                        <div className="flex items-center mb-4">
                          <Field
                            type="checkbox"
                            name="hasTradingSummary"
                            id="hasTradingSummary"
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                          <label
                            htmlFor="hasTradingSummary"
                            className="ml-2 block text-sm font-medium text-gray-700"
                          >
                            I have Trading/Investment Activities
                          </label>
                        </div>
                      </div>

                      {/* PRAN Number Section */}
                      <div>
                        <div className="flex items-center mb-4">
                          <Field
                            type="checkbox"
                            name="hasPranNumber"
                            id="hasPranNumber"
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                          <label
                            htmlFor="hasPranNumber"
                            className="ml-2 block text-sm font-medium text-gray-700"
                          >
                            I have a PRAN (Permanent Retirement Account Number)
                          </label>
                        </div>

                        {values.hasPranNumber && (
                          <div className="mt-4 p-4 bg-gray-50 rounded-md">
                            <div>
                              <label
                                htmlFor="pranNumber"
                                className="block text-sm font-medium text-gray-700 mb-1"
                              >
                                PRAN Number
                              </label>
                              <Field
                                type="text"
                                name="pranNumber"
                                id="pranNumber"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                placeholder="Enter your 12-digit PRAN number"
                              />
                              <ErrorMessage
                                name="pranNumber"
                                component="div"
                                className="mt-1 text-sm text-red-600"
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Document Upload Section */}
                      <div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                          Document Upload
                        </h2>
                        <p className="text-sm text-gray-600 mb-4">
                          Please upload the following documents (if applicable):
                        </p>
                        <ul className="list-disc pl-5 mb-6 text-sm text-gray-600">
                          {REQUIRED_DOCUMENTS.map((doc, index) => (
                            <li key={index} className="mb-1">
                              {doc}
                            </li>
                          ))}
                        </ul>

                        <div
                          {...getRootProps()}
                          className={`mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md ${
                            isDragActive
                              ? "border-primary-500 bg-primary-50"
                              : "border-gray-300 hover:border-primary-400"
                          } transition-all duration-200 cursor-pointer`}
                        >
                          <input {...getInputProps()} />
                          <div className="space-y-1 text-center">
                            <svg
                              className="mx-auto h-12 w-12 text-gray-400"
                              stroke="currentColor"
                              fill="none"
                              viewBox="0 0 48 48"
                              aria-hidden="true"
                            >
                              <path
                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            <div className="flex text-sm text-gray-600">
                              <label
                                htmlFor="file-upload"
                                className="relative cursor-pointer rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                              >
                                <span>Upload files</span>
                              </label>
                              <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">
                              PDF, PNG, JPG, JPEG, ZIP up to 50MB each
                            </p>
                          </div>
                        </div>

                        {fileError && (
                          <p className="mt-2 text-sm text-red-600">
                            {fileError}
                          </p>
                        )}

                        {files.length > 0 && (
                          <div className="mt-4">
                            <h3 className="text-sm font-medium text-gray-700 mb-2">
                              Uploaded Files ({files.length}):
                            </h3>
                            <ul className="divide-y divide-gray-200 border border-gray-200 rounded-md overflow-hidden">
                              {files.map((file, index) => (
                                <li
                                  key={index}
                                  className="pl-3 pr-4 py-3 flex items-center justify-between text-sm"
                                >
                                  <div className="w-0 flex-1 flex items-center">
                                    <svg
                                      className="flex-shrink-0 h-5 w-5 text-gray-400"
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                      aria-hidden="true"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                    <span className="ml-2 flex-1 w-0 truncate">
                                      {file.name}
                                    </span>
                                  </div>
                                  <div className="ml-4 flex-shrink-0 flex items-center space-x-4">
                                    <span className="text-xs text-gray-500">
                                      {formatFileSize(file.size)}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => removeFile(index)}
                                      className="font-medium text-red-600 hover:text-red-500"
                                    >
                                      Remove
                                    </button>
                                  </div>
                                </li>
                              ))}
                            </ul>
                            <p className="mt-2 text-xs text-gray-500">
                              Total size: {formatFileSize(totalSize)}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Submit Button */}
                      <div className="pt-6 col-span-2">
                        <LoadingButton
                          type="submit"
                          loading={isSubmitting}
                          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-md text-base font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
                          aria-label="Submit tax filing form"
                        >
                          Submit Tax Filing Form
                        </LoadingButton>
                      </div>
                    </Form>
                  );
                }}
              </Formik>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default withAuth(TaxFilingForm);
