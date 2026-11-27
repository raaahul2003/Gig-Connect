import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyApplications } from "../../services/applicationService";

const statusStyles = {
  pending: "border-amber-200 bg-amber-50 text-amber-900",
  accepted: "border-green-200 bg-green-50 text-green-900",
  rejected: "border-red-200 bg-red-50 text-red-900",
};

function formatDeliveryDate(value) {
  if (typeof value !== "string") return "Date unavailable";

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  if (
    Number.isNaN(date.getTime()) ||
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return "Date unavailable";
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function MyApplications() {

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  useEffect(() => {

    const fetchApplications = async () => {
      try {
        setApplications(await getMyApplications());
      } catch (err) {
        setError(
          err.response?.data?.message || "Could not load your applications."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const filteredApplications =
    statusFilter === "all"
      ? applications
      : applications.filter(
          (application) => (application.status || "pending") === statusFilter
        );

  return (
    <main className="mx-auto w-full max-w-5xl">
      <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
        <div>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
            My Applications
          </h1>
          <p className="mt-2 max-w-xl text-base leading-6 text-gray-700">
            Track the status of tasks you've applied for.
          </p>
        </div>
        <Link
          to="/browse"
          className="inline-flex min-h-11 items-center justify-center rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
        >
          Find tasks
        </Link>
      </header>
      <section
        aria-labelledby="application-history-heading"
        className="mt-8 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
      >
        <div className="flex flex-col gap-4 border-b border-gray-200 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <h2
            id="application-history-heading"
            className="text-lg font-bold tracking-tight text-gray-950 sm:text-xl"
          >
            Application history
          </h2>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
            {applications.length > 0 && !loading && !error && (
              <label className="flex items-center justify-between gap-3 text-sm font-medium text-gray-800 sm:justify-start">
                Filter status
                <span className="relative">
                  <select
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value)}
                    className="min-h-11 appearance-none rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm text-gray-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="all">All statuses</option>
                    <option value="pending">Pending</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <svg
                    aria-hidden="true"
                    className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-600"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      d="m5 7.5 5 5 5-5"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </label>
            )}
            <span
              className="text-sm font-medium text-gray-700"
              aria-live="polite"
            >
              {statusFilter === "all"
                ? `${applications.length} ${
                    applications.length === 1 ? "application" : "applications"
                  }`
                : `${filteredApplications.length} of ${applications.length} ${
                    applications.length === 1 ? "application" : "applications"
                  }`}
            </span>
          </div>
        </div>
        {loading ? (
          <p role="status" className="p-8 text-center text-sm text-gray-700">
            Loading applications...
          </p>
        ) : error ? (
          <p role="alert" className="p-6 text-center text-sm leading-6 text-red-800">
            {error}
          </p>
        ) : applications.length === 0 ? (
          <div className="px-5 py-12 text-center sm:px-6">
            <h3 className="font-semibold text-gray-950">No applications yet</h3>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-700">
              When you apply for a task, its status and details will appear here.
            </p>
            <Link
              to="/browse"
              className="mt-4 inline-flex min-h-11 items-center rounded-sm font-semibold text-blue-700 transition-colors hover:text-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
            >
              Explore available tasks →
            </Link>
          </div>
        ) : (
          filteredApplications.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-gray-700">
              No applications with this status.
            </p>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredApplications.map((application) => (
                <article
                  key={application._id}
                  className="px-5 py-5 sm:px-6 sm:py-6"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <h3 className="break-words text-base font-semibold text-gray-950 sm:text-lg">
                        {application.task?.title || "Task"}
                      </h3>
                      <p className="mt-1.5 text-sm text-gray-700">
                        Client:{" "}
                        {application.task?.client?._id ? (
                          <Link
                            to={`/clients/${application.task.client._id}`}
                            className="font-semibold text-blue-700 hover:text-blue-800 hover:underline focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                          >
                            {application.task.client.clientType === "company"
                              ? application.task.client.clientProfile?.companyName ||
                                application.task.client.name
                              : application.task.client.name}
                          </Link>
                        ) : (
                          <span className="font-medium text-gray-700">
                            Client information unavailable
                          </span>
                        )}
                      </p>
                      <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-3 text-sm">
                        <div>
                          <dt className="text-gray-600">Your offer</dt>
                          <dd className="mt-0.5 text-base font-semibold text-gray-950">
                            ₹{Number(application.bidAmount).toLocaleString("en-IN")}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-gray-600">Delivery date</dt>
                          <dd className="mt-0.5 text-base font-semibold text-gray-950">
                            {formatDeliveryDate(application.deliveryDate)}
                          </dd>
                        </div>
                      </dl>
                    </div>
                    <span
                      className={`inline-flex min-h-9 w-fit shrink-0 items-center rounded-md border px-3 py-1 text-sm font-semibold capitalize ${
                        statusStyles[application.status] ||
                        "border-gray-200 bg-gray-100 text-gray-800"
                      }`}
                    >
                      {application.status || "pending"}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )
        )}
      </section>
    </main>
  );
}
export default MyApplications;