import express from "express";
import { googleLoginController } from "../controllers/googleLogin.controller.js";

const router = express.Router();

router.post("/google", googleLoginController);

export default router;
 