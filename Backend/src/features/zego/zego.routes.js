import express from "express";
import { generateZegoToken } from "./zego.controllers.js";

const zegoRouter = express.Router();

zegoRouter.get("/token", generateZegoToken);

export default zegoRouter;