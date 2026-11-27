
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
      <main className="text-gray-900">
        {/* Hero */}
        <section className="border-b border-gray-200 bg-white px-4 pb-14 pt-12 sm:px-6 sm:pb-20 sm:pt-16">
          <div className="mx-auto max-w-4xl text-center">
            <p className="mb-5 inline-flex max-w-full rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-800">
              Find the right person for every task
            </p>

            <h1 className="text-4xl font-bold tracking-tight text-gray-950 sm:text-5xl lg:text-6xl">
              Get Tasks Done.
              <span className="block text-blue-700">
                Fast &amp; Simple.
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-700 sm:mt-6 sm:text-lg sm:leading-8">
              GigConnect connects people who need tasks completed with
              skilled freelancers ready to get the work done.
            </p>

            {/* Hero Actions */}
            <div className="mx-auto mt-7 flex w-full max-w-lg flex-col justify-center gap-3 sm:mt-8 sm:flex-row">
              {user?.role === "client" && (
                <Link
                  to="/post-task"
                  className="inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-blue-700 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 sm:w-auto"
                >
                  Post a Task
                </Link>
              )}

              <Link
                to="/browse"
                className="inline-flex min-h-12 w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-800 transition-colors hover:border-gray-400 hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 sm:w-auto"
              >
                Find Tasks
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section
          aria-label="GigConnect features"
          className="border-b border-gray-200 bg-gray-50"
        >
          <div className="mx-auto grid max-w-7xl gap-4 px-4 py-10 sm:grid-cols-2 sm:gap-5 sm:px-6 sm:py-14 md:grid-cols-3 lg:px-8">
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
    <article className="h-full rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
      <h2 className="text-lg font-semibold tracking-tight text-gray-950">
        {title}
      </h2>

      <p className="mt-2 text-sm leading-6 text-gray-700">
        {description}
      </p>
    </article>
  );
}

export default Landing;
