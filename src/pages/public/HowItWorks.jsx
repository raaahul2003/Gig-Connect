
import { Link } from "react-router-dom";

const clientSteps = [
  {
    number: "01",
    title: "Post Your Task",
    description:
      "Describe your project, add the required skills, set your budget, and publish your task.",
  },
  {
    number: "02",
    title: "Choose a Freelancer",
    description:
      "Review applications, compare proposals, and hire the freelancer who best matches your needs.",
  },
  {
    number: "03",
    title: "Review the Work",
    description:
      "Communicate with your freelancer, receive deliverables, and request revisions when needed.",
  },
  {
    number: "04",
    title: "Approve & Pay",
    description:
      "Approve the completed submission and make your payment securely through Razorpay.",
  },
];

const freelancerSteps = [
  {
    number: "01",
    title: "Explore Tasks",
    description:
      "Browse available projects and discover opportunities that match your skills.",
  },
  {
    number: "02",
    title: "Submit a Proposal",
    description:
      "Apply for suitable tasks with a clear proposal and your expected delivery timeline.",
  },
  {
    number: "03",
    title: "Complete the Work",
    description:
      "Work on your assigned project, upload your deliverables, and respond to revision requests.",
  },
  {
    number: "04",
    title: "Track Your Earnings",
    description:
      "Once the client completes payment, view your paid earnings and transaction history.",
  },
];

function StepCard({ step }) {
  return (
    <article className="h-full rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-blue-100 bg-blue-50 text-sm font-bold text-blue-800">
        {step.number}
      </span>

      <h3 className="mt-4 text-lg font-semibold tracking-tight text-gray-950">
        {step.title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-gray-700">
        {step.description}
      </p>
    </article>
  );
}

function HowItWorks() {
  return (
    <main className="bg-white">
      {/* Hero */}
      <section className="border-b border-gray-200 bg-white px-4 py-14 text-center sm:px-6 sm:py-16">
        <p className="text-sm font-semibold tracking-wide text-blue-800">
          Simple. Transparent. Effective.
        </p>

        <h1 className="mx-auto mt-3 max-w-3xl text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl lg:text-5xl">
          How GigConnect Works
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-gray-700 sm:text-lg sm:leading-8">
          A simple way for clients to find talented freelancers
          and for freelancers to discover meaningful work.
        </p>

        <div className="mx-auto mt-7 flex max-w-lg flex-col justify-center gap-3 sm:flex-row sm:gap-4">
          <Link
            to="/browse"
            className="inline-flex min-h-12 items-center justify-center rounded-lg bg-blue-700 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 sm:w-auto"
          >
            Explore Tasks
          </Link>

          <Link
            to="/register"
            className="inline-flex min-h-12 items-center justify-center rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-800 transition-colors hover:border-gray-400 hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 sm:w-auto"
          >
            Join GigConnect
          </Link>
        </div>
      </section>

      {/* Client Workflow */}
      <section className="border-b border-gray-200 bg-gray-50 px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-7 sm:mb-8">
            <p className="text-sm font-semibold text-blue-800">
              For clients
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
              Get your work done in four steps
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-700 sm:text-base">
              Find the right talent and manage your project from
              posting to payment.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {clientSteps.map((step) => (
              <StepCard key={step.number} step={step} />
            ))}
          </div>
        </div>
      </section>

      {/* Freelancer Workflow */}
      <section className="border-b border-blue-100 bg-blue-50/60 px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-7 sm:mb-8">
            <p className="text-sm font-semibold text-blue-800">
              For freelancers
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
              Turn your skills into opportunities
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-700 sm:text-base">
              Discover projects, work with clients, and track
              your successful payments.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {freelancerSteps.map((step) => (
              <StepCard key={step.number} step={step} />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-white px-4 py-12 text-center sm:px-6 sm:py-14">
        <h2 className="text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
          Ready to get started?
        </h2>

        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-gray-700 sm:text-base">
          Whether you need work done or want to showcase your
          skills, GigConnect brings opportunities together.
        </p>

        <Link
          to="/register"
          className="mt-6 inline-flex min-h-12 items-center justify-center rounded-lg bg-blue-700 px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
        >
          Get Started
        </Link>
      </section>
    </main>
  );
}

export default HowItWorks;
