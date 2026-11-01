
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Landing() {

  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user") || "null")
  );

  useEffect(() => {
    const syncUser = () =>
      setUser(JSON.parse(localStorage.getItem("user") || "null"));

    window.addEventListener("storage", syncUser);
    window.addEventListener("auth-changed", syncUser);

    return () => {
      window.removeEventListener("storage", syncUser);
      window.removeEventListener("auth-changed", syncUser);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <main>
        {/* Hero */}
        <section className="mx-auto max-w-7xl px-4 pb-16 pt-16 sm:px-6 sm:pb-24 sm:pt-20">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
              Find the right person for every task
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Get Tasks Done.
              <span className="block text-blue-600">
                Fast &amp; Simple.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg sm:leading-8">
              GigConnect connects people who need tasks completed with
              skilled freelancers ready to get the work done.
            </p>

            {/* Hero Actions */}
            <div className="mt-8 flex w-full flex-col justify-center gap-3 sm:flex-row">
              {user?.role === "client" && (
              <Link
                to="/post-task"
                className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 sm:w-auto"
              >
                Post a Task
              </Link>
              )}

              <Link
                to="/browse"
                className="inline-flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 sm:w-auto"
              >
                Find Tasks
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="border-y border-gray-200 bg-gray-50">
          <div className="mx-auto grid max-w-7xl gap-5 px-4 py-10 sm:gap-8 sm:px-6 sm:py-16 md:grid-cols-3">
            <Feature
              title="Quick Tasks"
              description="Find and complete tasks that can be finished quickly."
            />

            <Feature
              title="Trusted Freelancers"
              description="Make better decisions using our Trusted Freelancer Score."
            />

            <Feature
              title="Secure Workflow"
              description="Track applications, submissions and payments in one place."
            />
          </div>
        </section>
      </main>
    </div>
  );
}

function Feature({ title, description }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>

      <p className="mt-2 text-sm leading-6 text-gray-600">
        {description}
      </p>
    </div>
  );
}

export default Landing;
