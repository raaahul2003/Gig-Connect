
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
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">
          Active Work
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          These tasks have been assigned to freelancers and are currently in progress.
          A task is marked complete after you approve the freelancer's submission.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex h-full flex-col items-center rounded-2xl border border-gray-200 bg-white p-5 text-center shadow-sm flex items-center justify-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Active tasks
          </p>
          <p className="mt-3 text-3xl font-bold tracking-tight text-gray-900">
            {activeTasks.length}
          </p>
          <p className="mt-2 text-sm leading-6 text-gray-500">
            Tasks a freelancer is currently working on.
          </p>
        </div>

        <Link
          to="/client/progress"
          className="group flex h-full flex-col items-center rounded-2xl border border-blue-100 bg-gradient-to-br from-white to-blue-50/70 p-5 text-center shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 19V5m0 14h16M8 15l3-4 3 2 5-7"
              />
            </svg>
          </div>
          <h2 className="mt-4 text-base font-semibold text-gray-900">
            Track work progress
          </h2>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            Follow task milestones and see the latest updates from freelancers.
          </p>
          <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-semibold text-blue-700">
            View progress
            <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">
              →
            </span>
          </span>
        </Link>

        <Link
          to="/client/submissions"
          className="group flex h-full flex-col items-center rounded-2xl border border-gray-200 bg-white p-5 text-center shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 4h8l4 4v12H4V4h4Zm0 0v5h8V4m-8 9 2.5 2.5L16 12"
              />
            </svg>
          </div>
          <h2 className="mt-4 text-base font-semibold text-gray-900">
            Review submissions
          </h2>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            Approve submitted work or ask the freelancer to make a revision.
          </p>
          <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-semibold text-blue-700">
            Open submissions
            <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">
              →
            </span>
          </span>
        </Link>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow p-6 sm:p-10">
        {loading ? (
          <p className="py-8 text-center text-sm text-gray-500">
            Loading active work...
          </p>
        ) : error ? (
          <p className="py-8 text-center text-sm text-red-600">
            {error}
          </p>
        ) : activeTasks.length === 0 ? (
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
              className="mt-5 rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition-colors"
            >
              Review Applications
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Tasks in progress
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  The freelancer is working on these tasks. You can follow updates in Work Progress.
                </p>
              </div>
            </div>

            {activeTasks.map((task) => (
              <article
                key={task.id}
                className="rounded-2xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-sm sm:p-6"
              >
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                  <div className="min-w-0">
                    <h3 className="break-words text-base font-semibold text-gray-900 sm:text-lg">
                      {task.title}
                    </h3>
                    <p className="mt-2 text-sm text-gray-600">
                      Freelancer: <span className="font-medium text-gray-900">{task.freelancerName}</span>
                    </p>
                    <p className="mt-1 text-sm text-gray-600">
                      Deadline: <span className="font-medium text-gray-900">{task.deadline}</span>
                    </p>
                  </div>

                  <span className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                    <span className="h-2 w-2 rounded-full bg-blue-600" aria-hidden="true" />
                    In progress
                  </span>
                </div>

                <p className="mt-4 border-t border-gray-100 pt-4 text-sm leading-6 text-gray-600">
                  The freelancer is working on this task. Its status changes to
                  completed after you approve the submitted work.
                </p>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
