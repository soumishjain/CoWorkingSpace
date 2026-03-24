import axios from "./axios";

// ================== 🔐 SET TOKEN (SAFE WAY) ==================
export const setAuthToken = () => {
  const token = localStorage.getItem("token");

  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};



// ================== 💬 GET OLD MESSAGES ==================
export const getOldMessagesAPI = async ({
  departmentId,
  page = 1,
  limit = 50,
}) => {
  try {
    setAuthToken(); // 🔥 ensure latest token

    const response = await axios.get(`/chat/old-messages/${departmentId}`, {
      params: { page, limit },
    });

    return {
      success: true,
      data: response.data.data, // backend fixed version
    };
  } catch (error) {
    console.error("GET OLD MESSAGES ERROR:", error);

    return {
      success: false,
      error:
        error.response?.data?.message ||
        error.message ||
        "Something went wrong",
    };
  }
};