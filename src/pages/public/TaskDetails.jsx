
import { Link, useParams } from "react-router-dom";

function TaskDetails() {
  const { taskId } = useParams();

  // We'll fetch this task from our API later.
  // Until then, don't display invented task information.
  const task = null;

  if (!task) {
    return (
      <main className="min-h-screen bg-gray-50 px-5 py-20">
        <div className="mx-auto max-w-xl rounded-2xl border border-gray-200 bg-white p-8 text-center">
          <p className="text-sm font-semibold text-blue-600">
            TASK DETAILS
          </p>

          <h1 className="mt-3 text-2xl font-bold text-gray-900">
            Task not available yet
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-600">
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
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-6">
        <Link
          to="/browse"
          className="text-sm font-medium text-gray-600 hover:text-blue-600"
        >
          ← Back to tasks
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          <section className="min-w-0 rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                {task.category}
              </span>

              {task.isQuickTask && (
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                  Quick Task
                </span>
              )}

              {task.isUrgent && (
                <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                  Urgent
                </span>
              )}
            </div>

            <h1 className="mt-5 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {task.title}
            </h1>

            <p className="mt-4 leading-7 text-gray-600">
              {task.description}
            </p>

            <div className="my-8 border-t border-gray-200" />

            <h2 className="text-xl font-semibold text-gray-900">
              Requirements
            </h2>

            <ul className="mt-4 list-inside list-disc space-y-2 text-sm leading-6 text-gray-600">
              {task.requirements.map((requirement) => (
                <li key={requirement}>{requirement}</li>
              ))}
            </ul>

            <div className="my-8 border-t border-gray-200" />

            <h2 className="text-xl font-semibold text-gray-900">
              About the client
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-600">
              {task.client.name}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              {task.client.completedTasks} tasks completed
            </p>
          </section>

          <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-6">
            <p className="text-sm font-medium text-gray-500">
              Task budget
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              ₹{task.budget}
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Estimated time: {task.estimatedMinutes} minutes
            </p>

            <div className="my-6 border-t border-gray-200" />

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Applications</span>
              <span className="font-semibold text-gray-900">
                {task.applicationCount}
              </span>
            </div>

            <Link
              to={`/tasks/${taskId}/apply`}
              className="mt-6 flex w-full justify-center rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
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
