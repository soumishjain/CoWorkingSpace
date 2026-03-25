import React from "react";
import { useAuth } from "../context/AuthContext";

const TopGreeting = () => {
  const { user } = useAuth();

  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white px-6 py-6 shadow-sm">

      {/* 🔥 SUBTLE GLOW (less aggressive) */}
      <div className="absolute -top-16 -left-16 w-60 h-60 bg-indigo-100 rounded-full blur-3xl opacity-40" />
      <div className="absolute -bottom-16 -right-16 w-60 h-60 bg-purple-100 rounded-full blur-3xl opacity-40" />

      {/* CONTENT */}
      <div className="relative flex items-center justify-between">

        {/* LEFT */}
        <div>

          <h2 className="text-xl font-semibold text-gray-900 tracking-tight">
            Welcome back,{" "}
            <span className="text-indigo-600">
              {user?.name}
            </span>
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Let’s build something great today.
          </p>

          {/* 🔥 MINI INFO (cleaned) */}
          <div className="flex gap-4 mt-3 text-xs text-gray-400">

            <div className="flex items-center gap-1">
              📅 {new Date().toLocaleDateString()}
            </div>

          </div>

        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">

          {/* TEXT */}
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-800">
              {user?.name}
            </p>
            <p className="text-xs text-gray-400">
              Workspace Member
            </p>
          </div>

          {/* 🔥 AVATAR (less flashy, more clean) */}
          <div className="relative">
            <div className="p-[1.5px] rounded-xl bg-indigo-100">
              <img
                src={user?.profileImage}
                className="w-11 h-11 rounded-xl object-cover bg-white"
              />
            </div>

            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
          </div>

        </div>

      </div>
    </div>
  );
};

export default TopGreeting;