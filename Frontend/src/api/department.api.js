import axios from "./axios";

// 🔥 1. Get ALL departments of a workspace (main API)
export const getAllDepartments = async (workspaceId) => {
  try {
    const res = await axios.get(
      `/department/get-departments-of-this-workspace/${workspaceId}`,
      { withCredentials: true }
    );

    return res.data;

  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch departments";
  }
};

export const getMyDepartments = async (workspaceId) => {
  try {
    const res = await axios.get(
      `/department/get-my-departments/${workspaceId}`,
      { withCredentials: true }
    );

    return res.data;

  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch departments";
  }
};

// 🔥 2. Create Department
export const createDepartment = async (workspaceId, data) => {
  try {
    const res = await axios.post(
      `/department/create/${workspaceId}`,
      data,
      { withCredentials: true }
    );

    return res.data;

  } catch (error) {
    throw error.response?.data?.message || "Failed to create department";
  }
};

// 🔥 3. Join Department (for users)
export const joinDepartment = async (workspaceId, departmentId) => {
  try {
    const res = await axios.post(
      `/department/join-department/${workspaceId}/${departmentId}`,
      {},
      { withCredentials: true }
    );

    return res.data;

  } catch (error) {
    throw error.response?.data?.message || "Failed to join department";
  }
};

// 🔥 4. Delete Department (admin only)
export const deleteDepartment = async (workspaceId, departmentId) => {
  try {
    const res = await axios.delete(
      `/department/delete-department/${workspaceId}/${departmentId}`,
      { withCredentials: true }
    );

    return res.data;

  } catch (error) {
    throw error.response?.data?.message || "Failed to delete department";
  }
};

export const getWorkspaceStats = async (workspaceId) => {
  try {
    const res = await axios.get(
      `/workspace/stats/${workspaceId}`,
      { withCredentials: true }
    );

    return res.data;

  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch workspace stats";
  }
};


// 🔥 LEAVE DEPARTMENT
export const leaveDepartment = async (workspaceId, departmentId) => {
  try {
    const res = await axios.post(
      `/department/leave/${workspaceId}/${departmentId}`,
      {},
      { withCredentials: true }
    );

    return res.data;

  } catch (error) {
    throw error.response?.data?.message || "Failed to leave department";
  }
};

// 🔥 ASSIGN MANAGER
export const assignManager = async (
  workspaceId,
  departmentId,
  assignedUserId
) => {
  try {
    const res = await axios.patch(
      `/department/assign-manager/${workspaceId}/${departmentId}/${assignedUserId}`,
      {},
      { withCredentials: true }
    );
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to assign manager";
  }
};

export const getAllPendingDepartmentRequests = async (
  workspaceId ,
  departmentId 
) => {
  try{
    const res = await axios.get(
      `/department/get-all-department-pending-requests/${workspaceId}/${departmentId}`,
      {},
      {withCredentials : true}
    )
    return res.data
  }catch(error){
    throw error.response?.data?.message || "Failed to fetch";
  }
}

export const approveDepartmentRequest = async (workspaceId , departmentId, requestId) => {
  try {
    const res = await axios.patch(
      `/department/join-department/approve/${workspaceId}/${departmentId}/${requestId}`,
      { withCredentials: true }
    );
    return res.data;
  } catch (err) {
    throw err.response?.data?.message || "Failed to approve";
  }
};

export const rejectDepartmentRequest = async (workspaceId , departmentId, requestId) => {
  try {
    const res = await axios.patch(
      `/department/join-department/reject/${workspaceId}/${departmentId}/${requestId}`,
      { withCredentials: true }
    );
    return res.data;
  } catch (err) {
    throw err.response?.data?.message || "Failed to approve";
  }
};

export const getAllDepartmentMembers = async (workspaceId, departmentId) => {
  try {
    const res = await axios.get(
      `/department/get-department-members/${workspaceId}/${departmentId}`,
      { withCredentials: true }
    );

    console.log("🔥 RAW API:", res.data);

    // 🔥 check safeMembers directly
    console.log("🔥 SAFE MEMBERS:", res.data.safeMembers);

    const members = (res.data.safeMembers || []).map((m, index) => {
      console.log(`👤 MEMBER ${index}:`, m);

      return {
        _id: m?.userId?._id,
        name: m?.userId?.name,
        email: m?.userId?.email,
        profileImage: m?.userId?.profileImage,
        role: m?.role,
        isManager: m?.role === "manager",

        // 🔥 CRITICAL DEBUG
        pendingTasks: m?.pendingTasks ?? 0,
      };
    });

    // 🔥 final output check
    console.log("✅ FINAL MEMBERS:", members);

    return { members };

  } catch (error) {
    console.error("❌ API ERROR:", error);
    throw error;
  }
};