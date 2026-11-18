
import { Outlet } from "react-router-dom";
import FreelancerSidebar from "../dashboard/FreelancerSidebar";
import DashboardHeader from "../dashboard/DashboardHeader";

function FreelancerLayout() {
  return (
    <div className="min-h-screen bg-slate-50 md:flex">
      <FreelancerSidebar />

      <div className="min-w-0 flex-1">
        <DashboardHeader />

        <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default FreelancerLayout;
