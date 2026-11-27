
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
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8 sm:px-6 sm:py-12">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="mx-auto block w-fit rounded-sm text-center text-2xl font-bold tracking-tight text-gray-950 transition-colors hover:text-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700"
        >
          Gig<span className="text-blue-700">Connect</span>
        </Link>

        <section className="mt-6 rounded-xl border border-gray-200 bg-white p-5 sm:mt-8 sm:p-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-800">
            <span aria-hidden="true" className="text-xl">✉</span>
          </div>

          <h1 className="mt-4 text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
            Verify your email
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-700">
            Enter the six-digit code sent to your email address.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label
                htmlFor="code"
                className="mb-2 block text-left text-sm font-semibold text-gray-900"
              >
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
                className="min-h-14 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-center text-2xl font-semibold tracking-[0.4em] text-gray-950 outline-none placeholder:text-gray-400 transition-colors focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 p-3 text-left text-sm leading-6 text-red-800"
              >
                {error}
              </p>
            )}

            {message && (
              <p role="status" className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-left text-sm leading-6 text-blue-900">
                {message}
              </p>
            )}

            <button
              type="submit"
              className="min-h-12 w-full rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white transition-colors hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
            >
              Verify email
            </button>
          </form>

          <p className="mt-6 text-sm text-gray-700">
            Didn't receive a code?
          </p>

          <button
            type="button"
            onClick={() =>
              setMessage("Resending codes will be enabled with the backend.")
            }
            className="mt-1 inline-flex min-h-11 items-center rounded-sm text-sm font-semibold text-blue-700 transition-colors hover:text-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
          >
            Resend code
          </button>

          <div className="mt-6">
            <Link to="/login" className="inline-flex min-h-11 items-center rounded-sm text-sm font-medium text-gray-700 transition-colors hover:text-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700">
              Back to login
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

export default EmailVerification;
