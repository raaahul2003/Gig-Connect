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
      <main className="flex min-h-[60vh] items-center justify-center bg-gradient-to-b from-blue-50/70 via-white to-white px-4 py-12">
        <p className="rounded-2xl border border-blue-100 bg-white px-6 py-4 text-center text-sm font-medium text-gray-600 shadow-lg shadow-blue-900/5">
          Loading task...
        </p>
      </main>
    );
  }

  if (error || !task) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-50/70 via-gray-50 to-white px-4 py-12 sm:px-6">
        <div className="w-full max-w-xl rounded-3xl border border-gray-200/80 bg-white p-6 text-center shadow-xl shadow-gray-900/5 sm:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600 sm:text-sm">
            TASK DETAILS
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
            className="mt-6 inline-flex min-h-12 items-center justify-center rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-md shadow-blue-600/20 transition duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            Back to Browse Tasks
          </Link>
        </div>
      </main>
    );
  }


  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50/60 via-gray-50 to-white">
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-9 lg:px-8 lg:py-10">
        <Link
          to="/browse"
          className="inline-flex min-h-11 items-center rounded-lg pr-3 text-sm font-semibold text-gray-600 transition-colors hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        >
          ← Back to tasks
        </Link>

        <div className="mt-3 grid items-start gap-4 sm:mt-5 sm:gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-8">
          <section className="min-w-0 rounded-2xl border border-gray-200/80 bg-white p-5 shadow-lg shadow-gray-900/[0.04] sm:rounded-3xl sm:p-7 lg:p-9">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="rounded-full border border-blue-100 bg-blue-50 px-3.5 py-1.5 text-xs font-semibold text-blue-700">
                {task?.category}
              </span>



              {task?.isUrgent && (
                <span className="rounded-full border border-amber-100 bg-amber-50 px-3.5 py-1.5 text-xs font-semibold text-amber-700">
                  Urgent
                </span>
              )}
            </div>

            <h1 className="mt-5 break-words text-2xl font-bold leading-tight tracking-tight text-gray-950 sm:text-3xl sm:leading-tight lg:text-4xl">
              {task?.title}
            </h1>


            <div className="mt-4 break-words text-sm leading-7 text-gray-600 sm:mt-5 sm:text-base sm:leading-8">
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


            <div className="my-6 border-t border-gray-100 sm:my-8" />

            <h2 className="text-lg font-bold tracking-tight text-gray-900 sm:text-xl">
              Deliverables
            </h2>

            <p className="mt-3 whitespace-pre-line break-words rounded-xl bg-gray-50 px-4 py-3 text-sm leading-7 text-gray-700 sm:px-5 sm:py-4">
              {task.deliverables || "No deliverables specified."}
            </p>

            <div className="my-6 border-t border-gray-100 sm:my-8" />

            <h2 className="text-lg font-bold tracking-tight text-gray-900 sm:text-xl">
              Skills required
            </h2>

            {task.skills?.length ? (
              <ul className="mt-4 flex flex-wrap gap-2.5">
                {task.skills.map((skill) => (
                  <li key={skill} className="rounded-full border border-gray-200 bg-gray-50 px-3.5 py-2 text-sm font-medium text-gray-700">{skill}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm leading-6 text-gray-500">
                No specific skills listed.
              </p>
            )}


            <div className="my-6 border-t border-gray-100 sm:my-8" />

            <h2 className="text-lg font-bold tracking-tight text-gray-900 sm:text-xl">
              About the client
            </h2>

            <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
              {task?.client?._id ? (
                <>
                  <p className="text-sm font-semibold text-gray-900">
                    {task.client.clientType === "company"
                      ? task.client.clientProfile?.companyName || task.client.name
                      : task.client.name}
                  </p>

                  <Link
                    to={`/clients/${task.client._id}`}
                    className="mt-2 inline-flex items-center text-sm font-semibold text-blue-600 transition hover:text-blue-700 hover:underline"
                  >
                    View client profile →
                  </Link>
                </>
              ) : (
                <p className="text-sm text-gray-500">
                  Client information unavailable.
                </p>
              )}
            </div>



          </section>

          <aside className="h-fit rounded-2xl border border-gray-200/80 bg-white p-5 shadow-lg shadow-gray-900/[0.04] sm:rounded-3xl sm:p-7 lg:sticky lg:top-24">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-gray-500">
              Task budget
            </p>

            <p className="mt-2 break-words text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
              ₹{task?.budget}
            </p>

            <p className="mt-4 rounded-xl bg-blue-50/70 px-4 py-3 text-sm font-medium leading-6 text-gray-700">
              Deadline: {formattedDeadline}
            </p>

            <div className="my-5 border-t border-gray-200 sm:my-6" />


            <Link
              to={`/tasks/${taskId}/apply`}
              state={{ task }}
              className="flex min-h-12 w-full items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-center font-semibold text-white shadow-md shadow-blue-600/20 transition duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
              Apply for this task
            </Link>

            <p className="mt-4 text-center text-xs leading-5 text-gray-500">
              You'll review your application before submitting it.
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default TaskDetails;
