
import { Link } from "react-router-dom";

const metrics = [
  { label: "Active tasks", value: "—" },
  { label: "Applications received", value: "—" },
  { label: "Work in progress", value: "—" },
  { label: "Total spending", value: "—" },
];

function ClientDashboard() {
  return (
    <main>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-600">
            YOUR WORKSPACE
          </p>

          <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-900">
            Manage your tasks
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Track your work and collaborate with freelancers.
          </p>
        </div>

        <Link
          to="/post-task"
          className="inline-flex justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
        >
          + Create a task
        </Link>
      </div>

      <section
        aria-label="Task statistics"
        className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {metrics.map((metric) => (
          <article
            key={metric.label}
            className="rounded-2xl border border-gray-200 bg-white p-5"
          >
            <p className="text-sm text-gray-500">{metric.label}</p>

            <p className="mt-3 text-3xl font-bold text-gray-900">
              {metric.value}
            </p>

            <p className="mt-2 text-xs text-gray-400">
              Available when your account data is connected
            </p>
          </article>
        ))}
      </section>

      <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Your recent tasks
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Tasks you post will appear here.
            </p>
          </div>

          <Link
            to="/client/tasks"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            View all tasks →
          </Link>
        </div>

        <div className="mt-6 rounded-xl border border-dashed border-gray-300 px-5 py-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
            <span aria-hidden="true" className="text-xl text-gray-500">
              +
            </span>
          </div>

          <h4 className="mt-4 font-semibold text-gray-900">
            No tasks to display
          </h4>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">
            Your posted tasks and their progress will appear here once they're
            available from the database.
          </p>

          <Link
            to="/post-task"
            className="mt-5 inline-flex font-semibold text-blue-600 hover:text-blue-700"
          >
            Post your first task
          </Link>
        </div>
      </section>
    </main>
  );
}

export default ClientDashboard;
