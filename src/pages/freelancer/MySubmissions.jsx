
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getMySubmissions,
  downloadSubmissionFile,
} from "../../services/submissionService";
import api from "../../api/axios";

const disputeCategories = [
  { value: "client_non_payment", label: "Client has not paid" },
  { value: "client_not_responding", label: "Client is not responding" },
  { value: "scope_change", label: "Client changed the agreed scope" },
  { value: "other", label: "Other issue" },
];

const submissionStatusStyles = {
  submitted: "border-blue-200 bg-blue-50 text-blue-900",
  revision_requested: "border-amber-200 bg-amber-50 text-amber-900",
  approved: "border-green-200 bg-green-50 text-green-900",
};

function formatSubmissionDate(value) {
  if (!value) return "Date unavailable";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date unavailable";

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function MySubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloadingFile, setDownloadingFile] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedSubmissionId, setExpandedSubmissionId] = useState(null);

  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [category, setCategory] = useState("client_non_payment");
  const [description, setDescription] = useState("");
  const [evidence, setEvidence] = useState("");
  const [submittingDispute, setSubmittingDispute] = useState(false);

  const [disputeMessage, setDisputeMessage] = useState("");
  const [disputedSubmissions, setDisputedSubmissions] = useState([]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const data = await getMySubmissions();
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

  const filteredSubmissions =
    statusFilter === "all"
      ? submissions
      : submissions.filter(
          (submission) => submission.status === statusFilter
        );

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
      alert(
        error.response?.data?.message ||
          "Failed to download file."
      );
    } finally {
      setDownloadingFile("");
    }
  };

  const openDisputeForm = (submission) => {
    setSelectedSubmission(submission);
    setCategory(
      submission.status === "approved"
        ? "client_non_payment"
        : "client_not_responding"
    );
    setDescription("");
    setEvidence("");
    setDisputeMessage("");
  };

  const closeDisputeForm = () => {
    if (submittingDispute) return;

    setSelectedSubmission(null);
    setDisputeMessage("");
  };

  const handleRaiseDispute = async (event) => {
    event.preventDefault();

    if (!selectedSubmission?.task?._id) {
      setDisputeMessage("Task information is unavailable.");
      return;
    }

    if (!description.trim()) {
      setDisputeMessage("Please explain the issue.");
      return;
    }

    if (
      category === "client_non_payment" &&
      selectedSubmission.status !== "approved"
    ) {
      setDisputeMessage(
        "Non-payment disputes can only be raised for approved work."
      );
      return;
    }

    try {
      setSubmittingDispute(true);
      setDisputeMessage("");

      await api.post("/disputes", {
        taskId: selectedSubmission.task._id,
        submissionId: selectedSubmission._id,
        category,
        description: description.trim(),
        evidence: evidence.trim(),
      });

      setDisputedSubmissions((previous) => [
        ...previous,
        selectedSubmission._id,
      ]);

      alert(
        "Dispute submitted successfully. GigConnect administration will review your case."
      );

      setSelectedSubmission(null);
    } catch (error) {
      setDisputeMessage(
        error.response?.data?.message ||
          "Failed to submit dispute."
      );
    } finally {
      setSubmittingDispute(false);
    }
  };

  return (
    <main className="mx-auto w-full max-w-5xl space-y-6">
      <header>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
          My Submissions
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-6 text-gray-700">
          Review your submitted work, client feedback, and next steps.
        </p>
      </header>

      <section
        aria-labelledby="submission-history-heading"
        className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
      >
        <div className="flex flex-col gap-3 border-b border-gray-200 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <h2
            id="submission-history-heading"
            className="text-lg font-bold tracking-tight text-gray-950 sm:text-xl"
          >
            Submission history
          </h2>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
            {!loading && !error && submissions.length > 0 && (
              <label className="flex items-center justify-between gap-3 text-sm font-medium text-gray-800 sm:justify-start">
                Filter status
                <span className="relative">
                  <select
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value)}
                    className="min-h-11 appearance-none rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm text-gray-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="all">All statuses</option>
                    <option value="submitted">Submitted</option>
                    <option value="revision_requested">Revision requested</option>
                    <option value="approved">Approved</option>
                  </select>
                  <svg
                    aria-hidden="true"
                    className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-600"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      d="m5 7.5 5 5 5-5"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </label>
            )}
            {!loading && !error && (
              <span
                className="text-sm font-medium text-gray-700"
                aria-live="polite"
              >
                {statusFilter === "all"
                  ? `${submissions.length} ${
                      submissions.length === 1 ? "submission" : "submissions"
                    }`
                  : `${filteredSubmissions.length} of ${
                      submissions.length
                    } ${
                      submissions.length === 1 ? "submission" : "submissions"
                    }`}
              </span>
            )}
          </div>
        </div>
        {loading ? (
          <p role="status" className="px-5 py-12 text-center text-sm text-gray-700">
            Loading submissions...
          </p>
        ) : error ? (
          <p
            role="alert"
            className="m-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-900 sm:m-6"
          >
            {error}
          </p>
        ) : submissions.length === 0 ? (
          <div className="mx-auto flex max-w-md flex-col items-center px-5 py-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="h-6 w-6 text-blue-700"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Zm0 0v6h6M8 13h8m-8 4h8"
                />
              </svg>
            </div>

            <h3 className="mt-4 text-lg font-semibold text-gray-950">
              No submissions yet
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-700">
              Work you submit to clients will appear here, along with
              submission status and any revision feedback.
            </p>

            <Link
              to="/freelancer/active-work"
              className="mt-4 inline-flex min-h-11 items-center rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-800 transition-colors hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
            >
              View active work
            </Link>
          </div>
        ) : filteredSubmissions.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-gray-700">
            No submissions with this status.
          </p>
        ) : (
          <div className="space-y-4 bg-gray-50/70 p-4 sm:p-5">
            {filteredSubmissions.map((submission) => {
              const alreadyDisputed = disputedSubmissions.includes(
                submission._id
              );
              const statusLabel =
                submission.status?.replaceAll("_", " ") ||
                "Status unavailable";
              const client = submission.client;
              const clientName =
                client?.clientType === "company"
                  ? client.clientProfile?.companyName || client.name
                  : client?.name;
              const isExpanded = expandedSubmissionId === submission._id;

              return (
                <article
                  key={submission._id}
                  className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <h3 className="break-words text-base font-semibold text-gray-950">
                        {submission.task?.title || "Untitled task"}
                      </h3>

                      <p className="mt-1 text-sm text-gray-600">
                        Submitted{" "}
                        <time dateTime={submission.createdAt || undefined}>
                          {formatSubmissionDate(submission.createdAt)}
                        </time>
                      </p>
                      <p className="mt-1 text-sm text-gray-700">
                        Client:{" "}
                        {client?._id ? (
                          <Link
                            to={`/clients/${client._id}`}
                            className="font-semibold text-blue-700 hover:text-blue-800 hover:underline focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                          >
                            {clientName || "Client profile"}
                          </Link>
                        ) : (
                          <span className="font-medium text-gray-700">
                            Client information unavailable
                          </span>
                        )}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={`inline-flex min-h-8 w-fit shrink-0 items-center rounded-md border px-2.5 py-1 text-sm font-semibold capitalize ${
                          submissionStatusStyles[submission.status] ||
                          "border-gray-200 bg-gray-100 text-gray-800"
                        }`}
                      >
                        {statusLabel}
                      </span>
                      <button
                        type="button"
                        aria-expanded={isExpanded}
                        aria-controls={`submission-details-${submission._id}`}
                        onClick={() =>
                          setExpandedSubmissionId(
                            isExpanded ? null : submission._id
                          )
                        }
                        className="inline-flex min-h-10 items-center rounded-md px-2 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-50 hover:text-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                      >
                        {isExpanded ? "See less" : "See more"}
                      </button>
                    </div>
                  </div>

                  <div
                    id={`submission-details-${submission._id}`}
                    hidden={!isExpanded}
                    className="mt-5 space-y-5 border-t border-gray-100 pt-5"
                  >
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900">
                          Delivery note
                        </h4>
                        <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-6 text-gray-800">
                          {submission.description}
                        </p>
                      </div>

                      {submission.files?.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900">
                            Submitted files
                          </h4>

                          <ul className="mt-2 divide-y divide-gray-200 border-y border-gray-200">
                            {submission.files.map((file) => (
                              <li
                                key={file._id || file.filename}
                                className="flex items-center justify-between gap-4 py-3"
                              >
                                <span className="min-w-0 break-all text-sm text-gray-800">
                                  {file.originalName}
                                </span>

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleDownload(submission._id, file)
                                  }
                                  disabled={downloadingFile === file._id}
                                  aria-label={`Download ${file.originalName}`}
                                  className="inline-flex min-h-10 shrink-0 items-center rounded-md bg-blue-50 px-3 text-sm font-semibold text-blue-800 transition-colors hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                                >
                                  {downloadingFile === file._id
                                    ? "Downloading..."
                                    : "Download"}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {submission.feedback && (
                        <div className="rounded-r-lg border-l-4 border-indigo-300 bg-indigo-50/70 p-4">
                          <h4 className="text-sm font-semibold text-indigo-950">
                            Client feedback
                          </h4>

                          <p className="mt-1 text-sm leading-6 text-indigo-950">
                            {submission.feedback}
                          </p>
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-3 border-t border-gray-100 pt-4">
                        {submission.status === "revision_requested" &&
                          submission.task?._id && (
                            <Link
                              to={`/freelancer/tasks/${submission.task._id}/submit?revisionOf=${submission._id}`}
                              className="inline-flex min-h-11 items-center rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                            >
                              Resubmit work
                            </Link>
                          )}

                        {alreadyDisputed ? (
                          <span className="inline-flex min-h-11 items-center rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm font-semibold text-amber-900">
                            Dispute submitted
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => openDisputeForm(submission)}
                            className="inline-flex min-h-11 items-center rounded-lg border border-red-300 px-4 py-2.5 text-sm font-semibold text-red-800 transition-colors hover:bg-red-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
                          >
                            Raise a dispute
                          </button>
                        )}
                      </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Raise dispute modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-gray-950/60 p-3 sm:items-center sm:p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="raise-dispute-heading"
            className="my-0 w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-xl sm:my-6"
          >
            <div className="flex items-center justify-between border-b border-gray-100 p-5">
              <div>
                <h2
                  id="raise-dispute-heading"
                  className="text-lg font-semibold text-gray-950"
                >
                  Raise a dispute
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {selectedSubmission.task?.title}
                </p>
              </div>

              <button
                type="button"
                onClick={closeDisputeForm}
                disabled={submittingDispute}
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                aria-label="Close dispute form"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={handleRaiseDispute}
              className="space-y-5 p-5"
            >
              <div>
                <label
                  htmlFor="disputeCategory"
                  className="mb-2 block text-sm font-semibold text-gray-900"
                >
                  Reason for dispute
                </label>

                <select
                  id="disputeCategory"
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  required
                  className="min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
                >
                  {disputeCategories.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              {category === "client_non_payment" && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-900">
                  This option is for completed work that the client has
                  approved but has not paid for. The backend will verify
                  the payment status before accepting your dispute.
                </div>
              )}

              <div>
                <label
                  htmlFor="disputeDescription"
                  className="mb-2 block text-sm font-semibold text-gray-900"
                >
                  Explain the issue
                </label>

                <textarea
                  id="disputeDescription"
                  value={description}
                  onChange={(event) =>
                    setDescription(event.target.value)
                  }
                  required
                  maxLength={3000}
                  rows={4}
                  aria-describedby="dispute-description-count"
                  placeholder="Explain what happened and why you need assistance..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-500 focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
                />

                <p
                  id="dispute-description-count"
                  className="mt-1 text-right text-sm text-gray-600"
                >
                  {description.length}/3000
                </p>
              </div>

              <div>
                <label
                  htmlFor="disputeEvidence"
                  className="mb-2 block text-sm font-semibold text-gray-900"
                >
                  Evidence or additional information
                </label>

                <textarea
                  id="disputeEvidence"
                  value={evidence}
                  onChange={(event) =>
                    setEvidence(event.target.value)
                  }
                  maxLength={3000}
                  rows={3}
                  aria-describedby="dispute-evidence-count"
                  placeholder="Add relevant payment references, dates or other details..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-500 focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
                />
                <p
                  id="dispute-evidence-count"
                  className="mt-1 text-right text-sm text-gray-600"
                >
                  {evidence.length}/3000
                </p>
              </div>

              {disputeMessage && (
                <p
                  role="alert"
                  className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-900"
                >
                  {disputeMessage}
                </p>
              )}

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeDisputeForm}
                  disabled={submittingDispute}
                  className="min-h-11 rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-800 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submittingDispute}
                  className="min-h-11 rounded-lg bg-red-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
                >
                  {submittingDispute
                    ? "Submitting..."
                    : "Submit Dispute"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
