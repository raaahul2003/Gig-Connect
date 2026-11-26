
import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    registeredUsers: 0,
    publishedTasks: 0,
    activeProjects: 0,
    completedProjects: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/admin/dashboard");

        setStats(response.data.stats);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError(
          err.response?.data?.message ||
            "Failed to load dashboard statistics."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const metrics = [
    {
      label: "Registered Users",
      value: stats.registeredUsers,
    },
    {
      label: "Published Tasks",
      value: stats.publishedTasks,
    },
    {
      label: "Active Projects",
      value: stats.activeProjects,
    },
    {
      label: "Completed Projects",
      value: stats.completedProjects,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">
          Dashboard Overview
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Monitor marketplace activity and platform operations.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow"
          >
            <p className="text-sm text-gray-500">{metric.label}</p>

            <p className="mt-3 text-3xl font-semibold text-gray-900">
              {loading ? "..." : metric.value}
            </p>

            <p className="mt-2 text-xs text-gray-400">
              Live platform statistics
            </p>
          </div>
        ))}
      </div>

      <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 p-5">
          <h3 className="font-semibold text-gray-900">
            Recent Platform Activity
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            New registrations, task activity, and reports will appear here.
          </p>
        </div>

        <div className="px-6 py-12 text-center">
          <p className="font-medium text-gray-800">
            Activity tracking is not implemented yet.
          </p>
          <p className="mt-2 text-sm text-gray-500">
            This section can be connected when activity tracking is added to
            the backend.
          </p>
        </div>
      </section>
    </div>
  );
}
