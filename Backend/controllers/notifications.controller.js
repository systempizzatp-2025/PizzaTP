import Notification from "../models/notification.model.js";
import { io } from "../index.js";

export const createGlobalNotification = async (req, res) => {
  try {
    const { title, message, type, image } = req.body;

    const notification = await Notification.create({
      title,
      message,
      type,
      image: image || "",
      isGlobal: true,
      sentAt: new Date(),
    });

    io.emit("newNotification", notification);

    res.json({
      success: true,
      message: "Gửi thông báo thành công!",
      notification,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const createUserNotification = async (req, res) => {
  try {
    const { userId, title, message, type, orderId, image } = req.body;

    const notification = await Notification.create({
      user: userId,
      title,
      message,
      type,
      orderId: orderId || null,
      image: image || "",
      sentAt: new Date(),
    });

    io.to(userId).emit("newNotification", notification);

    res.json({ success: true, notification });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const getUserNotifications = async (req, res) => {
  try {
    const userId = req.userId;

    const notifications = await Notification.find({
      $or: [{ user: userId }, { isGlobal: true }],
    }).sort({ createdAt: -1 });

    res.json(notifications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    await Notification.findByIdAndUpdate(id, { isRead: true });
    res.json({ success: true, id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const getAllNotifications = async (req, res) => {
  try {
    const data = await Notification.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
