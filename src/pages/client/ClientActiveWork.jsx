
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getClientActiveWork } from "../../services/applicationService";

export default function ClientActiveWork() {

  const [activeTasks, setActiveTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {

    const fetchActiveWork = async () => {
      try {
        const applications = await getClientActiveWork();

        const tasks = applications.map((application) => ({
          id: application._id,
          title: application.task?.title || "Untitled Task",
          freelancerName: application.freelancer?.name || "Freelancer",
          deadline: application.task?.deadline
            ? new Date(application.task.deadline).toLocaleDateString()
            : "Not specified",
          status: application.task?.status || "in_progress",
        }));

        setActiveTasks(tasks);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load active work."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchActiveWork();
  }, []);

  return (
    <main className="space-y-6 sm:space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
          Active Work
        </h1>
        <p className="mt-2 max-w-3xl text-base leading-6 text-gray-700">
          These tasks have been assigned to freelancers and are currently in
          progress. A task is marked complete after you approve the freelancer's
          submission.
        </p>
      </header>

      <section
        aria-label="Active work summary and shortcuts"
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4"
      >
        <article className="col-span-2 flex min-h-20 items-center justify-between rounded-xl border border-gray-200 bg-white p-4 sm:col-span-1 sm:min-h-0 sm:flex-col sm:justify-center sm:p-5 sm:text-center">
          <p className="text-sm font-semibold text-gray-700">Active tasks</p>
          <p className="text-2xl font-bold tracking-tight text-gray-950 sm:mt-2 sm:text-3xl">
            {activeTasks.length}
          </p>
        </article>

        <Link
          to="/client/progress"
          className="group flex min-h-24 flex-col justify-center rounded-xl border border-blue-200 bg-blue-50/50 p-4 text-left transition-colors hover:border-blue-300 hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
        >
          <span className="flex items-center justify-between gap-2 text-sm font-semibold text-blue-900">
            <span className="min-w-0">Track work progress</span>
            <span
              className="shrink-0 transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            >
              →
            </span>
          </span>
          <span className="mt-1 text-xs leading-5 text-gray-700">
            Follow task milestones and updates from freelancers.
          </span>
        </Link>

        <Link
          to="/client/submissions"
          className="group flex min-h-24 flex-col justify-center rounded-xl border border-gray-200 bg-white p-4 text-left transition-colors hover:border-blue-200 hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
        >
          <span className="flex items-center justify-between gap-2 text-sm font-semibold text-blue-900">
            <span className="min-w-0">Review submissions</span>
            <span
              className="shrink-0 transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            >
              →
            </span>
          </span>
          <span className="mt-1 text-xs leading-5 text-gray-700">
            Approve submitted work or request a revision.
          </span>
        </Link>
      </section>

      <section
        aria-labelledby="active-tasks-heading"
        className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
      >
        <header className="border-b border-gray-200 p-4 sm:px-5">
          <h2
            id="active-tasks-heading"
            className="text-lg font-semibold tracking-tight text-gray-950"
          >
            Tasks in progress
          </h2>
        </header>

        {loading ? (
          <p
            role="status"
            aria-live="polite"
            className="px-5 py-8 text-center text-sm text-gray-600"
          >
            Loading active work...
          </p>
        ) : error ? (
          <p
            role="alert"
            className="px-5 py-8 text-center text-sm text-red-800"
          >
            {error}
          </p>
        ) : activeTasks.length === 0 ? (
          <div className="mx-auto flex max-w-md flex-col items-center px-5 py-8 text-center sm:py-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-800">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="h-6 w-6"
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

            <h3 className="mt-4 text-lg font-semibold text-gray-950">
              No active work yet
            </h3>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Once you hire a freelancer, their task progress and submissions
              will appear here.
            </p>
            <Link
              to="/client/applications"
              className="mt-5 inline-flex min-h-11 items-center justify-center rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
            >
              Review Applications
            </Link>
          </div>
        ) : (
          <div className="space-y-3 bg-gray-50/70 p-3 sm:p-4">
            {activeTasks.map((task) => (
              <article
                key={task.id}
                className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <h3 className="break-words text-base font-semibold leading-6 text-gray-950 sm:text-lg">
                      {task.title}
                    </h3>
                    <dl className="mt-3 grid grid-cols-2 gap-x-5 gap-y-2 text-sm sm:flex sm:flex-wrap sm:gap-x-6">
                      <div>
                        <dt className="text-xs font-medium text-gray-600">
                          Freelancer
                        </dt>
                        <dd className="mt-1 break-words font-medium text-gray-900">
                          {task.freelancerName}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs font-medium text-gray-600">
                          Deadline
                        </dt>
                        <dd className="mt-1 font-medium text-gray-900">
                          {task.deadline}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <span className="inline-flex min-h-9 w-fit shrink-0 items-center gap-2 rounded-md border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-800">
                    <span
                      className="h-2 w-2 rounded-full bg-blue-700"
                      aria-hidden="true"
                    />
                    In progress
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
