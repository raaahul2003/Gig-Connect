
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMySubmissions, downloadSubmissionFile } from "../../services/submissionService";

export default function MySubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      alert(
        error.response?.data?.message ||
        "Failed to download file."
      );
    } finally {
      setDownloadingFile("");
    }
  };

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

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow p-6 sm:p-10">
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
              className="mt-5 rounded-lg border border-gray-200 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition-colors"
            >
              View Active Work
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
                      Submitted on {submission.createdAt ? new Date(submission.createdAt).toLocaleDateString() : "Date unavailable"}
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

                {submission.status === "revision_requested" && submission.task?._id && (
                  <Link
                    to={`/freelancer/tasks/${submission.task._id}/submit?revisionOf=${submission._id}`}
                    className="mt-4 inline-flex rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition-colors"
                  >
                    Resubmit Work
                  </Link>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
