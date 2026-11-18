
import { NavLink } from "react-router-dom";

const links = [
  { label: "Overview", to: "/freelancer/dashboard" },
  { label: "Find Tasks", to: "/browse" },
  { label: "My Applications", to: "/freelancer/applications" },
  { label: "Active Work", to: "/freelancer/active-work" },
  { label: "Submissions", to: "/freelancer/submissions" },
  { label: "Earnings", to: "/freelancer/earnings" },
  { label: "Notifications", to: "/freelancer/notifications" },
  { label: "Messages", to: "/freelancer/messages" },
  { label: "My Profile", to: "/freelancer/profile" },
];

function FreelancerSidebar() {
  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-gray-200 bg-white md:sticky md:top-0 md:h-screen md:w-64 md:border-b-0 md:border-r">
      <div className="border-b border-gray-100 px-6 py-5">
        <NavLink to="/" className="text-xl font-bold tracking-tight text-gray-950">
          Gig<span className="text-blue-600">Connect</span>
        </NavLink>
        <p className="mt-1 text-xs text-gray-500">Freelancer workspace</p>
      </div>

      <nav
        aria-label="Freelancer navigation"
        className="flex gap-2 overflow-x-auto p-3 md:flex-1 md:flex-col md:gap-1.5 md:overflow-y-auto md:overflow-x-hidden md:p-4"
      >
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/freelancer/dashboard"}
            className={({ isActive }) =>
              `shrink-0 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? "bg-blue-50 font-semibold text-blue-700 ring-1 ring-inset ring-blue-100"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-950"
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="hidden border-t border-gray-100 p-4 md:block">
        <NavLink
          to="/freelancer/settings"
          className="block rounded-lg px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-50"
        >
          Settings
        </NavLink>
        <NavLink
          to="/"
          className="mt-1 block rounded-lg px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-50"
        >
          Back to marketplace
        </NavLink>
      </div>
    </aside>
  );
}

export default FreelancerSidebar;
