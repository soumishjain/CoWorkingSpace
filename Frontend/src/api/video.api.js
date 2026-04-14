import axios from "axios";

export const getZegoTokenAPI = async (chatRoomId) => {
  try {
    const res = await axios.get(
      `/api/zego/token?chatRoomId=${chatRoomId}`,
      {
        withCredentials: true,
      }
    );

    return res.data;
  } catch (err) {
    console.error("💥 TOKEN ERROR:", err);
    throw err;
  }
};