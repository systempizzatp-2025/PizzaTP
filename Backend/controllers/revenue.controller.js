import OrderModel from "../models/order.model.js";
import ProductModel from "../models/product.model.js";
import ReviewModel from "../models/review.model.js";
import FavoriteModel from "../models/favorite.model.js";
import PromotionModel from "../models/promotion.model.js";


export const getRevenueReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ success: false, message: "Thiếu startDate hoặc endDate" });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59);


    const revenueData = await OrderModel.aggregate([
      {
        $match: {
          payment_status: { $in: ["paid", "CASH ON DELIVERY"] },
          createdAt: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: { date: "$createdAt", timezone: "+07:00" } },
            month: { $month: { date: "$createdAt", timezone: "+07:00" } },
            day: { $dayOfMonth: { date: "$createdAt", timezone: "+07:00" } },
          },
          totalRevenue: { $sum: "$totalAmt" },
          totalOrders: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
    ]);

    return res.json({ success: true, data: revenueData });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


export const getOrdersReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ success: false, message: "Thiếu startDate hoặc endDate" });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59);

    const ordersData = await OrderModel.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
          payment_status: { $in: ["paid", "CASH ON DELIVERY"] }, 
        },
      },
      {
        $group: {
          _id: {
            year: { $year: { date: "$createdAt", timezone: "+07:00" } },
            month: { $month: { date: "$createdAt", timezone: "+07:00" } },
            day: { $dayOfMonth: { date: "$createdAt", timezone: "+07:00" } },
          },
          totalOrders: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
    ]);

    return res.json({ success: true, data: ordersData });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


export const getProductsReport = async (req, res) => {
  try {
    const products = await ProductModel.find({}).lean();


    const formattedData = products.map((product) => ({
      name: product.name,
      price: product.price,
      discount: product.discount,
      description: product.description,
      sizes: product.sizes.map((s) => s.name),
      type: product.type,
      createdAt: product.createdAt,
    }));

    return res.json({ success: true, data: formattedData });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getOverviewReport = async (req, res) => {
  try {
 
    const totalOrders = await OrderModel.countDocuments({
      payment_status: { $in: ["paid", "CASH ON DELIVERY"] },
    });


    const revenueResult = await OrderModel.aggregate([
      {
        $match: { payment_status: { $in: ["paid", "CASH ON DELIVERY"] } },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmt" },
        },
      },
    ]);
    const totalRevenue = revenueResult[0]?.totalRevenue || 0;


    const totalProducts = await ProductModel.countDocuments({ publish: true });


    const totalReviews = await ReviewModel.countDocuments();


    const totalFavorites = await FavoriteModel.countDocuments();

 
    const today = new Date();
    const activePromotions = await PromotionModel.countDocuments({
      startDate: { $lte: today },
      endDate: { $gte: today },
    });

    return res.json({
      success: true,
      data: {
        totalOrders,
        totalRevenue,
        totalProducts,
        totalReviews,
        totalFavorites,
        activePromotions,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
