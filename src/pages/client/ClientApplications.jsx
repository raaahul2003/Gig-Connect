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

  const filteredApplications =
    status === "All"
      ? applications
      : applications.filter(
        (application) =>
          application.status === status.toLowerCase()
      );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Applications
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Review proposals from freelancers for your tasks.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {["All", "Pending", "Accepted", "Rejected"].map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setStatus(item)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${status === item
              ? "bg-blue-600 text-white"
              : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
              }`}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 sm:p-10">
        {actionError && (
          <p className="mb-4 text-sm text-red-500">
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
              No applications yet
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              Freelancer proposals will appear here when someone applies
              to one of your tasks.
            </p>
            <Link
              to="/client/tasks"
              className="mt-5 rounded-lg border border-gray-200 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              View My Tasks
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((application) => (
              <article
                key={application._id}
                className="rounded-lg border border-gray-200 p-5"
              >
                <h2 className="font-semibold text-gray-900">
                  {application.freelancer?.name || "Freelancer"}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {application.task?.title || "Task"}
                </p>
                <p className="mt-3 text-sm text-gray-700">
                  {application.proposal}
                </p>
                <p className="mt-3 text-sm text-gray-600">
                  Proposed price: ₹{application.bidAmount}
                  {" · "}
                  Delivery: {application.deliveryHours} hours
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  Status: {application.status?.charAt(0).toUpperCase() +
                    application.status?.slice(1)}
                </p>
                {application.status === "pending" && (
                  <div className="mt-4 flex gap-3">
                    <button
                      type="button"
                      disabled={updatingId === application._id}
                      onClick={() =>
                        handleApplicationAction(application._id, "accepted")
                      }
                      className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-60"
                    >
                      {updatingId === application._id ? "Processing..." : "Accept"}
                    </button>
                    <button
                      type="button"
                      disabled={updatingId === application._id}
                      onClick={() =>
                        handleApplicationAction(application._id, "rejected")
                      }
                      className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-60"
                    >
                      {updatingId === application._id ? "Processing..." : "Reject"}
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
