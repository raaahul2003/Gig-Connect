import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getTaskById } from "../../services/taskService";

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
        <p className="rounded-2xl border border-gray-200 bg-white px-6 py-4 text-center text-sm font-medium text-gray-600 shadow-sm">
          Loading task...
        </p>
      </main>
    );
  }

  if (error || !task) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6">
        <div className="w-full max-w-xl rounded-3xl border border-gray-200 bg-white p-6 text-center shadow-sm sm:p-10">
          <p className="text-sm font-semibold text-blue-600">
            TASK DETAILS
          </p>

          <h1 className="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Task not available yet
          </h1>

          <p className="mt-3 break-words text-sm leading-6 text-gray-600">
            This task cannot be displayed until task data is connected.
            Task reference: {taskId}
          </p>

          <Link
            to="/browse"
            className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Back to Browse Tasks
          </Link>
        </div>
      </main>
    );
  }


  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
        <Link
          to="/browse"
          className="inline-flex min-h-11 items-center text-sm font-medium text-gray-600 transition hover:text-blue-600"
        >
          ← Back to tasks
        </Link>

        <div className="mt-4 grid items-start gap-5 sm:mt-6 sm:gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-8">
          <section className="min-w-0 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:rounded-3xl sm:p-7 lg:p-9">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                {task?.category}
              </span>



              {task?.isUrgent && (
                <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                  Urgent
                </span>
              )}
            </div>

            <h1 className="mt-5 break-words text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">
              {task?.title}
            </h1>

            <p className="mt-4 whitespace-pre-line break-words text-sm leading-7 text-gray-600 sm:text-base">
              {task?.description}
            </p>

            <div className="my-6 border-t border-gray-200 sm:my-8" />

            <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">
              Deliverables
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-600">
              {task.deliverables || "No deliverables specified."}
            </p>

            <div className="my-6 border-t border-gray-200 sm:my-8" />

            <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">
              Skills required
            </h2>

            {task.skills?.length ? (
              <ul className="mt-4 list-inside list-disc space-y-2 text-sm leading-6 text-gray-600">
                {task.skills.map((skill) => (
                  <li key={skill}>{skill}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-gray-500">
                No specific skills listed.
              </p>
            )}

            {/* <div className="my-8 border-t border-gray-200" />

            <h2 className="text-xl font-semibold text-gray-900">
              About the client
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-600">
              {task?.client.name}
            </p> */}


          </section>

          <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:rounded-3xl sm:p-7 lg:sticky lg:top-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Task budget
            </p>

            <p className="mt-2 break-words text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              ₹{task?.budget}
            </p>

            <p className="mt-3 rounded-xl bg-gray-50 px-4 py-3 text-sm leading-6 text-gray-600">
              Estimated time: {task?.estimatedMinutes} minutes
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Deadline: {formattedDeadline}
            </p>

            <div className="my-5 border-t border-gray-200 sm:my-6" />


            <Link
              to={`/tasks/${taskId}/apply`}
              className="flex min-h-12 w-full items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-center font-semibold text-white transition hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Apply for this task
            </Link>

            <p className="mt-3 text-center text-xs leading-5 text-gray-500">
              You'll review your application before submitting it.
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default TaskDetails;
