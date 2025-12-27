import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";
import morgan from "morgan";
import helmet from "helmet";
import connectDB from "./config/connectDB.js";

import userRouter from "./route/user.route.js";
import categoryRouter from "./route/category.route.js";
import uploadRouter from "./route/upload.route.js";
import router from "./route/admin.route.js";
import routerDelivery from "./route/delivery.route.js";
import subCategoryRouter from "./route/subCategory.route.js";
import productRouter from "./route/product.route.js";
import cartRouter from "./route/cart.route.js";
import favoriteRouter from "./route/favorite.route.js";
import addressRouter from "./route/address.route.js";
import orderRouter from "./route/order.route.js";
import reviewRouter from "./route/review.route.js";
import promotionRoute from "./route/promotion.route.js";
import notificationsRouter from "./route/notifications.route.js";
import dashboardRouter from "./route/dashboard.route.js";
import revenueRoute from "./route/revenue.route.js";
import googleAuthRoutes from "./route/authGoogle.routes.js";
import livechatRouter from "./route/livechat.route.js";
import liveChatSocket from "./socket/livechat.socket.js";

// Cần fix 
import Notification from "./models/notification.model.js";

const app = express();

app.use(
  cors({
    credentials: true,
    origin: process.env.FRONTEND_URL,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.use("/api/v1/nguoi-dung", userRouter);
app.use("/api/v1/danh-muc-chinh", categoryRouter);
app.use("/api/v1/file", uploadRouter);
app.use("/api/v1/quan-tri-vien", router);
app.use("/api/v1/nhan-vien-giao-hang", routerDelivery);
app.use("/api/v1/danh-muc-phu", subCategoryRouter);
app.use("/api/v1/san-pham", productRouter);
app.use("/api/v1/gio-hang", cartRouter);
app.use("/api/v1/yeu-thich", favoriteRouter);
app.use("/api/v1/dia-chi", addressRouter);
app.use("/api/v1/dat-hang", orderRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/v1/promotion", promotionRoute);
app.use("/api/notifications", notificationsRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/report", revenueRoute);
app.use("/api/auth", googleAuthRoutes);
app.use("/api/livechat", livechatRouter);

app.get("/", (req, res) => {
  res.json({ message: "Server OK", PORT: process.env.PORT || 8080 });
});

const PORT = process.env.PORT || 8080;
const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

liveChatSocket(io);

io.on("connection", (socket) => {
  socket.on("Tham gia phòng", async (userId, callback) => {
    socket.join(userId);

    const notis = await Notification.find({ user: userId, isRead: false })
      .sort({ createdAt: -1 })
      .lean();

    if (notis.length > 0) {
      socket.emit("newNotificationBatch", notis);
    }

    if (callback) callback();
  });

  socket.on("disconnect", () => {});
});

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log("Server chạy PORT:", PORT);
  });
});
