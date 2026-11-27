
import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function AdminTasks() {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({});
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [visibility, setVisibility] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedTask, setSelectedTask] = useState(null);
  const [hideTask, setHideTask] = useState(null);
  const [reason, setReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/admin/tasks", {
        params: { search, status, visibility },
      });

      setTasks(response.data.tasks || []);
      setStats(response.data.stats || {});
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load marketplace tasks."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [search, status, visibility]);

  const viewTask = async (taskId) => {
    try {
      const response = await api.get(`/admin/tasks/${taskId}`);
      setSelectedTask(response.data.task);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to load task details.");
    }
  };

  const handleHideTask = async () => {
    if (!reason.trim()) {
      alert("Please provide a reason.");
      return;
    }

    try {
      setActionLoading(true);

      await api.patch(`/admin/tasks/${hideTask._id}/hide`, {
        reason: reason.trim(),
      });

      setHideTask(null);
      setReason("");
      await fetchTasks();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to hide task.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRestoreTask = async (task) => {
    if (!window.confirm(`Restore "${task.title}" to the marketplace?`)) {
      return;
    }

    try {
      setActionLoading(true);

      await api.patch(`/admin/tasks/${task._id}/restore`);

      await fetchTasks();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to restore task.");
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount || 0);

  const statusLabel = {
    open: "Open",
    in_progress: "In Progress",
    completed: "Completed",
    cancelled: "Cancelled",
  };

  const statusStyle = {
    open: "bg-green-50 text-green-700",
    in_progress: "bg-blue-50 text-blue-700",
    completed: "bg-purple-50 text-purple-700",
    cancelled: "bg-gray-100 text-gray-600",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">
          Task Moderation
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Review marketplace listings and manage task visibility.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {[
          ["Total Tasks", stats.totalTasks],
          ["Open Tasks", stats.openTasks],
          ["Active Projects", stats.activeTasks],
          ["Completed", stats.completedTasks],
          ["Hidden Tasks", stats.hiddenTasks],
        ].map(([label, value]) => (
          <div
            key={label}
            className="rounded-xl border border-gray-200 bg-white p-4"
          >
            <p className="text-sm text-gray-500">{label}</p>
            <p className="mt-2 text-2xl font-semibold text-gray-900">
              {value ?? 0}
            </p>
          </div>
        ))}
      </div>

      {/* Search and filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tasks by title, category or description..."
          className="min-w-0 flex-1 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm"
        >
          <option value="all">All Statuses</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <select
          value={visibility}
          onChange={(e) => setVisibility(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm"
        >
          <option value="all">All Visibility</option>
          <option value="visible">Visible</option>
          <option value="hidden">Hidden</option>
        </select>
      </div>

      {/* Task table */}
      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 p-5">
          <h3 className="font-semibold text-gray-900">Marketplace Tasks</h3>
          <p className="mt-1 text-sm text-gray-500">
            Review tasks submitted by registered clients.
          </p>
        </div>

        {loading ? (
          <div className="p-12 text-center text-sm text-gray-500">
            Loading marketplace tasks...
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-sm text-red-600">{error}</p>
            <button
              onClick={fetchTasks}
              className="mt-3 text-sm font-medium text-blue-600"
            >
              Try again
            </button>
          </div>
        ) : tasks.length === 0 ? (
          <div className="p-12 text-center text-sm text-gray-500">
            No tasks found. Try changing your search or filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-left text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Task</th>
                  <th className="px-5 py-3 font-medium">Client</th>
                  <th className="px-5 py-3 font-medium">Budget</th>
                  <th className="px-5 py-3 font-medium">Applications</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Visibility</th>
                  <th className="px-5 py-3 font-medium">Posted</th>
                  <th className="px-5 py-3 font-medium">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {tasks.map((task) => (
                  <tr key={task._id}>
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-900">
                        {task.title}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {task.category}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-800">
                        {task.client?.name || "Unknown"}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {task.client?.email || "—"}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-gray-700">
                      {formatCurrency(task.budget)}
                    </td>

                    <td className="px-5 py-4 text-gray-700">
                      {task.applicationCount ?? 0}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          statusStyle[task.status] || "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {statusLabel[task.status] || task.status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={
                          task.isHidden
                            ? "font-medium text-red-600"
                            : "font-medium text-green-600"
                        }
                      >
                        {task.isHidden ? "Hidden" : "Visible"}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {formatDate(task.createdAt)}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => viewTask(task._id)}
                          className="font-medium text-blue-600 hover:text-blue-800"
                        >
                          View
                        </button>

                        {task.isHidden ? (
                          <button
                            disabled={actionLoading}
                            onClick={() => handleRestoreTask(task)}
                            className="font-medium text-green-600 disabled:opacity-50"
                          >
                            Restore
                          </button>
                        ) : task.status === "open" ? (
                          <button
                            disabled={actionLoading}
                            onClick={() => {
                              setHideTask(task);
                              setReason("");
                            }}
                            className="font-medium text-red-600 disabled:opacity-50"
                          >
                            Hide
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Task details modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div className="my-8 w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Task Details
              </h3>

              <button
                onClick={() => setSelectedTask(null)}
                className="text-2xl text-gray-400 hover:text-gray-700"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="mt-5 space-y-4 text-sm">
              <div>
                <p className="text-gray-500">Task title</p>
                <p className="mt-1 font-semibold text-gray-900">
                  {selectedTask.title}
                </p>
              </div>

              <div>
                <p className="text-gray-500">Description</p>
                <p className="mt-1 whitespace-pre-wrap text-gray-800">
                  {selectedTask.description}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-gray-500">Category</p>
                  <p className="mt-1 text-gray-900">
                    {selectedTask.category}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">Budget</p>
                  <p className="mt-1 text-gray-900">
                    {formatCurrency(selectedTask.budget)}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">Client</p>
                  <p className="mt-1 text-gray-900">
                    {selectedTask.client?.name || "Unknown"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {selectedTask.client?.email}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">Deadline</p>
                  <p className="mt-1 text-gray-900">
                    {formatDate(selectedTask.deadline)}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-gray-500">Deliverables</p>
                <p className="mt-1 whitespace-pre-wrap text-gray-800">
                  {selectedTask.deliverables}
                </p>
              </div>

              <div>
                <p className="text-gray-500">Required skills</p>
                <p className="mt-1 text-gray-800">
                  {selectedTask.skills?.join(", ") || "Not specified"}
                </p>
              </div>

              {selectedTask.isHidden && (
                <div className="rounded-lg bg-red-50 p-3">
                  <p className="font-medium text-red-700">
                    Moderation reason
                  </p>
                  <p className="mt-1 text-sm text-red-600">
                    {selectedTask.moderationReason || "No reason recorded"}
                  </p>
                  <p className="mt-1 text-xs text-red-500">
                    Hidden on {formatDate(selectedTask.moderatedAt)}
                  </p>
                </div>
              )}

              <div>
                <p className="font-semibold text-gray-900">
                  Applications ({selectedTask.applications?.length || 0})
                </p>

                {selectedTask.applications?.length > 0 ? (
                  <div className="mt-3 space-y-3">
                    {selectedTask.applications.map((application) => (
                      <div
                        key={application._id}
                        className="rounded-lg border border-gray-200 p-3"
                      >
                        <p className="font-medium text-gray-900">
                          {application.freelancer?.name || "Freelancer"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {application.freelancer?.email}
                        </p>
                        <p className="mt-2 text-gray-700">
                          Bid: {formatCurrency(application.bidAmount)}
                        </p>
                        <p className="mt-1 text-gray-600">
                          Status: {application.status}
                        </p>
                        <p className="mt-2 whitespace-pre-wrap text-gray-700">
                          {application.proposal}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-gray-500">
                    No applications received yet.
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={() => setSelectedTask(null)}
              className="mt-6 w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Hide task modal */}
      {hideTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900">
              Hide Marketplace Task
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              You are hiding "{hideTask.title}". It will no longer appear in
              the public marketplace.
            </p>

            <label className="mt-5 block text-sm font-medium text-gray-700">
              Reason for hiding
            </label>

            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              maxLength={500}
              placeholder="Explain why this task is being hidden..."
              className="mt-2 w-full rounded-lg border border-gray-200 p-3 text-sm outline-none focus:border-blue-500"
            />

            <p className="mt-1 text-right text-xs text-gray-400">
              {reason.length}/500
            </p>

            <div className="mt-5 flex justify-end gap-3">
              <button
                disabled={actionLoading}
                onClick={() => setHideTask(null)}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm"
              >
                Cancel
              </button>

              <button
                disabled={actionLoading || !reason.trim()}
                onClick={handleHideTask}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
              >
                {actionLoading ? "Processing..." : "Confirm Hide"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
