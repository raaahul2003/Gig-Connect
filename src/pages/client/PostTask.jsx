
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createTask } from "../../services/taskService";
import { toast } from "react-toastify";
import { generateTaskDescription } from "../../services/aiService";
import { LoaderCircle, Sparkles } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

const initialForm = {
  title: "",
  category: "",
  description: "",
  skills: "",
  deliverables: "",
  budget: "",
  deadline: "",
  isUrgent: false,
};

const steps = [
  "Task basics",
  "Requirements",
  "Budget & timing",
  "Review",
];

function FieldError({ error }) {
  if (!error) return null;
  return <p className="mt-2 text-sm text-red-600">{error}</p>;
}

function PostTask() {
  const submissionKey = useRef(crypto.randomUUID());
  const publishLock = useRef(false);

  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const [isPublishing, setIsPublishing] = useState(false);
  const [roughIdea, setRoughIdea] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState("");

  const navigate = useNavigate();

  function updateField(event) {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrors((current) => ({ ...current, [name]: "" }));
  }

  function validateAllSteps() {
    const nextErrors = {};

    if (form.title.trim().length < 5) {
      nextErrors.title = "Enter a title with at least 5 characters.";
    }

    if (!form.category) {
      nextErrors.category = "Choose a category.";
    }

    if (form.description.trim().length < 30) {
      nextErrors.description = "Description must contain at least 30 characters.";
    }

    if (!form.skills.trim()) {
      nextErrors.skills = "Enter at least one required skill.";
    }

    if (!form.deliverables.trim()) {
      nextErrors.deliverables = "Describe the expected deliverables.";
    }

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

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function validateStep() {
    const nextErrors = {};

    if (step === 0) {
      if (!form.title.trim()) nextErrors.title = "Task title is required.";
      if (!form.category) nextErrors.category = "Select a category.";
      if (!form.description.trim()) {
        nextErrors.description = "Task description is required.";
      }
    }

    if (step === 1) {
      if (!form.skills.trim()) nextErrors.skills = "Add required skills.";
      if (!form.deliverables.trim()) {
        nextErrors.deliverables = "Describe the deliverables.";
      }
    }

    if (step === 2) {
      if (!form.budget || Number(form.budget) <= 0) {
        nextErrors.budget = "Enter a budget greater than zero.";
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

  async function handleGenerateDescription() {
    if (!roughIdea.trim()) {
      setGenerationError("Enter a rough task idea before generating a description.");
      return;
    }

    setIsGenerating(true);
    setGenerationError("");
    try {
      const response = await generateTaskDescription({
        title: form.title,
        category: form.category,
        roughIdea,
        requiredSkills: form.skills,
        deliverables: form.deliverables,
        budget: form.budget,
        deadline: form.deadline,
      });
      setForm((current) => ({ ...current, description: response.generatedText }));
      setErrors((current) => ({ ...current, description: "" }));
    } catch (error) {
      setGenerationError(
        error.response?.data?.message || "Could not generate a description. Please try again."
      );
    } finally {
      setIsGenerating(false);
    }
  }

  async function publishTask() {
    // Immediately prevent duplicate submissions
    if (publishLock.current) return;

    if (!validateAllSteps()) return;

    const token = localStorage.getItem("token");

    if (!token) {
      setErrors({
        publish: "Please log in as a client to publish a task.",
      });
      return;
    }

    // Lock before starting the API request
    publishLock.current = true;
    setIsPublishing(true);
    setErrors({});

    try {
      await createTask(
        {
          ...form,
          budget: Number(form.budget),
          deadline: new Date(`${form.deadline}T23:59:59`).toISOString(),
        },
        token,
        submissionKey.current
      );

      toast.success("Task published successfully!");

      setTimeout(() => {
        navigate("/client/tasks");
      }, 1500);

    } catch (error) {
      console.error(
        "Publish task failed:",
        error.response?.data || error.message
      );

      setErrors({
        publish:
          error.response?.data?.message ||
          error.message ||
          "Could not publish the task. Please try again.",
      });

      // Allow retry if publishing failed
      publishLock.current = false;

    } finally {
      setIsPublishing(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 px-5 py-10 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <Link
          to="/"
          className="text-sm font-medium text-gray-600 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition-colors"
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
                className={`h-1.5 rounded-full ${index <= step ? "bg-blue-600" : "bg-gray-200"
                  }`}
              />
              <p
                className={`mt-2 text-xs sm:text-sm ${index === step
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
          className="mt-8 rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow p-6 sm:p-8"
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
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition-colors"
                />
                <FieldError error={errors.title} />
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
                  className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition-colors"
                >
                  <option value="">Select a category</option>
                  <option value="Design">Design</option>
                  <option value="Development">Development</option>
                  <option value="Writing">Writing</option>
                  <option value="Data Entry">Data Entry</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Research">Research</option>
                </select>
                <FieldError error={errors.category} />
              </div>

              <div>
                <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-800">
                      <Sparkles size={16} aria-hidden="true" /> AI Powered
                    </p>
                    <button
                      type="button"
                      onClick={handleGenerateDescription}
                      disabled={isGenerating}
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isGenerating && <LoaderCircle className="animate-spin" size={16} aria-hidden="true" />}
                      {isGenerating ? "Generating..." : form.description ? "Regenerate with AI" : "Generate Description with AI"}
                    </button>
                  </div>
                  <label htmlFor="roughIdea" className="mt-3 block text-sm font-medium text-blue-900">
                    Rough task idea
                  </label>
                  <textarea
                    id="roughIdea"
                    rows={3}
                    value={roughIdea}
                    maxLength={5000}
                    onChange={(event) => setRoughIdea(event.target.value)}
                    placeholder="Describe the work in your own words. AI will organize only what you provide."
                    className="mt-2 w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                  {generationError && <p role="alert" className="mt-2 text-sm text-red-600">{generationError}</p>}
                </div>

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
                  placeholder="Describe the task, context, and expected outcome. Share links to any reference images..."
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition-colors"
                />
                <FieldError error={errors.description} />
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
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition-colors"
                />
                <FieldError error={errors.skills} />
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
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition-colors"
                />
                <FieldError error={errors.deliverables} />
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
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition-colors"
                />
                <FieldError error={errors.budget} />
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
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition-colors"
                />
                <FieldError error={errors.deadline} />
              </div>

              <label className="flex items-start gap-3 rounded-xl border border-gray-200 p-4">
                <input
                  type="checkbox"
                  name="isUrgent"
                  checked={form.isUrgent}
                  onChange={updateField}
                  className="mt-1 h-4 w-4 accent-blue-600 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition-colors"
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
                className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition-colors"
              >
                Continue
              </button>
            ) : (
              <button
                type="button"
                onClick={publishTask}
                disabled={isPublishing}
                className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPublishing ? "Publishing..." : "Publish task"}
              </button>
            )}
          </div>

          <p className="mt-4 text-center text-xs leading-5 text-gray-500">
            Your task will be saved when you publish.
          </p>
        </form>
      </div>
    </main>
  );
}

export default PostTask;
