import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { submitApplication } from "../../services/applicationService";
import { getTaskById } from "../../services/taskService";
import { generateProposal } from "../../services/aiService";
import { LoaderCircle, Sparkles } from "lucide-react";

function ApplyTask() {
  const { taskId } = useParams();
  const location = useLocation();

  const [proposal, setProposal] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [bidAmount, setBidAmount] = useState("");
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [task, setTask] = useState(() => location.state?.task ?? null);
  const [freelancerSkills, setFreelancerSkills] = useState("");
  const [freelancerExperience, setFreelancerExperience] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState("");

  useEffect(() => {
    if (task) return;

    getTaskById(taskId)
      .then((response) => setTask(response.data.task))
      .catch(() => setGenerationError("Task details could not be loaded for AI generation."));
  }, [task, taskId]);

  async function handleGenerateProposal() {
    if (!task) {
      setGenerationError("Task details are still loading. Please try again shortly.");
      return;
    }

    setIsGenerating(true);
    setGenerationError("");
    try {
      const response = await generateProposal({
        taskTitle: task.title,
        taskDescription: task.description,
        requiredSkills: Array.isArray(task.skills) ? task.skills.join(", ") : task.skills,
        deliverables: task.deliverables,
        budget: String(task.budget ?? ""),
        deadline: task.deadline ? new Date(task.deadline).toLocaleDateString() : "",
        freelancerSkills,
        freelancerExperience,
      });
      setProposal(response.generatedText);
      setErrors((current) => ({ ...current, proposal: "" }));
    } catch (error) {
      setGenerationError(
        error.response?.data?.message || "Could not generate a proposal. Please try again."
      );
    } finally {
      setIsGenerating(false);
    }
  }

  const today = new Date();
  const minDeliveryDate = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  const maxDeliveryDate = task?.deadline
    ? new Date(task.deadline).toISOString().slice(0, 10)
    : "";

  async function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = {};

    if (proposal.trim().length < 30) {
      nextErrors.proposal =
        "Please write at least 30 characters about your approach.";
    }

    if (
      !bidAmount ||
      !Number.isFinite(Number(bidAmount)) ||
      Number(bidAmount) <= 0
    ) {
      nextErrors.bidAmount = "Enter a valid amount greater than zero.";
    } else if (
      task?.budget != null &&
      Number(bidAmount) > Number(task.budget)
    ) {
      nextErrors.bidAmount = `Your proposed price cannot exceed the task budget of ₹${Number(task.budget).toLocaleString("en-IN")}.`;
    }

    if (!deliveryDate) {
      nextErrors.deliveryDate = "Please select an estimated delivery date.";
    } else if (deliveryDate < minDeliveryDate) {
      nextErrors.deliveryDate = "Delivery date cannot be in the past.";
    } else if (
      maxDeliveryDate &&
      deliveryDate > maxDeliveryDate
    ) {
      nextErrors.deliveryDate =
        "Delivery date cannot exceed the client's deadline.";
    }

    if (!maxDeliveryDate) {
      nextErrors.deliveryDate = "Task deadline is unavailable.";
    }

    setErrors(nextErrors);
    setSubmitError("");

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setSubmitError("Please log in before applying for this task.");
      return;
    }

    try {
      setIsSubmitting(true);

      await submitApplication(taskId, {
        proposal: proposal.trim(),
        bidAmount: Number(bidAmount),
        deliveryDate,
      });

      setSubmitted(true);
    } catch (error) {
      setSubmitError(
        error.response?.data?.message ||
        error.message ||
        "Could not submit your application. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 sm:py-16">
        <section
          role="status"
          className="mx-auto max-w-lg rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm sm:p-8"
        >
          <div
            aria-hidden="true"
            className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-2xl font-semibold text-green-800"
          >
            ✓
          </div>

          <h1 className="mt-5 text-2xl font-bold tracking-tight text-gray-950">
            Application submitted
          </h1>

          <p className="mt-3 text-base leading-6 text-gray-700">
            Your application has been sent successfully.
          </p>

          <Link
            to="/browse"
            className="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white transition-colors hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
          >
            Back to tasks
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-3xl">
        <Link
          to={`/tasks/${taskId}`}
          className="inline-flex min-h-11 items-center text-sm font-semibold text-gray-700 transition-colors hover:text-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
        >
          ← Back to task
        </Link>

        <header className="mt-4">
          <p className="text-sm font-semibold text-blue-800">Application</p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
            Apply for this task
          </h1>

          <p className="mt-3 max-w-2xl text-base leading-6 text-gray-700">
            Introduce yourself, explain your approach, and propose a realistic
            delivery time and price.
          </p>
        </header>

        {task && (
          <section
            aria-label="Task summary"
            className="mt-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6"
          >
            <h2 className="text-lg font-semibold leading-6 text-gray-950">
              {task.title}
            </h2>
            <div className="mt-4 grid gap-4 border-t border-gray-200 pt-4 sm:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-gray-700">Task budget</p>
                <p className="mt-1 text-xl font-bold text-blue-800">
                  {task.budget != null
                    ? `₹${Number(task.budget).toLocaleString("en-IN")}`
                    : "Not provided"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Client deadline
                </p>
                <p className="mt-1 text-base font-semibold text-gray-950">
                  {task.deadline
                    ? new Date(task.deadline).toLocaleDateString("en-IN")
                    : "Unavailable"}
                </p>
              </div>
            </div>
          </section>
        )}

        <form
          onSubmit={handleSubmit}
          noValidate
          className="mt-6 space-y-7 rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7"
        >
          <section aria-labelledby="proposal-heading">
            <div>
              <h2
                id="proposal-heading"
                className="text-lg font-semibold text-gray-950"
              >
                Your proposal
              </h2>

              <p id="proposal-help" className="mt-1 text-sm text-gray-700">
                Explain how you'll complete the task and why you're a good fit.
              </p>

              <label htmlFor="proposal" className="sr-only">
                Your proposal
              </label>
              <textarea
                id="proposal"
                rows={6}
                value={proposal}
                onChange={(event) => setProposal(event.target.value)}
                placeholder="I'll approach this task by..."
                aria-invalid={Boolean(errors.proposal)}
                aria-describedby={
                  errors.proposal
                    ? "proposal-help proposal-error"
                    : "proposal-help"
                }
                className="mt-3 w-full rounded-lg border border-gray-300 px-4 py-3 text-base leading-6 text-gray-950 outline-none placeholder:text-gray-500 focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
              />

            <div className="mt-5 rounded-lg border-l-4 border-blue-700 bg-blue-50 p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="inline-flex items-center gap-2 text-sm font-semibold text-blue-900">
                  <Sparkles size={16} aria-hidden="true" />
                  AI proposal assistant
                </p>
                <button
                  type="button"
                  onClick={handleGenerateProposal}
                  disabled={isGenerating || !task}
                  aria-busy={isGenerating}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                >
                  {isGenerating && (
                    <LoaderCircle
                      className="animate-spin"
                      size={16}
                      aria-hidden="true"
                    />
                  )}
                  {isGenerating
                    ? "Generating..."
                    : proposal
                      ? "Regenerate with AI"
                      : "Generate proposal"}
                </button>
              </div>
              <p
                id="ai-context-help"
                className="mt-2 text-sm leading-5 text-blue-900"
              >
                Add optional context below so the proposal reflects only your
                real skills and experience.
              </p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="freelancerSkills"
                    className="block text-sm font-medium text-gray-900"
                  >
                    Relevant skills{" "}
                    <span className="font-normal text-gray-600">
                      (optional)
                    </span>
                  </label>
                  <input
                    id="freelancerSkills"
                    value={freelancerSkills}
                    onChange={(event) => setFreelancerSkills(event.target.value)}
                    maxLength={1000}
                    placeholder="e.g. React, API integration"
                    aria-describedby="ai-context-help"
                    className="mt-2 min-h-11 w-full rounded-lg border border-blue-200 bg-white px-3 py-2.5 text-base text-gray-950 outline-none placeholder:text-gray-500 focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div>
                  <label
                    htmlFor="freelancerExperience"
                    className="block text-sm font-medium text-gray-900"
                  >
                    Relevant experience{" "}
                    <span className="font-normal text-gray-600">
                      (optional)
                    </span>
                  </label>
                  <input
                    id="freelancerExperience"
                    value={freelancerExperience}
                    onChange={(event) =>
                      setFreelancerExperience(event.target.value)
                    }
                    maxLength={1000}
                    placeholder="Describe related work"
                    aria-describedby="ai-context-help"
                    className="mt-2 min-h-11 w-full rounded-lg border border-blue-200 bg-white px-3 py-2.5 text-base text-gray-950 outline-none placeholder:text-gray-500 focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>
              {generationError && (
                <p
                  role="alert"
                  className="mt-3 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-900"
                >
                  {generationError}
                </p>
              )}
            </div>

            <div className="mt-3 flex flex-wrap justify-between gap-2 text-sm text-gray-600">
              <span>Minimum 30 characters</span>
              <span aria-live="polite">{proposal.length} characters</span>
            </div>

            {errors.proposal && (
              <p
                id="proposal-error"
                className="mt-2 text-sm font-medium text-red-800"
              >
                {errors.proposal}
              </p>
            )}
            </div>
          </section>

          <section
            aria-label="Application terms"
            className="grid gap-5 border-t border-gray-200 pt-6 md:grid-cols-2"
          >
            <div>
              <label
                htmlFor="bidAmount"
                className="block text-sm font-semibold text-gray-900"
              >
                Your proposed price (₹)
              </label>

              <input
                id="bidAmount"
                type="number"
                min="1"
                step="1"
                value={bidAmount}
                onChange={(event) => setBidAmount(event.target.value)}
                placeholder="Enter your price"
                aria-invalid={Boolean(errors.bidAmount)}
                aria-describedby={
                  errors.bidAmount ? "bid-help bid-error" : "bid-help"
                }
                className="mt-2 min-h-11 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-base text-gray-950 outline-none placeholder:text-gray-500 focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
              />

              <p id="bid-help" className="mt-2 text-sm text-gray-600">
                Your offer must be equal to or lower than the task budget.
              </p>

              {errors.bidAmount && (
                <p id="bid-error" className="mt-2 text-sm font-medium text-red-800">
                  {errors.bidAmount}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="deliveryDate"
                className="block text-sm font-semibold text-gray-900"
              >
                Estimated delivery date
              </label>

              <p id="delivery-date-help" className="mt-1 text-sm text-gray-700">
                Select when you expect to complete this task.
              </p>

              <input
                id="deliveryDate"
                type="date"
                value={deliveryDate}
                min={minDeliveryDate}
                max={maxDeliveryDate || undefined}
                onChange={(event) => setDeliveryDate(event.target.value)}
                disabled={!task || !maxDeliveryDate}
                aria-invalid={Boolean(errors.deliveryDate)}
                aria-describedby={
                  errors.deliveryDate
                    ? "delivery-date-help delivery-date-error"
                    : "delivery-date-help"
                }
                className="mt-2 min-h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-base text-gray-950 outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100"
              />

              {maxDeliveryDate && (
                <p className="mt-2 text-sm text-gray-600">
                  Latest delivery date:{" "}
                  {new Date(`${maxDeliveryDate}T00:00:00`).toLocaleDateString(
                    "en-IN"
                  )}
                </p>
              )}

              {errors.deliveryDate && (
                <p
                  id="delivery-date-error"
                  className="mt-2 text-sm font-medium text-red-800"
                >
                  {errors.deliveryDate}
                </p>
              )}
            </div>
          </section>

          {submitError && (
            <p
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-900"
            >
              {submitError}
            </p>
          )}

          <div className="border-t border-gray-200 pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
              className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white transition-colors hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
            >
              {isSubmitting ? "Submitting..." : "Submit application"}
            </button>

            <p className="mt-3 text-center text-sm leading-5 text-gray-600">
              Your application will be sent to the client for review.
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}

export default ApplyTask;
