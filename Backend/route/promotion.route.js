import express from "express";
import {
  createPromotion,
  getPromotions,
  validatePromotion,
  redeemPromotion,
  deletePromotion,
} from "../controllers/promotion.controller.js";
import authAdmin from "../middleware/authAdmin.js";

const router = express.Router();

router.post("/create", authAdmin, createPromotion);
router.get("/list", getPromotions);
router.post("/validate", validatePromotion);
router.post("/redeem", redeemPromotion);
router.delete("/delete/:id", authAdmin, deletePromotion);

export default router;
