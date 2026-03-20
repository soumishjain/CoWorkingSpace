import React from "react";
import SmartDepartmentCard from "./SmartDepartmentCard";

const SmartDepartmentContainer = ({
  departments,
  user,
  role,
  loading,
  error,
  onJoin,
  onLeave,
  onAssignManager,
  onOpenDepartment,
}) => {

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

      {departments.map((dept) => (
        <SmartDepartmentCard
          key={dept._id}
          department={dept}
          role={role}
          user={user}
          onJoin={onJoin}
          onLeave={onLeave}
          onAssignManager={onAssignManager}
          onOpenDepartment={onOpenDepartment}
        />
      ))}

    </div>
  );
};

export default SmartDepartmentContainer;