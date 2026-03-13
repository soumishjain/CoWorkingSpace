import React from "react";
import { useAuth } from "../context/AuthContext";

const TopGreeting = () => {
  const { user } = useAuth();

  return (
    <div className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-6 py-5 shadow-sm">

      {/* Greeting */}
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
          Hi, <span className="text-[var(--color-primary)]">{user?.name}</span> 👋
        </h2>

        <p className="text-sm text-gray-500 mt-1 font-light">
          Welcome back to your workspace dashboard
        </p>
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-4">

        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium text-gray-800">{user?.name}</p>
          <p className="text-xs text-gray-400">Workspace Member</p>
        </div>

        <img
          src={user?.avatar || "https://i.pravatar.cc/150"}
          alt="user"
          className="h-20 w-15 object-cover "
        />
      </div>

    </div>
  );
};

export default TopGreeting;