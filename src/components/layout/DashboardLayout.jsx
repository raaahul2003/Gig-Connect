
import { Outlet } from "react-router-dom";
import DashboardSidebar from "../dashboard/DashboardSidebar";
import DashboardHeader from "../dashboard/DashboardHeader";

function DashboardLayout() {
  return (
    <div className="min-h-screen bg-gray-50 md:flex">
      <DashboardSidebar />

      <div className="min-w-0 flex-1">
        <DashboardHeader />

        <div className="px-5 py-8 sm:px-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
