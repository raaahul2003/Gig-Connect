import Navbar from "../../components/layout/Navbar"

function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <main>
        {/* Hero */}
        <section className="mx-auto max-w-7xl px-6 pb-24 pt-20">
          <div className="mx-auto max-w-3xl text-center">

            <div className="mb-6 inline-flex rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
              Find the right person for every task
            </div>

            <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Get Tasks Done.
              <span className="block text-blue-600">
                Fast &amp; Simple.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
              GigConnect connects people who need tasks completed with
              skilled freelancers ready to get the work done.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <button className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700">
                Post a Task
              </button>

              <button className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50">
                Find Tasks
              </button>
            </div>

          </div>
        </section>

        {/* Features */}
        <section className="border-y border-gray-200 bg-gray-50">
          <div className="mx-auto grid max-w-7xl gap-8 px-6 py-16 md:grid-cols-3">

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
  )
}

function Feature({ title, description }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <h2 className="text-lg font-semibold text-gray-900">
        {title}
      </h2>

      <p className="mt-2 text-sm leading-6 text-gray-600">
        {description}
      </p>
    </div>
  )
}

export default Landing