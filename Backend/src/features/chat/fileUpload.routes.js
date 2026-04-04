import express from "express";
import { identifyUser } from "../../middleware/auth.middleware.js";
import { uploadChatFile } from "./fileUpload.controllers.js";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

const fileUploadRouter = express.Router()

fileUploadRouter.post("/upload-chat-file",upload.single("file") ,identifyUser, uploadChatFile)