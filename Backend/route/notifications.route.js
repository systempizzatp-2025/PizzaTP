import express from "express";
import {
  createGlobalNotification,
  getUserNotifications,
  markAsRead,
  getAllNotifications,
  deleteNotification,
} from "../controllers/notifications.controller.js";
import auth from "../middleware/auth.js";
import authAdmin from "../middleware/authAdmin.js";

const router = express.Router();

router.post("/admin/create-global", authAdmin, createGlobalNotification);
router.get("/admin/all", authAdmin, getAllNotifications);
router.delete("/admin/:id", authAdmin, deleteNotification);


router.get("/user/my", auth, getUserNotifications);
router.put("/user/read/:id", auth, markAsRead);

export default router;
