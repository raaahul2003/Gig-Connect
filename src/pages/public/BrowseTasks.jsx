
import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { getTasks } from "../../services/taskService";

const categories = [
  "All Tasks",
  "Design",
  "Development",
  "Writing",
  "Data Entry",
  "Marketing",
  "Research"
];

function BrowseTasks() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Tasks");
  const [sort, setSort] = useState("newest");

  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user") || "null")
  );

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await getTasks();
        setTasks(response.data.tasks || []);
        setError("");
      } catch (error) {
        setError("Could not load tasks. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    // Load tasks when the page opens
    fetchTasks();

    // Refresh when the user returns to this page
    const handleFocus = () => {
      fetchTasks();
    };

    // Refresh when the browser tab becomes visible
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchTasks();
      }
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, []);

  const filteredTasks = tasks
    .filter((task) => {
      if (task.status !== "open") return false;

      const searchText = search.trim().toLowerCase();

      const matchesSearch =
        task.title?.toLowerCase().includes(searchText) ||
        task.description?.toLowerCase().includes(searchText) ||
        task.skills?.some((skill) =>
          skill.toLowerCase().includes(searchText)
        );

      const matchesCategory =
        category === "All Tasks" || task.category === category;


      return (
        matchesSearch &&
        matchesCategory
      );
    })
    .sort((a, b) => {
      if (sort === "budget-high") {
        return Number(b.budget) - Number(a.budget);
      }

      if (sort === "budget-low") {
        return Number(a.budget) - Number(b.budget);
      }

      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <h1 className="max-w-3xl text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Find your next opportunity
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
            Discover tasks that match your skills, schedule, and interests.
          </p>

          <div className="mt-5 flex max-w-4xl flex-col gap-3 sm:mt-6 sm:flex-row">
            <div className="min-w-0 flex-1">
              <label
                htmlFor="task-search"
                className="mb-1.5 block text-sm font-medium text-gray-800"
              >
                Search tasks
              </label>
              <div className="relative">
                <svg
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <circle cx="10.8" cy="10.8" r="6.8" />
                  <path strokeLinecap="round" d="m16 16 4.2 4.2" />
                </svg>
                <input
                  id="task-search"
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search titles, skills, or descriptions"
                  aria-label="Search tasks by title, skills, or description"
                  className="min-h-12 w-full rounded-lg border border-gray-300 bg-white px-4 pl-11 text-sm text-gray-900 outline-none transition placeholder:text-gray-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {user?.role === "client" && (
              <Link
                to="/post-task"
                className="inline-flex min-h-12 items-center justify-center self-end rounded-lg bg-blue-600 px-5 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 sm:mb-0"
              >
                Post a Task
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="flex flex-col gap-4 border-b border-gray-200 pb-4 sm:pb-5 lg:flex-row lg:items-center lg:justify-between">
          <nav
            className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 sm:flex-wrap sm:overflow-visible sm:pb-0"
            aria-label="Filter tasks by category"
          >
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                aria-pressed={category === item}
                className={`min-h-10 shrink-0 rounded-lg px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 ${category === item
                  ? "bg-blue-700 text-white"
                  : "border border-transparent text-gray-700 hover:border-gray-200 hover:bg-white hover:text-blue-800"
                  }`}
              >
                {item}
              </button>
            ))}
          </nav>

          <label className="flex min-h-11 w-full items-center justify-between gap-3 text-sm font-medium text-gray-800 sm:w-auto sm:justify-start">
            Sort by
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="min-h-11 min-w-0 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            >
              <option value="newest">Newest</option>
              <option value="budget-high">Highest budget</option>
              <option value="budget-low">Lowest budget</option>
            </select>
          </label>
        </div>

        <div className="mt-6 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">
            Available tasks
          </h2>

          <span className="text-sm font-medium text-gray-700" aria-live="polite">
            {filteredTasks.length} {filteredTasks.length === 1 ? "task" : "tasks"}
          </span>
        </div>

        {loading ? (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-xl border border-gray-200 bg-white p-5"
              >
                <div className="h-4 w-24 rounded bg-gray-200" />
                <div className="mt-5 h-6 w-3/4 rounded bg-gray-200" />
                <div className="mt-4 h-6 w-2/3 rounded bg-gray-200" />
                <div className="mt-6 h-5 w-28 rounded bg-gray-200" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div
            role="alert"
            className="mt-5 rounded-xl border border-red-200 bg-red-50 px-5 py-10 text-center"
          >
            <h3 className="text-lg font-semibold text-red-800">
              Unable to load tasks
            </h3>
            <p className="mt-2 text-sm text-red-700">{error}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-5 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
            >
              Refresh page
            </button>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="mt-5 rounded-xl border border-dashed border-gray-300 bg-white px-5 py-10 text-center sm:px-6 sm:py-12">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-2xl">
              <span aria-hidden="true">⌕</span>
            </div>

            <h3 className="mt-5 text-lg font-semibold text-gray-900">
              No tasks available yet
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              {search
                ? "No tasks match your search. Try a different keyword."
                : "New opportunities will appear here when clients post tasks."}
            </p>

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="mt-5 min-h-11 rounded-lg px-3 font-semibold text-blue-600 hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="mt-5 grid items-stretch gap-4 sm:mt-6 sm:gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredTasks.map((task) => (
              <article
                key={task._id}
                className="flex min-w-0 flex-col rounded-xl border border-gray-200 bg-white p-5 transition-colors hover:border-blue-300 sm:p-5"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-800">
                    {task.category}
                  </span>

                  {task.isQuickTask && (
                    <span className="rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-800">
                      Quick Task
                    </span>
                  )}

                  {task.isUrgent && (
                    <span className="rounded-md bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800">
                      Urgent
                    </span>
                  )}
                </div>

                <h3 className="mt-3 break-words text-lg font-semibold leading-6 text-gray-900">
                  {task.title}
                </h3>

                {task.skills?.length > 0 && (
                  <ul
                    className="mt-3 flex flex-wrap gap-1.5"
                    aria-label="Required skills"
                  >
                    {task.skills.slice(0, 3).map((skill) => (
                      <li
                        key={skill}
                        className="rounded-md border border-gray-200 bg-gray-50 px-2 py-1 text-xs font-medium text-gray-700"
                      >
                        {skill}
                      </li>
                    ))}
                    {task.skills.length > 3 && (
                      <li className="px-1 py-1 text-xs font-medium text-gray-600">
                        +{task.skills.length - 3} more
                      </li>
                    )}
                  </ul>
                )}

                <div className="mt-4 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs text-gray-600">
                      Client
                    </p>

                    {task.client?._id ? (
                      <Link
                        to={`/clients/${task.client._id}`}
                        className="block truncate text-sm font-semibold text-blue-700 hover:text-blue-800 hover:underline focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                      >
                        {task.client.clientType === "company"
                          ? task.client.clientProfile?.companyName || task.client.name
                          : task.client.name}
                      </Link>
                    ) : (
                      <span className="text-sm text-gray-500">
                        Client information unavailable
                      </span>
                    )}
                  </div>

                  <span className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-blue-50 px-2.5 py-1.5 text-xs font-medium text-blue-800">
                    <svg
                      className="h-3.5 w-3.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM20 8v6m3-3h-6"
                      />
                    </svg>
                    {task.applicationCount ?? 0} {task.applicationCount === 1 ? "Proposal" : "Proposals"}
                  </span>
                </div>

                <div className="mt-auto flex items-center justify-between gap-3 border-t border-gray-200 pt-4">
                  <div>
                    <p className="text-xs font-medium text-gray-600">
                      Budget
                    </p>
                    <p className="mt-1 text-xl font-bold tracking-tight text-gray-950">
                      ₹{Number(task.budget).toLocaleString("en-IN")}
                    </p>
                  </div>

                  <Link
                    to={`/tasks/${task._id}`}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                  >
                    View Task
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default BrowseTasks;
