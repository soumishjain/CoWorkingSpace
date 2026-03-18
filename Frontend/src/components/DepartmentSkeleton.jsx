import React from "react";

const DepartmentSkeleton = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm animate-pulse">

      {/* 🔥 Title */}
      <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>

      {/* 🔥 Description lines */}
      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>

      {/* 🔥 Footer */}
      <div className="flex items-center justify-between mt-4">

        <div className="h-6 w-20 bg-gray-200 rounded-full"></div>

        <div className="h-4 w-12 bg-gray-200 rounded"></div>

      </div>

    </div>
  );
};

export default DepartmentSkeleton;