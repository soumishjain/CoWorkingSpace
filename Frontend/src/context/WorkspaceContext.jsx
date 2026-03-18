import React, { createContext, useContext, useState } from "react";

const WorkspaceContext = createContext();

export const WorkspaceProvider = ({ children }) => {

  const [workspace, setWorkspace] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <WorkspaceContext.Provider
      value={{
        workspace,
        setWorkspace,
        isAdmin,
        setIsAdmin,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspaceContext = () => useContext(WorkspaceContext);