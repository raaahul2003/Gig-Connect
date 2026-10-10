
import { useState } from "react";
import { Link } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }

    setMessage(
      "This form is ready for integration. No reset email has been sent."
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-5 py-12">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="block text-center text-2xl font-bold text-gray-900"
        >
          Gig<span className="text-blue-600">Connect</span>
        </Link>

        <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <Link
            to="/login"
            className="text-sm font-medium text-gray-500 hover:text-blue-600"
          >
            ← Back to login
          </Link>

          <div className="mt-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <span aria-hidden="true" className="text-xl">@</span>
            </div>

            <h1 className="mt-5 text-2xl font-bold text-gray-900">
              Forgot your password?
            </h1>

            <p className="mt-3 text-sm leading-6 text-gray-600">
              Enter the email address associated with your account. We'll
              provide a way to reset your password once authentication is
              connected.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            <div>
              <label htmlFor="email" className="text-sm font-semibold">
                Email address
              </label>

              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            {error && (
              <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                {error}
              </p>
            )}

            {message && (
              <p role="status" className="rounded-lg bg-blue-50 p-3 text-sm text-blue-800">
                {message}
              </p>
            )}

            <button
              type="submit"
              className="w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Continue
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Remember your password?{" "}
            <Link to="/login" className="font-semibold text-blue-600">
              Sign in
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}

export default ForgotPassword;
