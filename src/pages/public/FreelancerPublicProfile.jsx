
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getPublicProfile,
  getFreelancerWorkHistory
} from "../../services/profileService";

function FreelancerPublicProfile() {
  const { userId } = useParams();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [completedWork, setCompletedWork] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const [profileResponse, workResponse] = await Promise.all([
          getPublicProfile(userId),
          getFreelancerWorkHistory(userId),
        ]);

        setUser(profileResponse.user);
        setCompletedWork(workResponse.completedWork || []);

      } catch (err) {
        setError(
          err.response?.data?.message ||
          "Unable to load this freelancer's profile."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-gray-500">Loading freelancer profile...</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="mx-auto max-w-3xl p-8 text-center">
        <h2 className="text-xl font-bold text-gray-900">
          Profile unavailable
        </h2>
        <p className="mt-2 text-gray-500">
          {error || "This profile could not be found."}
        </p>
      </div>
    );
  }

  if (user.role !== "freelancer") {
    return (
      <div className="mx-auto max-w-3xl p-8 text-center">
        <p className="text-gray-500">
          This profile is not a freelancer profile.
        </p>
      </div>
    );
  }

  const profile = user.profile || {};
  const freelancer = user.freelancerProfile || {};
  const portfolio = freelancer.portfolio || [];

  const workCategories = [
    ...new Set(
      completedWork
        .map((work) => work.task?.category)
        .filter(Boolean)
    ),
  ];

  const filteredWork =
    selectedCategory === "All"
      ? completedWork
      : completedWork.filter(
        (work) => work.task?.category === selectedCategory
      );

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-5xl space-y-6">

        {/* Freelancer information */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">

            <div className="h-28 w-28 shrink-0 overflow-hidden rounded-full border-4 border-blue-100 bg-blue-50">
              {profile.photoUrl ? (
                <img
                  src={profile.photoUrl}
                  alt={user.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-4xl font-bold text-blue-700">
                  {user.name?.charAt(0).toUpperCase() || "?"}
                </div>
              )}
            </div>

            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-bold text-gray-900">
                {user.name}
              </h1>

              <p className="mt-1 text-blue-600">
                {freelancer.headline || "Freelancer"}
              </p>

              {profile.location && (
                <p className="mt-2 text-sm text-gray-500">
                  {profile.location}
                </p>
              )}
            </div>
          </div>

          {/* About */}
          <div className="mt-8 border-t border-gray-100 pt-6">
            <h2 className="text-lg font-semibold text-gray-900">
              About
            </h2>

            <p className="mt-3 whitespace-pre-line leading-7 text-gray-600">
              {profile.bio || "No introduction added yet."}
            </p>
          </div>

          {/* Skills */}
          <div className="mt-8 border-t border-gray-100 pt-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Skills
            </h2>

            {freelancer.skills?.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {freelancer.skills.map((skill, index) => (
                  <span
                    key={`${skill}-${index}`}
                    className="rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-gray-500">
                No skills added yet.
              </p>
            )}
          </div>
        </section>
        {/* Freelancer Statistics */}
        <section className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Completed Projects
            </p>
            <h2 className="mt-2 text-3xl font-bold text-green-600">
              {completedWork.length}
            </h2>
            <p className="mt-1 text-xs text-gray-500">
              Client-approved projects
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Portfolio Projects
            </p>
            <h2 className="mt-2 text-3xl font-bold text-blue-600">
              {user.freelancerProfile?.portfolio?.length || 0}
            </h2>
            <p className="mt-1 text-xs text-gray-500">
              Showcased projects
            </p>
          </div>
        </section>

        {/* Portfolio */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-bold text-gray-900">
            Portfolio
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Projects showcasing this freelancer's work.
          </p>

          {portfolio.length > 0 ? (
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {portfolio.map((project, index) => (
                <article
                  key={project._id || index}
                  className="overflow-hidden rounded-xl border border-gray-200"
                >
                  {project.imageUrl && (
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="h-44 w-full object-cover"
                    />
                  )}

                  <div className="p-5">
                    <h3 className="font-semibold text-gray-900">
                      {project.title}
                    </h3>

                    <p className="mt-2 whitespace-pre-line text-sm leading-6 text-gray-600">
                      {project.description}
                    </p>

                    {project.technologies?.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {project.technologies.map((technology, i) => (
                          <span
                            key={`${technology}-${i}`}
                            className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600"
                          >
                            {technology}
                          </span>
                        ))}
                      </div>
                    )}

                    {project.projectUrl && (
                      <a
                        href={project.projectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-block text-sm font-medium text-blue-600 hover:underline"
                      >
                        View project →
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="mt-6 rounded-xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
              This freelancer has not added any portfolio projects yet.
            </p>
          )}
        </section>

        {/* Verified Completed Work */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Completed Work
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Projects completed and approved by clients on GigConnect.
              </p>
            </div>

            {completedWork.length > 0 && (
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 outline-none focus:border-blue-500"
              >
                <option value="All">All Categories</option>

                {workCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            )}
          </div>

          {filteredWork.length > 0 ? (
            <div className="mt-6 space-y-4">
              {filteredWork.map((work) => (
                <article
                  key={work._id}
                  className="rounded-xl border border-gray-200 p-5"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {work.task?.title || "Completed project"}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        {work.task?.category || "Project"}
                      </p>
                    </div>

                    <span className="w-fit rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
                      ✓ Client approved
                    </span>
                  </div>

                  <p className="mt-3 text-xs text-gray-500">
                    Completed:{" "}
                    {work.updatedAt
                      ? new Date(work.updatedAt).toLocaleDateString()
                      : "Date unavailable"}
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <p className="mt-6 rounded-xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
              {completedWork.length === 0
                ? "No completed projects yet."
                : "No completed projects in this category."}
            </p>
          )}
        </section>


      </div>
    </main>
  );
}

export default FreelancerPublicProfile;
