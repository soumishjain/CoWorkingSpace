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
    if (!chatRoomId) {
      throw new Error("chatRoomId is required");
    }

    const response = await axios.get(
      `/chat/${chatRoomId}/messages`,
      {
        params: { page, limit },
        withCredentials: true,
      }
    );

    const resData = response?.data || {};

    const messages = Array.isArray(resData.data)
      ? resData.data
      : [];

    const meta = {
      page: resData.meta?.page ?? page,
      limit: resData.meta?.limit ?? limit,
      hasMore: resData.meta?.hasMore ?? false,
    };

    return {
      success: true,
      data: messages,
      meta,
    };
  } catch (error) {
    console.error("❌ GET MESSAGES ERROR:", error);

    return {
      success: false,
      data: [],
      meta: {
        page,
        limit,
        hasMore: false,
      },
      error:
        error?.response?.data?.message ||
        error?.message ||
        "Failed to fetch messages",
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