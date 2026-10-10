
import { useState } from "react";
import { Link } from "react-router-dom";

function EmailVerification() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!/^\d{6}$/.test(code)) {
      setError("Enter a valid 6-digit verification code.");
      return;
    }

    setMessage(
      "Code format is valid, but verification isn't available until the backend is connected."
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

        <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm sm:p-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <span aria-hidden="true" className="text-2xl">✉</span>
          </div>

          <h1 className="mt-5 text-2xl font-bold text-gray-900">
            Verify your email
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-600">
            Enter the six-digit code sent to your email address.
          </p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            <div>
              <label htmlFor="code" className="sr-only">
                Six-digit verification code
              </label>

              <input
                id="code"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={code}
                onChange={(event) =>
                  setCode(event.target.value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="000000"
                className="w-full rounded-xl border border-gray-300 px-4 py-4 text-center text-2xl font-semibold tracking-[0.5em] outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            {error && (
              <p role="alert" className="text-sm text-red-700">
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
              Verify email
            </button>
          </form>

          <p className="mt-6 text-sm text-gray-500">
            Didn't receive a code?
          </p>

          <button
            type="button"
            onClick={() =>
              setMessage("Resending codes will be enabled with the backend.")
            }
            className="mt-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            Resend code
          </button>

          <div className="mt-6">
            <Link to="/login" className="text-sm text-gray-600 hover:text-blue-600">
              Back to login
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

export default EmailVerification;
