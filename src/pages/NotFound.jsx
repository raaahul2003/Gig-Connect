import { Link } from "react-router-dom";

function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <section className="w-full max-w-lg rounded-xl border border-gray-200 bg-white px-6 py-10 text-center sm:px-10 sm:py-12">
        <p className="text-sm font-semibold text-blue-800">404 error</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
          Page not found
        </h1>
        <p className="mt-3 text-base leading-7 text-gray-700">
          The page you're looking for doesn't exist.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex min-h-12 items-center justify-center rounded-lg bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
        >
          Back to home
        </Link>
      </section>
    </main>
  );
}

export default NotFound;