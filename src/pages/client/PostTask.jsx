
import { useState } from "react";
import { Link } from "react-router-dom";

const initialForm = {
  title: "",
  category: "",
  description: "",
  skills: "",
  deliverables: "",
  budget: "",
  deadline: "",
  estimatedMinutes: "60",
  isUrgent: false,
};

const steps = [
  "Task basics",
  "Requirements",
  "Budget & timing",
  "Review",
];

function PostTask() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  function updateField(event) {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrors((current) => ({ ...current, [name]: "" }));
  }

  function validateStep() {
    const nextErrors = {};

    if (step === 0) {
      if (form.title.trim().length < 5) {
        nextErrors.title = "Enter a title with at least 5 characters.";
      }

      if (!form.category) {
        nextErrors.category = "Choose a category.";
      }

      if (form.description.trim().length < 30) {
        nextErrors.description =
          "Description must contain at least 30 characters.";
      }
    }

    if (step === 1) {
      if (!form.skills.trim()) {
        nextErrors.skills = "Enter at least one required skill.";
      }

      if (!form.deliverables.trim()) {
        nextErrors.deliverables = "Describe the expected deliverables.";
      }
    }

    if (step === 2) {
      if (
        !form.budget ||
        !Number.isFinite(Number(form.budget)) ||
        Number(form.budget) <= 0
      ) {
        nextErrors.budget = "Enter a valid budget greater than zero.";
      }

      if (!form.deadline) {
        nextErrors.deadline = "Choose a deadline.";
      } else if (
        new Date(`${form.deadline}T23:59:59`).getTime() <= Date.now()
      ) {
        nextErrors.deadline = "Choose a future deadline.";
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function goNext() {
    if (validateStep()) {
      setStep((current) => Math.min(current + 1, steps.length - 1));
    }
  }

  function publishTask() {
    // Publishing will be implemented when the Express API is ready.
    setErrors({
      publish:
        "Your task has not been published. Backend integration is still pending.",
    });
  }

  function FieldError({ name }) {
    if (!errors[name]) return null;

    return <p className="mt-2 text-sm text-red-600">{errors[name]}</p>;
  }

  return (
    <main className="min-h-screen bg-gray-50 px-5 py-10 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <Link
          to="/"
          className="text-sm font-medium text-gray-600 hover:text-blue-600"
        >
          ← Back home
        </Link>

        <header className="mt-6">
          <p className="text-sm font-semibold text-blue-600">
            CLIENT WORKSPACE
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
            Post a task
          </h1>

          <p className="mt-3 text-gray-600">
            Explain the work, set your budget, and find the right freelancer.
          </p>
        </header>

        <div className="mt-8 grid grid-cols-4 gap-2">
          {steps.map((label, index) => (
            <div key={label}>
              <div
                className={`h-1.5 rounded-full ${
                  index <= step ? "bg-blue-600" : "bg-gray-200"
                }`}
              />
              <p
                className={`mt-2 text-xs sm:text-sm ${
                  index === step
                    ? "font-semibold text-blue-700"
                    : "text-gray-500"
                }`}
              >
                {String(index + 1).padStart(2, "0")}
                <span className="hidden sm:inline"> {label}</span>
              </p>
            </div>
          ))}
        </div>

        <form
          className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 sm:p-8"
          onSubmit={(event) => event.preventDefault()}
        >
          {step === 0 && (
            <section className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Tell us about your task
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                  Make the work clear so freelancers understand what you need.
                </p>
              </div>

              <div>
                <label htmlFor="title" className="text-sm font-semibold">
                  Task title
                </label>
                <input
                  id="title"
                  name="title"
                  value={form.title}
                  onChange={updateField}
                  placeholder="e.g. Design a social media poster"
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
                <FieldError name="title" />
              </div>

              <div>
                <label htmlFor="category" className="text-sm font-semibold">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={form.category}
                  onChange={updateField}
                  className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                >
                  <option value="">Select a category</option>
                  <option value="Design">Design</option>
                  <option value="Development">Development</option>
                  <option value="Writing">Writing</option>
                  <option value="Data Entry">Data Entry</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Research">Research</option>
                </select>
                <FieldError name="category" />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="text-sm font-semibold"
                >
                  Task description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={5}
                  value={form.description}
                  onChange={updateField}
                  placeholder="Explain the task, context and expected outcome..."
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
                <FieldError name="description" />
              </div>
            </section>
          )}

          {step === 1 && (
            <section className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Set expectations
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                  Explain the skills needed and what the freelancer must deliver.
                </p>
              </div>

              <div>
                <label htmlFor="skills" className="text-sm font-semibold">
                  Required skills
                </label>
                <input
                  id="skills"
                  name="skills"
                  value={form.skills}
                  onChange={updateField}
                  placeholder="e.g. Figma, typography, visual design"
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
                <FieldError name="skills" />
              </div>

              <div>
                <label
                  htmlFor="deliverables"
                  className="text-sm font-semibold"
                >
                  Expected deliverables
                </label>
                <textarea
                  id="deliverables"
                  name="deliverables"
                  rows={5}
                  value={form.deliverables}
                  onChange={updateField}
                  placeholder="What files, results or completed work should be delivered?"
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
                <FieldError name="deliverables" />
              </div>
            </section>
          )}

          {step === 2 && (
            <section className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Budget and timing
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                  Set a realistic budget and deadline for the work.
                </p>
              </div>

              <div>
                <label htmlFor="budget" className="text-sm font-semibold">
                  Budget (₹)
                </label>
                <input
                  id="budget"
                  name="budget"
                  type="number"
                  min="1"
                  step="1"
                  value={form.budget}
                  onChange={updateField}
                  placeholder="Enter your budget"
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
                <FieldError name="budget" />
              </div>

              <div>
                <label htmlFor="deadline" className="text-sm font-semibold">
                  Deadline
                </label>
                <input
                  id="deadline"
                  name="deadline"
                  type="date"
                  min={new Date().toLocaleDateString("en-CA")}
                  value={form.deadline}
                  onChange={updateField}
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
                <FieldError name="deadline" />
              </div>

              <div>
                <label
                  htmlFor="estimatedMinutes"
                  className="text-sm font-semibold"
                >
                  Estimated work duration
                </label>
                <select
                  id="estimatedMinutes"
                  name="estimatedMinutes"
                  value={form.estimatedMinutes}
                  onChange={updateField}
                  className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                >
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="120">2 hours</option>
                  <option value="240">4 hours</option>
                  <option value="480">8 hours</option>
                </select>
              </div>

              <label className="flex items-start gap-3 rounded-xl border border-gray-200 p-4">
                <input
                  type="checkbox"
                  name="isUrgent"
                  checked={form.isUrgent}
                  onChange={updateField}
                  className="mt-1 h-4 w-4 accent-blue-600"
                />
                <span>
                  <span className="block text-sm font-semibold text-gray-900">
                    Mark this task as urgent
                  </span>
                  <span className="mt-1 block text-sm text-gray-500">
                    Highlight this task for freelancers who can start quickly.
                  </span>
                </span>
              </label>
            </section>
          )}

          {step === 3 && (
            <section>
              <h2 className="text-xl font-semibold text-gray-900">
                Review your task
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Check your details before publishing.
              </p>

              <dl className="mt-6 divide-y divide-gray-100">
                {[
                  ["Title", form.title],
                  ["Category", form.category],
                  ["Description", form.description],
                  ["Required skills", form.skills],
                  ["Deliverables", form.deliverables],
                  ["Budget", `₹${form.budget}`],
                  ["Deadline", form.deadline],
                  ["Estimated duration", `${form.estimatedMinutes} minutes`],
                  ["Urgent", form.isUrgent ? "Yes" : "No"],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="grid gap-1 py-4 sm:grid-cols-[160px_1fr]"
                  >
                    <dt className="text-sm text-gray-500">{label}</dt>
                    <dd className="whitespace-pre-wrap break-words text-sm font-medium text-gray-900">
                      {value || "Not provided"}
                    </dd>
                  </div>
                ))}
              </dl>

              {errors.publish && (
                <p
                  role="alert"
                  className="mt-5 rounded-xl bg-amber-50 p-4 text-sm text-amber-800"
                >
                  {errors.publish}
                </p>
              )}
            </section>
          )}

          <div className="mt-8 flex flex-col-reverse justify-between gap-3 border-t border-gray-200 pt-6 sm:flex-row">
            <button
              type="button"
              onClick={() => {
                setErrors({});
                setStep((current) => Math.max(current - 1, 0));
              }}
              disabled={step === 0}
              className="rounded-xl border border-gray-300 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            {step < steps.length - 1 ? (
              <button
                type="button"
                onClick={goNext}
                className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
              >
                Continue
              </button>
            ) : (
              <button
                type="button"
                onClick={publishTask}
                className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
              >
                Publish task
              </button>
            )}
          </div>

          <p className="mt-4 text-center text-xs leading-5 text-gray-500">
            Frontend preview only. Your task will not be saved until backend integration.
          </p>
        </form>
      </div>
    </main>
  );
}

export default PostTask;
