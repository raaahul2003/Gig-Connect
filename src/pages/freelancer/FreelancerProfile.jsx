
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
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-gray-500">Loading your profile...</p>
      </div>
    );
  }

  return (
    <main>
      <header>
        <p className="text-sm font-semibold text-blue-600">
          YOUR PROFESSIONAL IDENTITY
        </p>

        <h1 className="mt-2 text-2xl font-bold text-gray-900">
          Freelancer Profile
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Introduce your skills, experience and projects to potential clients.
        </p>
      </header>

      <div className="mt-8 grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm">
          <div className="text-center">
            {/* Profile photo */}
            <div className="mx-auto h-24 w-24 overflow-hidden rounded-full border-4 border-blue-100 bg-blue-50">
              {photoPreview || photoUrl ? (
                <img
                  src={photoPreview || photoUrl}
                  alt="Freelancer profile"
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

            {/* Photo upload controls */}
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
          </div>


          <h2 className="mt-4 font-semibold text-gray-900">
            {form.name || "Your name"}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {form.headline || "Your professional headline"}
          </p>

          <div className="mt-5 border-t border-gray-100 pt-5 text-left">
            <p className="text-sm font-medium text-gray-900">
              Trusted Freelancer Score
            </p>

            <p className="mt-2 text-sm leading-5 text-gray-500">
              This score will be calculated from verified work history and
              reliability data when those features are implemented.
            </p>
          </div>
        </aside>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
        >
          <section>
            <h2 className="font-semibold text-gray-900">
              Basic information
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Keep your profile clear and professional.
            </p>
          </section>

          <div>
            <label htmlFor="name" className="text-sm font-semibold">
              Full name
            </label>
            <input
              id="name"
              value={form.name}
              readOnly
              className="mt-2 w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-500"
            />
          </div>

          <div>
            <label htmlFor="headline" className="text-sm font-semibold">
              Professional headline
            </label>
            <input
              id="headline"
              name="headline"
              value={form.headline}
              onChange={updateField}
              placeholder="e.g. React Developer and UI Designer"
              className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div>
            <label htmlFor="bio" className="text-sm font-semibold">
              About you
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={5}
              value={form.bio}
              onChange={updateField}
              placeholder="Describe your experience, strengths and approach..."
              className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div>
            <label htmlFor="skills" className="text-sm font-semibold">
              Skills
            </label>
            <input
              id="skills"
              name="skills"
              value={form.skills}
              onChange={updateField}
              placeholder="React, Node.js, MongoDB..."
              className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
            <p className="mt-2 text-xs text-gray-500">
              Separate skills with commas.
            </p>
          </div>

          {/* Portfolio section */}
          <section className="space-y-5 border-t border-gray-200 pt-6">
            <div>
              <h2 className="font-semibold text-gray-900">
                Portfolio projects
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Showcase projects that demonstrate your skills.
              </p>
            </div>

            {portfolioProjects.length > 0 ? (
              <div className="space-y-3">
                {portfolioProjects.map((project, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-gray-200 p-4"
                  >
                    <div className="flex flex-col justify-between gap-3 sm:flex-row">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-gray-900">
                          {project.title}
                        </h3>

                        <p className="mt-1 text-sm text-gray-600">
                          {project.description}
                        </p>

                        {project.technologies?.length > 0 && (
                          <p className="mt-2 text-xs text-blue-600">
                            {project.technologies.join(" · ")}
                          </p>
                        )}

                        {project.projectUrl && (
                          <a
                            href={project.projectUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-block text-sm text-blue-600 hover:underline"
                          >
                            View project
                          </a>
                        )}
                      </div>

                      <div className="flex shrink-0 gap-2">
                        <button
                          type="button"
                          onClick={() => handleEditProject(index)}
                          className="rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteProject(index)}
                          className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="rounded-xl border border-dashed border-gray-300 p-5 text-center text-sm text-gray-500">
                No portfolio projects added yet.
              </p>
            )}

            <div className="space-y-4 rounded-xl bg-gray-50 p-4">
              <h3 className="font-semibold text-gray-900">
                {editingIndex !== null ? "Edit project" : "Add a project"}
              </h3>

              <div>
                <label htmlFor="projectTitle" className="text-sm font-medium">
                  Project title *
                </label>
                <input
                  id="projectTitle"
                  name="title"
                  value={projectForm.title}
                  onChange={updateProjectField}
                  placeholder="e.g. E-commerce Website"
                  className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="projectDescription" className="text-sm font-medium">
                  Description
                </label>
                <textarea
                  id="projectDescription"
                  name="description"
                  rows={3}
                  value={projectForm.description}
                  onChange={updateProjectField}
                  placeholder="Describe what you built..."
                  className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="projectTechnologies" className="text-sm font-medium">
                  Technologies
                </label>
                <input
                  id="projectTechnologies"
                  name="technologies"
                  value={projectForm.technologies}
                  onChange={updateProjectField}
                  placeholder="React, Node.js, MongoDB"
                  className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 outline-none focus:border-blue-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Separate technologies with commas.
                </p>
              </div>

              <div>
                <label htmlFor="projectImage" className="text-sm font-medium">
                  Project image URL
                </label>
                <input
                  id="projectImage"
                  name="imageUrl"
                  type="url"
                  value={projectForm.imageUrl}
                  onChange={updateProjectField}
                  placeholder="https://example.com/project-image.png"
                  className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="projectUrl" className="text-sm font-medium">
                  Live project URL
                </label>
                <input
                  id="projectUrl"
                  name="projectUrl"
                  type="url"
                  value={projectForm.projectUrl}
                  onChange={updateProjectField}
                  placeholder="https://your-project.com"
                  className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleProjectSubmit}
                  className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
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
                    className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm hover:bg-white"
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
              className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          {message && (
            <p
              role="status"
              className="rounded-lg bg-green-50 p-3 text-sm text-green-700"
            >
              {message}
            </p>
          )}

          <div className="border-t border-gray-200 pt-6">
            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {saving ? "Saving..." : "Save profile"}
            </button>

            <p className="mt-3 text-xs text-gray-500">
              Remember to save your profile after adding, editing or deleting projects.
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}

export default FreelancerProfile;
