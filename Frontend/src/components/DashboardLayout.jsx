import React from "react";
import { Outlet } from "react-router-dom";
import DashboardLeftNav from "../components/DashboardLeftNav";

const DashboardLayout = () => {
  return (
    <div className="flex">
      <DashboardLeftNav />

      <div className="flex-1 p-8">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;