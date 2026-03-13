import React from "react";
import TopGreeting from "../components/TopGreeting";
import CardContainer from "../components/CardContainer";

const PersonalDashboard = () => {
  return (
    <div className="flex flex-col h-full">

      {/* Fixed greeting */}
      <div className="mb-6">
        <TopGreeting />
      </div>

      {/* Scrollable workspace cards */}
      <div className="flex-1 overflow-y-auto hide-scrollbar">
        <CardContainer />
      </div>

    </div>
  );
};

export default PersonalDashboard;