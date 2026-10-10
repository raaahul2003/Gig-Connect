
import { Link } from "react-router-dom";

const metrics = [
  { label: "Active tasks", value: "—" },
  { label: "Pending applications", value: "—" },
  { label: "Completed tasks", value: "—" },
  { label: "Total earnings", value: "—" },
];

function FreelancerDashboard() {
  return (
    <main>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-600">
            YOUR WORKSPACE
          </p>

          <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-900">
            Your next opportunity starts here
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Discover tasks, manage your work, and build your reputation.
          </p>
        </div>

        <Link
          to="/browse"
          className="inline-flex justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Find tasks
        </Link>
      </div>

      <section
        aria-label="Freelancer statistics"
        className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {metrics.map((metric) => (
          <article
            key={metric.label}
            className="rounded-2xl border border-gray-200 bg-white p-5"
          >
            <p className="text-sm text-gray-500">{metric.label}</p>

            <p className="mt-3 text-3xl font-bold text-gray-900">
              {metric.value}
            </p>

            <p className="mt-2 text-xs text-gray-400">
              Available when your account data is connected
            </p>
          </article>
        ))}
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-2">
        <article className="rounded-2xl border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="font-semibold text-gray-900">
                Your applications
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Follow up on opportunities you've applied for.
              </p>
            </div>

            <Link
              to="/freelancer/applications"
              className="text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              View all →
            </Link>
          </div>

          <div className="mt-5 rounded-xl border border-dashed border-gray-300 px-4 py-10 text-center">
            <h4 className="font-semibold text-gray-900">
              No applications to display
            </h4>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              Your submitted applications will appear here when they are
              available from the database.
            </p>
          </div>
        </article>

        <article className="rounded-2xl border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="font-semibold text-gray-900">
                Active work
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Keep track of tasks you're currently completing.
              </p>
            </div>

            <Link
              to="/freelancer/active-work"
              className="text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              View all →
            </Link>
          </div>

          <div className="mt-5 rounded-xl border border-dashed border-gray-300 px-4 py-10 text-center">
            <h4 className="font-semibold text-gray-900">
              No active tasks
            </h4>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              Accepted tasks and their progress will appear here.
            </p>
          </div>
        </article>
      </section>

      <section className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-6 sm:flex sm:items-center sm:justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">
            Build your freelancer profile
          </h3>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            Add your skills and portfolio to help clients understand your
            strengths.
          </p>
        </div>

        <Link
          to="/freelancer/profile"
          className="mt-4 inline-flex font-semibold text-blue-700 hover:text-blue-800 sm:mt-0"
        >
          Complete profile →
        </Link>
      </section>
    </main>
  );
}

export default FreelancerDashboard;
