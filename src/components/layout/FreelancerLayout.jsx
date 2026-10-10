
import { Outlet } from "react-router-dom";
import FreelancerSidebar from "../dashboard/FreelancerSidebar";
import DashboardHeader from "../dashboard/DashboardHeader";

function FreelancerLayout() {
  return (
    <div className="min-h-screen bg-gray-50 md:flex">
      <FreelancerSidebar />

      <div className="min-w-0 flex-1">
        <DashboardHeader />

        <div className="px-5 py-8 sm:px-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default FreelancerLayout;
