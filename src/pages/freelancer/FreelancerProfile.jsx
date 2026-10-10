
import { useState } from "react";

function FreelancerProfile() {
  const [form, setForm] = useState({
    name: "",
    headline: "",
    bio: "",
    skills: "",
    portfolio: "",
  });

  const [message, setMessage] = useState("");

  function updateField(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setMessage("");
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (form.name.trim().length < 2) {
      setMessage("Please enter your name.");
      return;
    }

    setMessage(
      "Your profile changes have not been saved. Profile persistence will be enabled with the backend."
    );
  }

  return (
    <main>
      <header>
        <p className="text-sm font-semibold text-blue-600">
          YOUR PROFESSIONAL IDENTITY
        </p>
        <h1 className="mt-2 text-2xl font-bold text-gray-900">
          Freelancer Profile
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Introduce your skills and experience to potential clients.
        </p>
      </header>

      <div className="mt-8 grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-6 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-2xl font-bold text-blue-700">
            {form.name.trim()
              ? form.name.trim().charAt(0).toUpperCase()
              : "?"}
          </div>

          <h2 className="mt-4 font-semibold text-gray-900">
            {form.name.trim() || "Your name"}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {form.headline || "Your professional headline"}
          </p>

          <div className="mt-5 border-t border-gray-100 pt-5 text-left">
            <p className="text-sm font-medium text-gray-900">
              Trusted Freelancer Score
            </p>
            <p className="mt-2 text-sm leading-5 text-gray-500">
              This score will be calculated from verified work history and
              reliability data when those features are implemented.
            </p>
          </div>
        </aside>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 sm:p-8"
        >
          <section>
            <h2 className="font-semibold text-gray-900">
              Basic information
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Keep your profile clear and professional.
            </p>
          </section>

          <div>
            <label htmlFor="name" className="text-sm font-semibold">
              Full name
            </label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={updateField}
              placeholder="Your full name"
              className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div>
            <label htmlFor="headline" className="text-sm font-semibold">
              Professional headline
            </label>
            <input
              id="headline"
              name="headline"
              value={form.headline}
              onChange={updateField}
              placeholder="e.g. React Developer and UI Designer"
              className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div>
            <label htmlFor="bio" className="text-sm font-semibold">
              About you
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={5}
              value={form.bio}
              onChange={updateField}
              placeholder="Describe your experience, strengths and approach..."
              className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div>
            <label htmlFor="skills" className="text-sm font-semibold">
              Skills
            </label>
            <input
              id="skills"
              name="skills"
              value={form.skills}
              onChange={updateField}
              placeholder="React, Figma, writing..."
              className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
            <p className="mt-2 text-xs text-gray-500">
              Separate skills with commas.
            </p>
          </div>

          <div>
            <label htmlFor="portfolio" className="text-sm font-semibold">
              Portfolio URL
            </label>
            <input
              id="portfolio"
              name="portfolio"
              type="url"
              value={form.portfolio}
              onChange={updateField}
              placeholder="https://your-portfolio.com"
              className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          {message && (
            <p
              role="status"
              className="rounded-lg bg-blue-50 p-3 text-sm leading-6 text-blue-800"
            >
              {message}
            </p>
          )}

          <div className="border-t border-gray-200 pt-6">
            <button
              type="submit"
              className="w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 sm:w-auto"
            >
              Save profile
            </button>
            <p className="mt-3 text-xs text-gray-500">
              Preview only — changes aren't persisted yet.
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}

export default FreelancerProfile;
