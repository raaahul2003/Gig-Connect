
import { useRef, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { submitWork } from "../../services/submissionService";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_FILES = 5;

function SubmitWork() {
  const { taskId } = useParams();
  const [searchParams] = useSearchParams();
  const revisionOf = searchParams.get("revisionOf");

  const fileInputRef = useRef(null);

  const [note, setNote] = useState("");
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleFiles(event) {
    setError("");
    setMessage("");

    const selectedFiles = Array.from(event.target.files || []);
    event.target.value = "";

    if (!selectedFiles.length) return;

    const existingKeys = new Set(
      files.map((file) => `${file.name}-${file.size}-${file.lastModified}`)
    );

    const uniqueFiles = selectedFiles.filter(
      (file) =>
        !existingKeys.has(`${file.name}-${file.size}-${file.lastModified}`)
    );

    if (uniqueFiles.some((file) => file.size > MAX_FILE_SIZE)) {
      setError("Each file must be 10 MB or smaller.");
      return;
    }

    if (files.length + uniqueFiles.length > MAX_FILES) {
      setError(`You can attach a maximum of ${MAX_FILES} files.`);
      return;
    }

    setFiles((current) => [...current, ...uniqueFiles]);
  }

  function removeFile(indexToRemove) {
    setFiles((current) =>
      current.filter((_, index) => index !== indexToRemove)
    );
  }


  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!taskId) {
      setError("Task ID is missing.");
      return;
    }

    if (note.trim().length < 20) {
      setError("Please provide a delivery note of at least 20 characters.");
      return;
    }

    if (files.length === 0) {
      setError("Attach at least one file before continuing.");
      return;
    }

    const formData = new FormData();

    formData.append("description", note.trim());

    if (revisionOf) {
      formData.append("revisionOf", revisionOf);
    }

    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      setIsSubmitting(true);

      const response = await submitWork(taskId, formData);

      setMessage(response.message || "Work submitted successfully.");
      setNote("");
      setFiles([]);
    } catch (error) {
      setError(
        error.response?.data?.message ||
        error.message ||
        "Failed to submit work. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }


  return (
    <main className="min-h-screen bg-gray-50 px-5 py-10 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <Link
          to="/freelancer/active-work"
          className="text-sm font-medium text-gray-600 hover:text-blue-600"
        >
          ← Back to active work
        </Link>

        <header className="mt-6">
          <p className="text-sm font-semibold text-blue-600">
            TASK DELIVERY
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
            {revisionOf ? "Resubmit revised work" : "Submit completed work"}
          </h1>
          <p className="mt-3 text-sm leading-6 text-gray-600">
            Provide a delivery note and attach the files the client needs to
            review.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-7 rounded-2xl border border-gray-200 bg-white p-6 sm:p-8"
        >
          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-sm text-gray-500">Task reference</p>
            <p className="mt-1 break-all font-semibold text-gray-900">
              {taskId}
            </p>
          </div>

          <div>
            <label htmlFor="deliveryNote" className="text-sm font-semibold">
              Delivery note
            </label>
            <p className="mt-1 text-sm text-gray-500">
              Summarize what you completed and mention anything the client
              should know.
            </p>

            <textarea
              id="deliveryNote"
              rows={5}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="I've completed the requested work. The attached files include..."
              className="mt-3 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />

            <p className="mt-2 text-right text-xs text-gray-500">
              {note.length} characters
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between gap-3">
              <label className="text-sm font-semibold text-gray-900">
                Delivery files
              </label>
              <span className="text-xs text-gray-500">
                Up to {MAX_FILES} files · 10 MB each
              </span>
            </div>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-3 flex w-full flex-col items-center rounded-xl border-2 border-dashed border-gray-300 px-5 py-10 text-center transition hover:border-blue-400 hover:bg-blue-50/40"
            >
              <span className="text-2xl" aria-hidden="true">↑</span>
              <span className="mt-3 text-sm font-semibold text-gray-900">
                Choose files to attach
              </span>
              <span className="mt-1 text-xs text-gray-500">
                Select files from your device
              </span>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFiles}
              className="sr-only"
              aria-label="Choose delivery files"
            />

            {files.length > 0 && (
              <ul className="mt-4 space-y-2">
                {files.map((file, index) => (
                  <li
                    key={`${file.name}-${file.size}-${file.lastModified}`}
                    className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 p-3"
                  >
                    <div className="min-w-0">
                      <p className="break-all text-sm font-medium text-gray-900">
                        {file.name}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="shrink-0 text-sm font-medium text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          {message && (
            <p
              role="status"
              className="rounded-lg bg-blue-50 p-3 text-sm leading-6 text-blue-800"
            >
              {message}
            </p>
          )}

          <div className="border-t border-gray-200 pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting
                ? "Submitting..."
                : revisionOf
                  ? "Resubmit for review"
                  : "Submit for review"}
            </button>
            <p className="mt-3 text-center text-xs text-gray-500">
              {revisionOf
                ? "Your revised work will be sent to the client for another review."
                : "Your submitted work will be sent to the client for review."}
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}

export default SubmitWork;
