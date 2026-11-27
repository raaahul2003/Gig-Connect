
import { Link, useNavigate } from "react-router-dom";
import { Bell, LogOut, Menu, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../api/axios";

function DashboardHeader({ mobileMenuOpen, onToggleMobileMenu }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isClient = user?.role === "client";
  const navigationId = isClient
    ? "client-navigation"
    : "freelancer-navigation";

  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await api.get("/notifications/unread-count");
        setUnreadCount(response.data.unreadCount);
      } catch (error) {
        console.error("Failed to fetch unread notifications:", error);
      }
    };

    fetchUnreadCount();

    const interval = setInterval(fetchUnreadCount, 30000);

    return () => clearInterval(interval);
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  }

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white px-3 py-2 sm:px-6 sm:py-2.5 lg:px-8 md:col-start-2 md:row-start-1">
      <div className="mx-auto flex min-h-11 w-full max-w-[1600px] items-center justify-between gap-2">
        <div className="min-w-0 md:hidden">
          <Link
            to="/"
            className="block rounded-sm text-lg font-bold leading-6 tracking-tight text-gray-950 transition-colors hover:text-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
          >
            Gig<span className="text-blue-600">Connect</span>
          </Link>
          <p className="truncate text-xs leading-4 text-gray-600">
            {isClient ? "Client workspace" : "Freelancer workspace"}
          </p>
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
          <Link
            to={
              isClient
                ? "/client/notifications"
                : "/freelancer/notifications"
            }
            className="relative inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
            aria-label={
              unreadCount > 0
                ? `Notifications, ${unreadCount} unread`
                : "Notifications"
            }
            title="Notifications"
          >
            <Bell size={20} aria-hidden="true" />

            {unreadCount > 0 && (
              <span
                aria-hidden="true"
                className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-700 px-1 text-xs font-semibold text-white"
              >
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </Link>

          {isClient && (
            <Link
              to="/post-task"
              aria-label="Post a task"
              title="Post a task"
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-700 text-sm font-semibold text-white transition-colors hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 sm:w-auto sm:px-4"
            >
              <Plus size={20} aria-hidden="true" className="sm:hidden" />
              <span className="hidden sm:inline">+ Post a task</span>
            </Link>
          )}

          <button
            type="button"
            onClick={handleLogout}
            aria-label="Log out"
            title="Log out"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
          >
            <LogOut size={20} aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={onToggleMobileMenu}
            aria-expanded={mobileMenuOpen}
            aria-controls={navigationId}
            aria-label={mobileMenuOpen ? "Close navigation" : "Open navigation"}
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-gray-300 text-gray-800 transition-colors hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 md:hidden"
          >
            {mobileMenuOpen ? (
              <X size={20} aria-hidden="true" />
            ) : (
              <Menu size={20} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

export default DashboardHeader;
