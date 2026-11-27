
import { useRef, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { submitWork } from "../../services/submissionService";
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_FILES = 5;

function SubmitWork() {
  const navigate = useNavigate();
  const { taskId } = useParams();
  const [searchParams] = useSearchParams();
  const revisionOf = searchParams.get("revisionOf");

  const fileInputRef = useRef(null);

  const [note, setNote] = useState("");
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleFiles(event) {
    setError("");

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

      await submitWork(taskId, formData);
      toast.success("Work submitted successfully!");
      navigate("/freelancer/submissions");
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
    <main className="mx-auto w-full max-w-3xl">
      <div>
        <Link
          to="/freelancer/active-work"
          className="inline-flex min-h-10 items-center text-sm font-medium text-gray-700 transition-colors hover:text-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
        >
          ← Back to active work
        </Link>

        <header className="mt-5">
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
            {revisionOf ? "Resubmit revised work" : "Submit completed work"}
          </h1>
          <p className="mt-2 max-w-2xl text-base leading-6 text-gray-700">
            Provide a delivery note and attach the files the client needs to
            review.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="mt-7 space-y-7 rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8"
        >
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <p className="text-sm font-medium text-gray-700">Task reference</p>
            <p className="mt-1 break-all text-sm font-semibold text-gray-950">
              {taskId}
            </p>
          </div>

          <div>
            <label
              htmlFor="deliveryNote"
              className="text-sm font-semibold text-gray-950"
            >
              Delivery note
            </label>
            <p id="delivery-note-help" className="mt-1 text-sm leading-5 text-gray-700">
              Summarize what you completed and mention anything the client
              should know. Use at least 20 characters.
            </p>

            <textarea
              id="deliveryNote"
              rows={5}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              aria-describedby="delivery-note-help delivery-note-count"
              placeholder="I've completed the requested work. The attached files include..."
              className="mt-3 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-950 outline-none placeholder:text-gray-500 focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
            />

            <p id="delivery-note-count" className="mt-2 text-right text-sm text-gray-600">
              {note.length} characters
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between gap-3">
              <p id="delivery-files-heading" className="text-sm font-semibold text-gray-950">
                Delivery files
              </p>
              <span id="delivery-files-guidance" className="text-sm text-gray-600">
                Up to {MAX_FILES} files · 10 MB each
              </span>
            </div>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              aria-describedby="delivery-files-guidance"
              className="mt-3 flex min-h-36 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 px-5 py-8 text-center transition-colors hover:border-blue-500 hover:bg-blue-50/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
            >
              <span className="text-sm font-semibold text-gray-950">
                Choose files to attach
              </span>
              <span className="mt-1 text-sm text-gray-600">
                Select files from your device
              </span>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFiles}
              className="sr-only"
              tabIndex={-1}
              aria-label="Choose delivery files"
            />

            {files.length > 0 && (
              <ul className="mt-4 divide-y divide-gray-200 border-y border-gray-200">
                {files.map((file, index) => (
                  <li
                    key={`${file.name}-${file.size}-${file.lastModified}`}
                    className="flex items-center justify-between gap-4 py-3"
                  >
                    <div className="min-w-0">
                      <p className="break-all text-sm font-medium text-gray-950">
                        {file.name}
                      </p>
                      <p className="mt-1 text-sm text-gray-600">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      aria-label={`Remove ${file.name}`}
                      className="inline-flex min-h-10 shrink-0 items-center rounded-md px-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50 hover:text-red-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
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
              className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-900"
            >
              {error}
            </p>
          )}

          <div className="border-t border-gray-200 pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="min-h-12 w-full rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white transition-colors hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
            >
              {isSubmitting
                ? "Submitting..."
                : revisionOf
                  ? "Resubmit for review"
                  : "Submit for review"}
            </button>
            <p className="mt-3 text-center text-sm leading-5 text-gray-600">
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
