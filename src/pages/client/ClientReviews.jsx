
import { Link } from "react-router-dom";

export default function ClientReviews() {
  // Real submissions will be loaded from the backend later.
  const submissions = [];

  return (
    <main className="space-y-7 sm:space-y-8">
      <header className="border-b border-gray-200 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
          Work Reviews
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-6 text-gray-700">
          Review freelancer submissions and provide feedback.
        </p>
      </header>

      <section aria-label="Freelancer work reviews">
        {submissions.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white px-5 py-10 sm:px-8 sm:py-12">
            <div className="mx-auto flex max-w-lg flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-800">
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

            <h2 className="mt-4 text-lg font-semibold tracking-tight text-gray-950">
              Nothing to review yet
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-700">
              When a freelancer submits completed work, you can inspect the
              delivery and provide feedback here.
            </p>

            <Link
              to="/client/active-work"
              className="mt-5 inline-flex min-h-11 items-center justify-center rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-800 transition-colors hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
            >
              View Active Work
            </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4 rounded-xl border border-gray-200 bg-gray-50 p-3 sm:p-4">
            {submissions.map((submission) => (
              <article
                key={submission.id}
                className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-5"
              >
                <h2 className="break-words text-lg font-semibold tracking-tight text-gray-950">
                  {submission.taskTitle}
                </h2>
                <p className="mt-2 text-sm text-gray-700">
                  Submitted by {submission.freelancerName}
                </p>
                <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-6 text-gray-700">
                  {submission.deliveryNote}
                </p>

                <div className="mt-5 flex flex-col gap-2 border-t border-gray-100 pt-4 sm:flex-row">
                  <button
                    type="button"
                    disabled
                    className="inline-flex min-h-11 items-center justify-center rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Approve Work
                  </button>
                  <button
                    type="button"
                    disabled
                    className="inline-flex min-h-11 items-center justify-center rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-800 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Request Revision
                  </button>
                </div>
                <p className="mt-3 text-sm leading-5 text-gray-600">
                  Review actions will be enabled after backend integration.
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
