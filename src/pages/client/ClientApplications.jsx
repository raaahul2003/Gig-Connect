import { Link } from "react-router-dom";
import { getApplicationsForClient, updateApplicationStatus } from "../../services/applicationService";
import { useEffect, useState } from "react";

export default function ClientApplications() {

  const [applications, setApplications] = useState([]);
  const [updatingId, setUpdatingId] = useState(null);
  const [actionError, setActionError] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("All");
  const [taskFilter, setTaskFilter] = useState("all");
  const [expandedApplicationId, setExpandedApplicationId] = useState(null);

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
    <main className="space-y-6 sm:space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
          Freelancer applications
        </h1>
        <p className="mt-2 max-w-3xl text-base leading-6 text-gray-700">
          Compare each freelancer's proposal, price, and delivery time before
          choosing who will work on your task.
        </p>
        <p className="mt-4 max-w-3xl border-l-2 border-blue-600 pl-3 text-sm leading-6 text-gray-700">
          <span className="font-semibold text-gray-900">Note:</span>{" "}
          accepting a freelancer assigns them to the task and automatically
          declines the other pending applications for that task.
        </p>
      </header>

      <section
        aria-label="Filter applications"
        className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5"
      >
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(260px,360px)] lg:items-end">
          <div className="min-w-0">
            <p className="mb-2 text-sm font-semibold text-gray-900">
              Application status
            </p>
            <nav
              aria-label="Filter applications by status"
              className="grid grid-cols-2 gap-2 sm:grid-cols-4"
            >
              {["All", "Pending", "Accepted", "Rejected"].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setStatus(item)}
                  aria-pressed={status === item}
                  className={`inline-flex min-h-11 min-w-0 items-center justify-between gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 ${
                    status === item
                      ? "border-blue-700 bg-blue-700 text-white"
                      : "border-gray-300 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-900"
                  }`}
                >
                  <span className="truncate">{item}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      status === item
                        ? "bg-white/20 text-white"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {statusCounts[item]}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          <div>
            <label
              htmlFor="application-task-filter"
              className="mb-2 block text-sm font-semibold text-gray-900"
            >
              Filter by task
            </label>
            <div className="relative">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 rotate-90 text-gray-500"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" />
              </svg>
              <select
                id="application-task-filter"
                value={taskFilter}
                onChange={(event) => setTaskFilter(event.target.value)}
                className="min-h-11 w-full appearance-none rounded-lg border border-gray-300 bg-white py-2.5 pl-3 pr-10 text-sm text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
              >
                <option value="all">All tasks ({applications.length})</option>
                {taskOptions.map((task) => (
                  <option key={task.id} value={task.id}>
                    {task.title} ({task.count}{" "}
                    {task.count === 1 ? "application" : "applications"})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {actionError && (
        <p
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-800"
        >
          {actionError}
        </p>
      )}

      <section aria-label="Application results">
        {loading ? (
          <p
            role="status"
            aria-live="polite"
            className="rounded-xl border border-gray-200 bg-white px-5 py-10 text-center text-sm text-gray-600"
          >
            Loading applications...
          </p>
        ) : error ? (
          <p
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-5 py-8 text-center text-sm text-red-800"
          >
            {error}
          </p>
        ) : filteredApplications.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white px-5 py-8 text-center sm:py-10">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-800">
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
                  d="M16 19h6v-1a4 4 0 0 0-6.5-3.1M16 19H8m8 0v-1a4 4 0 0 0-8 0v1m0 0H2v-1a4 4 0 0 1 6.5-3.1M15 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM3 9a2 2 0 1 1 4 0 2 2 0 0 1-4 0Z"
                />
              </svg>
            </div>

            <h2 className="mt-4 text-lg font-semibold text-gray-950">
              {applications.length === 0
                ? "No applications yet"
                : taskFilter !== "all" && status !== "All"
                  ? `No ${status.toLowerCase()} applications for this task`
                  : taskFilter !== "all"
                    ? "No applications for this task"
                    : `No ${status.toLowerCase()} applications`}
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-600">
              {applications.length === 0
                ? "Freelancer proposals will appear here when someone applies to one of your tasks."
                : "Try selecting another task or application status to see more proposals."}
            </p>
            {applications.length === 0 && (
              <Link
                to="/client/tasks"
                className="mt-5 inline-flex min-h-11 items-center justify-center rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-800 transition-colors hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
              >
                View My Tasks
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <header className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold tracking-tight text-gray-950">
                {status === "All" ? "All proposals" : `${status} proposals`}
              </h2>
              <p className="text-sm text-gray-600">
                {filteredApplications.length}{" "}
                {filteredApplications.length === 1
                  ? "application"
                  : "applications"}
              </p>
            </header>

            {filteredApplications.map((application) => {
              const isExpanded = expandedApplicationId === application._id;
              const detailsId = `application-details-${application._id}`;

              return (
                <article
                  key={application._id}
                  className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <h3 className="break-words text-base font-semibold text-gray-950 sm:text-lg">
                        {application.freelancer?.name || "Freelancer"}
                      </h3>
                      {application.freelancer?._id && (
                        <Link
                          to={`/freelancers/${application.freelancer._id}`}
                          className="mt-2 inline-flex min-h-9 items-center text-sm font-semibold text-blue-800 hover:text-blue-900 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                        >
                          View Freelancer Profile →
                        </Link>
                      )}
                      <p className="mt-2 text-sm text-gray-700">
                        Applied for{" "}
                        <span className="font-semibold text-gray-950">
                          {application.task?.title || "Task"}
                        </span>
                      </p>
                    </div>

                    <span
                      className={`inline-flex min-h-9 w-fit shrink-0 items-center rounded-md border px-3 py-1 text-sm font-semibold ${
                        application.status === "pending"
                          ? "border-amber-200 bg-amber-50 text-amber-800"
                          : application.status === "accepted"
                            ? "border-green-200 bg-green-50 text-green-800"
                            : "border-gray-200 bg-gray-100 text-gray-800"
                      }`}
                    >
                      {application.status?.charAt(0).toUpperCase() +
                        application.status?.slice(1)}
                    </span>
                  </div>

                  <dl className="mt-3 grid grid-cols-2 gap-x-5 gap-y-3 border-t border-gray-100 pt-3 sm:max-w-lg">
                    <div>
                      <dt className="text-sm text-gray-600">Proposed price</dt>
                      <dd className="mt-1 text-sm font-semibold text-gray-950">
                        ₹{Number(application.bidAmount).toLocaleString("en-IN")}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-600">
                        Estimated delivery date
                      </dt>
                      <dd className="mt-1 text-sm font-semibold text-gray-950">
                        {application.deliveryDate
                          ? new Date(
                              `${application.deliveryDate.slice(0, 10)}T00:00:00`
                            ).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                          : "Not provided"}
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-2 flex justify-end">
                    <button
                      type="button"
                      aria-expanded={isExpanded}
                      aria-controls={detailsId}
                      onClick={() =>
                        setExpandedApplicationId(
                          isExpanded ? null : application._id
                        )
                      }
                      className="inline-flex min-h-11 items-center rounded-md px-2 text-sm font-semibold text-blue-800 transition-colors hover:bg-blue-50 hover:text-blue-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                    >
                      {isExpanded ? "See less" : "See more"}
                    </button>
                  </div>

                  <div
                    id={detailsId}
                    hidden={!isExpanded}
                    className="mt-3 border-t border-gray-100 pt-4"
                  >
                    <section aria-label="Proposal">
                      <h4 className="text-sm font-semibold text-gray-900">
                        Proposal
                      </h4>
                      <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-6 text-gray-700">
                        {application.proposal}
                      </p>
                    </section>

                    {application.status === "pending" && (
                      <div className="mt-4 flex flex-col gap-2 border-t border-gray-100 pt-4 sm:flex-row">
                        <button
                          type="button"
                          disabled={updatingId === application._id}
                          onClick={() =>
                            handleApplicationAction(application._id, "accepted")
                          }
                          className="inline-flex min-h-11 items-center justify-center rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {updatingId === application._id
                            ? "Processing..."
                            : "Accept freelancer"}
                        </button>
                        <button
                          type="button"
                          disabled={updatingId === application._id}
                          onClick={() =>
                            handleApplicationAction(application._id, "rejected")
                          }
                          className="inline-flex min-h-11 items-center justify-center rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-800 transition-colors hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {updatingId === application._id
                            ? "Processing..."
                            : "Decline proposal"}
                        </button>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
