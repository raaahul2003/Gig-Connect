
import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch notifications from backend
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

  // Mark one notification as read
  async function markAsRead(id) {
    try {
      await api.patch(`/notifications/${id}/read`);

      setNotifications((current) =>
        current.map((item) =>
          item._id === id ? { ...item, isRead: true } : item
        )
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to mark notification as read."
      );
    }
  }

  // Mark all notifications as read
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
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">
            Notifications
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Stay updated on your tasks and account activity.
          </p>
        </div>

        <button
          type="button"
          onClick={markAllAsRead}
          disabled={unreadCount === 0}
          className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition-colors"
        >
          Mark all as read
        </button>
      </div>

      <div className="flex gap-2">
        {["All", "Unread"].map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setFilter(item)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              filter === item
                ? "bg-blue-600 text-white"
                : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            {item}
            {item === "Unread" && unreadCount > 0 && (
              <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-xs">
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow">
        {loading ? (
          <div className="px-6 py-14 text-center text-sm text-gray-500">
            Loading notifications...
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="h-7 w-7 text-blue-600"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9m-8 12h4"
                />
              </svg>
            </div>

            <h2 className="mt-4 font-semibold text-gray-900">
              {filter === "Unread"
                ? "You're all caught up"
                : "No notifications yet"}
            </h2>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">
              {filter === "Unread"
                ? "You have no unread notifications."
                : "Updates about applications, tasks, submissions, and payments will appear here."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredNotifications.map((item) => (
              <article
                key={item._id}
                className={`flex items-start gap-3 p-5 ${
                  item.isRead ? "bg-white" : "bg-blue-50/50"
                }`}
              >
                <div
                  className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${
                    item.isRead ? "bg-gray-300" : "bg-blue-600"
                  }`}
                  aria-label={item.isRead ? "Read" : "Unread"}
                />

                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-gray-900">
                    {item.title}
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    {item.message}
                  </p>

                  <p className="mt-2 text-xs text-gray-400">
                    {formatDate(item.createdAt)}
                  </p>
                </div>

                {!item.isRead && (
                  <button
                    type="button"
                    onClick={() => markAsRead(item._id)}
                    className="shrink-0 text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    Mark read
                  </button>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
