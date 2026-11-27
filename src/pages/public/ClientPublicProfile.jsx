
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPublicProfile } from "../../services/profileService";

function ClientPublicProfile() {
    const { userId } = useParams();

    // Profile states
    const [user, setUser] = useState(null);
    const [hiringHistory, setHiringHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Category filter state
    const [selectedCategory, setSelectedCategory] = useState("All");

    // Fetch public profile
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await getPublicProfile(userId);

                setUser(response.user);
                setHiringHistory(response.clientHiringHistory || []);

            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    "Unable to load this client's profile."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [userId]);

    // Get available categories
    const categories = [
        ...new Set(
            hiringHistory
                .map((task) => task.category)
                .filter(Boolean)
        ),
    ];

    // Filter completed projects
    const filteredHistory =
        selectedCategory === "All"
            ? hiringHistory
            : hiringHistory.filter(
                (task) => task.category === selectedCategory
            );

    // Loading state
    if (loading) {
        return (
            <main className="flex min-h-[60vh] items-center justify-center bg-gray-50 px-4 py-10">
                <p role="status" className="rounded-lg border border-gray-200 bg-white px-5 py-4 text-sm font-medium text-gray-700">
                    Loading client profile...
                </p>
            </main>
        );
    }

    // Error state
    if (error) {
        return (
            <main className="flex min-h-[60vh] items-center justify-center bg-gray-50 px-4 py-10">
                <p role="alert" className="max-w-lg rounded-lg border border-red-200 bg-red-50 px-5 py-4 text-center text-sm font-medium text-red-800">
                    {error}
                </p>
            </main>
        );
    }

    // Validate client account
    if (!user || user.role !== "client") {
        return (
            <main className="flex min-h-[60vh] items-center justify-center bg-gray-50 px-4 py-10">
                <p className="rounded-lg border border-gray-200 bg-white px-5 py-4 text-sm font-medium text-gray-700">
                    Client profile not found.
                </p>
            </main>
        );
    }

    // Client information
    const isCompany = user.clientType === "company";

    const displayName = isCompany
        ? user.clientProfile?.companyName || user.name
        : user.name;

    const memberSince = new Date(user.createdAt).toLocaleDateString(
        "en-IN",
        {
            month: "long",
            year: "numeric",
        }
    );

    const memberSinceYear = new Date(user.createdAt).getFullYear();

    // Client statistics
    const completedTaskCount = hiringHistory.length;
    const categoriesHired = categories.length;

    return (
        <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 sm:py-10">

            <div className="mx-auto max-w-6xl space-y-5">

                {/* Profile Header */}
                <section className="rounded-xl border border-gray-200 bg-white p-5 sm:p-7">

                    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-6">

                        {/* Profile Photo */}
                        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full border border-blue-200 bg-blue-50 sm:h-24 sm:w-24">

                            {user.profile?.photoUrl ? (
                                <img
                                    src={user.profile.photoUrl}
                                    alt={`${displayName} profile`}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-blue-700">
                                    {displayName?.charAt(0).toUpperCase() || "?"}
                                </div>
                            )}

                        </div>

                        {/* Client Details */}
                        <div className="text-center sm:text-left">

                            <h1 className="text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
                                {displayName}
                            </h1>

                            <span className="mt-2 inline-flex rounded-md bg-blue-50 px-2.5 py-1 text-sm font-semibold text-blue-800">
                                {isCompany
                                    ? "Company Client"
                                    : "Individual Client"}
                            </span>

                            <div className="mt-3 flex flex-col gap-1 text-sm text-gray-700 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-5">
                                <p>
                                    {user.profile?.location ||
                                        "Location not specified"}
                                </p>
                                <p>
                                    <span className="text-gray-600">Member since </span>
                                    {memberSince}
                                </p>
                            </div>

                        </div>

                    </div>
                </section>


                {/* About Section */}
                <section className="rounded-xl border border-gray-200 bg-white p-5 sm:p-7">

                    <h2 className="text-lg font-bold tracking-tight text-gray-950 sm:text-xl">
                        About
                    </h2>

                    <p className="mt-3 whitespace-pre-line text-sm leading-7 text-gray-700 sm:text-base">
                        {isCompany
                            ? user.clientProfile?.companyDescription ||
                            "No company description available."
                            : user.profile?.bio ||
                            "No bio available."}
                    </p>

                    {/* Company Website */}
                    {isCompany && user.clientProfile?.companyWebsite && (
                        <a
                            href={user.clientProfile.companyWebsite}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-sm text-sm font-semibold text-blue-700 hover:text-blue-800 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                        >
                            Visit Company Website
                            <span>↗</span>
                        </a>
                    )}

                </section>


                {/* Client Statistics */}
                <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">

                    {/* Completed Tasks */}
                    <div className="rounded-xl border border-gray-200 bg-white p-5">
                        <p className="text-sm font-medium text-gray-700">
                            Completed tasks
                        </p>
                        <h2 className="mt-2 text-3xl font-bold tracking-tight text-green-800 sm:text-4xl">
                            {completedTaskCount}
                        </h2>
                        <p className="mt-1 text-sm text-gray-600">
                            Successfully completed projects
                        </p>
                    </div>


                    {/* Categories Hired */}
                    <div className="rounded-xl border border-gray-200 bg-white p-5">
                        <p className="text-sm font-medium text-gray-700">
                            Categories hired
                        </p>
                        <h2 className="mt-2 text-3xl font-bold tracking-tight text-blue-800 sm:text-4xl">
                            {categoriesHired}
                        </h2>
                        <p className="mt-1 text-sm text-gray-600">
                            Different project categories
                        </p>
                    </div>


                    {/* Member Since */}
                    <div className="rounded-xl border border-gray-200 bg-white p-5 sm:col-span-2 lg:col-span-1">
                        <p className="text-sm font-medium text-gray-700">
                            Member since
                        </p>
                        <h2 className="mt-2 text-3xl font-bold tracking-tight text-indigo-800 sm:text-4xl">
                            {memberSinceYear}
                        </h2>
                        <p className="mt-1 text-sm text-gray-600">
                            Joined GigConnect
                        </p>
                    </div>

                </section>


                {/* Hiring History */}
                <section className="rounded-xl border border-gray-200 bg-white p-5 sm:p-7">

                    {/* Heading and Category Filter */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                        <div>
                            <h2 className="text-lg font-bold tracking-tight text-gray-950 sm:text-xl">
                                Hiring History
                            </h2>

                            <p className="mt-1 text-sm text-gray-600">
                                Completed projects posted by this client.
                            </p>
                        </div>

                        {hiringHistory.length > 0 && (
                            <label className="flex w-full flex-col gap-1.5 text-sm font-medium text-gray-800 sm:w-56">
                                Filter by category
                                <select
                                    value={selectedCategory}
                                    onChange={(e) =>
                                        setSelectedCategory(e.target.value)
                                    }
                                    className="min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                                >
                                    <option value="All">
                                        All Categories
                                    </option>

                                    {categories.map((category) => (
                                        <option
                                            key={category}
                                            value={category}
                                        >
                                            {category}
                                        </option>
                                    ))}

                                </select>
                            </label>
                        )}

                    </div>


                    {/* Completed Projects */}
                    {hiringHistory.length === 0 ? (

                        <p className="mt-5 rounded-lg border border-dashed border-gray-300 px-5 py-8 text-center text-sm text-gray-700">
                            No completed projects yet.
                        </p>

                    ) : filteredHistory.length > 0 ? (

                        <div className="mt-5 divide-y divide-gray-200 border-y border-gray-200">

                            {filteredHistory.map((task) => (
                                <article
                                    key={task._id}
                                    className="py-4"
                                >

                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">

                                        <div className="min-w-0">
                                            <h3 className="break-words font-semibold text-gray-950">
                                                {task.title}
                                            </h3>

                                            <p className="mt-1 text-sm text-gray-700">
                                                {task.category}
                                            </p>
                                        </div>

                                        <span className="inline-flex min-h-8 w-fit shrink-0 items-center gap-1.5 rounded-md bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-800">
                                            <span aria-hidden="true">✓</span>
                                            Completed
                                        </span>

                                    </div>

                                    <p className="mt-2 text-sm text-gray-600">
                                        Completed:{" "}
                                        {task.updatedAt
                                            ? new Date(
                                                task.updatedAt
                                            ).toLocaleDateString("en-IN")
                                            : "Date unavailable"}
                                    </p>

                                </article>
                            ))}

                        </div>

                    ) : (

                        <p className="mt-5 rounded-lg border border-dashed border-gray-300 px-5 py-8 text-center text-sm text-gray-700">
                            No completed projects in this category.
                        </p>

                    )}

                </section>

            </div>
        </main>
    );
}

export default ClientPublicProfile;
