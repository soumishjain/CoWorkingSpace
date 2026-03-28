import React from "react";
import SmartDepartmentCard from "./SmartDepartmentCard";
import Loader from "./Loader";

const SmartDepartmentContainer = ({
  departments,
  user,
  isAdmin,
  loading,
  error,
  onJoin,
  onLeave,
  onAssignManager,
  onOpenDepartment,
  workspaceId
}) => {

  if (loading) return <Loader />;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

      {departments?.map((dept) => (
        <SmartDepartmentCard
          key={dept._id}
          department={dept}
          isAdmin={isAdmin}
          user={user}
          onJoin={onJoin}
          onLeave={onLeave}
          onAssignManager={onAssignManager}
          onOpenDepartment={onOpenDepartment}
          workspaceId={workspaceId}
        />
      ))}

    </div>
  );
};

export default SmartDepartmentContainer;