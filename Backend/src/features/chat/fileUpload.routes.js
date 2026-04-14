import express from "express";
import multer from "multer";
import { identifyUser } from "../../middleware/auth.middleware.js";
import { uploadChatFile } from "./fileUploadController.js";

const fileUploadRouter = express.Router();

// 🔥 memory storage
const upload = multer({
  storage: multer.memoryStorage(),
});

fileUploadRouter.post(
  "/upload-chat-file",
  identifyUser,
  upload.single("file"),
  uploadChatFile
);

export default fileUploadRouter;