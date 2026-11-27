
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import api from "../../api/axios";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const [googleCredential, setGoogleCredential] = useState("");
  const [selectedRole, setSelectedRole] = useState("freelancer");
  const [needsRole, setNeedsRole] = useState(false);
  const [loading, setLoading] = useState(false);

  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get("verified") === "true") {
      toast.success("Email verified successfully! You can now log in.");
    }
  }, [searchParams]);



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

  function finishLogin(data) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    window.dispatchEvent(new Event("auth-changed"));

    navigate(
      data.user.role === "client"
        ? "/client/dashboard"
        : data.user.role === "admin"
          ? "/admin/dashboard"
          : "/freelancer/dashboard"
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
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
              Welcome back
            </h1>
            <p className="mt-2 text-sm leading-6 text-gray-700">
              Sign in to continue to your workspace.
            </p>
          </div>

          {needsRole ? (
            <section className="mt-6 space-y-5">
              <h2 className="text-lg font-semibold text-gray-950">
                Choose how you’ll use GigConnect
              </h2>

              <fieldset>
                <legend className="text-sm font-medium text-gray-700">
                  Select an account type
                </legend>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  {[
                    { value: "freelancer", title: "Freelancer", description: "Find tasks and earn" },
                    { value: "client", title: "Client", description: "Post tasks and hire" },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className={`flex min-h-24 cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors sm:p-4 ${selectedRole === option.value
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 hover:border-blue-300 hover:bg-gray-50"
                        }`}
                    >
                      <input
                        type="radio"
                        name="googleRole"
                        value={option.value}
                        checked={selectedRole === option.value}
                        onChange={() => setSelectedRole(option.value)}
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

              {error && (
                <p
                  role="alert"
                  className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm leading-6 text-red-800"
                >
                  {error}
                </p>
              )}

              <button
                type="button"
                onClick={completeGoogleRegistration}
                disabled={loading}
                className="min-h-12 w-full rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white transition-colors hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating account..." : "Continue"}
              </button>
            </section>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
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
                  className="mt-2 min-h-12 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-950 outline-none placeholder:text-gray-500 transition-colors focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
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
                    className="rounded-sm text-sm font-medium text-blue-700 transition-colors hover:text-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
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
                    className="min-h-12 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 pr-20 text-gray-950 outline-none placeholder:text-gray-500 transition-colors focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute inset-y-0 right-1 inline-flex min-w-14 items-center justify-center rounded-md px-2 text-sm font-semibold text-gray-700 transition-colors hover:text-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-blue-700"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

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
                {loading ? "Signing in..." : "Sign in"}
              </button>
              <div className="relative flex items-center justify-center border-t border-gray-200 pt-5">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-3 text-sm text-gray-600">
                  Or continue with Google
                </span>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setError("Google sign-in failed. Please try again.")}
                  width="100%"
                />
              </div>
            </form>
          )}
          <p className="mt-6 text-center text-sm text-gray-700">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="rounded-sm font-semibold text-blue-700 transition-colors hover:text-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
            >
              Create an account
            </Link>
          </p>
        </section>

        <p className="mt-5 text-center text-sm text-gray-600">
          Secure sign-in powered by Google.
        </p>
      </div>
    </main>
  );
}

export default Login;
