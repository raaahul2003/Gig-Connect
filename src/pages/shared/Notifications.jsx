
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/notifications");
        setNotifications(response.data.notifications || []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
          "Failed to load notifications."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const filteredNotifications =
    filter === "Unread"
      ? notifications.filter((item) => !item.isRead)
      : notifications;

  async function markAsRead(id) {
    await api.patch(`/notifications/${id}/read`);

    setNotifications((current) =>
      current.map((item) =>
        item._id === id ? { ...item, isRead: true } : item
      )
    );
  }

  async function handleNotificationClick(item) {
    try {
      if (!item.isRead) {
        await markAsRead(item._id);
      }

      if (item.link) {
        const destination = new URL(item.link, window.location.origin);

        // Only allow navigation within this application.
        if (destination.origin === window.location.origin) {
          navigate(
            destination.pathname + destination.search + destination.hash
          );
          return;
        }
      }

      // Fallback for older notifications without a destination.
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      const fallbackRoutes = {
        application_received: "/client/applications",
        application_accepted: "/freelancer/active-work",
        application_rejected: "/freelancer/applications",
        submission_received: "/client/submissions",
        revision_requested: "/freelancer/submissions",
        submission_approved: "/freelancer/submissions",
        payment_received: "/freelancer/earnings",
        message_received: null,
      };

      const fallback = fallbackRoutes[item.type];

      if (fallback) {
        navigate(fallback);
      } else if (item.type === "message_received") {
        navigate(
          user.role === "client"
            ? "/client/messages"
            : "/freelancer/messages"
        );
      } else {
        navigate(
          user.role === "client"
            ? "/client/dashboard"
            : "/freelancer/dashboard"
        );
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to open this notification."
      );
    }
  }

  async function markAllAsRead() {
    try {
      await api.patch("/notifications/read-all");

      setNotifications((current) =>
        current.map((item) => ({ ...item, isRead: true }))
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to mark all notifications as read."
      );
    }
  }

  const unreadCount = notifications.filter(
    (item) => !item.isRead
  ).length;

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <main className="mx-auto w-full max-w-6xl space-y-6">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
            Notifications
          </h1>
          <p className="mt-1 text-base leading-6 text-gray-700">
            Stay updated on your tasks and account activity.
          </p>
        </div>

        <button
          type="button"
          onClick={markAllAsRead}
          disabled={unreadCount === 0}
          className="inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-800 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 sm:w-auto"
        >
          Mark all as read
        </button>
      </header>

      <div
        role="group"
        aria-label="Filter notifications"
        className="flex flex-wrap gap-2"
      >
        {["All", "Unread"].map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setFilter(item)}
            aria-pressed={filter === item}
            className={`inline-flex min-h-11 items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 ${
              filter === item
                ? "bg-blue-700 text-white hover:bg-blue-800"
                : "border border-gray-300 bg-white text-gray-800 hover:bg-gray-50"
            }`}
          >
            {item}
            {item === "Unread" && unreadCount > 0 && (
              <span
                className={`ml-2 rounded-full px-2 py-0.5 text-xs font-semibold ${
                  filter === item
                    ? "bg-white/20 text-white"
                    : "bg-blue-50 text-blue-900"
                }`}
              >
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-900"
        >
          {error}
        </div>
      )}

      <section
        aria-label="Notification list"
        className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
      >
        {loading ? (
          <p
            role="status"
            className="px-6 py-12 text-center text-sm text-gray-700"
          >
            Loading notifications...
          </p>
        ) : filteredNotifications.length === 0 ? (
          <div className="px-6 py-10 text-center sm:py-12">
            <h2 className="text-base font-semibold text-gray-950">
              {filter === "Unread"
                ? "You're all caught up"
                : "No notifications yet"}
            </h2>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-700">
              {filter === "Unread"
                ? "You have no unread notifications."
                : "Updates about applications, tasks, submissions, and payments will appear here."}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filteredNotifications.map((item) => (
              <li key={item._id}>
                <button
                  type="button"
                  onClick={() => handleNotificationClick(item)}
                  className={`group flex min-h-11 w-full items-start gap-3 border-l-4 px-4 py-4 text-left transition-colors hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-700 sm:gap-4 sm:px-5 ${
                    item.isRead
                      ? "border-l-transparent bg-white"
                      : "border-l-blue-700 bg-blue-50/50"
                  }`}
                >
                  <span className="min-w-0 flex-1">
                    <span className="block text-base font-semibold leading-6 text-gray-950">
                      {item.title}
                    </span>

                    <span className="mt-1 block whitespace-pre-wrap break-words text-sm leading-6 text-gray-700">
                      {item.message}
                    </span>

                    <time
                      dateTime={item.createdAt || undefined}
                      className="mt-2 block text-sm text-gray-600"
                    >
                      {formatDate(item.createdAt)}
                    </time>

                    <span className="mt-2 block text-sm font-semibold text-blue-800 underline decoration-transparent underline-offset-2 group-hover:decoration-current">
                      View details →
                    </span>
                  </span>

                  {!item.isRead && (
                    <span
                      aria-label="Unread notification"
                      className="shrink-0 rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-900"
                    >
                      New
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
