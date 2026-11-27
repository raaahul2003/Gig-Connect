
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { toast } from 'sonner'


function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "freelancer",
    clientType: "individual",
    password: "",
    confirmPassword: "",
    acceptedTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  function updateField(event) {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    // Frontend validation
    if (form.name.trim().length < 2) {
      setError("Enter your full name.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Enter a valid email address.");
      return;
    }

    if (form.password.length < 8) {
      setError("Your password must contain at least 8 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Your passwords don't match.");
      return;
    }

    if (!form.acceptedTerms) {
      setError("Please accept the terms to continue.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/register", {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role,
        ...(form.role === "client" && {
          clientType: form.clientType,
        }),
      });

      toast.success(
        response.data.message ||
        "Registration successful! Please verify your email."
      );

      navigate("/login", {
        replace: true,
        state: {
          email: form.email.trim(),
          registered: true,
          emailVerificationRequired: true,
        },
      });

    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Registration failed. Please try again.";

      setError(errorMessage);
      toast.error(errorMessage);

    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8 sm:px-6 sm:py-12">
      <div className="w-full max-w-xl">
        <Link
          to="/"
          className="mx-auto block w-fit rounded-sm text-center text-2xl font-bold tracking-tight text-gray-950 transition-colors hover:text-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700"
        >
          Gig<span className="text-blue-700">Connect</span>
        </Link>

        <section className="mt-6 rounded-xl border border-gray-200 bg-white p-5 sm:mt-8 sm:p-8">
          <h1 className="text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
            Create your account
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-700">
            Join GigConnect and get started.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label htmlFor="name" className="text-sm font-semibold text-gray-900">
                Full name
              </label>
              <input
                id="name"
                name="name"
                autoComplete="name"
                value={form.name}
                onChange={updateField}
                placeholder="Your full name"
                className="mt-2 min-h-12 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-950 outline-none placeholder:text-gray-500 transition-colors focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label htmlFor="email" className="text-sm font-semibold text-gray-900">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={updateField}
                placeholder="you@example.com"
                className="mt-2 min-h-12 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-950 outline-none placeholder:text-gray-500 transition-colors focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <fieldset>
              <legend className="text-sm font-semibold text-gray-900">
                I want to join as
              </legend>

              <div className="mt-3 grid grid-cols-2 gap-3">
                {[
                  {
                    value: "freelancer",
                    title: "Freelancer",
                    description: "Find tasks and earn",
                  },
                  {
                    value: "client",
                    title: "Client",
                    description: "Post tasks and hire",
                  },
                ].map((option) => (
                  <label
                    key={option.value}
                    className={`flex min-h-24 cursor-pointer items-start gap-3 rounded-lg border p-3.5 transition-colors sm:p-4 ${form.role === option.value
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 hover:border-blue-300 hover:bg-gray-50"
                      }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={option.value}
                      checked={form.role === option.value}
                      onChange={updateField}
                      className="mt-1 h-4 w-4 shrink-0 accent-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                    />
                    <span>
                      <span className="block font-semibold text-gray-950">
                        {option.title}
                      </span>
                      <span className="mt-1 block text-sm leading-5 text-gray-700">
                        {option.description}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
            {/* Client Type Selection */}
            {form.role === "client" && (
              <fieldset>
                <legend className="text-sm font-semibold text-gray-900">
                  What type of client are you?
                </legend>

                <div className="mt-3 grid grid-cols-2 gap-3">
                  {[
                    {
                      value: "individual",
                      title: "Individual",
                      description: "Hire for personal projects",
                    },
                    {
                      value: "company",
                      title: "Company",
                      description: "Hire for your business",
                    },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className={`flex min-h-24 cursor-pointer items-start gap-3 rounded-lg border p-3.5 transition-colors sm:p-4 ${form.clientType === option.value
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 hover:border-blue-300 hover:bg-gray-50"
                        }`}
                    >
                      <input
                        type="radio"
                        name="clientType"
                        value={option.value}
                        checked={form.clientType === option.value}
                        onChange={updateField}
                        className="mt-1 h-4 w-4 shrink-0 accent-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                      />

                      <span>
                        <span className="block font-semibold text-gray-950">
                          {option.title}
                        </span>

                        <span className="mt-1 block text-sm leading-5 text-gray-700">
                          {option.description}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
            )}

            <div>
              <label htmlFor="password" className="text-sm font-semibold text-gray-900">
                Password
              </label>

              <div className="relative mt-2">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={form.password}
                  onChange={updateField}
                  placeholder="At least 8 characters"
                  className="min-h-12 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 pr-20 text-gray-950 outline-none placeholder:text-gray-500 transition-colors focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-1 inline-flex min-w-14 items-center justify-center rounded-md px-2 text-sm font-semibold text-gray-700 transition-colors hover:text-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-blue-700"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="text-sm font-semibold text-gray-900"
              >
                Confirm password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={form.confirmPassword}
                onChange={updateField}
                placeholder="Re-enter your password"
                className="mt-2 min-h-12 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-950 outline-none placeholder:text-gray-500 transition-colors focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <label className="flex min-h-11 cursor-pointer items-start gap-3 text-sm leading-6 text-gray-700">
              <input
                type="checkbox"
                name="acceptedTerms"
                checked={form.acceptedTerms}
                onChange={updateField}
                className="mt-1 h-4 w-4 shrink-0 accent-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
              />
              <span>
                I agree to the GigConnect terms and conditions.
              </span>
            </label>

            {error && (
              <p
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm leading-6 text-red-800"
              >
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="min-h-12 w-full rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white transition-colors hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-700">
            Already have an account?{" "}
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

export default Register;
