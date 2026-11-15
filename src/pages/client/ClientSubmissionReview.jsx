
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getSubmissionsForClient,
  reviewSubmission,
  downloadSubmissionFile
} from "../../services/submissionService";


export default function ClientSubmissionReview() {

  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [feedback, setFeedback] = useState({});
  const [actionLoading, setActionLoading] = useState("");
  const [actionError, setActionError] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  const [downloadingFile, setDownloadingFile] = useState("");

  const handleDownload = async (submissionId, file) => {
    try {
      setDownloadingFile(file._id);

      const blob = await downloadSubmissionFile(
        submissionId,
        file._id
      );

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = file.originalName;

      document.body.appendChild(link);
      link.click();
      link.remove();

      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 1000);
    } catch (error) {
      alert("Failed to download file.");
    } finally {
      setDownloadingFile("");
    }
  };

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const data = await getSubmissionsForClient();
        setSubmissions(data);
      } catch (error) {
        setError(
          error.response?.data?.message ||
          error.message ||
          "Failed to load submissions."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  const handleApprove = async (submissionId) => {
    try {
      setActionLoading(submissionId);
      setActionError("");
      setActionMessage("");

      await reviewSubmission(submissionId, "approved");

      setSubmissions((prev) =>
        prev.filter((submission) => submission._id !== submissionId)
      );

      setActionMessage("Work approved successfully.");
    } catch (error) {
      setActionError(
        error.response?.data?.message || "Failed to approve submission."
      );
    } finally {
      setActionLoading("");
    }
  };

  const handleRevision = async (submissionId) => {
    const revisionFeedback = feedback[submissionId]?.trim();

    if (!revisionFeedback) {
      setActionError("Please enter feedback before requesting a revision.");
      return;
    }

    try {
      setActionLoading(submissionId);
      setActionError("");
      setActionMessage("");

      const response = await reviewSubmission(
        submissionId,
        "revision_requested",
        revisionFeedback
      );

      setSubmissions((prev) =>
        prev.map((submission) =>
          submission._id === submissionId
            ? response.submission || {
              ...submission,
              status: "revision_requested",
              feedback: revisionFeedback,
            }
            : submission
        )
      );

      setActionMessage("Revision requested successfully.");
      setFeedback((prev) => ({
        ...prev,
        [submissionId]: "",
      }));
    } catch (error) {
      setActionError(
        error.response?.data?.message || "Failed to request revision."
      );
    } finally {
      setActionLoading("");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Submission Review
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Review submitted work and provide feedback to freelancers.
        </p>
      </div>

      {actionError && (
        <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {actionError}
        </p>
      )}

      {actionMessage && (
        <p className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
          {actionMessage}
        </p>
      )}

      <div className="rounded-xl border border-gray-200 bg-white p-6 sm:p-10">
        {loading ? (
          <p className="py-8 text-center text-sm text-gray-500">
            Loading submissions...
          </p>
        ) : error ? (
          <p
            role="alert"
            className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
          >
            {error}
          </p>
        ) : submissions.length === 0 ? (
          <div className="mx-auto flex max-w-md flex-col items-center py-8 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="h-7 w-7 text-blue-600"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m5-3v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9l5 4Z"
                />
              </svg>
            </div>

            <h2 className="mt-4 text-lg font-semibold text-gray-900">
              No submissions to review
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              When freelancers submit their completed work, you'll find
              their delivery notes and attachments here.
            </p>

            <Link
              to="/client/progress"
              className="mt-5 rounded-lg border border-gray-200 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              View Work Progress
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {submissions.map((submission) => (
              <article
                key={submission._id}
                className="rounded-xl border border-gray-200 p-5"
              >
                <div className="flex flex-col justify-between gap-3 sm:flex-row">
                  <div>
                    <h2 className="font-semibold text-gray-900">
                      {submission.task?.title || "Untitled task"}
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      Submitted by {submission.freelancer?.name || "Unknown freelancer"}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {submission.freelancer?.email}
                    </p>
                  </div>
                  <span className="h-fit rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                    {submission.status?.replaceAll("_", " ")}
                  </span>
                </div>

                <p className="mt-4 text-sm leading-6 text-gray-700">
                  {submission.description}
                </p>

                {submission.files?.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <h3 className="text-sm font-medium text-gray-800">
                      Attached files
                    </h3>
                    {submission.files.map((file) => (
                      <div
                        key={file._id || file.filename}
                        className="rounded-lg border border-gray-200 p-3 text-sm text-gray-600"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="break-all">{file.originalName}</span>

                          <button
                            type="button"
                            onClick={() => handleDownload(submission._id, file)}
                            disabled={downloadingFile === file._id}
                            className="shrink-0 rounded-lg bg-blue-50 px-3 py-2 text-xs font-medium text-blue-700 hover:bg-blue-100 disabled:opacity-50"
                          >
                            {downloadingFile === file._id
                              ? "Downloading..."
                              : "Download"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <textarea
                  value={feedback[submission._id] || ""}
                  onChange={(e) =>
                    setFeedback((prev) => ({
                      ...prev,
                      [submission._id]: e.target.value,
                    }))
                  }
                  placeholder="Enter feedback if you want the freelancer to make revisions..."
                  rows={3}
                  className="mt-4 w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-blue-500 focus:outline-none"
                />

                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => handleApprove(submission._id)}
                    disabled={actionLoading === submission._id}
                    className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {actionLoading === submission._id ? "Processing..." : "Approve Work"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRevision(submission._id)}
                    disabled={actionLoading === submission._id}
                    className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {actionLoading === submission._id
                      ? "Processing..."
                      : "Request Revision"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
