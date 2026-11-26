
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  getMyProfile,
  updateNotificationPreferences,
  changePassword,
} from "../../services/profileService";

const defaultPreferences = {
  taskUpdates: true,
  applicationUpdates: true,
  paymentUpdates: true,
};

export default function Settings() {
  const [user, setUser] = useState(null);
  const [preferences, setPreferences] = useState(defaultPreferences);
  const [originalPreferences, setOriginalPreferences] =
    useState(defaultPreferences);

  const [loading, setLoading] = useState(true);
  const [savingNotifications, setSavingNotifications] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await getMyProfile();
        const currentUser = response.user;

        setUser(currentUser);

        const savedPreferences = {
          taskUpdates:
            currentUser.notificationPreferences?.taskUpdates ?? true,
          applicationUpdates:
            currentUser.notificationPreferences?.applicationUpdates ?? true,
          paymentUpdates:
            currentUser.notificationPreferences?.paymentUpdates ?? true,
        };

        setPreferences(savedPreferences);
        setOriginalPreferences(savedPreferences);
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Unable to load account settings."
        );
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handlePreferenceChange = (event) => {
    const { name, checked } = event.target;

    setPreferences((current) => ({
      ...current,
      [name]: checked,
    }));
  };

  const handleSaveNotifications = async (event) => {
    event.preventDefault();

    try {
      setSavingNotifications(true);

      const response =
        await updateNotificationPreferences(preferences);

      const saved = response.notificationPreferences;

      setPreferences(saved);
      setOriginalPreferences(saved);

      toast.success("Notification preferences saved.");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to save notification preferences."
      );
    } finally {
      setSavingNotifications(false);
    }
  };

  const handleResetNotifications = () => {
    setPreferences(originalPreferences);
  };

  const handlePasswordInput = (event) => {
    const { name, value } = event.target;

    setPasswords((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handlePasswordChange = async (event) => {
    event.preventDefault();

    if (
      !passwords.currentPassword ||
      !passwords.newPassword ||
      !passwords.confirmPassword
    ) {
      toast.error("Please complete all password fields.");
      return;
    }

    if (passwords.newPassword.length < 8) {
      toast.error("New password must contain at least 8 characters.");
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    try {
      setChangingPassword(true);

      const response = await changePassword(passwords);

      toast.success(
        response.message || "Password changed successfully."
      );

      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to change password."
      );
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-sm text-gray-500">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Page heading */}
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">
          Settings
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your notifications and account security.
        </p>
      </div>

      {/* Notification preferences */}
      <form
        onSubmit={handleSaveNotifications}
        className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7"
      >
        <div>
          <h2 className="font-semibold text-gray-900">
            Notification Preferences
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Choose which platform updates you want to receive.
          </p>
        </div>

        <div className="mt-6 space-y-5">
          {[
            {
              name: "taskUpdates",
              label: "Task updates",
              description:
                "Stay informed about task progress and status changes.",
            },
            {
              name: "applicationUpdates",
              label: "Application updates",
              description:
                "Receive updates about submitted and received applications.",
            },
            {
              name: "paymentUpdates",
              label: "Payment updates",
              description:
                "Receive updates about payments and earnings.",
            },
          ].map((item) => (
            <label
              key={item.name}
              className="flex cursor-pointer items-start justify-between gap-4"
            >
              <span>
                <span className="block text-sm font-medium text-gray-800">
                  {item.label}
                </span>
                <span className="mt-1 block text-sm text-gray-500">
                  {item.description}
                </span>
              </span>

              <input
                type="checkbox"
                name={item.name}
                checked={preferences[item.name]}
                onChange={handlePreferenceChange}
                className="mt-1 h-4 w-4 shrink-0 accent-blue-600"
              />
            </label>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-gray-100 pt-5">
          <button
            type="button"
            onClick={handleResetNotifications}
            disabled={savingNotifications}
            className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Reset
          </button>

          <button
            type="submit"
            disabled={savingNotifications}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {savingNotifications ? "Saving..." : "Save Preferences"}
          </button>
        </div>
      </form>

      {/* Change password */}
      <form
        onSubmit={handlePasswordChange}
        className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7"
      >
        <div>
          <h2 className="font-semibold text-gray-900">
            Change Password
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Use a strong password to keep your account secure.
          </p>
        </div>

        <div className="mt-6 space-y-4">
          {[
            {
              name: "currentPassword",
              label: "Current password",
              autoComplete: "current-password",
            },
            {
              name: "newPassword",
              label: "New password",
              autoComplete: "new-password",
            },
            {
              name: "confirmPassword",
              label: "Confirm new password",
              autoComplete: "new-password",
            },
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
                onChange={handlePasswordInput}
                autoComplete={field.autoComplete}
                minLength={field.name !== "currentPassword" ? 8 : undefined}
                required
                className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2.5 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </label>
          ))}
        </div>

        <div className="mt-6 flex justify-end border-t border-gray-100 pt-5">
          <button
            type="submit"
            disabled={changingPassword}
            className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {changingPassword ? "Updating..." : "Update Password"}
          </button>
        </div>
      </form>

      {/* Account security */}
      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
        <h2 className="font-semibold text-gray-900">
          Account Security
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Your registered account information.
        </p>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Registered email
            </p>
            <p className="mt-1 break-all text-sm font-medium text-gray-900">
              {user?.email || "Email unavailable"}
            </p>
          </div>

          <span
            className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-medium ${
              user?.isEmailVerified
                ? "bg-green-50 text-green-700"
                : "bg-amber-50 text-amber-700"
            }`}
          >
            {user?.isEmailVerified
              ? "Email verified"
              : "Email not verified"}
          </span>
        </div>
      </section>
    </div>
  );
}
