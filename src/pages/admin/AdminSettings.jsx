
import { useEffect, useState } from "react";
import api from "../../api/axios";

const initialSettings = {
  platformName: "GigConnect",
  supportEmail: "",
  commission: "5",
  requireTaskReview: true,
  maintenanceMode: false,
};

export default function AdminSettings() {
  const [settings, setSettings] = useState(initialSettings);
  const [savedSettings, setSavedSettings] = useState(initialSettings);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      setLoading(true);

      const response = await api.get("/admin/settings");
      const data = response.data.settings;

      const formattedSettings = {
        platformName: data.platformName || "GigConnect",
        supportEmail: data.supportEmail || "",
        commission: String(data.commission ?? 5),
        requireTaskReview: data.requireTaskReview ?? true,
        maintenanceMode: data.maintenanceMode ?? false,
      };

      setSettings(formattedSettings);
      setSavedSettings(formattedSettings);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to load settings."
      );
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }

  function updateSetting(event) {
    const { name, value, type, checked } = event.target;

    setSettings((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));

    setMessage("");
  }

  async function handleSave(event) {
    event.preventDefault();

    if (!settings.platformName.trim() || !settings.supportEmail.trim()) {
      setMessage("Enter the platform name and support email.");
      setMessageType("error");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(settings.supportEmail.trim())) {
      setMessage("Enter a valid support email address.");
      setMessageType("error");
      return;
    }

    const commission = Number(settings.commission);

    if (
      settings.commission.trim() === "" ||
      !Number.isFinite(commission) ||
      commission < 0 ||
      commission > 100
    ) {
      setMessage("Commission must be between 0 and 100.");
      setMessageType("error");
      return;
    }

    try {
      setSaving(true);
      setMessage("");

      const response = await api.put("/admin/settings", {
        ...settings,
        commission,
      });

      const data = response.data.settings;

      const formattedSettings = {
        platformName: data.platformName,
        supportEmail: data.supportEmail,
        commission: String(data.commission),
        requireTaskReview: data.requireTaskReview,
        maintenanceMode: data.maintenanceMode,
      };

      setSettings(formattedSettings);
      setSavedSettings(formattedSettings);
      setMessage("Platform settings saved successfully!");
      setMessageType("success");
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to save settings."
      );
      setMessageType("error");
    } finally {
      setSaving(false);
    }
  }

  function handleReset() {
    setSettings(savedSettings);
    setMessage("");
  }

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <p className="text-sm text-gray-500">Loading platform settings...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">
          Admin Settings
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Configure platform preferences and marketplace policies.
        </p>
      </div>

      <form
        onSubmit={handleSave}
        className="space-y-7 rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7"
      >
        <section>
          <h3 className="font-semibold text-gray-900">
            Platform Information
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Basic marketplace identity and support details.
          </p>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <label className="block text-sm font-medium text-gray-700">
              Platform name
              <input
                name="platformName"
                value={settings.platformName}
                onChange={updateSetting}
                required
                className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2.5 outline-none focus:border-blue-500"
              />
            </label>

            <label className="block text-sm font-medium text-gray-700">
              Support email
              <input
                type="email"
                name="supportEmail"
                value={settings.supportEmail}
                onChange={updateSetting}
                required
                placeholder="support@example.com"
                className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2.5 outline-none focus:border-blue-500"
              />
            </label>
          </div>
        </section>

        <section className="border-t border-gray-100 pt-6">
          <h3 className="font-semibold text-gray-900">
            Marketplace Policies
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Configure commission and task review preferences.
          </p>

          <div className="mt-5 max-w-sm">
            <label className="block text-sm font-medium text-gray-700">
              Platform commission (%)
              <input
                type="number"
                name="commission"
                min="0"
                max="100"
                step="0.1"
                value={settings.commission}
                onChange={updateSetting}
                required
                className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2.5 outline-none focus:border-blue-500"
              />
            </label>
            <p className="mt-2 text-xs text-gray-500">
              Current payment calculations still use the existing 5% backend
              commission until dynamic commission integration is implemented.
            </p>
          </div>

          <label className="mt-5 flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              name="requireTaskReview"
              checked={settings.requireTaskReview}
              onChange={updateSetting}
              className="mt-1 h-4 w-4 accent-blue-600"
            />
            <span>
              <span className="block text-sm font-medium text-gray-800">
                Require task moderation
              </span>
              <span className="mt-1 block text-sm text-gray-500">
                Preference saved for future moderation policy integration.
              </span>
            </span>
          </label>
        </section>

        <section className="border-t border-gray-100 pt-6">
          <h3 className="font-semibold text-gray-900">
            Platform Availability
          </h3>

          <label className="mt-4 flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              name="maintenanceMode"
              checked={settings.maintenanceMode}
              onChange={updateSetting}
              className="mt-1 h-4 w-4 accent-blue-600"
            />
            <span>
              <span className="block text-sm font-medium text-gray-800">
                Maintenance mode
              </span>
              <span className="mt-1 block text-sm text-gray-500">
                Preference saved. This does not yet take the live platform offline.
              </span>
            </span>
          </label>
        </section>

        {message && (
          <p
            role="status"
            className={`text-sm ${
              messageType === "success"
                ? "text-green-700"
                : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        <div className="flex flex-wrap justify-end gap-3 border-t border-gray-100 pt-5">
          <button
            type="button"
            onClick={handleReset}
            disabled={saving}
            className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Reset
          </button>

          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
