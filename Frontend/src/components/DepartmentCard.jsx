import React from "react";

const DepartmentCard = ({ department }) => {

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer">

      {/* 🔥 Department Name */}
      <h3 className="text-lg font-semibold text-gray-900">
        {department?.name}
      </h3>

      {/* 🔥 Description */}
      <p className="text-sm text-gray-500 mt-2 line-clamp-2">
        {department?.description || "No description available"}
      </p>

      <p className="text-sm text-gray-500 mt-2 line-clamp-2">
        {department?.manager || "No Manager"}
      </p>

      {/* 🔥 Footer */}
      <div className="flex items-center justify-between mt-4">

        <span className="text-xs px-3 py-1 bg-indigo-100 text-indigo-600 rounded-full">
          Department
        </span>

        <button className="text-sm font-medium text-[var(--color-primary)] hover:underline">
          Open →
        </button>

      </div>

    </div>
  );
};

export default DepartmentCard;