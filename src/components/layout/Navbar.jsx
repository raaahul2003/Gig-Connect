
import { useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="relative border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link
          to="/"
          onClick={closeMenu}
          className="text-xl font-bold tracking-tight text-gray-900"
        >
          GigConnect
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link
            to="/"
            className="text-sm font-medium text-gray-700 transition hover:text-blue-600"
          >
            Home
          </Link>

          <Link
            to="/browse"
            className="text-sm font-medium text-gray-700 transition hover:text-blue-600"
          >
            Browse Tasks
          </Link>

          <Link
            to="/how-it-works"
            className="text-sm font-medium text-gray-700 transition hover:text-blue-600"
          >
            How It Works
          </Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            to="/login"
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            Sign Up
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 md:hidden"
        >
          {menuOpen ? (
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-5 w-5"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          ) : (
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-5 w-5"
            >
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className="absolute left-0 right-0 top-full z-50 border-b border-gray-200 bg-white p-4 shadow-lg md:hidden"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            <Link
              to="/"
              onClick={closeMenu}
              className="rounded-lg px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600"
            >
              Home
            </Link>

            <Link
              to="/browse"
              onClick={closeMenu}
              className="rounded-lg px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600"
            >
              Browse Tasks
            </Link>

            <Link
              to="/how-it-works"
              onClick={closeMenu}
              className="rounded-lg px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600"
            >
              How It Works
            </Link>

            <div className="my-2 border-t border-gray-100" />

            <Link
              to="/login"
              onClick={closeMenu}
              className="rounded-lg px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Login
            </Link>

            <Link
              to="/register"
              onClick={closeMenu}
              className="rounded-lg bg-blue-600 px-3 py-3 text-center text-sm font-semibold text-white hover:bg-blue-700"
            >
              Sign Up
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}

export default Navbar;
