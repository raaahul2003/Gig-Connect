
import { Link } from "react-router-dom";

function DashboardHeader() {
  return (
    <header className="flex flex-col gap-4 border-b border-gray-200 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
      <div>
        <p className="text-sm text-gray-500">Client workspace</p>
        <h1 className="text-lg font-semibold text-gray-900">
          Dashboard overview
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <Link
          to="/post-task"
          className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          + Post a task
        </Link>

        <Link
          to="/login"
          aria-label="Account"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-gray-50 font-semibold text-gray-700 hover:bg-gray-100"
        >
          U
        </Link>
      </div>
    </header>
  );
}

export default DashboardHeader;
