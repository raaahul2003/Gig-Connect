
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteTask, getMyTasks } from "../../services/taskService";
import { toast } from "react-toastify";

export default function ClientTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);
  const [statusFilter, setStatusFilter] = useState("all");
  const [deletingTaskId, setDeletingTaskId] = useState(null);

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
  const openTasks = tasks.filter(
    (task) => task.status === "open"
  ).length;
  const inProgressTasks = tasks.filter(
    (task) => task.status === "in_progress"
  ).length;
  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  ).length;
  const filteredTasks = tasks.filter(
    (task) => statusFilter === "all" || task.status === statusFilter
  );

  const metrics = [
    { label: "Total Tasks", value: totalTasks },
    { label: "In Progress", value: inProgressTasks },
    { label: "Completed", value: completedTasks },
  ];

  const statusFilters = [
    { label: "All tasks", value: "all", count: totalTasks },
    { label: "Open", value: "open", count: openTasks },
    { label: "In Progress", value: "in_progress", count: inProgressTasks },
    { label: "Completed", value: "completed", count: completedTasks },
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

  const handleDeleteTask = async (task) => {
    if (task.status !== "open") {
      toast.error("Only open tasks can be deleted.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${task.title}"?`
    );

    if (!confirmed) return;

    try {
      setDeletingTaskId(task._id);

      await deleteTask(task._id);

      setTasks((current) =>
        current.filter((item) => item._id !== task._id)
      );

      toast.success("Task deleted successfully!");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete task."
      );
    } finally {
      setDeletingTaskId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">
            My Tasks
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage the tasks you've posted on GigConnect.
          </p>
        </div>

        {/* <Link
          to="/post-task"
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition-colors"
        >
          + Post a Task
        </Link> */}
      </div>

      {/* Task Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {metrics.map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow p-5"
          >
            <p className="text-sm text-gray-500">{item.label}</p>
            <p className="mt-2 text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* Tasks List */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow p-6 sm:p-10">

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
              className="mt-5 rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition-colors"
            >
              Post Your First Task
            </Link>
          </div>

        ) : (
          /* Task Cards */
          <div className="space-y-5">
            <div className="flex flex-col gap-3 border-b border-gray-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-base font-semibold text-gray-900">
                  Your posted tasks
                </h2>
                <p className="mt-1 text-sm text-gray-500" aria-live="polite">
                  Showing {filteredTasks.length} of {totalTasks} tasks
                </p>
              </div>

              <nav
                aria-label="Filter tasks by status"
                className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap"
              >
                {statusFilters.map((filter) => {
                  const isActive = statusFilter === filter.value;

                  return (
                    <button
                      key={filter.value}
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => setStatusFilter(filter.value)}
                      className={`inline-flex min-w-0 items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 sm:justify-center sm:px-4 ${isActive
                        ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                        : "border-gray-200 bg-white text-gray-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                        }`}
                    >
                      <span className="truncate">{filter.label}</span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs ${isActive
                          ? "bg-white/20 text-white"
                          : "bg-gray-100 text-gray-500"
                          }`}
                      >
                        {filter.count}
                      </span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {filteredTasks.length === 0 ? (
              <p className="rounded-lg border border-dashed border-gray-200 px-4 py-8 text-center text-sm text-gray-500">
                No tasks found with this status.
              </p>
            ) : filteredTasks.map((task) => (
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
                <div className="mt-5 flex justify-end border-t border-gray-100 pt-4">
                  <button
                    type="button"
                    onClick={() => handleDeleteTask(task)}
                    disabled={deletingTaskId === task._id}
                    className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {deletingTaskId === task._id ? "Deleting..." : "Delete Task"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
