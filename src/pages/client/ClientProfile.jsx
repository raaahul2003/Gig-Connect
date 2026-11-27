import { useEffect, useState } from "react";
import {
    getMyProfile,
    updateMyProfile,
    uploadProfilePhoto,
} from "../../services/profileService";

function ClientProfile() {
    const [form, setForm] = useState({
        name: "",
        clientType: "individual",
        bio: "",
        location: "",
        companyName: "",
        companyWebsite: "",
        companyDescription: "",
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [photoUrl, setPhotoUrl] = useState("");
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [photoPreview, setPhotoPreview] = useState("");
    const [photoUploading, setPhotoUploading] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);

                const response = await getMyProfile();
                const user = response.user;

                setPhotoUrl(user.profile?.photoUrl || "");

                setForm({
                    name: user.name || "",
                    clientType: user.clientType || "individual",
                    bio: user.profile?.bio || "",
                    location: user.profile?.location || "",
                    companyName: user.clientProfile?.companyName || "",
                    companyWebsite: user.clientProfile?.companyWebsite || "",
                    companyDescription:
                        user.clientProfile?.companyDescription || "",
                });
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    "Unable to load your profile."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    function updateField(event) {
        const { name, value } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));

        setMessage("");
        setError("");
    }

    async function handleSubmit(event) {
        event.preventDefault();

        try {
            setSaving(true);
            setMessage("");
            setError("");

            const profileData = {
                profile: {
                    bio: form.bio.trim(),
                    location: form.location.trim(),
                },
            };

            // Include company details only for company clients
            if (form.clientType === "company") {
                profileData.clientProfile = {
                    companyName: form.companyName.trim(),
                    companyWebsite: form.companyWebsite.trim(),
                    companyDescription: form.companyDescription.trim(),
                };
            }

            await updateMyProfile(profileData);

            setMessage("Your profile has been updated successfully!");
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to update your profile."
            );
        } finally {
            setSaving(false);
        }
    }

    function handlePhotoChange(event) {
        const file = event.target.files[0];

        if (!file) return;

        const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

        if (!allowedTypes.includes(file.type)) {
            setError("Only JPG, PNG and WebP images are allowed.");
            event.target.value = "";
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError("Image size must be less than 5 MB.");
            event.target.value = "";
            return;
        }

        setSelectedPhoto(file);
        setPhotoPreview(URL.createObjectURL(file));
        setError("");
        setMessage("");
    }

    async function handlePhotoUpload() {
        if (!selectedPhoto) {
            setError("Please select an image first.");
            return;
        }

        try {
            setPhotoUploading(true);
            setError("");
            setMessage("");

            const response = await uploadProfilePhoto(selectedPhoto);

            setPhotoUrl(response.photoUrl);
            setSelectedPhoto(null);
            setPhotoPreview("");

            setMessage("Profile photo uploaded successfully!");
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to upload profile photo."
            );
        } finally {
            setPhotoUploading(false);
        }
    }

    if (loading) {
        return (
            <main
                role="status"
                aria-live="polite"
                className="flex min-h-[300px] items-center justify-center"
            >
                <p className="text-sm text-gray-600">Loading your profile...</p>
            </main>
        );
    }

    return (
        <main className="space-y-6 sm:space-y-8">
            <header>
                <h1 className="text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
                    Client Profile
                </h1>

                <p className="mt-2 max-w-2xl text-base leading-6 text-gray-700">
                    Manage your profile and introduce yourself to freelancers.
                </p>
            </header>

            <div className="grid items-start gap-5 lg:grid-cols-[260px_minmax(0,1fr)] xl:gap-6">
                <aside
                    aria-label="Profile preview"
                    className="overflow-hidden rounded-xl border border-gray-200 bg-white"
                >
                    <div className="flex flex-col items-center p-5 text-center sm:p-6">
                        <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-blue-100 bg-blue-50">
                            {photoPreview || photoUrl ? (
                                <img
                                    src={photoPreview || photoUrl}
                                    alt="Client profile"
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-blue-800">
                                    {form.name.trim()
                                        ? form.name.trim().charAt(0).toUpperCase()
                                        : "?"}
                                </div>
                            )}
                        </div>

                        <h2 className="mt-4 break-words font-semibold text-gray-950">
                            {form.clientType === "company"
                                ? form.companyName || "Your company"
                                : form.name || "Your name"}
                        </h2>

                        <p className="mt-1 text-sm text-gray-600">
                            {form.clientType === "company"
                                ? "Company account"
                                : "Individual client"}
                        </p>

                        <p className="mt-3 text-sm text-gray-700">
                            {form.location || "Your location"}
                        </p>
                    </div>

                    <div className="border-t border-gray-200 p-5 sm:p-6">
                        <p className="text-sm font-semibold text-gray-900">
                            Profile photo
                        </p>
                        <p className="mt-1 text-sm text-gray-600">
                            Use a clear photo so freelancers can recognize your profile.
                        </p>

                        <div className="mt-4">
                            <input
                                id="profilePhoto"
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={handlePhotoChange}
                                className="peer sr-only"
                            />
                            <label
                                htmlFor="profilePhoto"
                                className="inline-flex min-h-11 w-full cursor-pointer items-center justify-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800 transition-colors hover:bg-gray-50 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blue-700"
                            >
                                Choose photo
                            </label>
                        </div>

                        {selectedPhoto && (
                            <div className="mt-4 rounded-lg bg-gray-50 p-3">
                                <p className="break-all text-xs leading-5 text-gray-700">
                                    Preview: {selectedPhoto.name}
                                </p>
                                <button
                                    type="button"
                                    onClick={handlePhotoUpload}
                                    disabled={photoUploading}
                                    className="mt-3 inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {photoUploading ? "Uploading..." : "Upload photo"}
                                </button>
                            </div>
                        )}
                    </div>
                </aside>

                <form
                    onSubmit={handleSubmit}
                    className="min-w-0 overflow-hidden rounded-xl border border-gray-200 bg-white"
                >
                    <div className="border-b border-gray-200 px-5 py-5 sm:px-7">
                        <h2 className="text-lg font-semibold tracking-tight text-gray-950">
                            Profile information
                        </h2>
                        <p className="mt-1 text-sm leading-5 text-gray-600">
                            Keep your client profile clear and professional.
                        </p>
                    </div>

                    <div className="space-y-7 p-5 sm:p-7">
                        <section>
                            <h3 className="text-sm font-semibold text-gray-900">
                                Basic information
                            </h3>
                            <div className="mt-4">
                                <label
                                    htmlFor="accountName"
                                    className="block text-sm font-medium text-gray-800"
                                >
                                    Account name
                                </label>
                                <input
                                    id="accountName"
                                    value={form.name}
                                    readOnly
                                    className="mt-2 min-h-11 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm text-gray-700"
                                />
                            </div>
                        </section>

                        {form.clientType === "company" && (
                            <section className="border-t border-gray-200 pt-6">
                                <h3 className="text-sm font-semibold text-gray-900">
                                    Company information
                                </h3>
                                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label
                                            htmlFor="companyName"
                                            className="block text-sm font-medium text-gray-800"
                                        >
                                            Company name
                                        </label>
                                        <input
                                            id="companyName"
                                            name="companyName"
                                            value={form.companyName}
                                            onChange={updateField}
                                            placeholder="Enter your company name"
                                            className="mt-2 min-h-11 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="companyWebsite"
                                            className="block text-sm font-medium text-gray-800"
                                        >
                                            Company website
                                        </label>
                                        <input
                                            id="companyWebsite"
                                            name="companyWebsite"
                                            type="url"
                                            value={form.companyWebsite}
                                            onChange={updateField}
                                            placeholder="https://example.com"
                                            className="mt-2 min-h-11 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                                        />
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label
                                            htmlFor="companyDescription"
                                            className="block text-sm font-medium text-gray-800"
                                        >
                                            Company description
                                        </label>
                                        <textarea
                                            id="companyDescription"
                                            name="companyDescription"
                                            rows={5}
                                            value={form.companyDescription}
                                            onChange={updateField}
                                            placeholder="Tell freelancers about your company..."
                                            className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm leading-6 text-gray-900 placeholder:text-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                                        />
                                    </div>
                                </div>
                            </section>
                        )}

                        <section className="border-t border-gray-200 pt-6">
                            <h3 className="text-sm font-semibold text-gray-900">
                                About
                            </h3>
                            <div className="mt-4">
                                <label
                                    htmlFor="bio"
                                    className="block text-sm font-medium text-gray-800"
                                >
                                    {form.clientType === "company"
                                        ? "About your company"
                                        : "About you"}
                                </label>
                                <textarea
                                    id="bio"
                                    name="bio"
                                    rows={4}
                                    value={form.bio}
                                    onChange={updateField}
                                    placeholder="Introduce yourself..."
                                    className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm leading-6 text-gray-900 placeholder:text-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                                />
                            </div>
                        </section>

                        <section className="border-t border-gray-200 pt-6">
                            <label
                                htmlFor="location"
                                className="block text-sm font-semibold text-gray-900"
                            >
                                Location
                            </label>
                            <input
                                id="location"
                                name="location"
                                value={form.location}
                                onChange={updateField}
                                placeholder="e.g. Kochi, Kerala"
                                className="mt-2 min-h-11 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 sm:max-w-md"
                            />
                        </section>

                        {error && (
                            <p
                                role="alert"
                                className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm leading-5 text-red-800"
                            >
                                {error}
                            </p>
                        )}

                        {message && (
                            <p
                                role="status"
                                className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm leading-5 text-green-800"
                            >
                                {message}
                            </p>
                        )}
                    </div>

                    <div className="border-t border-gray-200 bg-gray-50/70 px-5 py-4 sm:px-7">
                        <button
                            type="submit"
                            disabled={saving}
                            className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                        >
                            {saving ? "Saving..." : "Save profile"}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}

export default ClientProfile;