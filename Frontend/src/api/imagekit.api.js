import axios from "./axios";

export const uploadToImageKit = async (file) => {
  try {
    console.log("🚀 STEP 1: requesting auth...");

    const { data } = await axios.get("/imagekit-auth"); // 🔥 confirm route
    console.log("✅ AUTH RESPONSE:", data);

    if (!data?.signature || !data?.token || !data?.expire) {
      console.error("❌ INVALID AUTH DATA");
      return null;
    }

    console.log("🚀 STEP 2: preparing formData...");

    const publicKey = import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY;
    console.log("🔑 PUBLIC KEY:", publicKey);

    if (!publicKey) {
      console.error("❌ PUBLIC KEY MISSING");
      return null;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", file.name);
    formData.append("publicKey", publicKey);
    formData.append("signature", data.signature);
    formData.append("expire", data.expire);
    formData.append("token", data.token);

    console.log("🚀 STEP 3: uploading to ImageKit...");

    const res = await axios.post(
      "https://upload.imagekit.io/api/v1/files/upload",
      formData
    );

    console.log("🎉 UPLOAD SUCCESS:", res.data);

    const mime = file.type;

    let type = "file";
    if (mime.startsWith("image/")) type = "image";
    else if (mime.startsWith("video/")) type = "video";
    else if (mime.startsWith("audio/")) type = "audio";

    return {
      url: res.data.url,
      type,
      name: file.name,
    };

  } catch (err) {
    console.error("💥 UPLOAD FAILED:");
    console.error("STATUS:", err.response?.status);
    console.error("DATA:", err.response?.data);
    console.error("FULL ERROR:", err);

    return null;
  }
};