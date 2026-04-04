import express from "express";
import { generateZegoToken } from "./zego.controllers";

const router = express.Router();

router.get("/token", generateZegoToken);

export default router;