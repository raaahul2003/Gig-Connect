import { useEffect, useState } from "react";
import { getClientActiveWork } from "../../services/applicationService";
import { getSubmissionsForClient } from "../../services/submissionService";

const statusStyles = {
  Completed: "border-green-200 bg-green-50 text-green-800",
  "In Progress": "border-blue-200 bg-blue-50 text-blue-800",
  Pending: "border-gray-200 bg-gray-100 text-gray-700",
};

export default function ClientWorkProgress() {

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWorkProgress = async () => {
      try {
        const [applications, submissions] = await Promise.all([
          getClientActiveWork(),
          getSubmissionsForClient(),
        ]);

        // Get the latest submission for each task
        const latestSubmissions = new Map();

        submissions.forEach((submission) => {
          const taskId = submission.task?._id;

          if (!taskId) return;

          const existing = latestSubmissions.get(taskId);

          if (
            !existing ||
            new Date(submission.createdAt) >
            new Date(existing.createdAt)
          ) {
            latestSubmissions.set(taskId, submission);
          }
        });

        // Include active and completed tasks
        const taskMap = new Map();

        applications.forEach((application) => {
          const task = application.task;

          if (!task?._id) return;

          taskMap.set(task._id, {
            id: task._id,
            title: task.title || "Untitled Task",
            freelancer: application.freelancer?.name || "Freelancer",
            deadline: task.deadline,
            status: task.status,
          });
        });

        // Add completed tasks from submission history
        submissions.forEach((submission) => {
          const task = submission.task;

          if (!task?._id || taskMap.has(task._id)) return;

          taskMap.set(task._id, {
            id: task._id,
            title: task.title || "Untitled Task",
            freelancer: submission.freelancer?.name || "Freelancer",
            deadline: task.deadline,
            status: task.status,
          });
        });

        const formattedTasks = Array.from(taskMap.values()).map((task) => {
          const submission = latestSubmissions.get(task.id);

          let progress = 0;

          if (submission?.status === "approved") {
            progress = 100;
          } else if (
            submission?.status === "submitted" ||
            submission?.status === "revision_requested"
          ) {
            progress = 50;
          }

          const status =
            task.status === "completed"
              ? "Completed"
              : task.status === "in_progress"
                ? "In Progress"
                : "Pending";

          const milestones = [
            {
              id: "assigned",
              title: "Task assigned to freelancer",
              status: "Completed",
            },
            {
              id: "submitted",
              title: "Work submitted for review",
              status: submission ? "Completed" : "Pending",
            },
            {
              id: "approved",
              title: "Client approval",
              status:
                submission?.status === "approved"
                  ? "Completed"
                  : submission?.status === "revision_requested"
                    ? "In Progress"
                    : "Pending",
            },
          ];

          return {
            ...task,
            status,
            progress,
            milestones,
          };
        });

        setTasks(formattedTasks);
      } catch (err) {
        setError(
          err.response?.data?.message ||
          err.message ||
          "Failed to load work progress."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchWorkProgress();
  }, []);

  return (
    <main className="space-y-6 sm:space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
          Work Progress
        </h1>
        <p className="mt-2 max-w-3xl text-base leading-6 text-gray-700">
          Track milestones and delivery progress for your active tasks.
        </p>
      </header>

      {loading ? (
        <div
          role="status"
          aria-live="polite"
          className="rounded-xl border border-gray-200 bg-white px-5 py-10 text-center text-sm text-gray-600"
        >
          Loading work progress...
        </div>
      ) : error ? (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-5 py-8 text-sm leading-6 text-red-800"
        >
          {error}
        </div>
      ) : tasks.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white px-5 py-10 text-center">
          <h2 className="text-lg font-semibold text-gray-950">
            No active tasks
          </h2>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            Progress updates will appear here when work begins.
          </p>
        </div>
      ) : (
        <section aria-label="Task progress" className="space-y-4">
          {tasks.map((task) => (
            <article
              key={task.id}
              className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5"
            >
              <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <h2 className="break-words text-lg font-semibold tracking-tight text-gray-950">
                    {task.title}
                  </h2>
                  <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                    <div>
                      <dt className="text-xs font-medium text-gray-600">
                        Freelancer
                      </dt>
                      <dd className="mt-1 font-medium text-gray-900">
                        {task.freelancer}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-medium text-gray-600">
                        Deadline
                      </dt>
                      <dd className="mt-1 font-medium text-gray-900">
                        {task.deadline &&
                        !isNaN(new Date(task.deadline).getTime())
                          ? new Date(task.deadline).toLocaleDateString()
                          : "Not set"}
                      </dd>
                    </div>
                  </dl>
                </div>

                <span
                  className={`inline-flex min-h-9 w-fit shrink-0 items-center rounded-md border px-3 py-1 text-sm font-semibold ${
                    statusStyles[task.status] ||
                    "border-gray-200 bg-gray-100 text-gray-800"
                  }`}
                >
                  {task.status}
                </span>
              </header>

              <div className="mt-5 grid gap-5 border-t border-gray-100 pt-5 lg:grid-cols-[minmax(220px,0.7fr)_minmax(0,1.3fr)]">
                <section aria-label={`Overall progress for ${task.title}`}>
                  <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                    <h3 className="font-semibold text-gray-900">
                      Overall progress
                    </h3>
                    <span className="font-semibold text-gray-950">
                      {task.progress}%
                    </span>
                  </div>
                  <div
                    className="h-2.5 overflow-hidden rounded-full bg-gray-100"
                    role="progressbar"
                    aria-label={`${task.title} progress`}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={task.progress}
                  >
                    <div
                      className="h-full rounded-full bg-blue-700 transition-all"
                      style={{
                        width: `${Math.min(100, Math.max(0, task.progress))}%`,
                      }}
                    />
                  </div>
                </section>

                <section aria-labelledby={`milestones-${task.id}`}>
                  <h3
                    id={`milestones-${task.id}`}
                    className="font-semibold text-gray-900"
                  >
                    Milestones
                  </h3>

                  <ol className="mt-3 grid gap-3 sm:grid-cols-3">
                    {task.milestones.map((milestone, index) => (
                      <li
                        key={milestone.id}
                        className="flex min-w-0 items-start gap-3 sm:flex-col sm:gap-2"
                      >
                        <span
                          aria-hidden="true"
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                            milestone.status === "Completed"
                              ? "bg-green-100 text-green-800"
                              : milestone.status === "In Progress"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {milestone.status === "Completed" ? "✓" : index + 1}
                        </span>

                        <div className="min-w-0">
                          <p className="text-sm font-medium leading-5 text-gray-900">
                            {milestone.title}
                          </p>
                          <span
                            className={`mt-1 inline-flex min-h-7 items-center rounded-md border px-2 py-1 text-xs font-semibold ${
                              statusStyles[milestone.status] ??
                              "border-gray-200 bg-gray-100 text-gray-800"
                            }`}
                          >
                            {milestone.status}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ol>
                </section>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
