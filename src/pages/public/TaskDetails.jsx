import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getTaskById } from "../../services/taskService";
import ReactMarkdown from "react-markdown";

function TaskDetails() {
  const { taskId } = useParams();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const formattedDeadline = task?.deadline
    ? new Date(task.deadline).toLocaleDateString()
    : "Not specified";

  useEffect(() => {
    getTaskById(taskId)
      .then((response) => setTask(response.data.task))
      .catch(() => setError("Could not load this task."))
      .finally(() => setLoading(false));
  }, [taskId]);

  if (loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-gray-50 px-4 py-12">
        <p className="rounded-lg border border-gray-200 bg-white px-6 py-4 text-center text-sm font-medium text-gray-700">
          Loading task...
        </p>
      </main>
    );
  }

  if (error || !task) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6">
        <div className="w-full max-w-xl rounded-xl border border-gray-200 bg-white p-6 text-center sm:p-10">
          <p className="text-sm font-semibold text-blue-700">
            Task details
          </p>

          <h1 className="mt-3 text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
            Task not available yet
          </h1>

          <p className="mt-3 break-words text-sm leading-7 text-gray-600 sm:text-base">
            This task is no longer available for applications. It may have
            already been assigned, completed, or removed.
          </p>

          <Link
            to="/browse"
            className="mt-6 inline-flex min-h-12 items-center justify-center rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white transition-colors hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
          >
            Back to Browse Tasks
          </Link>
        </div>
      </main>
    );
  }


  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <Link
          to="/browse"
          className="inline-flex min-h-11 items-center rounded-md pr-3 text-sm font-semibold text-gray-700 transition-colors hover:text-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
        >
          ← Back to tasks
        </Link>

        <div className="mt-3 grid items-start gap-5 sm:mt-5 sm:gap-6 lg:grid-cols-[minmax(0,1fr)_19rem] lg:gap-8">
          <section className="min-w-0 rounded-xl border border-gray-200 bg-white p-5 sm:p-7 lg:p-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-800">
                {task?.category}
              </span>

              {task?.isUrgent && (
                <span className="rounded-md border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800">
                  Urgent
                </span>
              )}
            </div>

            <h1 className="mt-4 break-words text-2xl font-bold leading-tight tracking-tight text-gray-950 sm:text-3xl lg:text-4xl">
              {task?.title}
            </h1>

            <div className="mt-4 max-w-3xl break-words text-sm leading-7 text-gray-700 sm:mt-5 sm:text-base sm:leading-8">
              <ReactMarkdown
                components={{
                  p: ({ children }) => (
                    <p className="mb-4 last:mb-0">
                      {children}
                    </p>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-bold text-gray-900">
                      {children}
                    </strong>
                  ),
                  ul: ({ children }) => (
                    <ul className="mb-4 list-disc space-y-2 pl-6">
                      {children}
                    </ul>
                  ),
                  li: ({ children }) => (
                    <li className="pl-1">
                      {children}
                    </li>
                  ),
                }}
              >
                {task?.description || ""}
              </ReactMarkdown>
            </div>

            <div className="my-6 border-t border-gray-200 sm:my-7" />

            <h2 className="text-lg font-bold tracking-tight text-gray-900 sm:text-xl">
              Deliverables
            </h2>

            <p className="mt-3 whitespace-pre-line break-words text-sm leading-7 text-gray-700 sm:text-base">
              {task.deliverables || "No deliverables specified."}
            </p>

            <div className="my-6 border-t border-gray-200 sm:my-7" />

            <h2 className="text-lg font-bold tracking-tight text-gray-900 sm:text-xl">
              Skills required
            </h2>

            {task.skills?.length ? (
              <ul className="mt-4 flex flex-wrap gap-2">
                {task.skills.map((skill) => (
                  <li key={skill} className="rounded-md border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm font-medium text-gray-800">{skill}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm leading-6 text-gray-600">
                No specific skills listed.
              </p>
            )}

            <div className="my-6 border-t border-gray-200 sm:my-7" />

            <h2 className="text-lg font-bold tracking-tight text-gray-900 sm:text-xl">
              About the client
            </h2>

            <div className="mt-3">
              {task?.client?._id ? (
                <>
                  <p className="text-sm font-semibold text-gray-900">
                    {task.client.clientType === "company"
                      ? task.client.clientProfile?.companyName || task.client.name
                      : task.client.name}
                  </p>

                  <Link
                    to={`/clients/${task.client._id}`}
                    className="mt-2 inline-flex min-h-10 items-center text-sm font-semibold text-blue-700 transition-colors hover:text-blue-800 hover:underline focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                  >
                    View client profile →
                  </Link>
                </>
              ) : (
                <p className="text-sm text-gray-600">
                  Client information unavailable.
                </p>
              )}
            </div>
          </section>

          <aside className="h-fit rounded-xl border border-gray-200 bg-white p-5 sm:p-6 lg:sticky lg:top-24">
            <p className="text-sm font-medium text-gray-700">
              Task budget
            </p>

            <p className="mt-2 break-words text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
              ₹{task?.budget}
            </p>

            <div className="mt-5 border-t border-gray-200 pt-4">
              <p className="text-sm font-medium text-gray-600">Deadline</p>
              <p className="mt-1 text-sm font-semibold text-gray-900">
                {formattedDeadline}
              </p>
            </div>

            <Link
              to={`/tasks/${taskId}/apply`}
              state={{ task }}
              className="mt-5 flex min-h-12 w-full items-center justify-center rounded-lg bg-blue-700 px-5 py-3 text-center font-semibold text-white transition-colors hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
            >
              Apply for this task
            </Link>

            <p className="mt-3 text-center text-xs leading-5 text-gray-600">
              You'll review your application before submitting it.
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default TaskDetails;
