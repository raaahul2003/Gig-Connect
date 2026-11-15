
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyTasks } from "../../services/taskService";

export default function ClientTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);

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
            "Failed to load your tasks."
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
  }, [reload]);

  const totalTasks = tasks.length;
  const inProgressTasks = tasks.filter(
    (task) => task.status === "in_progress"
  ).length;
  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  ).length;

  const metrics = [
    { label: "Total Tasks", value: totalTasks },
    { label: "In Progress", value: inProgressTasks },
    { label: "Completed", value: completedTasks },
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
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            My Tasks
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage the tasks you've posted on GigConnect.
          </p>
        </div>

        {/* <Link
          to="/post-task"
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          + Post a Task
        </Link> */}
      </div>

      {/* Task Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {metrics.map((item) => (
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

      {/* Tasks List */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 sm:p-10">

        {/* Loading */}
        {loading ? (
          <div className="py-12 text-center text-sm text-gray-500">
            Loading your tasks...
          </div>

        ) : error ? (
          /* Error */
          <div className="py-10 text-center">
            <p className="text-sm text-red-600">{error}</p>

            <button
              onClick={() => setReload((prev) => prev + 1)}
              className="mt-4 rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>

        ) : tasks.length === 0 ? (
          /* Empty State */
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
          /* Task Cards */
          <div className="space-y-4">
            {tasks.map((task) => (
              <div
                key={task._id}
                className="rounded-xl border border-gray-200 p-5 transition hover:shadow-sm"
              >
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {task.title}
                    </h2>

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

                {task.description && (
                  <p className="mt-3 text-sm leading-6 text-gray-600">
                    {task.description}
                  </p>
                )}

                <div className="mt-4 grid grid-cols-1 gap-3 border-t border-gray-100 pt-4 sm:grid-cols-3">
                  <div>
                    <p className="text-xs text-gray-500">Budget</p>
                    <p className="mt-1 text-sm font-semibold text-gray-900">
                      {Number(task.budget).toLocaleString("en-IN")}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Deadline</p>
                    <p className="mt-1 text-sm font-medium text-gray-900">
                      {formatDate(task.deadline)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Posted On</p>
                    <p className="mt-1 text-sm font-medium text-gray-900">
                      {formatDate(task.createdAt)}
                    </p>
                  </div>
                </div>

                {task.isUrgent && (
                  <span className="mt-4 inline-block rounded-md bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700">
                    Urgent Task
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
