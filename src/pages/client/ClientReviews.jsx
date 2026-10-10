
import { Link } from "react-router-dom";

export default function ClientReviews() {
  // Real submissions will be loaded from the backend later.
  const submissions = [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Work Reviews
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Review freelancer submissions and provide feedback.
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
                  d="M9 12l2 2 4-4m5-3v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9l5 4Z"
                />
              </svg>
            </div>

            <h2 className="mt-4 text-lg font-semibold text-gray-900">
              Nothing to review yet
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              When a freelancer submits completed work, you'll be able
              to inspect the delivery and provide feedback here.
            </p>

            <Link
              to="/client/active-work"
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
                <h2 className="font-semibold text-gray-900">
                  {submission.taskTitle}
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                  Submitted by {submission.freelancerName}
                </p>
                <p className="mt-3 text-sm text-gray-700">
                  {submission.deliveryNote}
                </p>

                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    disabled
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white opacity-60"
                  >
                    Approve Work
                  </button>
                  <button
                    type="button"
                    disabled
                    className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-500 opacity-60"
                  >
                    Request Revision
                  </button>
                </div>
                <p className="mt-2 text-xs text-gray-400">
                  Review actions will be enabled after backend integration.
                </p>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
