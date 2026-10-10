
import { useState } from "react";

export default function AdminUsers() {
  // Real user records will be loaded from the backend later.
  const [users] = useState([]);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("All");

  const filteredUsers = users.filter((user) => {
    const query = search.trim().toLowerCase();

    const matchesSearch =
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query);

    const matchesRole = role === "All" || user.role === role;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">
          User Management
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Review and manage GigConnect accounts.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by name or email..."
          aria-label="Search users"
          className="min-w-0 flex-1 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
        />

        <select
          value={role}
          onChange={(event) => setRole(event.target.value)}
          aria-label="Filter by role"
          className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none focus:border-blue-500"
        >
          <option value="All">All Roles</option>
          <option value="Client">Client</option>
          <option value="Freelancer">Freelancer</option>
          <option value="Admin">Admin</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-100 p-5">
          <h3 className="font-semibold text-gray-900">All Users</h3>
          <p className="mt-1 text-sm text-gray-500">
            Account records and management actions.
          </p>
        </div>

        {filteredUsers.length === 0 ? (
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
                  d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2m16 0v-2a4 4 0 0 0-3-3.87M14 3.13a4 4 0 0 1 0 7.75M14 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"
                />
              </svg>
            </div>

            <h3 className="mt-4 font-semibold text-gray-900">
              No users found
            </h3>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">
              {search || role !== "All"
                ? "Try changing your search or role filter."
                : "Registered accounts will appear here after the backend is connected."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-5 py-3 font-medium">User</th>
                  <th className="px-5 py-3 font-medium">Role</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Joined</th>
                  <th className="px-5 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-900">
                        {user.name}
                      </p>
                      <p className="mt-1 text-gray-500">{user.email}</p>
                    </td>
                    <td className="px-5 py-4 text-gray-600">{user.role}</td>
                    <td className="px-5 py-4 text-gray-600">{user.status}</td>
                    <td className="px-5 py-4 text-gray-600">{user.joinedAt}</td>
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
      </div>
    </div>
  );
}
