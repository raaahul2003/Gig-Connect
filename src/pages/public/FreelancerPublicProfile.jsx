
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

  const [freelancerScore, setFreelancerScore] = useState(null);
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
        setFreelancerScore(profileResponse.freelancerScore);
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
      <main className="flex min-h-[50vh] items-center justify-center bg-gray-50 px-4 py-10">
        <p
          role="status"
          className="rounded-lg border border-gray-200 bg-white px-5 py-4 text-sm font-medium text-gray-700"
        >
          Loading freelancer profile...
        </p>
      </main>
    );
  }

  if (error || !user) {
    return (
      <main className="flex min-h-[50vh] items-center justify-center bg-gray-50 px-4 py-10">
        <div
          role="alert"
          className="w-full max-w-xl rounded-xl border border-gray-200 bg-white p-6 text-center sm:p-8"
        >
          <h2 className="text-xl font-bold tracking-tight text-gray-950">
            Profile unavailable
          </h2>
          <p className="mt-2 text-sm leading-6 text-gray-700">
            {error || "This profile could not be found."}
          </p>
        </div>
      </main>
    );
  }

  if (user.role !== "freelancer") {
    return (
      <main className="flex min-h-[50vh] items-center justify-center bg-gray-50 px-4 py-10">
        <p className="rounded-lg border border-gray-200 bg-white px-5 py-4 text-sm text-gray-700">
          This profile is not a freelancer profile.
        </p>
      </main>
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
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-6xl space-y-5">

        {/* Freelancer information */}
        <section className="rounded-xl border border-gray-200 bg-white p-5 sm:p-7">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-6">

            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full border border-blue-200 bg-blue-50 sm:h-24 sm:w-24">
              {profile.photoUrl ? (
                <img
                  src={profile.photoUrl}
                  alt={`${user.name} profile`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-blue-800">
                  {user.name?.charAt(0).toUpperCase() || "?"}
                </div>
              )}
            </div>

            <div className="min-w-0 text-center sm:text-left">
              <h1 className="break-words text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
                {user.name}
              </h1>

              <p className="mt-1 text-base font-medium text-blue-800">
                {freelancer.headline || "Freelancer"}
              </p>

              {/* Freelancer reputation score with hover and keyboard-focus details */}
              <div className="relative mt-4 w-fit group">
                <button
                  type="button"
                  aria-describedby="freelancer-score-details"
                  className="inline-flex min-h-14 items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-left transition-colors hover:border-blue-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-800">
                    <svg
                      aria-hidden="true"
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <circle cx="12" cy="12" r="9" />
                      <path strokeLinecap="round" d="M12 11v5m0-8h.01" />
                    </svg>
                  </span>

                  <span>
                    <span className="block text-xs font-medium text-blue-900">
                      Reputation score
                    </span>
                    <span className="mt-0.5 flex items-baseline gap-1">
                      <span className="text-2xl font-bold leading-none text-blue-950">
                        {user.reputation?.score ?? 0}
                      </span>
                      <span className="text-sm text-blue-900">/100</span>
                    </span>
                  </span>
                </button>

                {/* Reputation score details */}
                <div
                  id="freelancer-score-details"
                  role="tooltip"
                  className="invisible absolute left-0 top-full z-50 mt-2 w-[min(18rem,calc(100vw-2rem))] rounded-lg border border-gray-200 bg-white p-4 opacity-0 shadow-lg transition-opacity group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100"
                >
                  <h3 className="font-semibold text-gray-950">
                    How is this score calculated?
                  </h3>

                  <p className="mt-1 text-sm leading-5 text-gray-700">
                    The reputation score is based on verified activity and profile quality.
                  </p>

                  <div className="mt-4 space-y-3 text-sm">
                    <div>
                      <div className="flex justify-between gap-3">
                        <span className="text-gray-700">Completed projects</span>
                        <strong>
                          {freelancerScore?.projectScore ?? 0}/40
                        </strong>
                      </div>
                      <div className="mt-1 h-2 rounded-full bg-gray-100" aria-hidden="true">
                        <div
                          className="h-2 rounded-full bg-blue-500"
                          style={{
                            width: `${((freelancerScore?.projectScore ?? 0) / 40) * 100}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between gap-3">
                        <span className="text-gray-700">On-time delivery</span>
                        <strong>
                          {freelancerScore?.onTimeScore ?? 0}/30
                        </strong>
                      </div>
                      <div className="mt-1 h-2 rounded-full bg-gray-100" aria-hidden="true">
                        <div
                          className="h-2 rounded-full bg-green-500"
                          style={{
                            width: `${((freelancerScore?.onTimeScore ?? 0) / 30) * 100}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between gap-3">
                        <span className="text-gray-700">Profile completeness</span>
                        <strong>
                          {freelancerScore?.profileScore ?? 0}/30
                        </strong>
                      </div>
                      <div className="mt-1 h-2 rounded-full bg-gray-100" aria-hidden="true">
                        <div
                          className="h-2 rounded-full bg-indigo-600"
                          style={{
                            width: `${((freelancerScore?.profileScore ?? 0) / 30) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 border-t border-gray-200 pt-3 text-sm text-gray-700">
                    Based on {freelancerScore?.completedProjects ?? 0} verified
                    completed projects.
                  </div>
                </div>
              </div>


              {profile.location && (
                <p className="mt-2 text-sm text-gray-700">
                  {profile.location}
                </p>
              )}
            </div>
          </div>

          {/* About */}
          <div className="mt-6 border-t border-gray-200 pt-5">
            <h2 className="text-lg font-bold tracking-tight text-gray-950">
              About
            </h2>

            <p className="mt-2 whitespace-pre-line text-sm leading-7 text-gray-700 sm:text-base">
              {profile.bio || "No introduction added yet."}
            </p>
          </div>

          {/* Skills */}
          <div className="mt-6 border-t border-gray-200 pt-5">
            <h2 className="text-lg font-bold tracking-tight text-gray-950">
              Skills
            </h2>

            {freelancer.skills?.length > 0 ? (
              <ul className="mt-3 flex flex-wrap gap-2">
                {freelancer.skills.map((skill, index) => (
                  <li
                    key={`${skill}-${index}`}
                    className="rounded-md border border-blue-100 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-900"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-gray-700">
                No skills added yet.
              </p>
            )}
          </div>
        </section>
        {/* Freelancer Statistics */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <p className="text-sm font-medium text-gray-700">
              Completed Projects
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-green-800">
              {completedWork.length}
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Client-approved projects
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <p className="text-sm font-medium text-gray-700">
              Portfolio Projects
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-blue-800">
              {user.freelancerProfile?.portfolio?.length || 0}
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Showcased projects
            </p>
          </div>
        </section>

        {/* Portfolio */}
        <section className="rounded-xl border border-gray-200 bg-white p-5 sm:p-7">
          <h2 className="text-lg font-bold tracking-tight text-gray-950 sm:text-xl">
            Portfolio
          </h2>

          <p className="mt-1 text-sm text-gray-600">
            Projects showcasing this freelancer's work.
          </p>

          {portfolio.length > 0 ? (
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {portfolio.map((project, index) => (
                <article
                  key={project._id || index}
                  className="min-w-0 overflow-hidden rounded-lg border border-gray-200"
                >
                  {project.imageUrl && (
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="h-40 w-full object-cover"
                    />
                  )}

                  <div className="p-4 sm:p-5">
                    <h3 className="break-words font-semibold text-gray-950">
                      {project.title}
                    </h3>

                    <p className="mt-2 whitespace-pre-line break-words text-sm leading-6 text-gray-700">
                      {project.description}
                    </p>

                    {project.technologies?.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {project.technologies.map((technology, i) => (
                          <span
                            key={`${technology}-${i}`}
                            className="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700"
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
                        className="mt-4 inline-flex min-h-10 items-center rounded-sm text-sm font-semibold text-blue-700 hover:text-blue-800 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                      >
                        View project →
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="mt-5 rounded-lg border border-dashed border-gray-300 px-5 py-8 text-center text-sm text-gray-700">
              This freelancer has not added any portfolio projects yet.
            </p>
          )}
        </section>

        {/* Verified Completed Work */}
        <section className="rounded-xl border border-gray-200 bg-white p-5 sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold tracking-tight text-gray-950 sm:text-xl">
                Completed Work
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Projects completed and approved by clients on GigConnect.
              </p>
            </div>

            {completedWork.length > 0 && (
              <label className="flex w-full flex-col gap-1.5 text-sm font-medium text-gray-800 sm:w-56">
                Filter by category
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="All">All Categories</option>

                  {workCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>
            )}
          </div>

          {filteredWork.length > 0 ? (
            <div className="mt-5 divide-y divide-gray-200 border-y border-gray-200">
              {filteredWork.map((work) => (
                <article
                  key={work._id}
                  className="py-4"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <h3 className="break-words font-semibold text-gray-950">
                        {work.task?.title || "Completed project"}
                      </h3>

                      <p className="mt-1 text-sm text-gray-700">
                        {work.task?.category || "Project"}
                      </p>
                    </div>

                    <span className="inline-flex min-h-8 w-fit shrink-0 items-center gap-1.5 rounded-md bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-800">
                      <span aria-hidden="true">✓</span>
                      Client approved
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-gray-600">
                    Completed:{" "}
                    {work.updatedAt
                      ? new Date(work.updatedAt).toLocaleDateString()
                      : "Date unavailable"}
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <p className="mt-5 rounded-lg border border-dashed border-gray-300 px-5 py-8 text-center text-sm text-gray-700">
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
