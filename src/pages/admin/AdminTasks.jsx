
import { useState } from "react";

export default function AdminTasks() {
  // Real marketplace tasks will come from the backend later.
  const [tasks] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(search.trim().toLowerCase());

    const matchesStatus =
      status === "All" || task.status === status;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">
          Task Moderation
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Review marketplace listings and manage task visibility.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search tasks by title..."
          aria-label="Search tasks"
          className="min-w-0 flex-1 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
        />

        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          aria-label="Filter tasks by status"
          className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none focus:border-blue-500"
        >
          <option value="All">All Statuses</option>
          <option value="Pending Review">Pending Review</option>
          <option value="Published">Published</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-100 p-5">
          <h3 className="font-semibold text-gray-900">Marketplace Tasks</h3>
          <p className="mt-1 text-sm text-gray-500">
            Task listings submitted by clients.
          </p>
        </div>

        {filteredTasks.length === 0 ? (
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
                  d="M8 7h8M8 11h8M8 15h5M6 3h9l4 4v14H6V3Z"
                />
              </svg>
            </div>

            <h3 className="mt-4 font-semibold text-gray-900">
              No tasks found
            </h3>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">
              {search || status !== "All"
                ? "Try changing your search or status filter."
                : "Task listings will appear here once the backend is connected."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Task</th>
                  <th className="px-5 py-3 font-medium">Client</th>
                  <th className="px-5 py-3 font-medium">Budget</th>
                  <th className="px-5 py-3 font-medium">Submitted</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredTasks.map((task) => (
                  <tr key={task.id}>
                    <td className="px-5 py-4 font-medium text-gray-900">
                      {task.title}
                    </td>
                    <td className="px-5 py-4 text-gray-600">
                      {task.clientName}
                    </td>
                    <td className="px-5 py-4 text-gray-600">
                      {task.budget}
                    </td>
                    <td className="px-5 py-4 text-gray-600">
                      {task.submittedAt}
                    </td>
                    <td className="px-5 py-4 text-gray-600">
                      {task.status}
                    </td>
                    <td className="px-5 py-4">
                      <button
                        type="button"
                        disabled
                        className="font-medium text-blue-600 opacity-60"
                      >
                        View
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
