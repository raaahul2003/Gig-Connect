
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

function DashboardHeader() {

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  }


  return (
    <header className="flex flex-col gap-4 border-b border-gray-200 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
      <div>
        <p className="text-sm text-gray-500">workspace</p>
        <h1 className="text-lg font-semibold text-gray-900">
          Dashboard overview
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {user?.role === "client" && (
          <Link
            to="/client/post-task"
            className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            + Post a task
          </Link>
        )}

        <button
          type="button"
          onClick={handleLogout}
          aria-label="Log out"
          title="Log out"
          className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 hover:text-red-600 border"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
}

export default DashboardHeader;
