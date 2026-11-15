
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
    <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 font-bold text-blue-600">
        {step.number}
      </span>

      <h3 className="mt-5 text-lg font-semibold text-gray-900">
        {step.title}
      </h3>

      <p className="mt-2 text-sm leading-7 text-gray-600">
        {step.description}
      </p>
    </article>
  );
}

function HowItWorks() {
  return (
    <main className="bg-gray-50">
      {/* Hero */}
      <section className="bg-white px-6 py-20 text-center">
        <p className="text-sm font-bold tracking-widest text-blue-600">
          SIMPLE. TRANSPARENT. EFFECTIVE.
        </p>

        <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          How GigConnect Works
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-gray-600">
          A simple way for clients to find talented freelancers
          and for freelancers to discover meaningful work.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            to="/browse"
            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Explore Tasks
          </Link>

          <Link
            to="/register"
            className="rounded-xl border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50"
          >
            Join GigConnect
          </Link>
        </div>
      </section>

      {/* Client Workflow */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-10">
          <p className="text-sm font-bold tracking-widest text-blue-600">
            FOR CLIENTS
          </p>

          <h2 className="mt-3 text-3xl font-bold text-gray-900">
            Get your work done in four steps
          </h2>

          <p className="mt-3 text-gray-600">
            Find the right talent and manage your project from
            posting to payment.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {clientSteps.map((step) => (
            <StepCard key={step.number} step={step} />
          ))}
        </div>
      </section>

      {/* Freelancer Workflow */}
      <section className="bg-blue-50 px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10">
            <p className="text-sm font-bold tracking-widest text-blue-600">
              FOR FREELANCERS
            </p>

            <h2 className="mt-3 text-3xl font-bold text-gray-900">
              Turn your skills into opportunities
            </h2>

            <p className="mt-3 text-gray-600">
              Discover projects, work with clients, and track
              your successful payments.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {freelancerSteps.map((step) => (
              <StepCard key={step.number} step={step} />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-white px-6 py-20 text-center">
        <h2 className="text-3xl font-bold text-gray-900">
          Ready to get started?
        </h2>

        <p className="mx-auto mt-4 max-w-xl text-gray-600">
          Whether you need work done or want to showcase your
          skills, GigConnect brings opportunities together.
        </p>

        <Link
          to="/register"
          className="mt-8 inline-flex rounded-xl bg-blue-600 px-7 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Get Started
        </Link>
      </section>
    </main>
  );
}

export default HowItWorks;
