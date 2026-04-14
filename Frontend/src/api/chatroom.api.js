import axios from "./axios";

// ================== 🔐 SET TOKEN ==================
const setAuthToken = () => {
  const token = localStorage.getItem("token");

  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};

// ================== 💬 GET ALL CHATROOMS ==================
export const getChatRoomsAPI = async ({ workspaceId, departmentId }) => {
  try {
    setAuthToken();

    const { data } = await axios.get(
      `chatrooms/get-chatrooms/${workspaceId}/${departmentId}`
    );

    return {
      success: true,
      chatRooms: data.chatRooms || [],
      meta : data.meta || {}
    };
  } catch (error) {
    console.error("GET CHATROOMS ERROR:", error);

    return {
      success: false,
      chatRooms: [],
      error:
        error.response?.data?.message ||
        error.message ||
        "Something went wrong",
    };
  }
};

// ================== 💬 GET SINGLE CHATROOM ==================
export const getChatRoomByIdAPI = async ({
  workspaceId,
  departmentId,
  chatRoomId,
}) => {
  try {
    setAuthToken();

    const { data } = await axios.get(
      `/get-chatroom/${workspaceId}/${departmentId}/${chatRoomId}`
    );

    return {
      success: true,
      chatRoom: data.chatRoom,
    };
  } catch (error) {
    console.error("GET CHATROOM ERROR:", error);

    return {
      success: false,
      chatRoom: null,
      error:
        error.response?.data?.message ||
        error.message ||
        "Something went wrong",
    };
  }
};

// ================== ➕ CREATE CHATROOM ==================
export const createChatRoomAPI = async ({
  workspaceId,
  departmentId,
  name,
}) => {
  try {
    setAuthToken();

    const { data } = await axios.post(
      `/create-chatroom/${workspaceId}/${departmentId}`,
      { name }
    );

    return {
      success: true,
      chatRoom: data.chatRoom,
      message: data.message,
    };
  } catch (error) {
    console.error("CREATE CHATROOM ERROR:", error);

    return {
      success: false,
      error:
        error.response?.data?.message ||
        error.message ||
        "Something went wrong",
    };
  }
};

// ================== ❌ DELETE CHATROOM ==================
export const deleteChatRoomAPI = async ({
  workspaceId,
  departmentId,
  chatRoomId,
}) => {
  try {
    setAuthToken();

    const { data } = await axios.delete(
      `/delete-chatroom/${workspaceId}/${departmentId}/${chatRoomId}`
    );

    return {
      success: true,
      message: data.message,
    };
  } catch (error) {
    console.error("DELETE CHATROOM ERROR:", error);

    return {
      success: false,
      error:
        error.response?.data?.message ||
        error.message ||
        "Something went wrong",
    };
  }
};

// ================== 👥 ADD MEMBERS ==================
export const addMembersToChatRoomAPI = async ({
  workspaceId,
  departmentId,
  chatRoomId,
  members, // array of userIds
}) => {
  try {
    setAuthToken();

    const { data } = await axios.patch(
      `/add-members/${workspaceId}/${departmentId}/${chatRoomId}`,
      { members }
    );

    return {
      success: true,
      chatRoom: data.chatRoom,
    };
  } catch (error) {
    console.error("ADD MEMBERS ERROR:", error);

    return {
      success: false,
      error:
        error.response?.data?.message ||
        error.message ||
        "Something went wrong",
    };
  }
};

// ================== 🚫 REMOVE MEMBERS ==================
export const removeMembersFromChatRoomAPI = async ({
  workspaceId,
  departmentId,
  chatRoomId,
  members, // array of userIds
}) => {
  try {
    setAuthToken();

    const { data } = await axios.patch(
      `/remove-members/${workspaceId}/${departmentId}/${chatRoomId}`,
      { members }
    );

    return {
      success: true,
      chatRoom: data.chatRoom,
    };
  } catch (error) {
    console.error("REMOVE MEMBERS ERROR:", error);

    return {
      success: false,
      error:
        error.response?.data?.message ||
        error.message ||
        "Something went wrong",
    };
  }
};