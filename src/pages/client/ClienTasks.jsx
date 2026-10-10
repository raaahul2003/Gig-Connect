import { Link } from "react-router-dom";

export default function ClientTasks() {
  // Connect this to the backend later.
  const tasks = [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            My Tasks
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage the tasks you've posted on GigConnect.
          </p>
        </div>

        <Link
          to="/post-task"
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          + Post a Task
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: "Total Tasks", value: "—" },
          { label: "In Progress", value: "—" },
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
        {tasks.length === 0 ? (
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
                  d="M8 7h8M8 11h8M8 15h5M6 3h9l4 4v14H6V3Z"
                />
              </svg>
            </div>

            <h2 className="mt-4 text-lg font-semibold text-gray-900">
              No tasks posted yet
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Your posted tasks will appear here. Create your first task
              to start receiving freelancer applications.
            </p>

            <Link
              to="/post-task"
              className="mt-5 rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white hover:bg-blue-700"
            >
              Post Your First Task
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div key={task.id}>{task.title}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}