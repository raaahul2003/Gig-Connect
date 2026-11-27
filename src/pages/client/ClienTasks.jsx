
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteTask, getMyTasks } from "../../services/taskService";
import { toast } from "react-toastify";
import api from "../../api/axios";

export default function ClientTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);
  const [statusFilter, setStatusFilter] = useState("all");
  const [deletingTaskId, setDeletingTaskId] = useState(null);

  const [selectedTask, setSelectedTask] = useState(null);
  const [disputeCategory, setDisputeCategory] = useState(
    "freelancer_not_delivering"
  );
  const [disputeDescription, setDisputeDescription] = useState("");
  const [disputeEvidence, setDisputeEvidence] = useState("");
  const [submittingDispute, setSubmittingDispute] = useState(false);

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
        return "bg-green-50 text-green-800 ring-1 ring-inset ring-green-200";
      case "in_progress":
        return "bg-blue-50 text-blue-800 ring-1 ring-inset ring-blue-200";
      case "completed":
        return "bg-violet-50 text-violet-800 ring-1 ring-inset ring-violet-200";
      case "cancelled":
        return "bg-red-50 text-red-800 ring-1 ring-inset ring-red-200";
      default:
        return "bg-gray-100 text-gray-800 ring-1 ring-inset ring-gray-200";
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

  const handleRaiseDispute = async (event) => {
    event.preventDefault();

    if (!selectedTask || !disputeDescription.trim()) {
      toast.error("Please provide a dispute description.");
      return;
    }

    try {
      setSubmittingDispute(true);

      await api.post("/disputes", {
        taskId: selectedTask._id,
        category: disputeCategory,
        description: disputeDescription.trim(),
        evidence: disputeEvidence.trim(),
      });

      toast.success("Dispute submitted successfully!");

      setSelectedTask(null);
      setDisputeDescription("");
      setDisputeEvidence("");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Failed to submit dispute."
      );
    } finally {
      setSubmittingDispute(false);
    }
  };

  return (
    <main className="space-y-6 sm:space-y-8">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
            My Tasks
          </h1>
          <p className="mt-2 text-base leading-6 text-gray-700">
            Manage the tasks you've posted on GigConnect.
          </p>
        </div>
      </header>

      <section
        aria-label="Task totals"
        className="grid grid-cols-3 gap-2 sm:gap-4"
      >
        {metrics.map((item) => (
          <article
            key={item.label}
            className="min-w-0 rounded-xl border border-gray-200 bg-white p-3 sm:p-5"
          >
            <p className="text-xs font-medium leading-5 text-gray-700 sm:text-sm">
              {item.label}
            </p>
            <p className="mt-1 text-xl font-bold tracking-tight text-gray-950 sm:mt-2 sm:text-2xl">
              {item.value}
            </p>
          </article>
        ))}
      </section>

      <section aria-label="Posted tasks" className="space-y-4">
        {loading ? (
          <div
            role="status"
            aria-live="polite"
            className="rounded-xl border border-gray-200 bg-white px-5 py-10 text-center text-sm text-gray-600"
          >
            Loading your tasks...
          </div>
        ) : error ? (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-5 py-8 text-center"
          >
            <p className="text-sm leading-6 text-red-800">{error}</p>
            <button
              type="button"
              onClick={() => setReload((prev) => prev + 1)}
              className="mt-4 inline-flex min-h-11 items-center justify-center rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
            >
              Try Again
            </button>
          </div>
        ) : tasks.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white px-5 py-10 text-center sm:py-12">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
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
                  d="M8 7h8M8 11h8M8 15h5M6 3h9l4 4v14H6V3Z"
                />
              </svg>
            </div>

            <h2 className="mt-4 text-lg font-semibold text-gray-950">
              No tasks posted yet
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-600">
              Your posted tasks will appear here. Create your first task
              to start receiving freelancer applications.
            </p>
            <Link
              to="/post-task"
              className="mt-5 inline-flex min-h-11 items-center justify-center rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
            >
              Post Your First Task
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <header className="flex flex-col gap-3 border-b border-gray-200 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div>
                <h2
                  id="posted-tasks-heading"
                  className="text-lg font-semibold tracking-tight text-gray-950"
                >
                  Your posted tasks
                </h2>
                <p className="mt-1 text-sm text-gray-600" aria-live="polite">
                  Showing {filteredTasks.length} of {totalTasks} tasks
                </p>
              </div>

              <nav
                aria-label="Filter tasks by status"
                className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap xl:justify-end"
              >
                {statusFilters.map((filter) => {
                  const isActive = statusFilter === filter.value;

                  return (
                    <button
                      key={filter.value}
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => setStatusFilter(filter.value)}
                      className={`inline-flex min-h-11 min-w-0 items-center justify-between gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 sm:justify-center sm:px-4 ${
                        isActive
                          ? "border-blue-700 bg-blue-700 text-white"
                          : "border-gray-300 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-900"
                      }`}
                    >
                      <span className="truncate">{filter.label}</span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {filter.count}
                      </span>
                    </button>
                  );
                })}
              </nav>
            </header>

            <div className="space-y-4 bg-gray-50/70 p-4 sm:p-5">
              {filteredTasks.length === 0 ? (
                <p className="rounded-xl border border-dashed border-gray-300 bg-white px-4 py-8 text-center text-sm text-gray-700">
                  No tasks found with this status.
                </p>
              ) : (
                filteredTasks.map((task) => (
                  <article
                    key={task._id}
                    className="min-w-0 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5"
                  >
                    <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <h3 className="break-words text-base font-semibold leading-6 text-gray-950 sm:text-lg">
                          {task.title}
                        </h3>
                        <p className="mt-1 text-sm text-gray-600">
                          {task.category}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                        <span
                          className={`w-fit rounded-md px-2.5 py-1.5 text-xs font-semibold ${getStatusStyle(
                            task.status
                          )}`}
                        >
                          {formatStatus(task.status)}
                        </span>
                        {task.isUrgent && (
                          <span className="w-fit rounded-md bg-orange-50 px-2.5 py-1.5 text-xs font-semibold text-orange-800 ring-1 ring-inset ring-orange-200">
                            Urgent Task
                          </span>
                        )}
                      </div>
                    </header>

                    {task.description && (
                      <p className="mt-4 text-sm leading-6 text-gray-700">
                        {task.description}
                      </p>
                    )}

                    <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4 border-t border-gray-100 pt-4 sm:grid-cols-4 sm:gap-x-5">
                      <div className="min-w-0">
                        <dt className="text-xs font-medium text-gray-600">
                          Budget
                        </dt>
                        <dd className="mt-1 break-words text-sm font-semibold text-gray-950">
                          {Number(task.budget).toLocaleString("en-IN")}
                        </dd>
                      </div>

                      <div className="min-w-0">
                        <dt className="text-xs font-medium text-gray-600">
                          Deadline
                        </dt>
                        <dd className="mt-1 text-sm font-medium text-gray-900">
                          {formatDate(task.deadline)}
                        </dd>
                      </div>

                      <div className="min-w-0">
                        <dt className="text-xs font-medium text-gray-600">
                          Applications received
                        </dt>
                        <dd className="mt-1 text-sm font-semibold text-blue-800">
                          {task.applicationCount ?? 0}
                        </dd>
                      </div>

                      <div className="min-w-0">
                        <dt className="text-xs font-medium text-gray-600">
                          Posted on
                        </dt>
                        <dd className="mt-1 text-sm font-medium text-gray-900">
                          {formatDate(task.createdAt)}
                        </dd>
                      </div>
                    </dl>

                    {(task.status === "in_progress" ||
                      task.status === "completed" ||
                      task.status === "open") && (
                      <div className="mt-4 flex flex-wrap justify-end gap-2 border-t border-gray-100 pt-4">
                        {(task.status === "in_progress" ||
                          task.status === "completed") && (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedTask(task);
                              setDisputeCategory("freelancer_not_delivering");
                              setDisputeDescription("");
                              setDisputeEvidence("");
                            }}
                            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-800 transition-colors hover:bg-red-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
                          >
                            Raise a Dispute
                          </button>
                        )}

                        {task.status === "open" && (
                          <button
                            type="button"
                            onClick={() => handleDeleteTask(task)}
                            disabled={deletingTaskId === task._id}
                            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-800 transition-colors hover:bg-red-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {deletingTaskId === task._id
                              ? "Deleting..."
                              : "Delete Task"}
                          </button>
                        )}
                      </div>
                    )}
                  </article>
                ))
              )}
            </div>
          </div>
        )}
      </section>

      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-gray-950/60 p-4 sm:p-6">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="dispute-dialog-title"
            aria-describedby="dispute-dialog-description"
            className="my-6 w-full max-w-lg rounded-2xl border border-gray-200 bg-white shadow-xl"
          >
            <div className="flex items-start justify-between gap-4 border-b border-gray-200 p-5">
              <div>
                <h2
                  id="dispute-dialog-title"
                  className="text-lg font-semibold text-gray-950"
                >
                  Raise a Dispute
                </h2>
                <p
                  id="dispute-dialog-description"
                  className="mt-1 text-sm leading-5 text-gray-600"
                >
                  {selectedTask.title}
                </p>
              </div>

              <button
                type="button"
                disabled={submittingDispute}
                onClick={() => setSelectedTask(null)}
                aria-label="Close dispute form"
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-gray-700 transition-colors hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>

            <form onSubmit={handleRaiseDispute} className="space-y-4 p-5">
              <div>
                <label
                  htmlFor="dispute-category"
                  className="mb-2 block text-sm font-medium text-gray-800"
                >
                  Reason for dispute
                </label>

                <select
                  id="dispute-category"
                  value={disputeCategory}
                  onChange={(e) => setDisputeCategory(e.target.value)}
                  className="min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                >
                  <option value="freelancer_not_delivering">
                    Freelancer not delivering work
                  </option>
                  <option value="poor_quality_work">
                    Poor quality or incomplete work
                  </option>
                  <option value="scope_change">
                    Changes to agreed scope
                  </option>
                  <option value="other">
                    Other issue
                  </option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="dispute-description"
                  className="mb-2 block text-sm font-medium text-gray-800"
                >
                  Explain the issue
                </label>

                <textarea
                  id="dispute-description"
                  required
                  maxLength={3000}
                  rows={4}
                  value={disputeDescription}
                  onChange={(e) => setDisputeDescription(e.target.value)}
                  placeholder="Explain what happened..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-3 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                />
              </div>

              <div>
                <label
                  htmlFor="dispute-evidence"
                  className="mb-2 block text-sm font-medium text-gray-800"
                >
                  Evidence or additional information
                </label>

                <textarea
                  id="dispute-evidence"
                  maxLength={3000}
                  rows={3}
                  value={disputeEvidence}
                  onChange={(e) => setDisputeEvidence(e.target.value)}
                  placeholder="Add any relevant details..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-3 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                />
              </div>

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  disabled={submittingDispute}
                  onClick={() => setSelectedTask(null)}
                  className="inline-flex min-h-11 items-center justify-center rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-800 transition-colors hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submittingDispute}
                  className="inline-flex min-h-11 items-center justify-center rounded-lg bg-red-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submittingDispute
                    ? "Submitting..."
                    : "Submit Dispute"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
