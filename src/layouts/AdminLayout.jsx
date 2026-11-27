
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

const adminLinks = [
  { label: "Dashboard", to: "/admin/dashboard", icon: "▦" },
  { label: "Users", to: "/admin/users", icon: "♙" },
  { label: "Task Moderation", to: "/admin/tasks", icon: "▤" },
  { label: "Transactions", to: "/admin/transactions", icon: "₹" },
  { label: "Disputes", to: "/admin/disputes", icon: "⚖" },
  { label: "Settings", to: "/admin/settings", icon: "⚙" },
];

export default function AdminLayout() {

  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("auth-changed"));
    navigate("/login", { replace: true });
  }

  return (
    <div className="min-h-screen bg-gray-50 lg:flex">
      <aside className="flex w-full flex-col border-b border-gray-200 bg-white lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r">
        <div className="border-b border-gray-200 px-5 py-4 sm:px-6 sm:py-5">
          <h1 className="text-xl font-bold tracking-tight text-gray-950">
            GigConnect<span className="text-blue-700">.</span>
          </h1>
          <p className="mt-1 text-sm font-medium text-gray-700">
            Administration
          </p>
        </div>

        <nav
          aria-label="Admin navigation"
          className="flex gap-2 overflow-x-auto p-3 lg:flex-1 lg:flex-col lg:gap-1 lg:overflow-x-hidden lg:overflow-y-auto lg:p-4"
        >
          {adminLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `inline-flex min-h-11 shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 lg:w-full ${isActive
                  ? "bg-blue-50 font-semibold text-blue-800 ring-1 ring-inset ring-blue-100"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-950"
                }`
              }
            >
              <span aria-hidden="true" className="w-5 text-center text-current">
                {link.icon}
              </span>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-gray-200 p-3 lg:mt-auto lg:p-4">
          <p className="text-sm leading-5 text-gray-600">
            GigConnect Admin Panel
          </p>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold text-gray-900">
            Administration
          </p>

          <div className="flex items-center gap-3">
            <span className="rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700">
              Admin UI
            </span>

            <button
              type="button"
              onClick={handleLogout}
              title="Logout"
              aria-label="Logout"
              className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-gray-300 text-gray-700 transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
            >
              <LogOut size={20} aria-hidden="true" />
            </button>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
