
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

export default function MySubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloadingFile, setDownloadingFile] = useState("");

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
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">
          My Submissions
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Track your submitted work and client feedback.
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-10">
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
                  d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Zm0 0v6h6M8 13h8m-8 4h8"
                />
              </svg>
            </div>

            <h2 className="mt-4 text-lg font-semibold text-gray-900">
              No submissions yet
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Work you submit to clients will appear here, along with
              submission status and any revision feedback.
            </p>

            <Link
              to="/freelancer/active-work"
              className="mt-5 rounded-lg border border-gray-200 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              View Active Work
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {submissions.map((submission) => {
              const alreadyDisputed = disputedSubmissions.includes(
                submission._id
              );

              return (
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
                        Submitted on{" "}
                        {submission.createdAt
                          ? new Date(
                              submission.createdAt
                            ).toLocaleDateString()
                          : "Date unavailable"}
                      </p>
                    </div>

                    <span className="h-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                      {submission.status?.replaceAll("_", " ")}
                    </span>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-gray-700">
                    {submission.description}
                  </p>

                  {submission.files?.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <h3 className="text-sm font-medium text-gray-800">
                        Submitted files
                      </h3>

                      {submission.files.map((file) => (
                        <div
                          key={file._id || file.filename}
                          className="rounded-lg border border-gray-200 p-3 text-sm text-gray-600"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <span className="break-all">
                              {file.originalName}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                handleDownload(submission._id, file)
                              }
                              disabled={
                                downloadingFile === file._id
                              }
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

                  {submission.feedback && (
                    <div className="mt-4 rounded-lg bg-amber-50 p-4">
                      <h3 className="text-sm font-semibold text-amber-800">
                        Client Feedback
                      </h3>

                      <p className="mt-1 text-sm leading-6 text-amber-800">
                        {submission.feedback}
                      </p>
                    </div>
                  )}

                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    {submission.status === "revision_requested" &&
                      submission.task?._id && (
                        <Link
                          to={`/freelancer/tasks/${submission.task._id}/submit?revisionOf=${submission._id}`}
                          className="inline-flex rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
                        >
                          Resubmit Work
                        </Link>
                      )}

                    {alreadyDisputed ? (
                      <span className="rounded-lg bg-amber-50 px-4 py-2.5 text-sm font-medium text-amber-700">
                        Dispute submitted
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => openDisputeForm(submission)}
                        className="rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
                      >
                        Raise a Dispute
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Raise dispute modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div className="my-6 w-full max-w-lg rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 p-5">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Raise a Dispute
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {selectedSubmission.task?.title}
                </p>
              </div>

              <button
                type="button"
                onClick={closeDisputeForm}
                disabled={submittingDispute}
                className="rounded-lg px-3 py-2 text-gray-500 hover:bg-gray-100 disabled:opacity-50"
                aria-label="Close dispute form"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={handleRaiseDispute}
              className="space-y-4 p-5"
            >
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Reason for dispute
                </label>

                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  required
                  className="w-full rounded-lg border border-gray-200 px-3 py-3 text-sm outline-none focus:border-blue-500"
                >
                  {disputeCategories.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              {category === "client_non_payment" && (
                <div className="rounded-lg bg-amber-50 p-3 text-sm leading-6 text-amber-800">
                  This option is for completed work that the client has
                  approved but has not paid for. The backend will verify
                  the payment status before accepting your dispute.
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Explain the issue
                </label>

                <textarea
                  value={description}
                  onChange={(event) =>
                    setDescription(event.target.value)
                  }
                  required
                  maxLength={3000}
                  rows={4}
                  placeholder="Explain what happened and why you need assistance..."
                  className="w-full rounded-lg border border-gray-200 px-3 py-3 text-sm outline-none focus:border-blue-500"
                />

                <p className="mt-1 text-right text-xs text-gray-400">
                  {description.length}/3000
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Evidence or additional information
                </label>

                <textarea
                  value={evidence}
                  onChange={(event) =>
                    setEvidence(event.target.value)
                  }
                  maxLength={3000}
                  rows={3}
                  placeholder="Add relevant payment references, dates or other details..."
                  className="w-full rounded-lg border border-gray-200 px-3 py-3 text-sm outline-none focus:border-blue-500"
                />
              </div>

              {disputeMessage && (
                <p
                  role="alert"
                  className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
                >
                  {disputeMessage}
                </p>
              )}

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeDisputeForm}
                  disabled={submittingDispute}
                  className="rounded-lg border border-gray-200 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submittingDispute}
                  className="rounded-lg bg-red-600 px-5 py-3 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
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
    </div>
  );
}
