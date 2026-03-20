import React from "react";

const SmartDepartmentCard = ({
  department,
  role,
  user,
  onJoin,
  onLeave,
  onAssignManager,
  onOpenDepartment,
}) => {

  const isAdmin = role === "admin";
  const isMember = department.members?.includes(user._id);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md">

      <h3 className="text-lg font-semibold text-gray-900">
        {department.name}
      </h3>

      <p className="text-sm text-gray-500 mt-1">
        {department.description || "No description"}
      </p>

      <p className="text-xs text-gray-500 mt-2">
        Manager: {department.manager?.name || "Not assigned"}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">

        {/* 🔥 ADMIN */}
        {isAdmin ? (
          <button
            onClick={() =>
              onAssignManager(department._id, prompt("Enter User ID"))
            }
            className="bg-purple-500 text-white px-3 py-1 text-xs rounded-lg"
          >
            {department.manager ? "Change Manager" : "Assign Manager"}
          </button>
        ) : (
          <>
            {!isMember && (
              <button
                onClick={() => onJoin(department._id)}
                className="bg-blue-500 text-white px-3 py-1 text-xs rounded-lg"
              >
                Join
              </button>
            )}

            {isMember && (
              <button
                onClick={() => onLeave(department._id)}
                className="bg-red-500 text-white px-3 py-1 text-xs rounded-lg"
              >
                Leave
              </button>
            )}
          </>
        )}
      </div>

    </div>
  );
};

export default SmartDepartmentCard;