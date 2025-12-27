import OrderModel from "../models/order.model.js";
import UserModel from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import generatedRefreshToken from "../utils/genenratedRefreshToken.js";
import generatedAccessToken from "../utils/generatedAccessToken.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";

const BRANCHES = [
  {
    id: "GO_VAP",
    name: "Chi nhánh Gò Vấp",
    position: [10.846129, 106.668837],
    address:
      "226/106 Đ. Nguyễn Văn Lượng, Phường 17, Gò Vấp, Thành phố Hồ Chí Minh",
  },
];

const findNearestBranch = (customerPosition) => {
  let nearestBranch = BRANCHES[0];
  let minDistance = calculateDistance(
    customerPosition[0],
    customerPosition[1],
    BRANCHES[0].position[0],
    BRANCHES[0].position[1]
  );

  for (let i = 1; i < BRANCHES.length; i++) {
    const distance = calculateDistance(
      customerPosition[0],
      customerPosition[1],
      BRANCHES[i].position[0],
      BRANCHES[i].position[1]
    );
    if (distance < minDistance) {
      minDistance = distance;
      nearestBranch = BRANCHES[i];
    }
  }

  return nearestBranch;
};

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const calculateEstimatedTime = (distanceKm) => {
  if (distanceKm <= 2) return Math.round(distanceKm * 8);
  if (distanceKm <= 5) return Math.round(distanceKm * 6);
  return Math.round(distanceKm * 5);
};

export const loginDeliveryController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const delivery = await UserModel.findOne({ email });

    if (!delivery) {
      return res
        .status(400)
        .json({ message: "Tài khoản không tồn tại.", success: false });
    }

    const checkPassword = await bcryptjs.compare(password, delivery.password);
    if (!checkPassword) {
      return res.status(400).json({ message: "Sai mật khẩu.", success: false });
    }

    if (delivery.role !== "DELIVERY") {
      return res.status(403).json({
        message: "Tài khoản này không có quyền truy cập trang nhân viên.",
        success: false,
      });
    }

    const accessToken = generatedAccessToken(delivery._id, delivery.role);
    const refreshToken = await generatedRefreshToken(
      delivery._id,
      delivery.role
    );

    await UserModel.findByIdAndUpdate(delivery._id, {
      last_login_date: new Date(),
      refresh_token: refreshToken,
    });

    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      path: "/api/v1/nhan-vien-giao-hang",
    };
    res.cookie("deliveryAccessToken", accessToken, cookieOptions);
    res.cookie("deliveryRefreshToken", refreshToken, cookieOptions);

    res.json({
      message: "Đăng nhập thành công!",
      success: true,
      data: {
        accessToken,
        refreshToken,
        delivery: {
          id: delivery._id,
          name: delivery.name,
          email: delivery.email,
          phone: delivery.phone,
        },
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: error.message, success: false });
  }
};

export const logoutDeliveryController = async (req, res) => {
  try {
    const refreshTokenFromHeader =
      req.headers.authorization && req.headers.authorization.split(" ")[1];
    let deliveryIdToLogout = null;

    if (refreshTokenFromHeader) {
      try {
        const decoded = jwt.verify(
          refreshTokenFromHeader,
          process.env.SECRET_KEY_REFRESH_TOKEN
        );
        deliveryIdToLogout = decoded.id;
      } catch (error) {
        console.error("JWT verify error:", error);
      }
    }

    const cookieOptions = { httpOnly: true, secure: true, sameSite: "None" };

    res.clearCookie("deliveryAccessToken", cookieOptions);
    res.clearCookie("deliveryRefreshToken", cookieOptions);

    if (deliveryIdToLogout) {
      await UserModel.findByIdAndUpdate(deliveryIdToLogout, {
        refresh_token: "",
      });
    }

    res.json({ message: "Đăng xuất thành công", success: true });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: error.message, success: false });
  }
};

export const refreshAccessTokenDeliveryController = async (req, res) => {
  try {
    const refreshTokenFromHeader = req.headers.authorization?.split(" ")[1];
    if (!refreshTokenFromHeader) {
      return res.status(401).json({ message: "Refresh Token", success: false });
    }

    const decoded = jwt.verify(
      refreshTokenFromHeader,
      process.env.SECRET_KEY_REFRESH_TOKEN
    );
    const deliveryId = decoded.id;

    const delivery = await UserModel.findById(deliveryId);

    if (
      !delivery ||
      delivery.role !== "DELIVERY" ||
      delivery.refresh_token !== refreshTokenFromHeader
    ) {
      return res.status(403).json({
        message: "Mã thông báo làm mới không hợp lệ",
        success: false,
      });
    }

    const newAccessToken = generatedAccessToken(deliveryId, delivery.role);
    res.json({
      message: "Mã thông báo truy cập đã được làm mới thành công!",
      success: true,
      data: { accessToken: newAccessToken },
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(401).json({
      message: "Mã thông báo làm mới không hợp lệ hoặc đã hết hạn",
      success: false,
    });
  }
};

export const getDeliveryDetailsController = async (req, res) => {
  try {
    const userId = req.userId;

    const deliveryDetails = await UserModel.findById(userId).select(
      "-password -refresh_token"
    );

    if (!deliveryDetails || deliveryDetails.role !== "DELIVERY") {
      return res.status(403).json({
        message: "Không tìm thấy thông tin nhân viên giao hàng.",
        success: false,
      });
    }

    res.json({
      message: "Lấy thông tin nhân viên giao hàng thành công.",
      success: true,
      data: deliveryDetails,
    });
  } catch (error) {
    console.error("Get delivery details error:", error);
    res.status(500).json({
      message:
        error.message || "Lỗi server khi lấy thông tin nhân viên giao hàng.",
      success: false,
    });
  }
};

export const getShipperStatsController = async (req, res) => {
  try {
    const shipperId = req.userId;

    const shipper = await UserModel.findById(shipperId);
    if (!shipper || shipper.role !== "DELIVERY") {
      return res.status(403).json({
        message: "Bạn không có quyền truy cập",
        error: true,
        success: false,
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayStats = await OrderModel.aggregate([
      {
        $match: {
          shipper: new mongoose.Types.ObjectId(shipperId),
          order_status: "delivered",
          deliveredAt: {
            $gte: today,
            $lt: tomorrow,
          },
        },
      },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalEarnings: { $sum: "$totalAmt" },
          orders: {
            $push: {
              orderId: "$orderId",
              deliveredAt: "$deliveredAt",
              amount: "$totalAmt",
            },
          },
        },
      },
    ]);

    const allTimeStats = await OrderModel.aggregate([
      {
        $match: {
          shipper: new mongoose.Types.ObjectId(shipperId),
          order_status: "delivered",
        },
      },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalEarnings: { $sum: "$totalAmt" },
          averageEarnings: { $avg: "$totalAmt" },
        },
      },
    ]);

    const result = {
      today: todayStats[0] || {
        totalOrders: 0,
        totalEarnings: 0,
        orders: [],
      },
      allTime: allTimeStats[0] || {
        totalOrders: 0,
        totalEarnings: 0,
        averageEarnings: 0,
      },
      shipperId: shipperId,
      shipperName: shipper.name,
      updatedAt: new Date(),
    };

    return res.json({
      message: "Thống kê shipper",
      error: false,
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Lỗi khi lấy thống kê shipper:", error);
    return res.status(500).json({
      message: error.message || "Lỗi server",
      error: true,
      success: false,
    });
  }
};

export const getDeliveryOrdersController = async (req, res) => {
  try {
    const shipperId = req.userId;

    const shipper = await UserModel.findById(shipperId);
    if (!shipper || shipper.role !== "DELIVERY") {
      return res.status(403).json({
        message: "Bạn không có quyền truy cập",
        error: true,
        success: false,
      });
    }

    const orders = await OrderModel.aggregate([
      {
        $match: {
          payment_status: "CASH ON DELIVERY",
          order_status: "pending",
          shipper: null,
        },
      },
      {
        $group: {
          _id: "$orderId",
          orderId: { $first: "$orderId" },
          createdAt: { $first: "$createdAt" },
          userId: { $first: "$userId" },
          delivery_address: { $first: "$delivery_address" },
          order_status: { $first: "$order_status" },
          shipper: { $first: "$shipper" },
          products: {
            $push: {
              product_details: "$product_details",
              quantity: "$quantity",
              sizes: "$sizes",
              bases: "$bases",
              sizePrice: "$sizePrice",
              basePrice: "$basePrice",
              totalAmt: "$totalAmt",
            },
          },
          totalAmount: { $sum: "$totalAmt" },
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    const populatedOrders = await OrderModel.populate(orders, [
      { path: "userId", select: "name email phone" },
      {
        path: "delivery_address",
        select: "street ward district city phoneNumber coordinates",
      },
    ]);

    const orderList = populatedOrders.map((order) => {
      let customerPosition = [10.846129, 106.668837];

      if (order.delivery_address?.coordinates) {
        const coords = order.delivery_address.coordinates;
        if (coords.lat && coords.lng) {
          customerPosition = [coords.lat, coords.lng];
        } else if (Array.isArray(coords) && coords.length === 2) {
          customerPosition = coords;
        }
      }

      const nearestBranch = findNearestBranch(customerPosition);

      const distance = calculateDistance(
        nearestBranch.position[0],
        nearestBranch.position[1],
        customerPosition[0],
        customerPosition[1]
      ).toFixed(2);

      const estimatedTime = calculateEstimatedTime(parseFloat(distance));

      return {
        _id: order.orderId,
        orderId: order.orderId,
        createdAt: order.createdAt,
        customer: {
          name: order.userId?.name || "Khách hàng",
          email: order.userId?.email || "",
          phone:
            order.delivery_address?.phoneNumber || order.userId?.phone || "",
        },
        delivery_address: order.delivery_address,
        customerPosition: customerPosition,
        status: "pending",
        products: order.products || [],
        totalAmount: order.totalAmount || 0,
        deliveryFee: 0,
        tip: 0,
        branch: {
          id: nearestBranch.id,
          name: nearestBranch.name,
          position: nearestBranch.position,
          address: nearestBranch.address,
        },
        distance: `${distance}km`,
        estimatedDeliveryTime: `${estimatedTime} phút`,
        shipper: order.shipper,
        isCurrentShipper: false,
      };
    });

    return res.json({
      message: "Danh sách đơn hàng pending",
      error: false,
      success: true,
      data: orderList,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Lỗi server",
      error: true,
      success: false,
    });
  }
};

export const getCurrentDeliveryController = async (req, res) => {
  try {
    const shipperId = req.userId;

    const shipper = await UserModel.findById(shipperId);
    if (!shipper || shipper.role !== "DELIVERY") {
      return res.status(403).json({
        message: "Bạn không có quyền truy cập",
        error: true,
        success: false,
      });
    }

    const orders = await OrderModel.aggregate([
      {
        $match: {
          shipper: new mongoose.Types.ObjectId(shipperId),
          order_status: "shipping",
        },
      },
      {
        $group: {
          _id: "$orderId",
          orderId: { $first: "$orderId" },
          createdAt: { $first: "$createdAt" },
          userId: { $first: "$userId" },
          delivery_address: { $first: "$delivery_address" },
          order_status: { $first: "$order_status" },
          shipper: { $first: "$shipper" },
          products: {
            $push: {
              product_details: "$product_details",
              quantity: "$quantity",
              sizes: "$sizes",
              bases: "$bases",
              sizePrice: "$sizePrice",
              basePrice: "$basePrice",
              totalAmt: "$totalAmt",
            },
          },
          totalAmount: { $sum: "$totalAmt" },
        },
      },
      { $sort: { createdAt: -1 } },
      { $limit: 1 },
    ]);

    if (!orders || orders.length === 0) {
      return res.json({
        message: "Không có đơn hàng đang giao",
        error: false,
        success: true,
        data: null,
      });
    }

    const order = orders[0];

    const populatedOrder = await OrderModel.populate(order, [
      { path: "userId", select: "name email phone" },
      {
        path: "delivery_address",
        select: "street ward district city phoneNumber coordinates",
      },
    ]);

    let customerPosition = [10.846129, 106.668837];
    if (populatedOrder.delivery_address?.coordinates) {
      const coords = populatedOrder.delivery_address.coordinates;
      if (coords.lat && coords.lng) {
        customerPosition = [coords.lat, coords.lng];
      } else if (Array.isArray(coords) && coords.length === 2) {
        customerPosition = coords;
      }
    }

    const nearestBranch = findNearestBranch(customerPosition);

    const distance = calculateDistance(
      nearestBranch.position[0],
      nearestBranch.position[1],
      customerPosition[0],
      customerPosition[1]
    ).toFixed(2);

    const estimatedTime = calculateEstimatedTime(parseFloat(distance));

    const formattedOrder = {
      orderId: populatedOrder.orderId,
      customer: {
        name: populatedOrder.userId?.name || "Khách hàng",
        phone:
          populatedOrder.delivery_address?.phoneNumber ||
          populatedOrder.userId?.phone ||
          "",
      },
      customerAddress: populatedOrder.delivery_address
        ? `${populatedOrder.delivery_address.street || ""}, ${
            populatedOrder.delivery_address.ward || ""
          }, ${populatedOrder.delivery_address.district || ""}, ${
            populatedOrder.delivery_address.city || ""
          }`
        : "Đang cập nhật",
      customerPosition: customerPosition,
      branch: nearestBranch,
      storeName: nearestBranch.name,
      storeAddress: nearestBranch.address,
      storePosition: nearestBranch.position,
      totalAmount: populatedOrder.totalAmount || 0,
      deliveryFee: 0,
      distance: `${distance}km`,
      estimatedDeliveryTime: `${estimatedTime} phút`,
      products: populatedOrder.products || [],
      status: "shipping",
    };

    return res.json({
      message: "Đơn hàng đang giao",
      error: false,
      success: true,
      data: formattedOrder,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Lỗi server",
      error: true,
      success: false,
    });
  }
};

export const updateOrderStatusController = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    const shipperId = req.userId;

    const validStatuses = ["pending", "shipping", "delivered"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Trạng thái không hợp lệ",
        error: true,
        success: false,
      });
    }

    const orders = await OrderModel.find({ orderId: orderId });

    if (!orders || orders.length === 0) {
      return res.status(404).json({
        message: "Không tìm thấy đơn hàng",
        error: true,
        success: false,
      });
    }

    if (status === "shipping") {
      const firstOrder = orders[0];
      if (
        firstOrder.shipper &&
        firstOrder.shipper.toString() !== shipperId.toString()
      ) {
        return res.status(400).json({
          message: "Đơn hàng này đã được shipper khác nhận",
          error: true,
          success: false,
        });
      }
    }

    const updateData = {
      order_status: status,
      updatedAt: new Date(),
    };

    if (status === "shipping") {
      updateData.shipper = shipperId;
    }

    if (status === "delivered") {
      updateData.deliveredAt = new Date();
    }

    const updateResult = await OrderModel.updateMany(
      { orderId: orderId },
      updateData
    );

    return res.json({
      message: `Cập nhật trạng thái thành "${status}"`,
      error: false,
      success: true,
      data: {
        modifiedCount: updateResult.modifiedCount,
        orderId: orderId,
        status: status,
        shipper: shipperId,
        deliveredAt: status === "delivered" ? new Date() : null,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Lỗi server",
      error: true,
      success: false,
    });
  }
};

export const getDeliveredOrdersController = async (req, res) => {
  try {
    const shipperId = req.userId;

    const shipper = await UserModel.findById(shipperId);
    if (!shipper || shipper.role !== "DELIVERY") {
      return res.status(403).json({
        message: "Bạn không có quyền truy cập",
        error: true,
        success: false,
      });
    }

    const orders = await OrderModel.aggregate([
      {
        $match: {
          shipper: new mongoose.Types.ObjectId(shipperId),
          order_status: "delivered",
        },
      },
      {
        $group: {
          _id: "$orderId",
          orderId: { $first: "$orderId" },
          createdAt: { $first: "$createdAt" },
          userId: { $first: "$userId" },
          delivery_address: { $first: "$delivery_address" },
          order_status: { $first: "$order_status" },
          shipper: { $first: "$shipper" },
          deliveredAt: { $first: "$deliveredAt" },
          products: {
            $push: {
              product_details: "$product_details",
              quantity: "$quantity",
              sizes: "$sizes",
              bases: "$bases",
            },
          },
          totalAmount: { $sum: "$totalAmt" },
        },
      },
      { $sort: { deliveredAt: -1 } },
    ]);

    const populatedOrders = await OrderModel.populate(orders, [
      { path: "userId", select: "name email" },
      {
        path: "delivery_address",
        select: "street ward district city phoneNumber coordinates",
      },
    ]);

    const formattedOrders = populatedOrders.map((order) => {
      let customerPosition = [10.846129, 106.668837];
      if (order.delivery_address?.coordinates) {
        const coords = order.delivery_address.coordinates;
        if (coords.lat && coords.lng) {
          customerPosition = [coords.lat, coords.lng];
        }
      }

      const nearestBranch = findNearestBranch(customerPosition);
      const distance = calculateDistance(
        nearestBranch.position[0],
        nearestBranch.position[1],
        customerPosition[0],
        customerPosition[1]
      ).toFixed(2);

      return {
        _id: order.orderId,
        orderId: order.orderId,
        customer: {
          name: order.userId?.name || "Khách hàng",
          phone: order.delivery_address?.phoneNumber || "",
        },
        customerAddress: order.delivery_address
          ? `${order.delivery_address.street || ""}, ${
              order.delivery_address.ward || ""
            }, ${order.delivery_address.district || ""}, ${
              order.delivery_address.city || ""
            }`
          : "Đang cập nhật",
        amount: order.totalAmount || 0,
        deliveryFee: 0,
        tip: 0,
        status: "delivered",
        orderTime: new Date(order.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        deliveryTime: order.deliveredAt
          ? new Date(order.deliveredAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "",
        distance: `${distance}km`,
        customerPhone: order.delivery_address?.phoneNumber || "",
        products: order.products || [],
      };
    });

    return res.json({
      message: "Danh sách đơn hàng đã giao",
      error: false,
      success: true,
      data: formattedOrders,
    });
  } catch (error) {
    console.error("❌ Lỗi khi lấy đơn đã giao:", error);
    return res.status(500).json({
      message: error.message || "Lỗi server",
      error: true,
      success: false,
    });
  }
};

export const updateDeliveryDetailsController = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, email, mobile, gender, birth_date } = req.body;



    const user = await UserModel.findById(userId);
    if (!user || user.role !== "DELIVERY") {
      return res.status(403).json({
        message: "Bạn không có quyền thực hiện hành động này",
        success: false,
      });
    }

    if (email && email !== user.email) {
      const existingUser = await UserModel.findOne({
        email,
        _id: { $ne: userId },
      });
      if (existingUser) {
        return res.status(400).json({
          message: "Email đã được sử dụng bởi tài khoản khác",
          success: false,
        });
      }
    }

    if (mobile && mobile !== user.mobile) {
      const existingUser = await UserModel.findOne({
        mobile,
        _id: { $ne: userId },
      });
      if (existingUser) {
        return res.status(400).json({
          message: "Số điện thoại đã được sử dụng bởi tài khoản khác",
          success: false,
        });
      }
    }

    const updateData = {
      updatedAt: new Date(),
    };

    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (mobile) updateData.mobile = mobile;
    if (gender) updateData.gender = gender;
    if (birth_date) updateData.birth_date = birth_date;

    const updatedUser = await UserModel.findByIdAndUpdate(userId, updateData, {
      new: true,
    }).select("-password -refresh_token");

    return res.status(200).json({
      message: "Cập nhật thông tin thành công",
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật thông tin delivery:", error);
    return res.status(500).json({
      message: "Lỗi server khi cập nhật thông tin",
      success: false,
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const uploadDeliveryImageController = async (req, res) => {
  try {

    const userId = req.userId;
    const image = req.file;

    if (!image) {
      return res.status(400).json({
        message: "Vui lòng chọn ảnh",
        success: false,
      });
    }

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
    ];
    if (!allowedTypes.includes(image.mimetype)) {
      return res.status(400).json({
        message: "Chỉ chấp nhận file ảnh (JPEG, PNG, WebP, GIF)",
        success: false,
      });
    }

    if (image.size > 5 * 1024 * 1024) {
      return res.status(400).json({
        message: "Kích thước ảnh tối đa là 5MB",
        success: false,
      });
    }



    const imageBuffer = image.buffer;
    const base64Image = `data:${image.mimetype};base64,${imageBuffer.toString(
      "base64"
    )}`;

    const uploadResult = await cloudinary.uploader.upload(base64Image, {
      folder: "PizzaTP/delivery",
      resource_type: "image",
      transformation: [
        { width: 500, height: 500, crop: "fill" },
        { quality: "auto" },
        { format: "webp" },
      ],
    });

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        profile_image: uploadResult.secure_url,
        updatedAt: new Date(),
      },
      { new: true }
    ).select("-password -refresh_token");

    return res.status(200).json({
      message: "Tải ảnh đại diện thành công",
      success: true,
      data: {
        _id: updatedUser._id,
        profile_image: updatedUser.profile_image,
        name: updatedUser.name,
        email: updatedUser.email,
      },
    });
  } catch (error) {
    console.error("Lỗi khi upload ảnh delivery:", error);

    let errorMessage = "Lỗi server khi upload ảnh";
    let statusCode = 500;

    if (error.message.includes("Cloudinary")) {
      errorMessage =
        "Lỗi khi upload lên Cloudinary. Vui lòng kiểm tra kết nối.";
    } else if (
      error.message.includes("ENOENT") ||
      error.message.includes("File")
    ) {
      errorMessage = "Không thể đọc file ảnh";
      statusCode = 400;
    }

    return res.status(statusCode).json({
      message: errorMessage,
      success: false,
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
