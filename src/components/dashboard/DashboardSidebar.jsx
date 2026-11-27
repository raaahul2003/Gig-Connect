
import { NavLink } from "react-router-dom";

const links = [
  { label: "Overview", to: "/client/dashboard" },
  { label: "My Tasks", to: "/client/tasks" },
  { label: "My Profile", to: "/client/profile" },
  { label: "Applications", to: "/client/applications" },
  { label: "Active Work", to: "/client/active-work" },
  { label: "Work Progress", to: "/client/progress" },
  { label: "Submissions", to: "/client/submissions" },
  { label: "Payments", to: "/client/payments" },
  { label: "Notifications", to: "/client/notifications" },
  { label: "Messages", to: "/client/messages" },
];

function DashboardSidebar({ mobileMenuOpen, onCloseMobileMenu }) {
  return (
    <aside className={`${mobileMenuOpen ? "flex" : "hidden"} w-full shrink-0 flex-col border-b border-gray-200 bg-white md:sticky md:top-0 md:col-start-1 md:row-start-1 md:row-span-2 md:flex md:h-screen md:w-64 md:border-b-0 md:border-r`}>
      <div className="hidden border-b border-gray-200 px-5 py-5 md:block">
        <div>
          <NavLink
            to="/"
            className="inline-block rounded-sm text-xl font-bold tracking-tight text-gray-950 transition-colors hover:text-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700"
          >
            Gig<span className="text-blue-600">Connect</span>
          </NavLink>
          <p className="mt-0.5 text-sm text-gray-600">Client workspace</p>
        </div>
      </div>

      <nav
        id="client-navigation"
        aria-label="Client navigation"
        className={`${mobileMenuOpen ? "grid" : "hidden"} grid-cols-2 gap-2 p-3 md:flex md:flex-1 md:flex-col md:gap-1 md:overflow-y-auto md:overflow-x-hidden md:p-4`}
      >
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/client/dashboard"}
            onClick={onCloseMobileMenu}
            className={({ isActive }) =>
              `inline-flex min-h-11 min-w-0 w-full items-center rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 md:justify-start ${
                isActive
                  ? "bg-blue-50 font-semibold text-blue-800 ring-1 ring-inset ring-blue-100"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-950"
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div
        className={`${mobileMenuOpen ? "grid" : "hidden"} grid-cols-2 gap-2 border-t border-gray-200 p-3 md:mt-auto md:grid md:grid-cols-1 md:gap-1 md:p-4`}
      >
        <NavLink
          to="/client/settings"
          onClick={onCloseMobileMenu}
          className={({ isActive }) =>
            `inline-flex min-h-11 items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-gray-50 hover:text-gray-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 ${
              isActive ? "bg-blue-50 font-semibold text-blue-800" : "text-gray-700"
            }`
          }
        >
          Settings
        </NavLink>

        <NavLink
          to="/"
          onClick={onCloseMobileMenu}
          className="inline-flex min-h-11 items-center rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 md:mt-0"
        >
          Back to marketplace
        </NavLink>
      </div>
    </aside>
  );
}

export default DashboardSidebar;
