import { useEffect, useState } from "react";
import { getClientActiveWork } from "../../services/applicationService";
import { getSubmissionsForClient } from "../../services/submissionService";

const statusStyles = {
  Completed: "bg-green-50 text-green-700",
  "In Progress": "bg-blue-50 text-blue-700",
  Pending: "bg-gray-100 text-gray-600",
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
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">
          Work Progress
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Track milestones and delivery progress for your active tasks.
        </p>
      </div>

      {loading ? (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow px-6 py-14 text-center">
          <p className="text-sm text-gray-500">
            Loading work progress...
          </p>
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-14 text-center">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow px-6 py-14 text-center">
          <h2 className="font-semibold text-gray-900">
            No active tasks
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Progress updates will appear here when work begins.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {tasks.map((task) => (
            <article
              key={task.id}
              className="space-y-6 rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow p-5 sm:p-7"
            >
              <div className="flex flex-col justify-between gap-4 sm:flex-row">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {task.title}
                  </h2>
                  <p className="mt-2 text-sm text-gray-500">
                    Freelancer: {task.freelancer}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Deadline:{" "}
                    {task.deadline && !isNaN(new Date(task.deadline).getTime())
                      ? new Date(task.deadline).toLocaleDateString()
                      : "Not set"}
                  </p>
                </div>

                <span
                  className={`h-fit w-fit rounded-full px-3 py-1 text-xs font-medium ${statusStyles[task.status] || "bg-gray-100 text-gray-600"
                    }`}
                >
                  {task.status}
                </span>
              </div>

              <div>
                <div className="mb-2 flex justify-between gap-3 text-sm">
                  <span className="font-medium text-gray-700">
                    Overall progress
                  </span>
                  <span className="font-semibold text-gray-900">
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
                    className="h-full rounded-full bg-blue-600 transition-all"
                    style={{
                      width: `${Math.min(100, Math.max(0, task.progress))}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900">Milestones</h3>

                <div className="mt-4 space-y-4">
                  {task.milestones.map((milestone, index) => (
                    <div key={milestone.id} className="flex gap-3">
                      <div
                        className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${milestone.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : milestone.status === "In Progress"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-500"
                          }`}
                      >
                        {milestone.status === "Completed" ? "✓" : index + 1}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-800">
                          {milestone.title}
                        </p>
                        <span
                          className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[milestone.status] ??
                            "bg-gray-100 text-gray-600"
                            }`}
                        >
                          {milestone.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
