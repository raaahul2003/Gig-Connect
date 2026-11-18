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
  const [deliveryHours, setDeliveryHours] = useState("24");
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
    }

    if (!deliveryHours) {
      nextErrors.deliveryHours = "Choose a delivery time.";
    }

    setErrors(nextErrors);
    setSubmitError("");

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
        deliveryHours: Number(deliveryHours),
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
      <main className="min-h-screen bg-gray-50 px-5 py-16">
        <section className="mx-auto max-w-lg rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-2xl text-green-700">
            ✓
          </div>

          <h1 className="mt-5 text-2xl font-bold text-gray-900">
            Application submitted
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-600">
            Your application has been sent successfully.
          </p>

          <Link
            to="/browse"
            className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition-colors"
          >
            Back to tasks
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-5 py-10 sm:px-6">
      <div className="mx-auto max-w-2xl">
        <Link
          to={`/tasks/${taskId}`}
          className="text-sm font-medium text-gray-600 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition-colors"
        >
          ← Back to task
        </Link>

        <header className="mt-6">
          <p className="text-sm font-semibold text-blue-600">
            YOUR OPPORTUNITY
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
            Apply for this task
          </h1>

          <p className="mt-3 leading-6 text-gray-600">
            Introduce yourself, explain your approach, and propose a realistic
            delivery time and price.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="mt-8 space-y-6 rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow p-6 sm:p-8"
        >
          <div>
            <label
              htmlFor="proposal"
              className="block text-sm font-semibold text-gray-900"
            >
              Your proposal
            </label>

            <p className="mt-1 text-sm text-gray-500">
              Explain how you'll complete the task and why you're a good fit.
            </p>

            <textarea
              id="proposal"
              rows={6}
              value={proposal}
              onChange={(event) => setProposal(event.target.value)}
              placeholder="I'll approach this task by..."
              aria-invalid={Boolean(errors.proposal)}
              aria-describedby={errors.proposal ? "proposal-error" : undefined}
              className="mt-3 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />

            <div className="mt-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-800">
                  <Sparkles size={16} aria-hidden="true" /> AI Powered
                </p>
                <button
                  type="button"
                  onClick={handleGenerateProposal}
                  disabled={isGenerating || !task}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isGenerating && <LoaderCircle className="animate-spin" size={16} aria-hidden="true" />}
                  {isGenerating ? "Generating..." : proposal ? "Regenerate with AI" : "Generate Proposal with AI"}
                </button>
              </div>
              <p className="mt-2 text-xs leading-5 text-blue-800">
                Add optional context below so the proposal reflects only your real skills and experience.
              </p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <input
                  value={freelancerSkills}
                  onChange={(event) => setFreelancerSkills(event.target.value)}
                  maxLength={1000}
                  placeholder="Your relevant skills (optional)"
                  className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
                <input
                  value={freelancerExperience}
                  onChange={(event) => setFreelancerExperience(event.target.value)}
                  maxLength={1000}
                  placeholder="Relevant experience (optional)"
                  className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
              {generationError && <p role="alert" className="mt-3 text-sm text-red-600">{generationError}</p>}
            </div>

            <div className="mt-2 flex justify-between gap-3 text-xs text-gray-500">
              <span>Minimum 30 characters</span>
              <span>{proposal.length} characters</span>
            </div>

            {errors.proposal && (
              <p id="proposal-error" className="mt-2 text-sm text-red-600">
                {errors.proposal}
              </p>
            )}
          </div>

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
              aria-describedby={errors.bidAmount ? "bid-error" : undefined}
              className="mt-3 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />

            {errors.bidAmount && (
              <p id="bid-error" className="mt-2 text-sm text-red-600">
                {errors.bidAmount}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="deliveryHours"
              className="block text-sm font-semibold text-gray-900"
            >
              Estimated delivery time
            </label>

            <select
              id="deliveryHours"
              value={deliveryHours}
              onChange={(event) => setDeliveryHours(event.target.value)}
              className="mt-3 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            >
              <option value="2">Within 2 hours</option>
              <option value="6">Within 6 hours</option>
              <option value="12">Within 12 hours</option>
              <option value="24">Within 24 hours</option>
              <option value="48">Within 48 hours</option>
              <option value="72">Within 3 days</option>
            </select>

            {errors.deliveryHours && (
              <p className="mt-2 text-sm text-red-600">
                {errors.deliveryHours}
              </p>
            )}
          </div>

          {submitError && (
            <p role="alert" className="text-sm text-red-600">
              {submitError}
            </p>
          )}

          <div className="border-t border-gray-200 pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition-colors"
            >
              {isSubmitting ? "Submitting..." : "Submit application"}
            </button>

            <p className="mt-3 text-center text-xs leading-5 text-gray-500">
              Your application will be sent to the client for review.
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}

export default ApplyTask;
