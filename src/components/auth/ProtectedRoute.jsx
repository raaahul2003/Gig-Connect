import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute({ allowedRole }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== allowedRole) {
    const roleHome = {
      client: "/client/dashboard",
      freelancer: "/freelancer/dashboard",
      admin: "/admin/dashboard",
    };

    return <Navigate to={roleHome[user.role] || "/login"} replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;