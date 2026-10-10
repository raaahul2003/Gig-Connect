
import { Link } from "react-router-dom";

function MyApplications() {
  const applications = [];

  return (
    <main>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-600">
            FREELANCER WORKSPACE
          </p>
          <h1 className="mt-2 text-2xl font-bold text-gray-900">
            My Applications
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Track the status of tasks you've applied for.
          </p>
        </div>

        <Link
          to="/browse"
          className="inline-flex justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Find tasks
        </Link>
      </div>

      <div className="mt-8 rounded-2xl border border-gray-200 bg-white">
        <div className="flex flex-col gap-3 border-b border-gray-200 p-5 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-semibold text-gray-900">
            Application history
          </h2>

          <span className="text-sm text-gray-500">
            {applications.length} applications
          </span>
        </div>

        {applications.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-2xl text-gray-500">
              <span aria-hidden="true">↗</span>
            </div>

            <h3 className="mt-5 font-semibold text-gray-900">
              No applications yet
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">
              When you apply for a task, its status and details will appear
              here.
            </p>

            <Link
              to="/browse"
              className="mt-5 inline-flex font-semibold text-blue-600 hover:text-blue-700"
            >
              Explore available tasks →
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {applications.map((application) => (
              <article key={application.id} className="p-5">
                <h3 className="font-semibold text-gray-900">
                  {application.taskTitle}
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Status: {application.status}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default MyApplications;
