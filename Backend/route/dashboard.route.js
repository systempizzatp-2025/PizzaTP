import express from "express";
import {
  getDashboardSummary,
  getHourlyPerformance,
  getPaymentStats,
  getRatingStats,
  getRevenueByMonth,
  getReviewStats,
  getTopSellingProducts,
} from "../controllers/dashboard.controller.js";
import authAdmin from "../middleware/authAdmin.js";

const router = express.Router();

// doanh thu theo tháng
router.get("/revenue", authAdmin, getRevenueByMonth);

// Thống kê review / khách hàng
router.get("/reviews/stats", authAdmin, getReviewStats);

// lấy thống kê thanh toán
router.get("/payment/stats", authAdmin, getPaymentStats);
//Lấy thống kê đánh giá
router.get("/rating/stats", authAdmin, getRatingStats);

// lấy thống kê thanh toán hiệu suất theo giờ
router.get("/hourly-performance", authAdmin, getHourlyPerformance);

//lấy thống kê thanh toán top sản phẩm bán chạy
router.get("/top-products", authAdmin, getTopSellingProducts);

// Doanh thu hôm nay
router.get("/stats/summary", authAdmin, getDashboardSummary);

export default router;
