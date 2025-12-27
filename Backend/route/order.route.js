import { Router } from "express";
import auth from "../middleware/auth.js";
import {
  CashOnDeliveryOrderController,
  getOrderDetails,
  paymentController,
  webhookStripe,
  cancelOrderController,
} from "../controllers/order.controller.js";

const orderRouter = Router();

orderRouter.post(
  "/tien-mat-khi-giao-hang",
  auth,
  CashOnDeliveryOrderController
);

orderRouter.post("/thanh-toan-online", auth, paymentController);
orderRouter.post("/webhook", webhookStripe);
orderRouter.get("/lay-danh-sach-don-da-dat-hang", auth, getOrderDetails);
orderRouter.post("/huy-don", auth, cancelOrderController);

export default orderRouter;
