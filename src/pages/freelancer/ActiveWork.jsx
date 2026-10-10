
import { Link } from "react-router-dom";

function ActiveWork() {
  const activeTasks = [];

  return (
    <main>
      <header>
        <p className="text-sm font-semibold text-blue-600">
          WORKSPACE
        </p>
        <h1 className="mt-2 text-2xl font-bold text-gray-900">
          Active Work
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Manage accepted tasks and keep deliveries on track.
        </p>
      </header>

      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          { label: "In progress", value: "—" },
          { label: "Awaiting review", value: "—" },
          { label: "Revisions requested", value: "—" },
        ].map((item) => (
          <article
            key={item.label}
            className="rounded-2xl border border-gray-200 bg-white p-5"
          >
            <p className="text-sm text-gray-500">{item.label}</p>
            <p className="mt-3 text-2xl font-bold text-gray-900">
              {item.value}
            </p>
            <p className="mt-2 text-xs text-gray-400">
              Shown when task data is connected
            </p>
          </article>
        ))}
      </section>

      <section className="mt-8 rounded-2xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900">
            Your active tasks
          </h2>
        </div>

        {activeTasks.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-2xl text-gray-500">
              ✓
            </div>

            <h3 className="mt-5 font-semibold text-gray-900">
              Nothing in progress
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">
              Tasks assigned to you will appear here, along with their
              deadlines and delivery status.
            </p>

            <Link
              to="/browse"
              className="mt-5 inline-flex font-semibold text-blue-600 hover:text-blue-700"
            >
              Find your next task →
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {activeTasks.map((task) => (
              <article key={task.id} className="p-5">
                <h3 className="font-semibold text-gray-900">{task.title}</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Status: {task.status}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default ActiveWork;
