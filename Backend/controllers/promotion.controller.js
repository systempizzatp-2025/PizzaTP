import Promotion from "../models/promotion.model.js";
import mongoose from "mongoose";
import moment from "moment-timezone";


export const createPromotion = async (req, res) => {
  try {
    let { startDate, endDate } = req.body;

    
    const start = moment
      .tz(startDate, "YYYY-MM-DD", "Asia/Ho_Chi_Minh")
      .startOf("day")
      .toDate();
    const end = moment
      .tz(endDate, "YYYY-MM-DD", "Asia/Ho_Chi_Minh")
      .endOf("day")
      .toDate();

    const promoData = { ...req.body, startDate: start, endDate: end };
    const promo = await Promotion.create(promoData);

    return res.status(201).json({ success: true, promo });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};


export const getPromotions = async (req, res) => {
  try {
    const promos = await Promotion.find().sort({ createdAt: -1 });
    res.json({ success: true, promos });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


export const validatePromotion = async (req, res) => {
  try {
    const { code, userId, orderTotal } = req.body;

    const promo = await Promotion.findOne({
      code: code.toUpperCase(),
      isActive: true,
    });

    if (!promo)
      return res
        .status(400)
        .json({ success: false, message: "Mã khuyến mãi không tồn tại" });


    const now = moment.tz("Asia/Ho_Chi_Minh").toDate();

    if (now < promo.startDate || now > promo.endDate)
      return res.status(400).json({
        success: false,
        message: "Mã chưa đến ngày sử dụng hoặc đã hết hạn",
      });

    if (promo.usageLimit > 0 && promo.usedCount >= promo.usageLimit)
      return res
        .status(400)
        .json({ success: false, message: "Mã đã đạt giới hạn sử dụng" });

    if (promo.perUserLimit > 0 && userId) {
      const usedCountByUser = promo.usedBy.filter(
        (id) => id.toString() === userId
      ).length;
      if (usedCountByUser >= promo.perUserLimit)
        return res.status(400).json({
          success: false,
          message: "Bạn đã đạt giới hạn sử dụng mã này",
        });
    }

    if (orderTotal < promo.minOrderAmount)
      return res.status(400).json({
        success: false,
        message: `Đơn hàng tối thiểu phải từ ${promo.minOrderAmount}đ`,
      });


    let discount = 0;
    if (promo.discountType === "Percent") {
      discount = orderTotal * (promo.discountValue / 100);
      if (promo.maxDiscount > 0)
        discount = Math.min(discount, promo.maxDiscount);
    } else {
      discount = promo.discountValue;
    }

    const finalPrice = Math.max(orderTotal - discount, 0);
    res.json({ success: true, discount, finalPrice, promo });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


export const redeemPromotion = async (req, res) => {
  try {
    const { code, userId } = req.body;


    const promo = await Promotion.findOne({
      code: code.toUpperCase(),
      isActive: true,
    });
    if (!promo)
      return res.status(400).json({
        success: false,
        message: "Mã không tồn tại hoặc đã bị vô hiệu hóa",
      });

    const now = moment.tz("Asia/Ho_Chi_Minh").toDate();
    if (now < promo.startDate || now > promo.endDate)
      return res.status(400).json({
        success: false,
        message: "Mã chưa đến ngày sử dụng hoặc đã hết hạn",
      });

    if (promo.usageLimit > 0 && promo.usedCount >= promo.usageLimit)
      return res
        .status(400)
        .json({ success: false, message: "Mã đã đạt giới hạn sử dụng" });

    if (promo.perUserLimit > 0 && userId) {
      const usedCountByUser = promo.usedBy.filter(
        (id) => id.toString() === userId
      ).length;
      if (usedCountByUser >= promo.perUserLimit)
        return res.status(400).json({
          success: false,
          message: "Bạn đã đạt giới hạn sử dụng mã này",
        });
    }


    promo.usedCount += 1;
    if (userId) promo.usedBy.push(userId);
    await promo.save();

    res.json({ success: true, message: "Đã ghi nhận sử dụng mã!" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


export const deletePromotion = async (req, res) => {
  try {
    const { id } = req.params;
    const promo = await Promotion.findByIdAndDelete(id);
    if (!promo)
      return res
        .status(404)
        .json({ success: false, message: "Mã không tồn tại" });
    res.json({ success: true, message: "Xóa mã thành công" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
