import axios from './axios'

export const getUserWorkspace = async () => {
    const res = await axios.get('/workspace/get-my-workspaces', {
        withCredentials: true
    })
    return res.data
}

export const createWorkspace = async (formData) => {
    const data = new FormData()

    data.append("name", formData.name)
    data.append("description", formData.description)
    data.append("joinPassword", formData.joinPassword)

    if (formData.coverImage) {
        data.append("coverImage", formData.coverImage)
    }

    const response = await axios.post('/workspace/create', data, {
        withCredentials: true
    })

    return response.data
}

export const deleteWorkspace = async (workspaceId) => {
    try {
        const res = await axios.post(
            `/workspace/delete/${workspaceId}`,
            {},
            { withCredentials: true }
        )
        return res.data
    } catch (error) {
        throw error.response?.data?.message || "Failed to delete workspace"
    }
}

// 🔥 WORKSPACE STATS
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

export const searchWorkspaces = async (query) => {
  const res = await axios.get(`/workspace/search?query=${query}`, {
    withCredentials: true,
  });
  return res.data;
};

export const joinWorkspace = async (workspaceId, password) => {
  const res = await axios.post(
    `/workspace/join-request/${workspaceId}`,
    {joinPassword : password},
    { withCredentials: true }
  );
  return res.data;
};

export const approveRequest = async (requestId) => {
  try {
    const res = await axios.patch(
      `/workspace/join-request/approve/${requestId}`,
      {},
      { withCredentials: true }
    );
    return res.data;
  } catch (err) {
    throw err.response?.data?.message || "Failed to approve";
  }
};

export const rejectRequest = async (requestId) => {
  try {
    const res = await axios.patch(
      `/workspace/join-request/reject/${requestId}`,
      {},
      { withCredentials: true }
    );
    return res.data;
  } catch (err) {
    throw err.response?.data?.message || "Failed to approve";
  }
};