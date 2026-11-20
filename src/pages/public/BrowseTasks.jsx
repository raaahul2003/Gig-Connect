
import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { getTasks } from "../../services/taskService";
import ReactMarkdown from "react-markdown";

const categories = [
  "All Tasks",
  "Design",
  "Development",
  "Writing",
  "Data Entry",
  "Marketing",
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

  const filteredTasks = tasks.filter((task) => {
    if (task.status !== "open") return false;

    const matchesSearch = task.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "All Tasks" || task.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <p className="text-xs font-bold tracking-[0.16em] text-blue-600 sm:text-sm">
            THE MARKETPLACE
          </p>

          <h1 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
            Find your next opportunity
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base sm:leading-7">
            Discover tasks that match your skills, schedule, and interests.
          </p>

          <div className="mt-6 flex max-w-3xl flex-col gap-3 sm:mt-8 sm:flex-row">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search tasks by title..."
              aria-label="Search tasks by title"
              className="min-h-12 min-w-0 flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 text-base outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />

            {user?.role === "client" && (
              <Link
                to="/post-task"
                className="inline-flex min-h-12 items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-center font-semibold text-white transition hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition-colors"
              >
                Post a Task
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2" aria-label="Filter tasks by category">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                aria-pressed={category === item}
                className={`min-h-10 rounded-full px-4 py-2 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${category === item
                  ? "bg-blue-600 text-white"
                  : "border border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:text-blue-600"
                  }`}
              >
                {item}
              </button>
            ))}
          </div>

          <label className="flex w-full items-center justify-between gap-3 text-sm font-medium text-gray-600 sm:w-auto sm:justify-start">
            Sort by
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="min-h-10 min-w-0 rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="newest">Newest</option>
              <option value="budget-high">Highest budget</option>
              <option value="budget-low">Lowest budget</option>
            </select>
          </label>
        </div>

        <div className="mt-8 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 sm:mt-10">
          <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">
            Available tasks
          </h2>

          <span className="text-sm text-gray-500" aria-live="polite">
            {filteredTasks.length} tasks
          </span>
        </div>

        {filteredTasks.length === 0 ? (
          <div className="mt-5 rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-12 text-center sm:mt-6 sm:px-6 sm:py-16">
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
                className="flex min-w-0 flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md sm:p-6"
              >
                <div className="flex flex-wrap gap-2">
                  {task.isQuickTask && (
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                      Quick Task
                    </span>
                  )}

                  {task.isUrgent && (
                    <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                      Urgent
                    </span>
                  )}
                </div>

                <h3 className="mt-4 break-words text-lg font-semibold leading-6 text-gray-900">
                  {task.title}
                </h3>

                <div className="mt-2 line-clamp-4 break-words text-sm leading-6 text-gray-600">
                  <ReactMarkdown>{task.description || ""}</ReactMarkdown>
                </div>



                <div className="mt-auto flex items-center justify-between gap-3 border-t border-gray-100 pt-4">
                  <span className="font-semibold text-gray-900">
                    ₹{task.budget}
                  </span>

                  <Link
                    to={`/tasks/${task._id}`}
                    className="inline-flex min-h-10 items-center rounded-lg px-2 font-semibold text-blue-600 transition hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition-colors"
                  >
                    View task →
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
