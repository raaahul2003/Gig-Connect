
import { useEffect, useState } from "react";
import {
  getMyProfile,
  updateMyProfile,
  uploadProfilePhoto
} from "../../services/profileService";

const emptyProject = {
  title: "",
  description: "",
  technologies: "",
  imageUrl: "",
  projectUrl: "",
};

function FreelancerProfile() {
  const [form, setForm] = useState({
    name: "",
    headline: "",
    bio: "",
    skills: "",
  });

  const [portfolioProjects, setPortfolioProjects] = useState([]);
  const [projectForm, setProjectForm] = useState(emptyProject);
  const [editingIndex, setEditingIndex] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [photoUrl, setPhotoUrl] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [photoUploading, setPhotoUploading] = useState(false);

  // Load profile from backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);

        const response = await getMyProfile();
        const user = response.user;
        setPhotoUrl(user.profile?.photoUrl || "");

        setForm({
          name: user.name || "",
          headline: user.freelancerProfile?.headline || "",
          bio: user.profile?.bio || "",
          skills: user.freelancerProfile?.skills?.join(", ") || "",
        });

        setPortfolioProjects(
          user.freelancerProfile?.portfolio || []
        );
      } catch (err) {
        setError(
          err.response?.data?.message || "Unable to load your profile."
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

  function updateProjectField(event) {
    const { name, value } = event.target;

    setProjectForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  // Add or update a portfolio project
  function handleProjectSubmit(event) {
    event.preventDefault();

    if (!projectForm.title.trim()) {
      setError("Please enter a project title.");
      return;
    }

    const project = {
      title: projectForm.title.trim(),
      description: projectForm.description.trim(),
      technologies: projectForm.technologies
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      imageUrl: projectForm.imageUrl.trim(),
      projectUrl: projectForm.projectUrl.trim(),
    };

    if (editingIndex !== null) {
      setPortfolioProjects((current) =>
        current.map((item, index) =>
          index === editingIndex ? project : item
        )
      );
    } else {
      setPortfolioProjects((current) => [...current, project]);
    }

    setProjectForm(emptyProject);
    setEditingIndex(null);
    setError("");
    setMessage("");
  }

  // Edit a portfolio project
  function handleEditProject(index) {
    const project = portfolioProjects[index];

    setProjectForm({
      title: project.title || "",
      description: project.description || "",
      technologies: project.technologies?.join(", ") || "",
      imageUrl: project.imageUrl || "",
      projectUrl: project.projectUrl || "",
    });

    setEditingIndex(index);
    setError("");
  }

  // Delete a portfolio project
  function handleDeleteProject(index) {
    setPortfolioProjects((current) =>
      current.filter((_, i) => i !== index)
    );

    if (editingIndex === index) {
      setProjectForm(emptyProject);
      setEditingIndex(null);
    } else if (editingIndex !== null && editingIndex > index) {
      setEditingIndex((current) => current - 1);
    }

    setMessage("");
    setError("");
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
        err.response?.data?.message || "Failed to upload profile photo."
      );
    } finally {
      setPhotoUploading(false);
    }
  }

  // Save complete profile to backend
  async function handleSubmit(event) {
    event.preventDefault();

    if (form.name.trim().length < 2) {
      setError("Please enter a valid name.");
      return;
    }

    try {
      setSaving(true);
      setMessage("");
      setError("");

      await updateMyProfile({
        profile: {
          bio: form.bio.trim(),
        },
        freelancerProfile: {
          headline: form.headline.trim(),
          skills: form.skills
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean),
          portfolio: portfolioProjects,
        },
      });

      setMessage("Your profile has been updated successfully!");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update your profile."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main
        role="status"
        className="flex min-h-[300px] items-center justify-center text-sm text-gray-700"
      >
        Loading your profile...
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-6xl">
      <header>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
          Freelancer Profile
        </h1>

        <p className="mt-2 max-w-2xl text-base leading-6 text-gray-700">
          Introduce your skills, experience and projects to potential clients.
        </p>
      </header>

      <div className="mt-7 grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="h-fit rounded-xl border border-gray-200 bg-white p-5 text-center shadow-sm sm:p-6">
          <div className="text-center">
            <div className="mx-auto h-24 w-24 overflow-hidden rounded-full border-2 border-blue-100 bg-blue-50">
              {photoPreview || photoUrl ? (
                <img
                  src={photoPreview || photoUrl}
                  alt={`${form.name || "Freelancer"} profile`}
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
              <input
                id="profilePhoto"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handlePhotoChange}
                className="peer sr-only"
              />
              <label
                htmlFor="profilePhoto"
                className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800 transition-colors hover:bg-gray-50 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blue-700"
              >
                Choose photo
              </label>

              {selectedPhoto && (
                <div className="mt-3">
                  <p className="mb-2 break-all text-sm text-gray-700">
                    Preview: {selectedPhoto.name}
                  </p>

                  <button
                    type="button"
                    onClick={handlePhotoUpload}
                    disabled={photoUploading}
                    className="inline-flex min-h-11 items-center justify-center rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                  >
                    {photoUploading ? "Uploading..." : "Upload photo"}
                  </button>
                </div>
              )}
            </div>
          </div>
          <h2 className="mt-4 text-lg font-semibold text-gray-950">
            {form.name || "Your name"}
          </h2>

          <p className="mt-1 text-sm leading-5 text-gray-700">
            {form.headline || "Your professional headline"}
          </p>
        </aside>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7"
        >
          <section>
            <h2 className="text-lg font-semibold text-gray-950">
              Basic information
            </h2>
            <p className="mt-1 text-sm text-gray-700">
              Keep your profile clear and professional.
            </p>
          </section>

          <div>
            <label
              htmlFor="name"
              className="block text-sm font-semibold text-gray-900"
            >
              Full name
            </label>
            <input
              id="name"
              value={form.name}
              readOnly
              className="mt-2 min-h-11 w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-gray-700"
            />
          </div>

          <div>
            <label
              htmlFor="headline"
              className="block text-sm font-semibold text-gray-900"
            >
              Professional headline
            </label>
            <input
              id="headline"
              name="headline"
              value={form.headline}
              onChange={updateField}
              placeholder="e.g. React Developer and UI Designer"
              className="mt-2 min-h-11 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-950 outline-none placeholder:text-gray-500 focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label
              htmlFor="bio"
              className="block text-sm font-semibold text-gray-900"
            >
              About you
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={5}
              value={form.bio}
              onChange={updateField}
              placeholder="Describe your experience, strengths and approach..."
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-950 outline-none placeholder:text-gray-500 focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label
              htmlFor="skills"
              className="block text-sm font-semibold text-gray-900"
            >
              Skills
            </label>
            <input
              id="skills"
              name="skills"
              value={form.skills}
              onChange={updateField}
              placeholder="React, Node.js, MongoDB..."
              className="mt-2 min-h-11 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-950 outline-none placeholder:text-gray-500 focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
            />
            <p className="mt-2 text-sm text-gray-600">
              Separate skills with commas.
            </p>
          </div>

          {/* Portfolio section */}
          <section className="space-y-5 border-t border-gray-200 pt-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-950">
                Portfolio projects
              </h2>
              <p className="mt-1 text-sm text-gray-700">
                Showcase projects that demonstrate your skills.
              </p>
            </div>

            {portfolioProjects.length > 0 ? (
              <div className="divide-y divide-gray-200 border-y border-gray-200">
                {portfolioProjects.map((project, index) => (
                  <article
                    key={index}
                    className="flex flex-col gap-4 py-4 sm:flex-row"
                  >
                    {project.imageUrl && (
                      <img
                        src={project.imageUrl}
                        alt={`${project.title} project preview`}
                        loading="lazy"
                        className="h-20 w-20 shrink-0 rounded-lg border border-gray-200 object-cover"
                      />
                    )}

                    <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 sm:flex-row">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-gray-950">
                          {project.title}
                        </h3>

                        <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-5 text-gray-700">
                          {project.description}
                        </p>

                        {project.technologies?.length > 0 && (
                          <p className="mt-2 text-sm text-blue-800">
                            {project.technologies.join(" · ")}
                          </p>
                        )}

                        {project.projectUrl && (
                          <a
                            href={project.projectUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-flex min-h-11 items-center text-sm font-semibold text-blue-800 underline decoration-transparent underline-offset-2 hover:decoration-current focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                          >
                            View project
                          </a>
                        )}
                      </div>

                      <div className="flex shrink-0 gap-2 sm:items-start">
                        <button
                          type="button"
                          onClick={() => handleEditProject(index)}
                          aria-label={`Edit ${project.title}`}
                          className="inline-flex min-h-11 items-center justify-center rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-800 transition-colors hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteProject(index)}
                          aria-label={`Delete ${project.title}`}
                          className="inline-flex min-h-11 items-center justify-center rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-800 transition-colors hover:bg-red-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="rounded-lg border border-dashed border-gray-300 p-5 text-center text-sm text-gray-700">
                No portfolio projects added yet.
              </p>
            )}

            <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4 sm:p-5">
              <h3 className="text-base font-semibold text-gray-950">
                {editingIndex !== null ? "Edit project" : "Add a project"}
              </h3>

              <div>
                <label
                  htmlFor="projectTitle"
                  className="block text-sm font-semibold text-gray-900"
                >
                  Project title *
                </label>
                <input
                  id="projectTitle"
                  name="title"
                  aria-required="true"
                  value={projectForm.title}
                  onChange={updateProjectField}
                  placeholder="e.g. E-commerce Website"
                  className="mt-2 min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-950 outline-none placeholder:text-gray-500 focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  htmlFor="projectDescription"
                  className="block text-sm font-semibold text-gray-900"
                >
                  Description
                </label>
                <textarea
                  id="projectDescription"
                  name="description"
                  rows={3}
                  value={projectForm.description}
                  onChange={updateProjectField}
                  placeholder="Describe what you built..."
                  className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-950 outline-none placeholder:text-gray-500 focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  htmlFor="projectTechnologies"
                  className="block text-sm font-semibold text-gray-900"
                >
                  Technologies
                </label>
                <input
                  id="projectTechnologies"
                  name="technologies"
                  value={projectForm.technologies}
                  onChange={updateProjectField}
                  placeholder="React, Node.js, MongoDB"
                  className="mt-2 min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-950 outline-none placeholder:text-gray-500 focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
                />
                <p className="mt-1 text-sm text-gray-600">
                  Separate technologies with commas.
                </p>
              </div>

              <div>
                <label
                  htmlFor="projectImage"
                  className="block text-sm font-semibold text-gray-900"
                >
                  Project image URL
                </label>
                <input
                  id="projectImage"
                  name="imageUrl"
                  type="url"
                  value={projectForm.imageUrl}
                  onChange={updateProjectField}
                  placeholder="https://example.com/project-image.png"
                  className="mt-2 min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-950 outline-none placeholder:text-gray-500 focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  htmlFor="projectUrl"
                  className="block text-sm font-semibold text-gray-900"
                >
                  Live project URL
                </label>
                <input
                  id="projectUrl"
                  name="projectUrl"
                  type="url"
                  value={projectForm.projectUrl}
                  onChange={updateProjectField}
                  placeholder="https://your-project.com"
                  className="mt-2 min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-950 outline-none placeholder:text-gray-500 focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleProjectSubmit}
                  className="inline-flex min-h-11 items-center justify-center rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                >
                  {editingIndex !== null ? "Update project" : "Add project"}
                </button>

                {editingIndex !== null && (
                  <button
                    type="button"
                    onClick={() => {
                      setProjectForm(emptyProject);
                      setEditingIndex(null);
                    }}
                    className="inline-flex min-h-11 items-center justify-center rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-800 transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </section>

          {error && (
            <p
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-900"
            >
              {error}
            </p>
          )}

          {message && (
            <p
              role="status"
              className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-900"
            >
              {message}
            </p>
          )}

          <div className="border-t border-gray-200 pt-6">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white transition-colors hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 sm:w-auto"
            >
              {saving ? "Saving..." : "Save profile"}
            </button>

            <p className="mt-3 text-sm text-gray-600">
              Remember to save your profile after adding, editing or deleting
              projects.
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}

export default FreelancerProfile;
