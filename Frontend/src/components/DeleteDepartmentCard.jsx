import React from "react";

const DeleteDepartmentCard = ({ department, onDelete }) => {

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all">

      <h3 className="text-lg font-semibold text-gray-900">
        {department.name}
      </h3>

      <p className="text-sm text-gray-500 mt-2">
        {department.description || "No description"}
      </p>

      {/* 🔴 DELETE BUTTON */}
      <button
        onClick={() => onDelete(department._id)}
        className="mt-4 w-full bg-red-500 text-white text-sm font-medium py-2 rounded-lg hover:bg-red-600 transition"
      >
        Delete Department
      </button>

    </div>
  );
};

export default DeleteDepartmentCard;