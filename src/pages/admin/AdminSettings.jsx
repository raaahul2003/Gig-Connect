
import { useState } from "react";

const initialSettings = {
  platformName: "GigConnect",
  supportEmail: "",
  commission: "10",
  requireTaskReview: true,
  maintenanceMode: false,
};

export default function AdminSettings() {
  const [settings, setSettings] = useState(initialSettings);
  const [message, setMessage] = useState("");

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

    if (
      !settings.platformName.trim() ||
      !settings.supportEmail.trim()
    ) {
      setMessage("Enter the platform name and support email.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(settings.supportEmail)) {
      setMessage("Enter a valid support email address.");
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
      return;
    }

    setMessage(
      "Validation successful. Settings are not saved to a server yet."
    );
  }

  function handleReset() {
    setSettings(initialSettings);
    setMessage("");
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">
          Admin Settings
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Configure platform preferences and marketplace policies.
        </p>
      </div>

      <form
        onSubmit={handleSave}
        className="space-y-7 rounded-xl border border-gray-200 bg-white p-5 sm:p-7"
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
            Configure the proposed commission and task review policy.
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
            <p className="mt-2 text-xs leading-5 text-gray-500">
              Proposed policy only. This does not calculate or deduct actual
              fees until backend payment logic is implemented.
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
                Propose reviewing tasks before publication.
              </span>
            </span>
          </label>
        </section>

        <section className="border-t border-gray-100 pt-6">
          <h3 className="font-semibold text-gray-900">Platform Availability</h3>

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
                UI preference only. This toggle does not take the live
                platform offline.
              </span>
            </span>
          </label>
        </section>

        {message && (
          <p role="status" className="text-sm text-blue-700">
            {message}
          </p>
        )}

        <div className="flex flex-wrap justify-end gap-3 border-t border-gray-100 pt-5">
          <button
            type="button"
            onClick={handleReset}
            className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Reset
          </button>
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}
