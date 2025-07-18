import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import toast from "react-hot-toast";
import Layout from "../../../components/Layout";
import { withAuth } from "../../../utils/auth";
import httpClient, { API_PATHS } from "../../../utils/httpClient";
import { handleApiErrorWithToast } from "../../../utils/errorHandler";
import { SectionLoading } from "../../../components/LoadingState";
import { getFileUrl, formatFileSize, downloadDocumentWithAuth } from "../../../utils/fileUtils";
import {
  DocumentTextIcon,
  ClockIcon,
  ArrowDownTrayIcon,
  ArrowLeftIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  PhoneIcon,
  EnvelopeIcon,
  IdentificationIcon,
} from "@heroicons/react/24/outline";

function SubmissionDetail() {
  const router = useRouter();
  const { id } = router.query;

  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadingDocument, setUploadingDocument] = useState(false);
  const [documentType, setDocumentType] = useState("");
  const [editCount, setEditCount] = useState(0);
  const [maxEditsReached, setMaxEditsReached] = useState(false);

  useEffect(() => {
    // Fetch submission details and user data
    const fetchData = async () => {
      // Only proceed if router is ready and id exists
      if (!router.isReady || !id) return;

      try {
        setLoading(true);
        
        // Fetch submission details
        const submissionResponse = await httpClient.get(
          API_PATHS.FORMS.USER_SUBMISSION_DETAIL(id)
        );
        setSubmission(submissionResponse.data);
        
        // Fetch user data to get edit count
        const userResponse = await httpClient.get(API_PATHS.AUTH.ME);
        const userData = userResponse.data;
        
        // Check if documentEditCounts exists and has an entry for this submission
        if (userData.documentEditCounts && userData.documentEditCounts[id]) {
          const count = userData.documentEditCounts[id];
          setEditCount(count);
          
          // Check if max edits reached
          if (count >= 2) {
            setMaxEditsReached(true);
          }
        }
      } catch (error) {
        handleApiErrorWithToast(error, "Failed to load submission details");
        setError("Failed to load submission details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router.isReady, id]);

  // Helper function to get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <ClockIcon className="-ml-0.5 mr-1.5 h-3 w-3 text-yellow-400" />
            Pending
          </span>
        );
      case "In Review":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <DocumentTextIcon className="-ml-0.5 mr-1.5 h-3 w-3 text-blue-400" />
            In Review
          </span>
        );
      case "Completed":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircleIcon className="-ml-0.5 mr-1.5 h-3 w-3 text-green-400" />
            Completed
          </span>
        );
      case "Rejected":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <ExclamationCircleIcon className="-ml-0.5 mr-1.5 h-3 w-3 text-red-400" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex justify-center items-center">
          <SectionLoading />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
          <button
            onClick={() => router.reload()}
            className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
          >
            Try Again
          </button>
        </div>
      </Layout>
    );
  }

  if (!submission) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex justify-center items-center">
          <div className="text-center">
            <p className="text-gray-500 mb-4">Submission not found</p>
            <Link 
              href="/user/submissions" 
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Back to Submissions
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  // Handle document deletion
  const handleDeleteDocument = async (documentId, documentType) => {
    if (!confirm("Are you sure you want to delete this document?")) return;
    
    if (maxEditsReached) {
      toast.error("You've reached the maximum number of edits");
      return;
    }

    try {
      const response = await httpClient.delete(
        API_PATHS.FORMS.DELETE_DOCUMENT(documentId)
      );

      // Update the submission state to remove the deleted document
      setSubmission(prevSubmission => {
        const updatedSubmission = { ...prevSubmission };
        // Remove the document from the documents array
        updatedSubmission.documents = updatedSubmission.documents.filter(
          doc => doc._id !== documentId
        );
        // Remove the document from the specific document type field
        updatedSubmission[documentType] = null;
        return updatedSubmission;
      });
      
      // Update edit count
      const newCount = editCount + 1;
      setEditCount(newCount);
      if (newCount >= 2) {
        setMaxEditsReached(true);
      }

      toast.success("Document deleted successfully");
    } catch (error) {
      handleApiErrorWithToast(error, "Failed to delete document");
    }
  };

  // Handle file selection for upload
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Handle document upload
  const handleUploadDocument = async () => {
    if (!selectedFile || !documentType) {
      toast.error("Please select a file and document type");
      return;
    }

    if (maxEditsReached) {
      toast.error("You've reached the maximum number of edits");
      return;
    }

    try {
      setUploadingDocument(true);

      const formData = new FormData();
      formData.append("document", selectedFile);
      formData.append("documentType", documentType);

      // When uploading files with FormData, let the browser set the Content-Type header
      // with the correct boundary parameter automatically
      const response = await httpClient.post(
        API_PATHS.FORMS.UPLOAD_DOCUMENT(id),
        formData
      );

      // Update the submission state to include the new document
      const newDocument = response.data.document;
      
      setSubmission(prevSubmission => {
        const updatedSubmission = { ...prevSubmission };
        // Add the document to the documents array
        if (!updatedSubmission.documents) {
          updatedSubmission.documents = [];
        }
        updatedSubmission.documents.push(newDocument);
        // Add the document to the specific document type field
        updatedSubmission[newDocument.documentType] = newDocument;
        return updatedSubmission;
      });

      // Update edit count
      const newCount = editCount + 1;
      setEditCount(newCount);
      if (newCount >= 2) {
        setMaxEditsReached(true);
      }

      // Reset form
      setSelectedFile(null);
      setDocumentType("");
      setEditMode(false);

      toast.success("Document uploaded successfully");
    } catch (error) {
      handleApiErrorWithToast(error, "Failed to upload document");
    } finally {
      setUploadingDocument(false);
    }
  };

  // Helper function to render file download link
  const renderFileDownload = (file, label) => {
    if (!file) {
      // If no file exists for this type and in edit mode, show upload option
      if (editMode) {
        return (
          <div className="py-3 flex justify-between text-sm font-medium">
            <div className="w-1/4 text-gray-500">{label}</div>
            <div className="w-3/4 text-gray-900">
              <div className="text-gray-500">No document uploaded</div>
            </div>
          </div>
        );
      }
      return null;
    }

    return (
      <div className="py-3 flex justify-between text-sm font-medium">
        <div className="w-1/4 text-gray-500">{label}</div>
        <div className="w-3/4 text-gray-900 flex justify-between items-center">
          <button
            onClick={() => downloadDocumentWithAuth(file._id, file.originalName)}
            className="inline-flex items-center text-primary-600 hover:text-primary-900"
          >
            <span className="truncate">{file.originalName}</span>
            <span className="ml-1 text-gray-500">
              ({formatFileSize(file.fileSize)})
            </span>
            <ArrowDownTrayIcon className="ml-1 h-4 w-4" />
          </button>
          {editMode && (
            <button
                onClick={() => handleDeleteDocument(file._id, file.documentType)}
                disabled={maxEditsReached}
                className={`text-red-600 hover:text-red-800 ml-2 ${maxEditsReached ? 'opacity-50 cursor-not-allowed' : ''}`}
                title="Delete document"
              >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      </div>
    );
  };

  // Document types for dropdown
  const documentTypes = [
    { value: "form16", label: "Form 16" },
    { value: "bankStatement", label: "Bank Statement" },
    { value: "investmentProof", label: "Investment Proof" },
    { value: "tradingSummary", label: "Trading Summary" },
    { value: "homeLoanCertificate", label: "Home Loan Certificate" },
    { value: "salarySlip", label: "Salary Slip" },
    { value: "aadharCard", label: "AADHAR Card" },
    { value: "other", label: "Other Document" },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Link 
              href="/user/submissions" 
              className="inline-flex items-center text-sm text-primary-600 hover:text-primary-900 mb-4"
            >
              <ArrowLeftIcon className="mr-1 h-4 w-4" />
              Back to Submissions
            </Link>
            <h1 className="text-2xl font-semibold text-gray-900">
              Submission Details
            </h1>
            <div className="mt-2 flex items-center">
              <p className="text-sm text-gray-500 mr-2">Status:</p>
              {getStatusBadge(submission.status)}
            </div>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
            <div className="px-4 py-5 sm:px-6 bg-primary-50">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Personal Information
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Submitted on {formatDate(submission.createdAt)}
              </p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
              <dl className="sm:divide-y sm:divide-gray-200">
                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <IdentificationIcon className="mr-1 h-5 w-5 text-gray-400" />
                    Full name
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {submission.fullName}
                  </dd>
                </div>
                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <EnvelopeIcon className="mr-1 h-5 w-5 text-gray-400" />
                    Email address
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {submission.email}
                  </dd>
                </div>
                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <PhoneIcon className="mr-1 h-5 w-5 text-gray-400" />
                    Phone number
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {submission.phone}
                  </dd>
                </div>
                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <DocumentTextIcon className="mr-1 h-5 w-5 text-gray-400" />
                    PAN
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {submission.pan}
                  </dd>
                </div>
                {submission.hasPRAN && (
                  <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      PRAN Number
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {submission.pranNumber}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 bg-primary-50 flex justify-between items-center">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Uploaded Documents
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Click on a document to download
                </p>
              </div>
              <div className="flex flex-col items-end">
                <button
                  onClick={() => setEditMode(!editMode)}
                  disabled={maxEditsReached && !editMode}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${editMode ? 'bg-gray-200 text-gray-800' : maxEditsReached ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-primary-600 text-white hover:bg-primary-700'}`}
                >
                  {editMode ? 'Cancel Edit' : 'Edit Documents'}
                </button>
                <div className="text-xs text-gray-500 mt-1">
                  {maxEditsReached ? 
                    "You've reached the maximum number of edits (2)" : 
                    `${editCount}/2 edits used`}
                </div>
              </div>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              {editMode && (
                <div className="mb-6 p-4 bg-gray-50 rounded-md">
                  <h4 className="text-md font-medium text-gray-900 mb-2">Upload New Document</h4>
                  {maxEditsReached ? (
                    <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                      <p className="text-sm text-yellow-700">
                        You've reached the maximum number of edits (2) allowed for this submission.
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label htmlFor="documentType" className="block text-sm font-medium text-gray-700 mb-1">
                            Document Type
                          </label>
                          <select
                            id="documentType"
                            value={documentType}
                            onChange={(e) => setDocumentType(e.target.value)}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                            disabled={maxEditsReached}
                          >
                            <option value="">Select document type</option>
                            {documentTypes.map((type) => (
                              <option key={type.value} value={type.value}>
                                {type.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label htmlFor="document" className="block text-sm font-medium text-gray-700 mb-1">
                            Document File
                          </label>
                          <input
                            type="file"
                            id="document"
                            onChange={handleFileChange}
                            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                            disabled={maxEditsReached}
                          />
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <button
                          onClick={handleUploadDocument}
                          disabled={uploadingDocument || !selectedFile || !documentType || maxEditsReached}
                          className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${uploadingDocument || !selectedFile || !documentType || maxEditsReached ? 'bg-gray-300 cursor-not-allowed' : 'bg-primary-600 hover:bg-primary-700'}`}
                        >
                          {uploadingDocument ? 'Uploading...' : 'Upload Document'}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
              <div className="sm:divide-y sm:divide-gray-200">
                {renderFileDownload(submission.form16, "Form 16")}
                {renderFileDownload(
                  submission.bankStatement,
                  "Bank Statement"
                )}
                {renderFileDownload(
                  submission.investmentProof,
                  "Investment Proof"
                )}
                {renderFileDownload(
                  submission.tradingSummary,
                  "Trading Summary"
                )}
                {renderFileDownload(
                  submission.homeLoanCertificate,
                  "Home Loan Certificate"
                )}
                {renderFileDownload(submission.salarySlip, "Salary Slip")}
                {renderFileDownload(submission.aadharCard, "AADHAR Card")}
                {renderFileDownload(submission.other, "Other Document")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default withAuth(SubmissionDetail, "user");
