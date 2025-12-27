import express from "express";
import {
  loginDeliveryController,
  logoutDeliveryController,
  refreshAccessTokenDeliveryController,
  getDeliveryDetailsController,
  getDeliveryOrdersController,
  getCurrentDeliveryController,
  updateOrderStatusController,
  getDeliveredOrdersController,
  getShipperStatsController,
  updateDeliveryDetailsController, 
  uploadDeliveryImageController,
} from "../controllers/delivery.controller.js";
import authDelivery from "../middleware/authDelivery.js";
import upload from "../middleware/multer.js";

const router = express.Router();


router.post("/dang-nhap", loginDeliveryController);
router.post("/dang-xuat", logoutDeliveryController);
router.post("/lam-moi-token", refreshAccessTokenDeliveryController);


router.get(
  "/thong-tin-nhan-vien-giao-hang",
  authDelivery,
  getDeliveryDetailsController
);


router.get("/danh-sach-don-hang", authDelivery, getDeliveryOrdersController);
router.get("/don-hang-dang-giao", authDelivery, getCurrentDeliveryController);
router.get(
  "/danh-sach-don-da-giao",
  authDelivery,
  getDeliveredOrdersController
);
router.post("/cap-nhat-trang-thai", authDelivery, updateOrderStatusController);


router.get("/thong-ke-shipper", authDelivery, getShipperStatsController);


router.put(
  "/upload-image",
  authDelivery,
  upload.single("img"),
  uploadDeliveryImageController
);
router.put(
  "/cap-nhat-thong-tin",
  authDelivery,
  updateDeliveryDetailsController
);

export default router;
