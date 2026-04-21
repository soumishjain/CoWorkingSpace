import express from "express";
import { getImageKitAuth } from "./imagekit.controllers.js";

const imagekitRouter = express.Router();

imagekitRouter.get("/imagekit-auth", getImageKitAuth);

export default imagekitRouter;