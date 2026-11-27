
import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar";

function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-gray-900">
      <Navbar />

      <div className="flex-1">
        <Outlet />
      </div>

      <footer className="mt-auto border-t border-gray-200 bg-gray-50">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div>
            <p className="font-semibold tracking-tight text-gray-950">
              Gig<span className="text-blue-700">Connect</span>
            </p>
            <p className="mt-1 text-sm text-gray-700">
              Find your next opportunity. Get tasks done.
            </p>
          </div>

          <p className="text-sm text-gray-700">
            © {new Date().getFullYear()} GigConnect
          </p>
        </div>
      </footer>
    </div>
  );
}

export default PublicLayout;
