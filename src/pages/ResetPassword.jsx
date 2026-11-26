
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

                    <h1 className="mt-6 text-2xl font-bold text-gray-900">
                        Create a new password
                    </h1>

                    <p className="mt-3 text-sm leading-6 text-gray-600">
                        Enter your new password below. Your reset link is valid for
                        15 minutes.
                    </p>

                    <form onSubmit={handleSubmit} className="mt-7 space-y-5">
                        <div>
                            <label className="text-sm font-semibold">
                                New password
                            </label>

                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter new password"
                                autoComplete="new-password"
                                required
                                minLength={8}
                                className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-semibold">
                                Confirm new password
                            </label>

                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm new password"
                                autoComplete="new-password"
                                required
                                minLength={8}
                                className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                            />
                        </div>

                        {error && (
                            <p
                                role="alert"
                                className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
                            >
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
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
