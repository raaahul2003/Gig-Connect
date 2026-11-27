
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

function FieldError({ error, id }) {
  if (!error) return null;
  return (
    <p id={id} role="alert" className="mt-2 text-sm leading-5 text-red-800">
      {error}
    </p>
  );
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
    <main className="min-h-screen bg-gray-50 px-4 py-7 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-3xl">
        <Link
          to="/"
          className="inline-flex min-h-11 items-center text-sm font-semibold text-gray-700 transition-colors hover:text-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
        >
          ← Back home
        </Link>

        <header className="mt-5">
          <p className="text-sm font-semibold text-blue-800">
            Client workspace
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
            Post a task
          </h1>

          <p className="mt-3 max-w-2xl text-base leading-6 text-gray-700">
            Explain the work, set your budget, and find the right freelancer.
          </p>
        </header>

        <nav className="mt-8" aria-label="Task posting steps">
          <ol className="grid grid-cols-4 gap-2">
            {steps.map((label, index) => (
              <li
                key={label}
                aria-current={index === step ? "step" : undefined}
                aria-label={`Step ${index + 1} of ${steps.length}: ${label}`}
              >
              <div
                className={`h-1.5 rounded-full ${
                  index <= step ? "bg-blue-700" : "bg-gray-300"
                  }`}
              />
              <p
                className={`mt-2 text-xs leading-4 sm:text-sm ${
                  index === step
                    ? "font-semibold text-blue-800"
                    : "text-gray-600"
                  }`}
              >
                <span className="sm:hidden">
                  {index === step
                    ? label
                    : String(index + 1).padStart(2, "0")}
                </span>
                <span className="hidden sm:inline">
                  {String(index + 1).padStart(2, "0")} {label}
                </span>
              </p>
              </li>
            ))}
          </ol>
        </nav>

        <form
          className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:mt-8 sm:p-8"
          onSubmit={(event) => event.preventDefault()}
        >
          {step === 0 && (
            <section className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold tracking-tight text-gray-950">
                  Tell us about your task
                </h2>
                <p className="mt-2 text-sm leading-6 text-gray-700">
                  Make the work clear so freelancers understand what you need.
                </p>
              </div>

              <div>
                <label htmlFor="title" className="text-sm font-semibold text-gray-900">
                  Task title
                </label>
                <input
                  id="title"
                  name="title"
                  value={form.title}
                  onChange={updateField}
                  aria-invalid={Boolean(errors.title)}
                  aria-describedby={errors.title ? "title-error" : undefined}
                  placeholder="e.g. Design a social media poster"
                  className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-500 transition-colors focus-visible:border-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                />
                <FieldError id="title-error" error={errors.title} />
              </div>

              <div>
                <label htmlFor="category" className="text-sm font-semibold text-gray-900">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={form.category}
                  onChange={updateField}
                  aria-invalid={Boolean(errors.category)}
                  aria-describedby={errors.category ? "category-error" : undefined}
                  className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 transition-colors focus-visible:border-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                >
                  <option value="">Select a category</option>
                  <option value="Design">Design</option>
                  <option value="Development">Development</option>
                  <option value="Writing">Writing</option>
                  <option value="Data Entry">Data Entry</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Research">Research</option>
                </select>
                <FieldError id="category-error" error={errors.category} />
              </div>

              <div>
                <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 sm:p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-800">
                      <Sparkles size={16} aria-hidden="true" /> AI Powered
                    </p>
                    <button
                      type="button"
                      onClick={handleGenerateDescription}
                      disabled={isGenerating}
                      aria-busy={isGenerating}
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isGenerating && <LoaderCircle className="animate-spin" size={16} aria-hidden="true" />}
                      {isGenerating ? "Generating..." : form.description ? "Regenerate with AI" : "Generate Description with AI"}
                    </button>
                  </div>
                  <label htmlFor="roughIdea" className="mt-4 block text-sm font-semibold text-gray-900">
                    Rough task idea <span className="font-normal text-gray-600">(optional)</span>
                  </label>
                  <textarea
                    id="roughIdea"
                    rows={3}
                    value={roughIdea}
                    maxLength={5000}
                    onChange={(event) => setRoughIdea(event.target.value)}
                    aria-describedby={
                      generationError
                        ? "rough-idea-help generation-error"
                        : "rough-idea-help"
                    }
                    placeholder="Describe the work in your own words. AI will organize only what you provide."
                    className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base leading-6 text-gray-900 placeholder:text-gray-500 transition-colors focus-visible:border-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                  />
                  <p id="rough-idea-help" className="mt-2 text-sm leading-5 text-gray-600">
                    Use this optional prompt to help draft the task description.
                  </p>
                  {generationError && (
                    <p id="generation-error" role="alert" className="mt-2 text-sm leading-5 text-red-800">
                      {generationError}
                    </p>
                  )}
                </div>

                <label
                  htmlFor="description"
                  className="mt-5 block text-sm font-semibold text-gray-900"
                >
                  Task description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={5}
                  value={form.description}
                  onChange={updateField}
                  aria-invalid={Boolean(errors.description)}
                  aria-describedby={errors.description ? "description-error" : undefined}
                  placeholder="Describe the task, context, and expected outcome. Share links to any reference images..."
                  className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base leading-6 text-gray-900 placeholder:text-gray-500 transition-colors focus-visible:border-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                />
                <FieldError id="description-error" error={errors.description} />
              </div>
            </section>
          )}

          {step === 1 && (
            <section className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold tracking-tight text-gray-950">
                  Set expectations
                </h2>
                <p className="mt-2 text-sm leading-6 text-gray-700">
                  Explain the skills needed and what the freelancer must deliver.
                </p>
              </div>

              <div>
                <label htmlFor="skills" className="text-sm font-semibold text-gray-900">
                  Required skills
                </label>
                <input
                  id="skills"
                  name="skills"
                  value={form.skills}
                  onChange={updateField}
                  aria-invalid={Boolean(errors.skills)}
                  aria-describedby={errors.skills ? "skills-error" : undefined}
                  placeholder="e.g. Figma, typography, visual design"
                  className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-500 transition-colors focus-visible:border-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                />
                <FieldError id="skills-error" error={errors.skills} />
              </div>

              <div>
                <label
                  htmlFor="deliverables"
                  className="text-sm font-semibold text-gray-900"
                >
                  Expected deliverables
                </label>
                <textarea
                  id="deliverables"
                  name="deliverables"
                  rows={5}
                  value={form.deliverables}
                  onChange={updateField}
                  aria-invalid={Boolean(errors.deliverables)}
                  aria-describedby={
                    errors.deliverables ? "deliverables-error" : undefined
                  }
                  placeholder="What files, results or completed work should be delivered?"
                  className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base leading-6 text-gray-900 placeholder:text-gray-500 transition-colors focus-visible:border-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                />
                <FieldError id="deliverables-error" error={errors.deliverables} />
              </div>
            </section>
          )}

          {step === 2 && (
            <section className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold tracking-tight text-gray-950">
                  Budget and timing
                </h2>
                <p className="mt-2 text-sm leading-6 text-gray-700">
                  Set a realistic budget and deadline for the work.
                </p>
              </div>

              <div>
                <label htmlFor="budget" className="text-sm font-semibold text-gray-900">
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
                  aria-invalid={Boolean(errors.budget)}
                  aria-describedby={errors.budget ? "budget-error" : undefined}
                  placeholder="Enter your budget"
                  className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-500 transition-colors focus-visible:border-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                />
                <FieldError id="budget-error" error={errors.budget} />
              </div>

              <div>
                <label htmlFor="deadline" className="text-sm font-semibold text-gray-900">
                  Deadline
                </label>
                <input
                  id="deadline"
                  name="deadline"
                  type="date"
                  min={new Date().toLocaleDateString("en-CA")}
                  value={form.deadline}
                  onChange={updateField}
                  aria-invalid={Boolean(errors.deadline)}
                  aria-describedby={
                    errors.deadline ? "deadline-error" : undefined
                  }
                  className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 transition-colors focus-visible:border-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                />
                <FieldError id="deadline-error" error={errors.deadline} />
              </div>

              <label className="flex min-h-16 cursor-pointer items-start gap-3 rounded-xl border border-gray-200 p-4 transition-colors hover:bg-gray-50">
                <input
                  type="checkbox"
                  name="isUrgent"
                  checked={form.isUrgent}
                  onChange={updateField}
                  className="mt-1 h-5 w-5 shrink-0 accent-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                />
                <span>
                  <span className="block text-sm font-semibold text-gray-900">
                    Mark this task as urgent
                  </span>
                  <span className="mt-1 block text-sm leading-5 text-gray-700">
                    Highlight this task for freelancers who can start quickly.
                  </span>
                </span>
              </label>
            </section>
          )}

          {step === 3 && (
            <section>
              <h2 className="text-xl font-semibold tracking-tight text-gray-950">
                Review your task
              </h2>
              <p className="mt-2 text-sm leading-6 text-gray-700">
                Check your details before publishing.
              </p>

              <dl className="mt-5 divide-y divide-gray-200">
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
                    className="grid gap-1 py-4 sm:grid-cols-[150px_minmax(0,1fr)] sm:gap-4"
                  >
                    <dt className="text-sm font-medium text-gray-700">{label}</dt>
                    <dd className="whitespace-pre-wrap break-words text-sm leading-6 font-medium text-gray-950">
                      {value || "Not provided"}
                    </dd>
                  </div>
                ))}
              </dl>

              {errors.publish && (
                <p
                  role="alert"
                  className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-800"
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
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-800 transition-colors hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>

            {step < steps.length - 1 ? (
              <button
                type="button"
                onClick={goNext}
                className="inline-flex min-h-11 items-center justify-center rounded-lg bg-blue-700 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
              >
                Continue
              </button>
            ) : (
              <button
                type="button"
                onClick={publishTask}
                disabled={isPublishing}
                className="inline-flex min-h-11 items-center justify-center rounded-lg bg-blue-700 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPublishing ? "Publishing..." : "Publish task"}
              </button>
            )}
          </div>

          <p className="mt-4 text-center text-sm leading-5 text-gray-600">
            Your task will be saved when you publish.
          </p>
        </form>
      </div>
    </main>
  );
}

export default PostTask;
