
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getSubmissionsForClient,
  reviewSubmission,
  downloadSubmissionFile
} from "../../services/submissionService";
import { toast } from "react-toastify";

export default function ClientSubmissionReview() {

  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [feedback, setFeedback] = useState({});
  const [actionLoading, setActionLoading] = useState("");
  const [actionError, setActionError] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  const [downloadingFile, setDownloadingFile] = useState("");
  const [expandedSubmissionId, setExpandedSubmissionId] = useState("");

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
    } catch {
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

      const response = await reviewSubmission(
        submissionId,
        "approved"
      );

      setSubmissions((prev) =>
        prev.map((submission) =>
          submission._id === submissionId
            ? response.submission || {
              ...submission,
              status: "approved",
            }
            : submission
        )
      );

      toast.success(
        "Work approved successfully! Redirecting to payments..."
      );

      // Give the user time to see the success toast
      setTimeout(() => {
        navigate("/client/payments");
      }, 1200);

    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to approve submission.";

      setActionError(errorMessage);
      toast.error(errorMessage);

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
    <main className="space-y-6 sm:space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
          Review submitted work
        </h1>
        <p className="mt-2 max-w-3xl text-base leading-6 text-gray-700">
          Check delivery notes and files, then decide whether to approve the work
          or request a revision.
        </p>
        <p className="mt-4 max-w-3xl border-l-2 border-blue-600 pl-3 text-sm leading-6 text-gray-700">
          <span className="font-semibold text-gray-900">Review decision:</span>{" "}
          approval completes the project; a revision request should include
          clear, actionable feedback.
        </p>
      </header>

      {actionError && (
        <p
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-800"
        >
          {actionError}
        </p>
      )}

      {actionMessage && (
        <p
          role="status"
          aria-live="polite"
          className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm leading-6 text-green-800"
        >
          {actionMessage}
        </p>
      )}

      <section aria-label="Submitted work">
        {loading ? (
          <p
            role="status"
            aria-live="polite"
            className="rounded-xl border border-gray-200 bg-white px-5 py-10 text-center text-sm text-gray-600"
          >
            Loading submissions...
          </p>
        ) : error ? (
          <p
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-5 py-8 text-sm leading-6 text-red-800"
          >
            {error}
          </p>
        ) : submissions.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white px-5 py-8 text-center sm:py-10">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-800">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="h-6 w-6"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m5-3v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9l5 4Z"
                />
              </svg>
            </div>

            <h2 className="mt-4 text-lg font-semibold text-gray-950">
              No submissions to review
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-600">
              When freelancers submit their completed work, you'll find their
              delivery notes and attachments here.
            </p>

            <Link
              to="/client/progress"
              className="mt-5 inline-flex min-h-11 items-center justify-center rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-800 transition-colors hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
            >
              View Work Progress
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {submissions.map((submission) => {
              const isExpanded = expandedSubmissionId === submission._id;

              return (
                <article
                  key={submission._id}
                  className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5"
                >
                <header className="flex flex-col gap-3 border-b border-gray-100 pb-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <h2 className="break-words text-lg font-semibold tracking-tight text-gray-950">
                      {submission.task?.title || "Untitled task"}
                    </h2>
                    <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                      <div>
                        <dt className="text-xs font-medium text-gray-600">
                          Freelancer
                        </dt>
                        <dd className="mt-1 font-semibold text-gray-900">
                          {submission.freelancer?.name || "Unknown freelancer"}
                        </dd>
                      </div>
                      {isExpanded && submission.freelancer?.email && (
                        <div className="min-w-0">
                          <dt className="text-xs font-medium text-gray-600">
                            Email
                          </dt>
                          <dd className="mt-1 break-all font-medium text-gray-800">
                            {submission.freelancer.email}
                          </dd>
                        </div>
                      )}
                    </dl>
                  </div>
                  <span
                    className={`inline-flex min-h-9 w-fit shrink-0 items-center rounded-md border px-3 py-1 text-sm font-semibold ${
                      submission.status === "approved"
                        ? "border-green-200 bg-green-50 text-green-800"
                        : submission.status === "revision_requested"
                          ? "border-amber-200 bg-amber-50 text-amber-800"
                          : "border-blue-200 bg-blue-50 text-blue-800"
                    }`}
                  >
                    {submission.status === "approved"
                      ? "Project completed"
                      : submission.status === "revision_requested"
                        ? "Revision requested"
                        : "Awaiting your review"}
                  </span>
                </header>

                {isExpanded && (
                  <section className="mt-4">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Delivery notes
                  </h3>
                  <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-gray-700">
                    {submission.description}
                  </p>
                  </section>
                )}

                {isExpanded && submission.files?.length > 0 && (
                  <section className="mt-4 border-t border-gray-100 pt-4">
                    <h3 className="text-sm font-semibold text-gray-900">
                      Files included ({submission.files.length})
                    </h3>
                    <ul className="mt-2 divide-y divide-gray-100">
                      {submission.files.map((file) => (
                        <li
                          key={file._id || file.filename}
                          className="flex flex-col gap-2 py-3 first:pt-1 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <span className="min-w-0 break-all text-sm font-medium text-gray-800">
                            {file.originalName}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleDownload(submission._id, file)}
                            disabled={downloadingFile === file._id}
                            className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-800 transition-colors hover:bg-blue-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {downloadingFile === file._id
                              ? "Downloading..."
                              : "Download"}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                {isExpanded && submission.status === "submitted" ? (
                  <section className="mt-4 border-t border-gray-100 pt-4">
                    <h3 className="text-sm font-semibold text-gray-900">
                      Review decision
                    </h3>
                    <label
                      htmlFor={`feedback-${submission._id}`}
                      className="mt-3 block text-sm font-medium text-gray-800"
                    >
                      Revision feedback
                      <span className="ml-2 font-normal text-gray-600">
                        (only needed if requesting changes)
                      </span>
                    </label>
                    <textarea
                      id={`feedback-${submission._id}`}
                      value={feedback[submission._id] || ""}
                      onChange={(e) =>
                        setFeedback((prev) => ({
                          ...prev,
                          [submission._id]: e.target.value,
                        }))
                      }
                      placeholder="Explain what needs to be changed..."
                      rows={3}
                      className="mt-2 w-full resize-y rounded-lg border border-gray-300 bg-white p-3 text-sm leading-6 text-gray-900 placeholder:text-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                    />
                    <p className="mt-2 text-sm leading-5 text-gray-600">
                      Provide specific, actionable feedback so the freelancer
                      knows what to update.
                    </p>

                    <div className="mt-4 flex flex-col gap-2 border-t border-gray-100 pt-4 sm:flex-row">
                      <button
                        type="button"
                        onClick={() => handleApprove(submission._id)}
                        disabled={actionLoading === submission._id}
                        className="inline-flex min-h-11 items-center justify-center rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {actionLoading === submission._id
                          ? "Processing..."
                          : "Approve and complete project"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRevision(submission._id)}
                        disabled={actionLoading === submission._id}
                        className="inline-flex min-h-11 items-center justify-center rounded-lg border border-amber-300 px-5 py-2.5 text-sm font-semibold text-amber-900 transition-colors hover:bg-amber-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {actionLoading === submission._id
                          ? "Processing..."
                          : "Request revision"}
                      </button>
                    </div>
                  </section>
                ) : isExpanded ? (
                  <p
                    className={`mt-4 border-t border-gray-100 pt-4 text-sm leading-6 ${
                      submission.status === "approved"
                        ? "text-green-800"
                        : "text-amber-900"
                    }`}
                  >
                    {submission.status === "approved"
                      ? "This work has been approved and the project is complete."
                      : "A revision has been requested. The project will remain in progress until the freelancer resubmits and you approve the work."}
                  </p>
                ) : null}

                <button
                  type="button"
                  onClick={() =>
                    setExpandedSubmissionId(isExpanded ? "" : submission._id)
                  }
                  aria-expanded={isExpanded}
                  className="mt-4 inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-semibold text-blue-800 transition-colors hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                >
                  {isExpanded ? "See less" : "See more"}
                </button>
              </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
