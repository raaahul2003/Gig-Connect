
import { useState } from "react";

const initialSettings = {
  fullName: "",
  email: "",
  phone: "",
  emailNotifications: true,
  taskUpdates: true,
  marketingEmails: false,
};

export default function Settings() {
  const [settings, setSettings] = useState(initialSettings);
  const [passwords, setPasswords] = useState({
    current: "",
    next: "",
    confirm: "",
  });
  const [message, setMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  function updateSetting(event) {
    const { name, value, type, checked } = event.target;

    setSettings((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
    setMessage("");
  }

  function handleSave(event) {
    event.preventDefault();

    if (!settings.fullName.trim() || !settings.email.trim()) {
      setMessage("Please enter your name and email address.");
      return;
    }

    setMessage(
      "Changes are reflected on this page only. Backend saving is not connected yet."
    );
  }

  function handlePasswordChange(event) {
    event.preventDefault();
    setPasswordMessage("");

    if (!passwords.current || !passwords.next || !passwords.confirm) {
      setPasswordMessage("Please complete all password fields.");
      return;
    }

    if (passwords.next.length < 8) {
      setPasswordMessage("Your new password must be at least 8 characters.");
      return;
    }

    if (passwords.next !== passwords.confirm) {
      setPasswordMessage("The new passwords do not match.");
      return;
    }

    setPasswordMessage(
      "Password validation passed. Connect the backend to change your password."
    );
    setPasswords({ current: "", next: "", confirm: "" });
  }

  function handleCancel() {
    setSettings(initialSettings);
    setMessage("");
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account details and preferences.
        </p>
      </div>

      <form
        onSubmit={handleSave}
        className="space-y-6 rounded-xl border border-gray-200 bg-white p-5 sm:p-7"
      >
        <div>
          <h2 className="font-semibold text-gray-900">Account Information</h2>
          <p className="mt-1 text-sm text-gray-500">
            Update your basic contact details.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <label className="block text-sm font-medium text-gray-700">
            Full name
            <input
              name="fullName"
              value={settings.fullName}
              onChange={updateSetting}
              required
              autoComplete="name"
              placeholder="Enter your full name"
              className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2.5 font-normal outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </label>

          <label className="block text-sm font-medium text-gray-700">
            Email address
            <input
              name="email"
              type="email"
              value={settings.email}
              onChange={updateSetting}
              required
              autoComplete="email"
              placeholder="you@example.com"
              className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2.5 font-normal outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </label>

          <label className="block text-sm font-medium text-gray-700 sm:col-span-2">
            Phone number
            <input
              name="phone"
              type="tel"
              value={settings.phone}
              onChange={updateSetting}
              autoComplete="tel"
              placeholder="Enter your phone number"
              className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2.5 font-normal outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </label>
        </div>

        <div className="border-t border-gray-100 pt-5">
          <h2 className="font-semibold text-gray-900">
            Notification Preferences
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Choose which updates you would like to receive.
          </p>

          <div className="mt-5 space-y-4">
            {[
              {
                name: "emailNotifications",
                label: "Email notifications",
                description: "Receive important account updates by email.",
              },
              {
                name: "taskUpdates",
                label: "Task updates",
                description: "Get notified about applications and task progress.",
              },
              {
                name: "marketingEmails",
                label: "Product announcements",
                description: "Receive optional product news and announcements.",
              },
            ].map((item) => (
              <label
                key={item.name}
                className="flex cursor-pointer items-start gap-3"
              >
                <input
                  type="checkbox"
                  name={item.name}
                  checked={settings[item.name]}
                  onChange={updateSetting}
                  className="mt-1 h-4 w-4 accent-blue-600"
                />
                <span>
                  <span className="block text-sm font-medium text-gray-800">
                    {item.label}
                  </span>
                  <span className="mt-1 block text-sm text-gray-500">
                    {item.description}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </div>

        {message && (
          <p role="status" className="text-sm text-blue-700">
            {message}
          </p>
        )}

        <div className="flex flex-wrap justify-end gap-3 border-t border-gray-100 pt-5">
          <button
            type="button"
            onClick={handleCancel}
            className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Reset
          </button>
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </form>

      <form
        onSubmit={handlePasswordChange}
        className="space-y-5 rounded-xl border border-gray-200 bg-white p-5 sm:p-7"
      >
        <div>
          <h2 className="font-semibold text-gray-900">Change Password</h2>
          <p className="mt-1 text-sm text-gray-500">
            Password changes require server-side authentication.
          </p>
        </div>

        {[
          { name: "current", label: "Current password" },
          { name: "next", label: "New password" },
          { name: "confirm", label: "Confirm new password" },
        ].map((field) => (
          <label
            key={field.name}
            className="block text-sm font-medium text-gray-700"
          >
            {field.label}
            <input
              type="password"
              name={field.name}
              value={passwords[field.name]}
              onChange={(event) =>
                setPasswords((current) => ({
                  ...current,
                  [field.name]: event.target.value,
                }))
              }
              autoComplete={
                field.name === "current"
                  ? "current-password"
                  : "new-password"
              }
              className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </label>
        ))}

        {passwordMessage && (
          <p role="status" className="text-sm text-blue-700">
            {passwordMessage}
          </p>
        )}

        <button
          type="submit"
          className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
        >
          Update Password
        </button>
      </form>
    </div>
  );
}
