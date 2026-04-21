import { ImageKit } from "@imagekit/nodejs";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
  privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGE_KIT_URL_ENDPOINT,
});

export const getImageKitAuth = (req, res) => {
  try {
    const auth = imagekit.getAuthenticationParameters();

    return res.status(200).json(auth);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Auth failed" });
  }
};