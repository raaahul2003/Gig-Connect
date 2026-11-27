
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import { toast } from "react-toastify";

function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        if (password.length < 8) {
            setError("Password must contain at least 8 characters.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);

            const response = await api.post(
                `/auth/reset-password/${token}`,
                {
                    password,
                    confirmPassword,
                }
            );

            toast.success(response.data.message);
            navigate("/login");
        } catch (err) {
            toast.error(
                err.response?.data?.message ||
                "Unable to reset password. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10 sm:px-6 sm:py-12">
            <div className="w-full max-w-md">
                <Link
                    to="/"
                    className="mx-auto block w-fit rounded-sm text-center text-2xl font-bold tracking-tight text-gray-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700"
                >
                    Gig<span className="text-blue-600">Connect</span>
                </Link>

                <section className="mt-7 rounded-xl border border-gray-200 bg-white p-5 sm:mt-8 sm:p-8">
                    <Link
                        to="/login"
                        className="inline-flex min-h-10 items-center rounded-sm text-sm font-medium text-gray-700 transition-colors hover:text-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                    >
                        ← Back to login
                    </Link>

                    <h1 className="mt-5 text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
                        Create a new password
                    </h1>

                    <p className="mt-3 text-sm leading-6 text-gray-700">
                        Enter your new password below. Your reset link is valid for
                        15 minutes.
                    </p>

                    <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                        <div>
                            <label
                                htmlFor="new-password"
                                className="text-sm font-semibold text-gray-900"
                            >
                                New password
                            </label>

                            <input
                                id="new-password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter new password"
                                autoComplete="new-password"
                                required
                                minLength={8}
                                className="mt-2 min-h-12 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-950 outline-none placeholder:text-gray-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="confirm-password"
                                className="text-sm font-semibold text-gray-900"
                            >
                                Confirm new password
                            </label>

                            <input
                                id="confirm-password"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm new password"
                                autoComplete="new-password"
                                required
                                minLength={8}
                                className="mt-2 min-h-12 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-950 outline-none placeholder:text-gray-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                            />
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
                            className="min-h-12 w-full rounded-lg bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? "Updating password..." : "Reset Password"}
                        </button>
                    </form>
                </section>
            </div>
        </main>
    );
}

export default ResetPassword;
