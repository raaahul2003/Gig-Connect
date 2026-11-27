
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyTasks } from "../../services/taskService";
import {
  getApplicationsForClient,
  getClientActiveWork,
} from "../../services/applicationService";

function ClientDashboard() {
  const [tasks, setTasks] = useState([]);
  const [applications, setApplications] = useState([]);
  const [activeWork, setActiveWork] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const [taskData, applicationData, activeWorkData] =
          await Promise.all([
            getMyTasks(),
            getApplicationsForClient(),
            getClientActiveWork(),
          ]);

        if (isMounted) {
          setTasks(taskData);
          setApplications(applicationData);
          setActiveWork(activeWorkData);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err.response?.data?.message ||
              err.message ||
              "Failed to load dashboard data."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  const activeTasks = tasks.filter(
    (task) => task.status === "open"
  ).length;

  const totalBudget = tasks.reduce(
    (total, task) => total + (Number(task.budget) || 0),
    0
  );

  const recentTasks = tasks.slice(0, 3);
  const recentApplications = applications.slice(0, 3);

  const metrics = [
    { label: "Active Tasks", value: activeTasks },
    { label: "Applications Received", value: applications.length },
    { label: "Work in Progress", value: activeWork.length },
    {
      label: "Total Budget",
      value: `₹${totalBudget.toLocaleString("en-IN")}`,
    },
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case "open":
      case "pending":
        return "bg-amber-50 text-amber-800 ring-1 ring-inset ring-amber-200";
      case "in_progress":
      case "accepted":
        return "bg-blue-50 text-blue-800 ring-1 ring-inset ring-blue-200";
      case "completed":
        return "bg-violet-50 text-violet-800 ring-1 ring-inset ring-violet-200";
      case "rejected":
      case "cancelled":
        return "bg-red-50 text-red-800 ring-1 ring-inset ring-red-200";
      default:
        return "bg-gray-100 text-gray-800 ring-1 ring-inset ring-gray-200";
    }
  };

  const formatStatus = (status) =>
    status
      ? status.replace("_", " ").replace(/\b\w/g, (char) =>
          char.toUpperCase()
        )
      : "Unknown";

  const formatDate = (date) => {
    if (!date) return "Not specified";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Not specified";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <main className="space-y-7 sm:space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
            Manage your tasks
          </h1>

          <p className="mt-2 text-base leading-6 text-gray-700">
            Track your work and collaborate with freelancers.
          </p>
        </div>

        <Link
          to="/post-task"
          className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 sm:w-auto"
        >
          + Create a task
        </Link>
      </header>

      <section
        aria-label="Task statistics"
        className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4"
      >
        {metrics.map((metric) => (
          <article
            key={metric.label}
            className="min-w-0 rounded-xl border border-gray-200 bg-white p-4 sm:p-5"
          >
            <p className="text-xs font-medium leading-5 text-gray-700 sm:text-sm">
              {metric.label}
            </p>

            <p className="mt-1 break-words text-xl font-bold tracking-tight text-gray-950 sm:mt-2 sm:text-3xl">
              {loading ? "..." : error ? "—" : metric.value}
            </p>

            <p className="mt-2 hidden text-xs text-gray-600 sm:block">
              {metric.label === "Total Budget"
                ? "Combined budget of your posted tasks"
                : "Based on your account activity"}
            </p>
          </article>
        ))}
      </section>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-800"
        >
          {error}
        </div>
      )}

      <div className="grid items-start gap-4 xl:grid-cols-2">
        <section
          aria-labelledby="recent-tasks-heading"
          className="min-w-0 rounded-xl border border-gray-200 bg-white p-4 sm:p-5"
        >
          <header className="flex flex-col gap-2 border-b border-gray-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2
                id="recent-tasks-heading"
                className="text-lg font-semibold tracking-tight text-gray-950"
              >
                Your recent tasks
              </h2>
              <p className="mt-1 text-sm leading-5 text-gray-600">
                Your latest posted tasks and their progress.
              </p>
            </div>

            <Link
              to="/client/tasks"
              className="inline-flex min-h-11 w-fit items-center font-semibold text-blue-800 transition-colors hover:text-blue-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
            >
              View all tasks →
            </Link>
          </header>

          <div className="divide-y divide-gray-200">
            {loading ? (
              <p
                role="status"
                aria-live="polite"
                className="py-8 text-sm text-gray-600"
              >
                Loading your tasks...
              </p>
            ) : recentTasks.length === 0 ? (
              <div className="py-8">
                <h3 className="font-semibold text-gray-900">
                  No tasks to display
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  Your posted tasks will appear here.
                </p>
                <Link
                  to="/post-task"
                  className="mt-4 inline-flex min-h-11 items-center font-semibold text-blue-800 transition-colors hover:text-blue-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                >
                  Post your first task
                </Link>
              </div>
            ) : (
              recentTasks.map((task) => (
                <article key={task._id} className="py-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <h3 className="font-semibold leading-6 text-gray-950">
                        {task.title}
                      </h3>
                      <p className="mt-1 text-sm text-gray-600">
                        {task.category}
                      </p>
                    </div>

                    <span
                      className={`w-fit shrink-0 rounded-md px-2.5 py-1.5 text-xs font-semibold ${getStatusStyle(
                        task.status
                      )}`}
                    >
                      {formatStatus(task.status)}
                    </span>
                  </div>

                  <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-2 border-t border-gray-100 pt-3">
                    <div>
                      <dt className="text-xs font-medium text-gray-600">
                        Budget
                      </dt>
                      <dd className="mt-1 text-sm font-semibold text-gray-950">
                        ₹{Number(task.budget).toLocaleString("en-IN")}
                      </dd>
                    </div>

                    <div>
                      <dt className="text-xs font-medium text-gray-600">
                        Deadline
                      </dt>
                      <dd className="mt-1 text-sm font-medium text-gray-900">
                        {formatDate(task.deadline)}
                      </dd>
                    </div>
                  </dl>
                </article>
              ))
            )}
          </div>
        </section>

        <section
          aria-labelledby="recent-applications-heading"
          className="min-w-0 rounded-xl border border-gray-200 bg-white p-4 sm:p-5"
        >
          <header className="flex flex-col gap-2 border-b border-gray-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2
                id="recent-applications-heading"
                className="text-lg font-semibold tracking-tight text-gray-950"
              >
                Recent applications
              </h2>
              <p className="mt-1 text-sm leading-5 text-gray-600">
                Freelancers who have applied to your tasks.
              </p>
            </div>

            <Link
              to="/client/applications"
              className="inline-flex min-h-11 w-fit items-center font-semibold text-blue-800 transition-colors hover:text-blue-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
            >
              View all applications →
            </Link>
          </header>

          <div className="divide-y divide-gray-200">
            {loading ? (
              <p
                role="status"
                aria-live="polite"
                className="py-8 text-sm text-gray-600"
              >
                Loading applications...
              </p>
            ) : recentApplications.length === 0 ? (
              <div className="py-8">
                <h3 className="font-semibold text-gray-900">
                  No applications yet
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  Applications from freelancers will appear here.
                </p>
              </div>
            ) : (
              recentApplications.map((application) => (
                <article key={application._id} className="py-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <h3 className="font-semibold leading-6 text-gray-950">
                        {application.freelancer?.name || "Freelancer"}
                      </h3>
                      <p className="mt-1 text-sm text-gray-600">
                        Applied for: {application.task?.title || "Task"}
                      </p>
                    </div>

                    <span
                      className={`w-fit shrink-0 rounded-md px-2.5 py-1.5 text-xs font-semibold ${getStatusStyle(
                        application.status
                      )}`}
                    >
                      {formatStatus(application.status)}
                    </span>
                  </div>

                  <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-2 border-t border-gray-100 pt-3">
                    <div>
                      <dt className="text-xs font-medium text-gray-600">
                        Bid amount
                      </dt>
                      <dd className="mt-1 text-sm font-semibold text-gray-950">
                        ₹{Number(application.bidAmount || 0).toLocaleString("en-IN")}
                      </dd>
                    </div>

                    <div>
                      <dt className="text-xs font-medium text-gray-600">
                        Applied on
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {formatDate(application.createdAt)}
                      </dd>
                    </div>
                  </dl>
                </article>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

export default ClientDashboard;
