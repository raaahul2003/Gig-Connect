import React from "react";
import { Link } from "react-router-dom";
import { getApplicationsForClient, updateApplicationStatus } from "../../services/applicationService";
import { useEffect } from "react";
import { useState } from "react";

export default function ClientApplications() {

  const [applications, setApplications] = useState([]);
  const [updatingId, setUpdatingId] = useState(null);
  const [actionError, setActionError] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("All");
  const [taskFilter, setTaskFilter] = useState("all");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getApplicationsForClient();
        setApplications(data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
          err.message ||
          "Failed to load applications."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const handleApplicationAction = async (applicationId, newStatus) => {
  try {
    setUpdatingId(applicationId);
    setActionError("");

    await updateApplicationStatus(applicationId, newStatus);

    const selectedApplication = applications.find(
      (application) => application._id === applicationId
    );

    setApplications((prevApplications) =>
      prevApplications.map((application) => {
        // Update the selected application
        if (application._id === applicationId) {
          return { ...application, status: newStatus };
        }

        // Reject other pending applications for the same task
        if (
          newStatus === "accepted" &&
          String(application.task?._id) ===
            String(selectedApplication?.task?._id) &&
          application.status === "pending"
        ) {
          return { ...application, status: "rejected" };
        }

        return application;
      })
    );
  } catch (err) {
    setActionError(
      err.response?.data?.message ||
      err.message ||
      "Failed to update application."
    );
  } finally {
    setUpdatingId(null);
  }
};

  const taskOptions = applications.reduce((tasks, application) => {
    const taskId = String(application.task?._id || "");

    if (!taskId) return tasks;

    const existingTask = tasks.find((task) => task.id === taskId);

    if (existingTask) {
      existingTask.count += 1;
    } else {
      tasks.push({
        id: taskId,
        title: application.task?.title || "Task",
        count: 1,
      });
    }

    return tasks;
  }, []);

  const taskFilteredApplications =
    taskFilter === "all"
      ? applications
      : applications.filter(
          (application) => String(application.task?._id) === taskFilter
        );

  const statusCounts = {
    All: taskFilteredApplications.length,
    Pending: taskFilteredApplications.filter((application) => application.status === "pending").length,
    Accepted: taskFilteredApplications.filter((application) => application.status === "accepted").length,
    Rejected: taskFilteredApplications.filter((application) => application.status === "rejected").length,
  };
  const filteredApplications =
    status === "All"
      ? taskFilteredApplications
      : taskFilteredApplications.filter(
          (application) => application.status === status.toLowerCase()
        );

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-white to-blue-50/60 p-5 sm:p-6">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">
          Hiring workspace
        </p>
        <h1 className="mt-2 text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">
          Freelancer applications
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-600">
          Compare each freelancer's proposal, price, and delivery time before
          choosing who will work on your task.
        </p>
        <p className="mt-4 rounded-xl border border-blue-100 bg-white/80 px-4 py-3 text-sm leading-6 text-gray-600">
          <span className="font-semibold text-gray-800">Good to know:</span>{" "}
          accepting a freelancer assigns them to the task and automatically
          declines the other pending applications for that task.
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1" aria-label="Filter applications by status">
        {["All", "Pending", "Accepted", "Rejected"].map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setStatus(item)}
            aria-pressed={status === item}
            className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
              status === item
                ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                : "border-gray-200 bg-white text-gray-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            }`}
          >
            {item}
            <span
              className={`rounded-full px-2 py-0.5 text-xs ${
                status === item
                  ? "bg-white/20 text-white"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {statusCounts[item]}
            </span>
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="sm:max-w-sm">
            <h2 className="text-sm font-semibold text-gray-900">
              Filter by task
            </h2>
            <p className="mt-1 text-xs text-gray-500">
              Select one of your tasks to see its freelancer applications.
            </p>
          </div>
          <label className="relative block w-full sm:max-w-md">
            <span className="sr-only">Filter applications by task</span>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 rotate-90 text-gray-400"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" />
            </svg>
            <select
              value={taskFilter}
              onChange={(event) => setTaskFilter(event.target.value)}
              className="min-h-11 w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-4 pr-10 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            >
              <option value="all">All tasks ({applications.length})</option>
              {taskOptions.map((task) => (
                <option key={task.id} value={task.id}>
                  {task.title} ({task.count}{" "}
                  {task.count === 1 ? "application" : "applications"})
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow p-6 sm:p-10">
        {actionError && (
          <p role="alert" className="mb-4 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
            {actionError}
          </p>
        )}
        {loading ? (
          <p className="py-8 text-center text-gray-500">
            Loading applications...
          </p>
        ) : error ? (
          <p className="py-8 text-center text-red-500">
            {error}
          </p>
        ) : filteredApplications.length === 0 ? (
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
                  d="M16 19h6v-1a4 4 0 0 0-6.5-3.1M16 19H8m8 0v-1a4 4 0 0 0-8 0v1m0 0H2v-1a4 4 0 0 1 6.5-3.1M15 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM3 9a2 2 0 1 1 4 0 2 2 0 0 1-4 0Z"
                />
              </svg>
            </div>

            <h2 className="mt-4 text-lg font-semibold text-gray-900">
              {applications.length === 0
                ? "No applications yet"
                : taskFilter !== "all" && status !== "All"
                  ? `No ${status.toLowerCase()} applications for this task`
                  : taskFilter !== "all"
                    ? "No applications for this task"
                    : `No ${status.toLowerCase()} applications`}
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              {applications.length === 0
                ? "Freelancer proposals will appear here when someone applies to one of your tasks."
                : "Try selecting another task or application status to see more proposals."}
            </p>
            {applications.length === 0 && (
              <Link
                to="/client/tasks"
                className="mt-5 rounded-lg border border-gray-200 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition-colors"
              >
                View My Tasks
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3 border-b border-gray-100 pb-4">
              <div>
                <h2 className="font-semibold text-gray-900">
                  {status === "All" ? "All proposals" : `${status} proposals`}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {filteredApplications.length}{" "}
                  {filteredApplications.length === 1 ? "application" : "applications"}
                </p>
              </div>
            </div>

            {filteredApplications.map((application) => (
              <article
                key={application._id}
                className="rounded-2xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-sm sm:p-6"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Freelancer
                    </p>
                    <h3 className="mt-1 break-words text-base font-semibold text-gray-900 sm:text-lg">
                      {application.freelancer?.name || "Freelancer"}
                    </h3>
                    <p className="mt-2 text-sm text-gray-600">
                      Applied for{" "}
                      <span className="font-medium text-gray-900">
                        {application.task?.title || "Task"}
                      </span>
                    </p>
                  </div>
                  <span
                    className={`w-fit shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${
                      application.status === "pending"
                        ? "bg-amber-50 text-amber-700"
                        : application.status === "accepted"
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {application.status?.charAt(0).toUpperCase() +
                      application.status?.slice(1)}
                  </span>
                </div>

                <div className="mt-5 rounded-xl bg-gray-50 p-4 sm:p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Proposal
                  </p>
                  <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-7 text-gray-700">
                    {application.proposal}
                  </p>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 sm:max-w-md">
                  <div className="rounded-xl border border-gray-100 px-4 py-3">
                    <p className="text-xs text-gray-500">Proposed price</p>
                    <p className="mt-1 text-sm font-semibold text-gray-900">
                      ₹{Number(application.bidAmount).toLocaleString("en-IN")}
                    </p>
                  </div>
                  <div className="rounded-xl border border-gray-100 px-4 py-3">
                    <p className="text-xs text-gray-500">Delivery time</p>
                    <p className="mt-1 text-sm font-semibold text-gray-900">
                      {application.deliveryHours} hours
                    </p>
                  </div>
                </div>

                {application.status === "pending" && (
                  <div className="mt-5 flex flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row">
                    <button
                      type="button"
                      disabled={updatingId === application._id}
                      onClick={() =>
                        handleApplicationAction(application._id, "accepted")
                      }
                      className="min-h-11 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {updatingId === application._id ? "Processing..." : "Accept freelancer"}
                    </button>
                    <button
                      type="button"
                      disabled={updatingId === application._id}
                      onClick={() =>
                        handleApplicationAction(application._id, "rejected")
                      }
                      className="min-h-11 rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {updatingId === application._id ? "Processing..." : "Decline proposal"}
                    </button>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
