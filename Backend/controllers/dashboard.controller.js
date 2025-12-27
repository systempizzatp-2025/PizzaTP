import OrderModel from "../models/order.model.js";
import Review from "../models/review.model.js";
import UserModel from "../models/user.model.js";
import ProductModel from "../models/product.model.js";

export const getDashboardSummary = async (req, res) => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const revenueTodayAgg = await OrderModel.aggregate([
      { $match: { createdAt: { $gte: startOfToday, $lte: endOfToday } } },
      { $group: { _id: null, total: { $sum: "$totalAmt" } } },
    ]);

    const revenueToday = revenueTodayAgg[0]?.total || 0;

    const newOrdersToday = await OrderModel.countDocuments({
      createdAt: { $gte: startOfToday, $lte: endOfToday },
    });

    const newUsersToday = await UserModel.countDocuments({
      createdAt: { $gte: startOfToday, $lte: endOfToday },
    });

    const totalProducts = await ProductModel.countDocuments();

    return res.json({
      success: true,
      data: {
        revenueToday,
        newOrdersToday,
        newUsersToday,
        totalProducts,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getTopSellingProducts = async (req, res) => {
  try {
    const topProducts = await OrderModel.aggregate([
      {
        $group: {
          _id: "$productId",
          totalSold: { $sum: 1 },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $project: {
          name: "$product.name",
          image: "$product.image",
          totalSold: 1,
        },
      },
    ]);

    const total = topProducts.reduce((sum, p) => sum + p.totalSold, 0);

    const finalData = topProducts.map((p, index) => ({
      name: p.name,
      image: Array.isArray(p.image) ? p.image[0] : p.image,
      value: Math.round((p.totalSold / total) * 100),
      color: pickColor(index),
    }));

    return res.json({ success: true, data: finalData });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

function pickColor(i) {
  const colors = ["#FF6B6B", "#4ECDC4", "#FFD93D", "#6C63FF", "#FF9F1C"];
  return colors[i] || "#8884d8";
}

export const getHourlyPerformance = async (req, res) => {
  try {
    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0,
      0,
      0,
      0
    );
    const endOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59,
      999
    );

    const orders = await OrderModel.find({
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    }).lean();

    const hours = Array.from({ length: 24 }, (_, i) => ({
      hour: `${i}:00`,
      orders: 0,
      revenue: 0,
    }));

    orders.forEach((order) => {
      const hour = new Date(order.createdAt).getHours();
      hours[hour].orders += 1;
      hours[hour].revenue += order.totalAmt || 0;
    });

    hours.forEach((h) => {
      h.revenue = Number((h.revenue / 1_000_000).toFixed(2));
    });

    return res.json({
      success: true,
      data: hours,
    });
  } catch (error) {
    console.error("Error getHourlyPerformance:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getRatingStats = async (req, res) => {
  try {
    const stats = await Review.aggregate([
      {
        $group: {
          _id: "$rating",
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const fullData = [1, 2, 3, 4, 5].map((star) => {
      const found = stats.find((s) => s._id === star);
      return {
        rating: star,
        count: found ? found.count : 0,
        color: getColor(star),
      };
    });

    return res.json({
      success: true,
      data: fullData,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

function getColor(star) {
  return {
    1: "#EF4444",
    2: "#F97316",
    3: "#EAB308",
    4: "#22C55E",
    5: "#3B82F6",
  }[star];
}

export const getPaymentStats = async (req, res) => {
  try {
    const { period } = req.query;
    const now = new Date();
    let startDate;

    if (period === "lastMonth") {
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    } else {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    const endDate = new Date(
      startDate.getFullYear(),
      startDate.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    );

    const orders = await OrderModel.find({
      createdAt: { $gte: startDate, $lte: endDate },
    }).lean();

    let onlineCount = 0;
    let codCount = 0;

    orders.forEach((o) => {
      if (o.payment_status === "paid") onlineCount++;
      else if (o.payment_status === "CASH ON DELIVERY") codCount++;
    });

    const total = onlineCount + codCount;

    const data = [
      {
        status: "Thanh toán Online - Stripe",
        value: total ? Math.round((onlineCount / total) * 100) : 0,
        color: "#4ECDC4",
      },
      {
        status: "Thanh toán khi nhận hàng",
        value: total ? Math.round((codCount / total) * 100) : 0,
        color: "#FF6B6B",
      },
    ];

    res.json({ success: true, data });
  } catch (error) {
    console.error("Error getPaymentStats:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getReviewStats = async (req, res) => {
  try {
    const data = [];
    const today = new Date();
    const msInDay = 24 * 60 * 60 * 1000;
    const timezoneOffset = 7 * 60;

    const localToday = new Date(today.getTime() + timezoneOffset * 60 * 1000);

    for (let i = 6; i >= 0; i--) {
      const day = new Date(localToday.getTime() - i * msInDay);

      const dayStart = new Date(day);
      dayStart.setHours(0, 0, 0, 0);

      const dayEnd = new Date(day);
      dayEnd.setHours(23, 59, 59, 999);

      const reviews = await Review.find({
        approved: true,
        createdAt: { $gte: dayStart, $lte: dayEnd },
      }).lean();

      const reviewCount = reviews.length;

      const interactiveUsersSet = new Set();
      reviews.forEach((r) => {
        if (r.likes && r.likes.length > 0) {
          r.likes.forEach((u) => interactiveUsersSet.add(u.toString()));
        }
      });

      data.push({
        day: day.toLocaleDateString("vi-VN", { weekday: "short" }),
        reviewCount,
        interactiveUsers: interactiveUsersSet.size,
      });
    }

    res.json({ success: true, data });
  } catch (error) {
    console.error("Error getReviewStats:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRevenueByMonth = async (req, res) => {
  try {
    const year = parseInt(req.query.year) || new Date().getFullYear();

    const revenueData = await OrderModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${year}-01-01T00:00:00.000Z`),
            $lte: new Date(`${year}-12-31T23:59:59.999Z`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalRevenue: { $sum: "$totalAmt" },
          totalOrders: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const result = [];
    for (let i = 1; i <= 12; i++) {
      const monthData = revenueData.find((r) => r._id === i);
      result.push({
        month: `T${i}`,
        revenue: monthData ? monthData.totalRevenue : 0,
        orders: monthData ? monthData.totalOrders : 0,
      });
    }

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
