
const metrics = [
  { label: "Registered Users", value: "—" },
  { label: "Published Tasks", value: "—" },
  { label: "Active Projects", value: "—" },
  { label: "Open Disputes", value: "—" },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">
          Dashboard Overview
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Monitor marketplace activity and platform operations.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded-xl border border-gray-200 bg-white p-5"
          >
            <p className="text-sm text-gray-500">{metric.label}</p>
            <p className="mt-3 text-3xl font-semibold text-gray-900">
              {metric.value}
            </p>
            <p className="mt-2 text-xs text-gray-400">
              Available after API integration
            </p>
          </div>
        ))}
      </div>

      <section className="rounded-xl border border-gray-200 bg-white">
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
            No activity to display
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Activity records will appear when the backend is connected.
          </p>
        </div>
      </section>
    </div>
  );
}
