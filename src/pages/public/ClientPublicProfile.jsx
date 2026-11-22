
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPublicProfile } from "../../services/profileService";
import {
    FaCheck,
    FaLayerGroup,
    FaCalendarAlt
} from "react-icons/fa";

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
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-600">
                    Loading client profile...
                </p>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    // Validate client account
    if (!user || user.role !== "client") {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-600">
                    Client profile not found.
                </p>
            </div>
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
        <main className="min-h-screen bg-gray-50 px-4 py-10">

            <div className="mx-auto max-w-5xl space-y-6">

                {/* Profile Header */}
                <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">

                    <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">

                        {/* Profile Photo */}
                        <div className="h-24 w-24 shrink-0 overflow-hidden rounded-full border-4 border-blue-100 bg-blue-50">

                            {user.profile?.photoUrl ? (
                                <img
                                    src={user.profile.photoUrl}
                                    alt={displayName}
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

                            <h1 className="text-2xl font-bold text-gray-900">
                                {displayName}
                            </h1>

                            <span className="mt-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                                {isCompany
                                    ? "Company Client"
                                    : "Individual Client"}
                            </span>

                            <p className="mt-3 text-sm text-gray-600">
                                {user.profile?.location ||
                                    "Location not specified"}
                            </p>

                            <p className="mt-1 text-sm text-gray-500">
                                Member since {memberSince}
                            </p>

                        </div>

                    </div>
                </section>


                {/* About Section */}
                <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">

                    <h2 className="text-xl font-bold text-gray-900">
                        About {isCompany ? "the Company" : ""}
                    </h2>

                    <p className="mt-3 whitespace-pre-line leading-7 text-gray-600">
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
                            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                        >
                            Visit Company Website
                            <span>↗</span>
                        </a>
                    )}

                </section>


                {/* Client Statistics */}
                <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">

                    {/* Completed Tasks */}
                    <div className="group relative overflow-hidden rounded-2xl border border-green-100 bg-gradient-to-br from-green-50 to-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">

                        <div className="flex items-center justify-between">

                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Completed Tasks
                                </p>

                                <h2 className="mt-3 text-4xl font-bold tracking-tight text-green-700">
                                    {completedTaskCount}
                                </h2>

                                <p className="mt-2 text-xs text-gray-500">
                                    Successfully completed projects
                                </p>
                            </div>

                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-green-700">
                                <FaCheck className="h-7 w-7" />
                            </div>

                        </div>

                        <div className="absolute -bottom-8 -right-8 h-24 w-24 rounded-full bg-green-100/50 blur-2xl transition-all group-hover:scale-150" />

                    </div>


                    {/* Categories Hired */}
                    <div className="group relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">

                        <div className="flex items-center justify-between">

                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Categories Hired
                                </p>

                                <h2 className="mt-3 text-4xl font-bold tracking-tight text-blue-700">
                                    {categoriesHired}
                                </h2>

                                <p className="mt-2 text-xs text-gray-500">
                                    Different project categories
                                </p>
                            </div>

                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                                <FaLayerGroup className="h-7 w-7" />
                            </div>

                        </div>

                        <div className="absolute -bottom-8 -right-8 h-24 w-24 rounded-full bg-blue-100/50 blur-2xl transition-all group-hover:scale-150" />

                    </div>


                    {/* Member Since */}
                    <div className="group relative overflow-hidden rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50 to-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md sm:col-span-2 lg:col-span-1">

                        <div className="flex items-center justify-between">

                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Member Since
                                </p>

                                <h2 className="mt-3 text-4xl font-bold tracking-tight text-purple-700">
                                    {memberSinceYear}
                                </h2>

                                <p className="mt-2 text-xs text-gray-500">
                                    Joined GigConnect
                                </p>
                            </div>

                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-purple-700">
                                <FaCalendarAlt className="h-7 w-7" />
                            </div>

                        </div>

                        <div className="absolute -bottom-8 -right-8 h-24 w-24 rounded-full bg-purple-100/50 blur-2xl transition-all group-hover:scale-150" />

                    </div>

                </section>


                {/* Hiring History */}
                <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">

                    {/* Heading and Category Filter */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                        <div>
                            <h2 className="text-xl font-bold text-gray-900">
                                Hiring History
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Completed projects posted by this client.
                            </p>
                        </div>

                        {hiringHistory.length > 0 && (
                            <select
                                value={selectedCategory}
                                onChange={(e) =>
                                    setSelectedCategory(e.target.value)
                                }
                                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 outline-none focus:border-blue-500"
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
                        )}

                    </div>


                    {/* Completed Projects */}
                    {hiringHistory.length === 0 ? (

                        <p className="mt-6 rounded-xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
                            No completed projects yet.
                        </p>

                    ) : filteredHistory.length > 0 ? (

                        <div className="mt-6 space-y-4">

                            {filteredHistory.map((task) => (
                                <article
                                    key={task._id}
                                    className="rounded-xl border border-gray-200 p-5 transition-colors hover:border-blue-200"
                                >

                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                                        <div>
                                            <h3 className="font-semibold text-gray-900">
                                                {task.title}
                                            </h3>

                                            <p className="mt-1 text-sm text-gray-500">
                                                {task.category}
                                            </p>
                                        </div>

                                        <span className="w-fit rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
                                            ✓ Completed
                                        </span>

                                    </div>

                                    <p className="mt-3 text-xs text-gray-500">
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

                        <p className="mt-6 rounded-xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
                            No completed projects in this category.
                        </p>

                    )}

                </section>

            </div>
        </main>
    );
}

export default ClientPublicProfile;
