
import { useState } from "react";
import { Link, useParams } from "react-router-dom";

function ApplyTask() {
  const { taskId } = useParams();

  const [proposal, setProposal] = useState("");
  const [deliveryHours, setDeliveryHours] = useState("24");
  const [bidAmount, setBidAmount] = useState("");
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event) {
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

    if (Object.keys(nextErrors).length === 0) {
      // UI-only for now. We'll save applications through our API later.
      setSubmitted(true);
    }
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-gray-50 px-5 py-16">
        <section className="mx-auto max-w-lg rounded-2xl border border-gray-200 bg-white p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-2xl text-green-700">
            ✓
          </div>

          <h1 className="mt-5 text-2xl font-bold text-gray-900">
            Application form completed
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-600">
            Your application hasn't been sent to a client yet. We'll enable
            submission when the backend is connected.
          </p>

          <Link
            to="/browse"
            className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
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
          className="text-sm font-medium text-gray-600 hover:text-blue-600"
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
          className="mt-8 space-y-6 rounded-2xl border border-gray-200 bg-white p-6 sm:p-8"
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

          <div className="border-t border-gray-200 pt-6">
            <button
              type="submit"
              className="w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
            >
              Review application
            </button>

            <p className="mt-3 text-center text-xs leading-5 text-gray-500">
              This is a frontend preview. No application is stored or sent yet.
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}

export default ApplyTask;
