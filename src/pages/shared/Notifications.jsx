
import { useState } from "react";

export default function Notifications() {
  // Real notifications will be loaded from the backend later.
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("All");

  const filteredNotifications =
    filter === "Unread"
      ? notifications.filter((item) => !item.read)
      : notifications;

  function markAsRead(id) {
    setNotifications((current) =>
      current.map((item) =>
        item.id === id ? { ...item, read: true } : item
      )
    );
  }

  function markAllAsRead() {
    setNotifications((current) =>
      current.map((item) => ({ ...item, read: true }))
    );
  }

  const unreadCount = notifications.filter((item) => !item.read).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
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

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        {filteredNotifications.length === 0 ? (
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
                key={item.id}
                className={`flex items-start gap-3 p-5 ${
                  item.read ? "bg-white" : "bg-blue-50/50"
                }`}
              >
                <div
                  className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${
                    item.read ? "bg-gray-300" : "bg-blue-600"
                  }`}
                  aria-label={item.read ? "Read" : "Unread"}
                />

                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-gray-900">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    {item.message}
                  </p>
                  <p className="mt-2 text-xs text-gray-400">
                    {item.time}
                  </p>
                </div>

                {!item.read && (
                  <button
                    type="button"
                    onClick={() => markAsRead(item.id)}
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
