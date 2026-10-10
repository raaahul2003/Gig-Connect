
import { Link } from "react-router-dom";

export default function ClientActiveWork() {
  // Connect to the API when the backend is ready.
  const activeTasks = [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Active Work
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Track tasks assigned to freelancers and review their progress.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: "Active Tasks", value: "—" },
          { label: "Awaiting Review", value: "—" },
          { label: "Completed", value: "—" },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-gray-200 bg-white p-5"
          >
            <p className="text-sm text-gray-500">{item.label}</p>
            <p className="mt-2 text-2xl font-semibold text-gray-900">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 sm:p-10">
        {activeTasks.length === 0 ? (
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
                <rect x="3" y="4" width="18" height="16" rx="2" />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 2v4m8-4v4M3 10h18m-13 4h4m-4 3h7"
                />
              </svg>
            </div>

            <h2 className="mt-4 text-lg font-semibold text-gray-900">
              No active work yet
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              Once you hire a freelancer, their task progress and
              submissions will appear here.
            </p>

            <Link
              to="/client/applications"
              className="mt-5 rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white hover:bg-blue-700"
            >
              Review Applications
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {activeTasks.map((task) => (
              <article
                key={task.id}
                className="rounded-lg border border-gray-200 p-5"
              >
                <h2 className="font-semibold text-gray-900">
                  {task.title}
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                  Freelancer: {task.freelancerName}
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  Deadline: {task.deadline}
                </p>
                <p className="mt-2 text-sm text-gray-600">
                  Status: {task.status}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
