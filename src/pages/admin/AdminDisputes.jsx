
import { useState } from "react";

export default function AdminDisputes() {
  // Disputes will be loaded from the backend later.
  const [disputes] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  const filteredDisputes = disputes.filter((dispute) => {
    const query = search.trim().toLowerCase();

    const matchesSearch = [
      dispute.taskTitle,
      dispute.clientName,
      dispute.freelancerName,
    ].some((value) => value.toLowerCase().includes(query));

    const matchesStatus =
      status === "All" || dispute.status === status;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">
          Dispute Management
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Review and manage disputes raised on GigConnect.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search task or participant..."
          aria-label="Search disputes"
          className="min-w-0 flex-1 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
        />

        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          aria-label="Filter disputes by status"
          className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none focus:border-blue-500"
        >
          <option value="All">All Statuses</option>
          <option value="Open">Open</option>
          <option value="Under Review">Under Review</option>
          <option value="Resolved">Resolved</option>
        </select>
      </div>

      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-100 p-5">
          <h3 className="font-semibold text-gray-900">Reported Disputes</h3>
          <p className="mt-1 text-sm text-gray-500">
            Cases requiring review or resolution.
          </p>
        </div>

        {filteredDisputes.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
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
                  d="M12 9v4m0 4h.01M10.3 3.9 2.8 17a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3l-7.5-13.1a2 2 0 0 0-3.4 0Z"
                />
              </svg>
            </div>

            <h3 className="mt-4 font-semibold text-gray-900">
              No disputes found
            </h3>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">
              {search || status !== "All"
                ? "Try changing your search or status filter."
                : "Reported disputes will appear here when connected to the backend."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Task</th>
                  <th className="px-5 py-3 font-medium">Client</th>
                  <th className="px-5 py-3 font-medium">Freelancer</th>
                  <th className="px-5 py-3 font-medium">Reason</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredDisputes.map((dispute) => (
                  <tr key={dispute.id}>
                    <td className="px-5 py-4 font-medium text-gray-900">
                      {dispute.taskTitle}
                    </td>
                    <td className="px-5 py-4 text-gray-600">
                      {dispute.clientName}
                    </td>
                    <td className="px-5 py-4 text-gray-600">
                      {dispute.freelancerName}
                    </td>
                    <td className="px-5 py-4 text-gray-600">
                      {dispute.reason}
                    </td>
                    <td className="px-5 py-4 text-gray-600">
                      {dispute.status}
                    </td>
                    <td className="px-5 py-4">
                      <button
                        type="button"
                        disabled
                        className="font-medium text-blue-600 opacity-60"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
