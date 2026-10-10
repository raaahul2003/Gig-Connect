
import { NavLink, Outlet } from "react-router-dom";

const adminLinks = [
  { label: "Dashboard", to: "/admin/dashboard", icon: "▦" },
  { label: "Users", to: "/admin/users", icon: "♙" },
  { label: "Task Moderation", to: "/admin/tasks", icon: "▤" },
  { label: "Disputes", to: "/admin/disputes", icon: "⚖" },
  { label: "Settings", to: "/admin/settings", icon: "⚙" },
];

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-50 lg:flex">
      <aside className="flex w-full flex-col border-b border-gray-200 bg-white lg:min-h-screen lg:w-64 lg:border-b-0 lg:border-r">
        <div className="border-b border-gray-100 px-6 py-5">
          <h1 className="text-xl font-bold tracking-tight text-gray-900">
            GigConnect<span className="text-blue-600">.</span>
          </h1>
          <p className="mt-1 text-xs font-medium uppercase tracking-wider text-gray-400">
            Administration
          </p>
        </div>

        <nav
          aria-label="Admin navigation"
          className="flex gap-2 overflow-x-auto p-3 lg:flex-1 lg:flex-col lg:overflow-visible"
        >
          {adminLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`
              }
            >
              <span aria-hidden="true" className="w-5 text-center">
                {link.icon}
              </span>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden border-t border-gray-100 p-4 lg:block">
          <p className="text-xs leading-5 text-gray-500">
            GigConnect Admin Panel
          </p>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-5 sm:px-8">
          <div>
            <p className="text-sm font-medium text-gray-800">
              Administration
            </p>
          </div>
          <span className="rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-gray-600">
            Admin UI
          </span>
        </header>

        <main className="p-5 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
