
import { useState } from "react";
import { Outlet } from "react-router-dom";
import FreelancerSidebar from "../dashboard/FreelancerSidebar";
import DashboardHeader from "../dashboard/DashboardHeader";

function FreelancerLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 md:grid md:grid-cols-[16rem_minmax(0,1fr)] md:grid-rows-[auto_1fr]">
      <DashboardHeader
        mobileMenuOpen={mobileMenuOpen}
        onToggleMobileMenu={() => setMobileMenuOpen((open) => !open)}
      />
      <FreelancerSidebar
        mobileMenuOpen={mobileMenuOpen}
        onCloseMobileMenu={() => setMobileMenuOpen(false)}
      />

      <div className="min-w-0 md:col-start-2 md:row-start-2">
        <div className="mx-auto w-full max-w-[1600px] px-4 py-4 sm:px-6 sm:py-8 lg:px-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default FreelancerLayout;
