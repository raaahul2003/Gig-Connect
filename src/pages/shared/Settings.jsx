
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
      <main
        role="status"
        className="flex min-h-[300px] items-center justify-center text-sm text-gray-700"
      >
        Loading settings...
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-4xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
          Settings
        </h1>
        <p className="mt-1 text-base leading-6 text-gray-700">
          Manage notification preferences, password, and account security.
        </p>
      </header>

      <form
        onSubmit={handleSaveNotifications}
        aria-labelledby="notification-preferences-heading"
        aria-busy={savingNotifications}
        className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7"
      >
        <header>
          <h2
            id="notification-preferences-heading"
            className="text-lg font-semibold text-gray-950"
          >
            Notification preferences
          </h2>
          <p className="mt-1 text-sm leading-5 text-gray-700">
            Choose which platform updates you want to receive.
          </p>
        </header>

        <fieldset className="mt-5">
          <legend className="sr-only">Notification types</legend>
          <div className="divide-y divide-gray-200 border-y border-gray-200">
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
                className="flex min-h-[76px] cursor-pointer items-center justify-between gap-5 py-4"
              >
                <span className="min-w-0">
                  <span className="block text-base font-semibold text-gray-900">
                    {item.label}
                  </span>
                  <span className="mt-1 block text-sm leading-5 text-gray-700">
                    {item.description}
                  </span>
                </span>

                <input
                  type="checkbox"
                  name={item.name}
                  checked={preferences[item.name]}
                  onChange={handlePreferenceChange}
                  className="h-5 w-5 shrink-0 accent-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                />
              </label>
            ))}
          </div>
        </fieldset>

        <div className="mt-5 flex flex-col gap-3 border-t border-gray-200 pt-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleResetNotifications}
            disabled={savingNotifications}
            className="inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-800 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 sm:w-auto"
          >
            Reset
          </button>

          <button
            type="submit"
            disabled={savingNotifications}
            className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 sm:w-auto"
          >
            {savingNotifications ? "Saving..." : "Save preferences"}
          </button>
        </div>
      </form>

      <form
        onSubmit={handlePasswordChange}
        aria-labelledby="change-password-heading"
        aria-busy={changingPassword}
        className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7"
      >
        <header>
          <h2
            id="change-password-heading"
            className="text-lg font-semibold text-gray-950"
          >
            Change password
          </h2>
          <p className="mt-1 text-sm leading-5 text-gray-700">
            Use a strong password to keep your account secure.
          </p>
        </header>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
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
              className={`block text-sm font-semibold text-gray-900 ${
                field.name === "currentPassword" ? "md:col-span-2" : ""
              }`}
            >
              {field.label}

              <input
                id={field.name}
                type="password"
                name={field.name}
                value={passwords[field.name]}
                onChange={handlePasswordInput}
                autoComplete={field.autoComplete}
                minLength={field.name !== "currentPassword" ? 8 : undefined}
                required
                aria-describedby={
                  field.name !== "currentPassword"
                    ? "new-password-help"
                    : undefined
                }
                className="mt-2 min-h-11 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-base font-normal text-gray-950 outline-none transition-colors focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
              />
              {field.name === "newPassword" && (
                <span
                  id="new-password-help"
                  className="mt-2 block text-sm font-normal text-gray-600"
                >
                  Use at least 8 characters.
                </span>
              )}
            </label>
          ))}
        </div>

        <div className="mt-5 flex flex-col gap-3 border-t border-gray-200 pt-5 sm:flex-row sm:justify-end">
          <button
            type="submit"
            disabled={changingPassword}
            className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 sm:w-auto"
          >
            {changingPassword ? "Updating..." : "Update Password"}
          </button>
        </div>
      </form>

      <section
        aria-labelledby="account-security-heading"
        className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7"
      >
        <h2
          id="account-security-heading"
          className="text-lg font-semibold text-gray-950"
        >
          Account security
        </h2>

        <p className="mt-1 text-sm leading-5 text-gray-700">
          Email address and verification status for this account.
        </p>

        <div className="mt-5 flex flex-col gap-4 border-t border-gray-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-gray-700">
              Registered email
            </p>
            <p className="mt-1 break-all text-base font-semibold text-gray-950">
              {user?.email || "Email unavailable"}
            </p>
          </div>

          <span
            className={`inline-flex min-h-9 w-fit items-center rounded-full border px-3 py-1 text-sm font-semibold ${
              user?.isEmailVerified
                ? "border-green-200 bg-green-50 text-green-900"
                : "border-amber-300 bg-amber-50 text-amber-900"
            }`}
          >
            {user?.isEmailVerified
              ? "Email verified"
              : "Email not verified"}
          </span>
        </div>
      </section>
    </main>
  );
}
