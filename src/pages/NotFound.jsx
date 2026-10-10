import { Link } from "react-router-dom"

function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <p className="text-sm font-semibold text-blue-600">404 ERROR</p>
      <h1 className="mt-3 text-4xl font-bold text-gray-900">
        Page not found
      </h1>
      <p className="mt-3 text-gray-600">
        The page you're looking for doesn't exist.
      </p>
      <Link
        to="/"
        className="mt-6 rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
      >
        Back to home
      </Link>
    </main>
  )
}

export default NotFound