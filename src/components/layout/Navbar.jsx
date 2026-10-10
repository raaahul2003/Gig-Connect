function Navbar() {

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

        {/* Logo */}
        <a href="/" className="text-xl font-bold tracking-tight text-gray-900">
          GigConnect
        </a>

        {/* Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <a
            href="/"
            className="text-sm font-medium text-gray-700 transition hover:text-blue-600"
          >
            Home
          </a>

          <a
            href="/browse"
            className="text-sm font-medium text-gray-700 transition hover:text-blue-600"
          >
            Browse Tasks
          </a>

          <a
            href="/how-it-works"
            className="text-sm font-medium text-gray-700 transition hover:text-blue-600"
          >
            How It Works
          </a>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <a
            href="/login"
            className="hidden rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 sm:block"
          >
            Login
          </a>

          <a
            href="/register"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            Sign Up
          </a>
        </div>

      </div>
    </header>
  )
}

export default Navbar