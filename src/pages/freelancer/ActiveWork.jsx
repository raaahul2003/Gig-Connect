
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMyActiveWork } from "../../services/applicationService";

const taskStatusLabels = {
  open: "Open",
  in_progress: "In progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

const taskStatusStyles = {
  open: "border-gray-200 bg-gray-50 text-gray-800",
  in_progress: "border-blue-200 bg-blue-50 text-blue-900",
  completed: "border-green-200 bg-green-50 text-green-900",
  cancelled: "border-red-200 bg-red-50 text-red-900",
};

function formatDeadline(value) {
  if (!value) return "Not specified";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not specified";

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function ActiveWork() {
  const [activeTasks, setActiveTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchActiveWork = async () => {
      try {
        const applications = await getMyActiveWork();

        const tasks = applications.map((application) => ({
          id: application._id,
          taskId: application.task?._id,
          title: application.task?.title || "Untitled Task",
          status: application.task?.status || "in_progress",
          deadline: formatDeadline(application.task?.deadline),
        }));

        setActiveTasks(tasks);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load active work."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchActiveWork();
  }, []);

  return (
    <main className="mx-auto w-full max-w-5xl">
      <header>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
          Active Work
        </h1>
        <p className="mt-2 max-w-xl text-base leading-6 text-gray-700">
          Review deadlines and submit completed work for your accepted tasks.
        </p>
      </header>

      <section
        aria-labelledby="active-tasks-heading"
        className="mt-8 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
      >
        <div className="flex flex-col gap-3 border-b border-gray-200 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h2
              id="active-tasks-heading"
              className="text-lg font-bold tracking-tight text-gray-950 sm:text-xl"
            >
              Your active tasks
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Accepted tasks currently in progress
            </p>
          </div>
          {!loading && !error && (
            <span
              className="text-sm font-medium text-gray-700"
              aria-live="polite"
            >
              {activeTasks.length}{" "}
              {activeTasks.length === 1 ? "active task" : "active tasks"}
            </span>
          )}
        </div>

        {loading ? (
          <p role="status" className="px-6 py-16 text-center text-sm text-gray-700">
            Loading active work...
          </p>
        ) : error ? (
          <p role="alert" className="px-6 py-16 text-center text-sm text-red-800">
            {error}
          </p>
        ) : activeTasks.length === 0 ? (
          <div className="px-5 py-12 text-center sm:px-6">
            <h3 className="font-semibold text-gray-950">No tasks in progress</h3>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-700">
              Accepted tasks will appear here once they are underway, with
              their deadlines and delivery status.
            </p>
            <Link
              to="/browse"
              className="mt-4 inline-flex min-h-11 items-center font-semibold text-blue-700 transition-colors hover:text-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
            >
              Explore available tasks →
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {activeTasks.map((task) => (
              <article
                key={task.id}
                className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6"
              >
                <div className="min-w-0">
                  <h3 className="break-words text-base font-semibold text-gray-950 sm:text-lg">
                    {task.title}
                  </h3>
                  <dl className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <dt className="text-gray-600">Status</dt>
                      <dd>
                        <span
                          className={`inline-flex min-h-8 items-center rounded-md border px-2.5 py-1 font-semibold ${
                            taskStatusStyles[task.status] ||
                            "border-gray-200 bg-gray-100 text-gray-800"
                          }`}
                        >
                          {taskStatusLabels[task.status] || task.status}
                        </span>
                      </dd>
                    </div>
                    <div>
                      <dt className="inline text-gray-600">Deadline: </dt>
                      <dd className="inline font-medium text-gray-900">
                        {task.deadline}
                      </dd>
                    </div>
                  </dl>
                </div>
                {task.status === "in_progress" && task.taskId && (
                  <Link
                    to={`/freelancer/tasks/${task.taskId}/submit`}
                    className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                  >
                    Submit work
                  </Link>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default ActiveWork;
