
import { useState } from "react";
import { Link } from "react-router-dom";

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

  // useEffect(() => {
  //   const syncUser = () =>
  //     setUser(JSON.parse(localStorage.getItem("user") || "null"));

  //   window.addEventListener("storage", syncUser);
  //   window.addEventListener("auth-changed", syncUser);

  //   return () => {
  //     window.removeEventListener("storage", syncUser);
  //     window.removeEventListener("auth-changed", syncUser);
  //   };
  // }, []);

  // Task data will come from our API later.
  const tasks = [];

  const filteredTasks = tasks.filter((task) => {
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
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-6">
          <p className="text-sm font-semibold text-blue-600">
            THE MARKETPLACE
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Find your next opportunity
          </h1>

          <p className="mt-3 max-w-2xl text-gray-600">
            Discover tasks that match your skills, schedule, and interests.
          </p>

          <div className="mt-8 flex max-w-3xl flex-col gap-3 sm:flex-row">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search tasks by title..."
              aria-label="Search tasks by title"
              className="min-w-0 flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />

            {user?.role === "client" && (
              <Link
                to="/client/post-task"
                className="rounded-xl bg-blue-600 px-6 py-3 text-center font-semibold text-white transition hover:bg-blue-700"
              >
                Post a Task
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                aria-pressed={category === item}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${category === item
                  ? "bg-blue-600 text-white"
                  : "border border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:text-blue-600"
                  }`}
              >
                {item}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-3 text-sm text-gray-600">
            Sort by
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none focus:border-blue-500"
            >
              <option value="newest">Newest</option>
              <option value="budget-high">Highest budget</option>
              <option value="budget-low">Lowest budget</option>
            </select>
          </label>
        </div>

        <div className="mt-10 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Available tasks
          </h2>

          <span className="text-sm text-gray-500">
            {filteredTasks.length} tasks
          </span>
        </div>

        {filteredTasks.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
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
                className="mt-5 font-semibold text-blue-600 hover:text-blue-700"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredTasks.map((task) => (
              <article
                key={task.id}
                className="rounded-2xl border border-gray-200 bg-white p-6"
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

                <h3 className="mt-4 text-lg font-semibold text-gray-900">
                  {task.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {task.description}
                </p>

                <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
                  <span className="font-semibold text-gray-900">
                    ₹{task.budget}
                  </span>

                  <Link
                    to={`/tasks/${task.id}`}
                    className="font-semibold text-blue-600 hover:text-blue-700"
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
