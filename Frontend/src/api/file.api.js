import axios from "./axios";

export const uploadChatFileAPI = async ({ file, workspaceId }) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("workspaceId", workspaceId);

    const res = await axios.post(
      "/upload-chat-file",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return res.data;

  } catch (err) {
    console.error("Upload error:", err);
    return { success: false, error: "Upload failed" };
  }
};