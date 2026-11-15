
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyTasks } from "../../services/taskService";

function ClientDashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchTasks = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getMyTasks();

        if (isMounted) {
          setTasks(data);
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

    fetchTasks();

    return () => {
      isMounted = false;
    };
  }, []);

  const activeTasks = tasks.filter(
    (task) => task.status === "open"
  ).length;

  const workInProgress = tasks.filter(
    (task) => task.status === "in_progress"
  ).length;

  const totalBudget = tasks.reduce(
    (total, task) => total + (Number(task.budget) || 0),
    0
  );

  const recentTasks = tasks.slice(0, 3);

  const metrics = [
    { label: "Active Tasks", value: activeTasks },
    { label: "Applications Received", value: "—" },
    { label: "Work in Progress", value: workInProgress },
    {
      label: "Total Budget",
      value: `₹${totalBudget.toLocaleString("en-IN")}`,
    },
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-700";
      case "in_progress":
        return "bg-blue-100 text-blue-700";
      case "completed":
        return "bg-purple-100 text-purple-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatStatus = (status) => {
    return status
      ? status.replace("_", " ").replace(/\b\w/g, (char) =>
          char.toUpperCase()
        )
      : "Unknown";
  };

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
    <main>
      {/* Dashboard Header */}
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

        {/* <Link
          to="/post-task"
          className="inline-flex justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
        >
          + Create a task
        </Link> */}
      </div>

      {/* Dashboard Metrics */}
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
              {loading ? "..." : error ? "—" : metric.value}
            </p>

            <p className="mt-2 text-xs text-gray-400">
              {metric.label === "Applications Received"
                ? "Application tracking will be connected next"
                : "Based on your posted tasks"}
            </p>
          </article>
        ))}
      </section>

      {/* Recent Tasks */}
      <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Your recent tasks
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Your latest posted tasks and their progress.
            </p>
          </div>

          <Link
            to="/client/tasks"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            View all tasks →
          </Link>
        </div>

        <div className="mt-6">
          {loading ? (
            <div className="py-10 text-center text-sm text-gray-500">
              Loading your dashboard...
            </div>
          ) : error ? (
            <div className="py-10 text-center">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          ) : recentTasks.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 px-5 py-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                <span aria-hidden="true" className="text-xl text-gray-500">
                  +
                </span>
              </div>

              <h4 className="mt-4 font-semibold text-gray-900">
                No tasks to display
              </h4>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">
                Your posted tasks and their progress will appear here once
                they're available from the database.
              </p>

              <Link
                to="/post-task"
                className="mt-5 inline-flex font-semibold text-blue-600 hover:text-blue-700"
              >
                Post your first task
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentTasks.map((task) => (
                <article
                  key={task._id}
                  className="rounded-xl border border-gray-200 p-5"
                >
                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {task.title}
                      </h4>

                      <p className="mt-1 text-sm text-gray-500">
                        {task.category}
                      </p>
                    </div>

                    <span
                      className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(
                        task.status
                      )}`}
                    >
                      {formatStatus(task.status)}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-x-8 gap-y-3 border-t border-gray-100 pt-4">
                    <div>
                      <p className="text-xs text-gray-500">Budget</p>
                      <p className="mt-1 text-sm font-semibold text-gray-900">
                        ₹{Number(task.budget).toLocaleString("en-IN")}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">Deadline</p>
                      <p className="mt-1 text-sm font-medium text-gray-900">
                        {formatDate(task.deadline)}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default ClientDashboard;
