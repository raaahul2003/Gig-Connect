
import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [suspendUser, setSuspendUser] = useState(null);
  const [reason, setReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/admin/users", {
        params: { search, role, status },
      });

      setUsers(response.data.users || []);
      setStats(response.data.stats || {});
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search, role, status]);

  const viewUser = async (userId) => {
    try {
      const response = await api.get(`/admin/users/${userId}`);
      setSelectedUser(response.data.user);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to load user details.");
    }
  };

  const handleSuspend = async () => {
    if (!reason.trim()) {
      alert("Please enter a suspension reason.");
      return;
    }

    try {
      setActionLoading(true);

      await api.patch(`/admin/users/${suspendUser._id}/suspend`, {
        reason: reason.trim(),
      });

      setSuspendUser(null);
      setReason("");
      await fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to suspend user.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReactivate = async (user) => {
    if (!window.confirm(`Reactivate ${user.name}'s account?`)) return;

    try {
      setActionLoading(true);

      await api.patch(`/admin/users/${user._id}/reactivate`);

      await fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to reactivate user.");
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

  const roleBadge = (userRole) => {
    const styles = {
      client: "bg-blue-50 text-blue-700",
      freelancer: "bg-purple-50 text-purple-700",
      admin: "bg-gray-100 text-gray-700",
    };

    return (
      <span className={`rounded-full px-3 py-1 text-xs font-medium ${styles[userRole] || styles.admin}`}>
        {userRole}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl">
          User Management
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Review and manage GigConnect accounts.
        </p>
      </div>

      {/* User statistics */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {[
          ["Total Users", stats.totalUsers],
          ["Clients", stats.clients],
          ["Freelancers", stats.freelancers],
          ["Admins", stats.admins],
          ["Suspended", stats.suspendedUsers],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl border border-gray-200 bg-white p-4">
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
          placeholder="Search by name or email..."
          className="min-w-0 flex-1 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm"
        >
          <option value="all">All Roles</option>
          <option value="client">Client</option>
          <option value="freelancer">Freelancer</option>
          <option value="admin">Admin</option>
        </select>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      {/* Users table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 p-5">
          <h3 className="font-semibold text-gray-900">Registered Users</h3>
          <p className="mt-1 text-sm text-gray-500">
            Manage registered accounts and account permissions.
          </p>
        </div>

        {loading ? (
          <div className="p-12 text-center text-sm text-gray-500">
            Loading users...
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-sm text-red-600">{error}</p>
            <button
              onClick={fetchUsers}
              className="mt-3 text-sm font-medium text-blue-600"
            >
              Try again
            </button>
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-sm text-gray-500">
            No users found. Try changing your search or filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-5 py-3 font-medium">User</th>
                  <th className="px-5 py-3 font-medium">Role</th>
                  <th className="px-5 py-3 font-medium">Verification</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Joined</th>
                  <th className="px-5 py-3 font-medium">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {users.map((user) => (
                  <tr key={user._id}>
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="mt-1 text-gray-500">{user.email}</p>
                    </td>

                    <td className="px-5 py-4">{roleBadge(user.role)}</td>

                    <td className="px-5 py-4">
                      <span className={user.isEmailVerified ? "text-green-600" : "text-orange-600"}>
                        {user.isEmailVerified ? "Verified" : "Not verified"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span className={user.isSuspended ? "text-red-600" : "text-green-600"}>
                        {user.isSuspended ? "Suspended" : "Active"}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {formatDate(user.createdAt)}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => viewUser(user._id)}
                          className="font-medium text-blue-600 hover:text-blue-800"
                        >
                          View
                        </button>

                        {user.role !== "admin" && (
                          user.isSuspended ? (
                            <button
                              disabled={actionLoading}
                              onClick={() => handleReactivate(user)}
                              className="font-medium text-green-600 disabled:opacity-50"
                            >
                              Reactivate
                            </button>
                          ) : (
                            <button
                              disabled={actionLoading}
                              onClick={() => {
                                setSuspendUser(user);
                                setReason("");
                              }}
                              className="font-medium text-red-600 disabled:opacity-50"
                            >
                              Suspend
                            </button>
                          )
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* User details modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">User Details</h3>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-2xl text-gray-400 hover:text-gray-700"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="mt-5 space-y-3 text-sm">
              <p><strong>Name:</strong> {selectedUser.name}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Role:</strong> {selectedUser.role}</p>
              <p><strong>Email verification:</strong> {selectedUser.isEmailVerified ? "Verified" : "Not verified"}</p>
              <p><strong>Account status:</strong> {selectedUser.isSuspended ? "Suspended" : "Active"}</p>
              <p><strong>Joined:</strong> {formatDate(selectedUser.createdAt)}</p>

              {selectedUser.isSuspended && (
                <p><strong>Suspension reason:</strong> {selectedUser.suspensionReason || "Not provided"}</p>
              )}
            </div>

            <button
              onClick={() => setSelectedUser(null)}
              className="mt-6 w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Suspend account modal */}
      {suspendUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900">
              Suspend Account
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Suspend {suspendUser.name}'s account? They will no longer be able to access protected features.
            </p>

            <label className="mt-5 block text-sm font-medium text-gray-700">
              Reason for suspension
            </label>

            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              maxLength={500}
              placeholder="Enter the reason..."
              className="mt-2 w-full rounded-lg border border-gray-200 p-3 text-sm outline-none focus:border-blue-500"
            />

            <div className="mt-5 flex justify-end gap-3">
              <button
                disabled={actionLoading}
                onClick={() => setSuspendUser(null)}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm"
              >
                Cancel
              </button>

              <button
                disabled={actionLoading || !reason.trim()}
                onClick={handleSuspend}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
              >
                {actionLoading ? "Processing..." : "Confirm Suspension"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
