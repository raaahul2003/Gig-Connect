
import { Link, useNavigate } from "react-router-dom";
import { LogOut, Bell } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../api/axios";

function DashboardHeader() {

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

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
    <header className="sticky top-0 z-30 flex flex-col gap-4 border-b border-gray-200/80 bg-white/90 px-4 py-4 shadow-sm backdrop-blur-lg sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">workspace</p>
        <h1 className="mt-1 text-lg font-semibold tracking-tight text-gray-950">
          Dashboard overview
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <Link
          to={
            user?.role === "client"
              ? "/client/notifications"
              : "/freelancer/notifications"
          }
          className="relative rounded-xl border border-gray-200 bg-white p-2.5 text-gray-600 transition hover:border-gray-300 hover:bg-gray-50 hover:text-blue-700"
          aria-label="Notifications"
          title="Notifications"
        >
          <Bell size={20} />

          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-xs font-semibold text-white">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Link>
        {user?.role === "client" && (
          <Link
            to="/post-task"
            className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            + Post a task
          </Link>
        )}

        <button
          type="button"
          onClick={handleLogout}
          aria-label="Log out"
          title="Log out"
          className="rounded-xl border border-gray-200 bg-white p-2.5 text-gray-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
}

export default DashboardHeader;
