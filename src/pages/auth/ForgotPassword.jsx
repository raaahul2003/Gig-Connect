
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api/axios";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      toast.error("Enter a valid email address.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/forgot-password", {
        email: normalizedEmail,
      });

      toast.success(response.data.message);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Unable to process your request. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8 sm:px-6 sm:py-12">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="mx-auto block w-fit rounded-sm text-center text-2xl font-bold tracking-tight text-gray-950 transition-colors hover:text-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700"
        >
          Gig<span className="text-blue-700">Connect</span>
        </Link>

        <section className="mt-6 rounded-xl border border-gray-200 bg-white p-5 sm:mt-8 sm:p-8">
          <Link
            to="/login"
            className="inline-flex min-h-10 items-center rounded-sm text-sm font-medium text-gray-700 transition-colors hover:text-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
          >
            ← Back to login
          </Link>

          <div className="mt-5">
            <h1 className="text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
              Forgot your password?
            </h1>

            <p className="mt-3 text-sm leading-6 text-gray-700">
              Enter the email address associated with your account.
              We'll send you a password reset link if an account exists.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label
                htmlFor="email"
                className="text-sm font-semibold text-gray-900"
              >
                Email address
              </label>

              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
                disabled={loading}
                className="mt-2 min-h-12 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-950 outline-none placeholder:text-gray-500 transition-colors focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-700"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="min-h-12 w-full rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white transition-colors hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Sending reset link..." : "Continue"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-700">
            Remember your password?{" "}
            <Link
              to="/login"
              className="rounded-sm font-semibold text-blue-700 transition-colors hover:text-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
            >
              Sign in
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}

export default ForgotPassword;
