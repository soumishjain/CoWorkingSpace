import axios from "./axios";

// ================== 🔐 SET TOKEN ==================
export const setAuthToken = () => {
  const token = localStorage.getItem("token");

  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};

// call once at app start (IMPORTANT)
setAuthToken();

// ================== 💬 GET MESSAGES ==================
export const getMessagesAPI = async ({
  chatRoomId,
  page = 1,
  limit = 20,
}) => {
  try {
    const response = await axios.get(
      `/chat/${chatRoomId}/messages`,
      {
        params: { page, limit },
      }
    );

    return {
      success: true,
      data: response.data.data || [],
      meta: response.data.meta || {
        page,
        hasMore: false,
      },
    };
  } catch (error) {
    console.error("GET MESSAGES ERROR:", error);

    return {
      success: false,
      data: [],
      meta: {
        page,
        hasMore: false,
      },
      error:
        error.response?.data?.message ||
        error.message ||
        "Something went wrong",
    };
  }
};



export const uploadFileAPI = async ({ file }) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const { data } = await axios.post("/upload-chat-file", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return {
      success: true,
      fileUrl: data.fileUrl,
      type: data.type,
      fileName: data.fileName,
    };
  } catch (error) {
    console.error("UPLOAD ERROR:", error);

    return {
      success: false,
      error: error.response?.data?.message || "Upload failed",
    };
  }
};