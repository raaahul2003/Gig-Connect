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
            <div className="flex min-h-[300px] items-center justify-center">
                <p className="text-gray-500">Loading your profile...</p>
            </div>
        );
    }

    return (
        <main>
            <header>
                <p className="text-sm font-semibold text-blue-600">
                    YOUR CLIENT IDENTITY
                </p>

                <h1 className="mt-2 text-2xl font-bold text-gray-900">
                    Client Profile
                </h1>

                <p className="mt-2 text-sm text-gray-500">
                    Manage your profile and introduce yourself to freelancers.
                </p>
            </header>

            <div className="mt-8 grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">

                {/* Profile sidebar */}
                <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm">

                    <div className="mx-auto h-24 w-24 overflow-hidden rounded-full border-4 border-blue-100 bg-blue-50">
                        {photoPreview || photoUrl ? (
                            <img
                                src={photoPreview || photoUrl}
                                alt="Client profile"
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-blue-700">
                                {form.name.trim()
                                    ? form.name.trim().charAt(0).toUpperCase()
                                    : "?"}
                            </div>
                        )}
                    </div>

                    <div className="mt-4">
                        <label
                            htmlFor="profilePhoto"
                            className="inline-block cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Choose photo
                        </label>

                        <input
                            id="profilePhoto"
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handlePhotoChange}
                            className="hidden"
                        />

                        {selectedPhoto && (
                            <div className="mt-3">
                                <p className="mb-2 text-xs text-gray-500">
                                    Preview: {selectedPhoto.name}
                                </p>

                                <button
                                    type="button"
                                    onClick={handlePhotoUpload}
                                    disabled={photoUploading}
                                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                                >
                                    {photoUploading ? "Uploading..." : "Upload photo"}
                                </button>
                            </div>
                        )}
                    </div>

                    <h2 className="mt-4 font-semibold text-gray-900">
                        {form.clientType === "company"
                            ? form.companyName || "Your company"
                            : form.name || "Your name"}
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        {form.clientType === "company"
                            ? "Company account"
                            : "Individual client"}
                    </p>

                    <p className="mt-4 text-sm text-gray-500">
                        {form.location || "Your location"}
                    </p>
                </aside>

                {/* Profile form */}
                <form
                    onSubmit={handleSubmit}
                    className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
                >

                    <section>
                        <h2 className="font-semibold text-gray-900">
                            Basic information
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Keep your client profile clear and professional.
                        </p>
                    </section>

                    {/* Account name */}
                    <div>
                        <label className="text-sm font-semibold">
                            Account name
                        </label>
                        <input
                            value={form.name}
                            readOnly
                            className="mt-2 w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-500"
                        />
                    </div>

                    {/* Company fields */}
                    {form.clientType === "company" && (
                        <>
                            <div>
                                <label htmlFor="companyName" className="text-sm font-semibold">
                                    Company name
                                </label>
                                <input
                                    id="companyName"
                                    name="companyName"
                                    value={form.companyName}
                                    onChange={updateField}
                                    placeholder="Enter your company name"
                                    className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="companyWebsite" className="text-sm font-semibold">
                                    Company website
                                </label>
                                <input
                                    id="companyWebsite"
                                    name="companyWebsite"
                                    type="url"
                                    value={form.companyWebsite}
                                    onChange={updateField}
                                    placeholder="https://example.com"
                                    className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="companyDescription" className="text-sm font-semibold">
                                    Company description
                                </label>
                                <textarea
                                    id="companyDescription"
                                    name="companyDescription"
                                    rows={5}
                                    value={form.companyDescription}
                                    onChange={updateField}
                                    placeholder="Tell freelancers about your company..."
                                    className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                                />
                            </div>
                        </>
                    )}

                    {/* Bio */}
                    <div>
                        <label htmlFor="bio" className="text-sm font-semibold">
                            {form.clientType === "company" ? "About your company" : "About you"}
                        </label>
                        <textarea
                            id="bio"
                            name="bio"
                            rows={4}
                            value={form.bio}
                            onChange={updateField}
                            placeholder="Introduce yourself..."
                            className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* Location */}
                    <div>
                        <label htmlFor="location" className="text-sm font-semibold">
                            Location
                        </label>
                        <input
                            id="location"
                            name="location"
                            value={form.location}
                            onChange={updateField}
                            placeholder="e.g. Kochi, Kerala"
                            className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* Feedback */}
                    {error && (
                        <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                            {error}
                        </p>
                    )}

                    {message && (
                        <p role="status" className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
                            {message}
                        </p>
                    )}

                    {/* Save button */}
                    <div className="border-t border-gray-200 pt-6">
                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60 sm:w-auto"
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