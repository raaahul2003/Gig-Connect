
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
          className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
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

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {loading ? (
          <div className="px-6 py-14 text-center text-sm text-gray-500">
            Loading notifications...
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
              <span className="text-2xl">🔔</span>
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
                onClick={() => handleNotificationClick(item)}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    handleNotificationClick(item);
                  }
                }}
                className={`flex cursor-pointer items-start gap-3 p-5 transition hover:bg-blue-50 ${
                  item.isRead ? "bg-white" : "bg-blue-50/50"
                }`}
              >
                <div
                  className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${
                    item.isRead ? "bg-gray-300" : "bg-blue-600"
                  }`}
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

                  <p className="mt-2 text-xs font-medium text-blue-600">
                    View details →
                  </p>
                </div>

                {!item.isRead && (
                  <span className="shrink-0 text-xs font-medium text-blue-600">
                    New
                  </span>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
