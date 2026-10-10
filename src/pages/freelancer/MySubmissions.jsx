
import { Link } from "react-router-dom";

export default function MySubmissions() {
  // Real submissions will be loaded from the backend later.
  const submissions = [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          My Submissions
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Track your submitted work and client feedback.
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 sm:p-10">
        {submissions.length === 0 ? (
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
            {submissions.map((submission) => (
              <article
                key={submission.id}
                className="rounded-xl border border-gray-200 p-5"
              >
                <div className="flex flex-col justify-between gap-3 sm:flex-row">
                  <div>
                    <h2 className="font-semibold text-gray-900">
                      {submission.taskTitle}
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      Submitted on {submission.submittedAt}
                    </p>
                  </div>

                  <span className="h-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                    {submission.status}
                  </span>
                </div>

                <p className="mt-4 text-sm leading-6 text-gray-700">
                  {submission.deliveryNote}
                </p>

                {submission.files?.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <h3 className="text-sm font-medium text-gray-800">
                      Submitted files
                    </h3>
                    {submission.files.map((file) => (
                      <div
                        key={file.id}
                        className="rounded-lg border border-gray-200 p-3 text-sm text-gray-600"
                      >
                        {file.name}
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
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
