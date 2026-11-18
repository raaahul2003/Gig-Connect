
import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

function getSavedUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(getSavedUser);
  const navigate = useNavigate();

  useEffect(() => {
    const syncUser = () => setUser(getSavedUser());

    window.addEventListener("storage", syncUser);
    window.addEventListener("auth-changed", syncUser);

    return () => {
      window.removeEventListener("storage", syncUser);
      window.removeEventListener("auth-changed", syncUser);
    };
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const dashboardPath =
    user?.role === "client"
      ? "/client/dashboard"
      : user?.role === "admin"
        ? "/admin/dashboard"
        : "/freelancer/dashboard";

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    closeMenu();
    navigate("/");
  }

  const desktopLinkClass = ({ isActive }) =>
    `text-sm font-medium transition ${isActive
      ? "text-blue-600"
      : "text-gray-700 hover:text-blue-600"
    }`;

  const mobileLinkClass = ({ isActive }) =>
    `rounded-lg px-3 py-3 text-sm font-medium transition ${isActive
      ? "bg-blue-50 text-blue-700"
      : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200/80 bg-white/90 shadow-sm backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">

        {/* Logo */}
        <Link
          to="/"
          onClick={closeMenu}
          className="text-xl font-bold tracking-tight text-gray-950 transition hover:text-blue-700"
        >
          GigConnect
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <NavLink to="/" end className={desktopLinkClass}>
            Home
          </NavLink>

          <NavLink to="/browse" className={desktopLinkClass}>
            Browse Tasks
          </NavLink>

          <NavLink
            to="/how-it-works"
            className={desktopLinkClass}
          >
            How It Works
          </NavLink>
        </nav>

        {/* Desktop Authentication */}
        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <Link
                to={dashboardPath}
                className="rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 hover:text-gray-950"
              >
                Dashboard
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 hover:text-gray-950"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={
            menuOpen
              ? "Close navigation menu"
              : "Open navigation menu"
          }
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
          className="absolute left-0 right-0 top-full z-50 border-b border-gray-200 bg-white/95 p-4 shadow-xl backdrop-blur-lg md:hidden"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-1">

            <NavLink
              to="/"
              end
              onClick={closeMenu}
              className={mobileLinkClass}
            >
              Home
            </NavLink>

            <NavLink
              to="/browse"
              onClick={closeMenu}
              className={mobileLinkClass}
            >
              Browse Tasks
            </NavLink>

            <NavLink
              to="/how-it-works"
              onClick={closeMenu}
              className={mobileLinkClass}
            >
              How It Works
            </NavLink>

            <div className="my-2 border-t border-gray-100" />

            {user ? (
              <>
                <Link
                  to={dashboardPath}
                  onClick={closeMenu}
                  className="rounded-lg px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Dashboard
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-lg bg-blue-600 px-3 py-3 text-center text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
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
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}

export default Navbar;
