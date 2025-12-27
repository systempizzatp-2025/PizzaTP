import { Router } from "express";
import auth from "../middleware/auth.js";
import authAdmin from "../middleware/authAdmin.js";
import {
  getMyChat,
  getAllChatsForAdmin,
  getChatByUserId,
  deleteMyChat,
} from "../controllers/livechat.controller.js";

const router = Router();

router.get("/my", auth, getMyChat);
router.get("/", authAdmin, getAllChatsForAdmin);
router.get("/:userId", authAdmin, getChatByUserId);
router.delete("/my", auth, deleteMyChat);

export default router;  
