
import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar";

function PublicLayout() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <Outlet />

      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-semibold text-gray-900">GigConnect</p>

          <p className="text-sm text-gray-500">
            Find your next opportunity. Get tasks done.
          </p>

          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} GigConnect
          </p>
        </div>
      </footer>
    </div>
  );
}

export default PublicLayout;
