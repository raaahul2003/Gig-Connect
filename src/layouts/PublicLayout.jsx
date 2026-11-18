
import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar";

function PublicLayout() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />

      <Outlet />

      <footer className="border-t border-gray-200 bg-gray-50/80">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p className="font-semibold tracking-tight text-gray-950">GigConnect</p>

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
