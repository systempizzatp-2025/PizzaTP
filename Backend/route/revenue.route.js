import express from "express";
import authAdmin from "../middleware/authAdmin.js";
import {
  getOrdersReport,
  getOverviewReport,
  getProductsReport,
  getRevenueReport,
} from "../controllers/revenue.controller.js";

const router = express.Router();


router.get("/revenue", authAdmin, getRevenueReport);
router.get("/orders", authAdmin, getOrdersReport);
router.get("/products", authAdmin, getProductsReport);
router.get("/overview", authAdmin, getOverviewReport);

export default router;
