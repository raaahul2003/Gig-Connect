
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import api from "../../api/axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const [googleCredential, setGoogleCredential] = useState("");
  const [selectedRole, setSelectedRole] = useState("freelancer");
  const [needsRole, setNeedsRole] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!email.trim() || !email.includes("@")) {
      setError("Enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Enter your password.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email: email.trim(),
        password,
      });

      finishLogin(response.data);
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Login failed. Please check your details and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSuccess(credentialResponse) {
    const credential = credentialResponse.credential;

    if (!credential) {
      setError("Google sign-in did not return a credential.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/google", { credential });

      if (response.data.needsRole) {
        setGoogleCredential(credential);
        setNeedsRole(true);
        return;
      }

      finishLogin(response.data);
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Google sign-in failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  function finishLogin(data) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    navigate(
      data.user.role === "client"
        ? "/client/dashboard"
        : "/freelancer/dashboard"
    );
  }

  async function completeGoogleRegistration() {
    if (!googleCredential) {
      setError("Please sign in with Google again.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/google/complete-registration", {
        credential: googleCredential,
        role: selectedRole,
      });

      finishLogin(response.data);
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Could not complete registration. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-5 py-12">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="block text-center text-2xl font-bold tracking-tight text-gray-900"
        >
          Gig<span className="text-blue-600">Connect</span>
        </Link>

        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Sign in to continue to your workspace.
            </p>
          </div>


          {needsRole ? (
            <section className="mt-8 space-y-5">
              <h2 className="text-lg font-semibold text-gray-900">
                Choose how you’ll use GigConnect
              </h2>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "freelancer", title: "Freelancer", description: "Find tasks and earn" },
                  { value: "client", title: "Client", description: "Post tasks and hire" },
                ].map((option) => (
                  <label
                    key={option.value}
                    className={`cursor-pointer rounded-xl border p-4 ${selectedRole === option.value
                      ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                      : "border-gray-200"
                      }`}
                  >
                    <input
                      type="radio"
                      name="googleRole"
                      value={option.value}
                      checked={selectedRole === option.value}
                      onChange={() => setSelectedRole(option.value)}
                      className="sr-only"
                    />
                    <span className="block font-semibold">{option.title}</span>
                    <span className="mt-1 block text-xs text-gray-500">
                      {option.description}
                    </span>
                  </label>
                ))}
              </div>

              {error && <p role="alert" className="text-sm text-amber-800">{error}</p>}

              <button
                type="button"
                onClick={completeGoogleRegistration}
                disabled={loading}
                className="w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white disabled:opacity-60"
              >
                {loading ? "Creating account..." : "Continue"}
              </button>
            </section>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-900"
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
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <div className="flex items-center justify-between gap-3">
                  <label
                    htmlFor="password"
                    className="text-sm font-semibold text-gray-900"
                  >
                    Password
                  </label>

                  <Link
                    to="/forgot-password"
                    className="text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="relative mt-2">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 pr-20 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute inset-y-0 right-3 text-sm font-medium text-gray-500 hover:text-blue-600"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {error && (
                <p
                  role="alert"
                  className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800"
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
              <div className="flex justify-center items-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setError("Google sign-in failed. Please try again.")}
                  width="100%"
                />
              </div>
            </form>
          )}
          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-blue-600 hover:text-blue-700"
            >
              Create an account
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-gray-500">
          Secure sign-in powered by Google.
        </p>
      </div>
    </main>
  );
}

export default Login;
