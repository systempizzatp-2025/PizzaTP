import UserModel from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import generatedRefreshToken from "../utils/genenratedRefreshToken.js";
import generatedAccessToken from "../utils/generatedAccessToken.js";
import jwt from "jsonwebtoken";
import verifyEmailTemplate from "../utils/verifyEmailTemplate.js";
import sendEmail from "../config/sendEmail.js";
import OrderModel from "../models/order.model.js";
import mongoose from "mongoose";

const BRANCHES = [
  {
    id: "GO_VAP",
    name: "Chi nhánh Gò Vấp",
    position: [10.846129, 106.668837],
    address: "226/106 Đ. Nguyễn Văn Lượng, Phường 17, Gò Vấp, TP.HCM",
  },
];

export const getPendingOrdersController = async (req, res) => {
  try {
    const orders = await OrderModel.aggregate([
      {
        $match: {
          order_status: "pending",
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
          payment_status: { $first: "$payment_status" },
          products: {
            $push: {
              product_details: "$product_details",
              quantity: "$quantity",
              sizes: "$sizes",
              bases: "$bases",
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

    const formattedOrders = populatedOrders.map((order) => {
      let customerAddress = "Đang cập nhật";
      if (order.delivery_address) {
        const addr = order.delivery_address;
        customerAddress = `${addr.street || ""}, ${addr.ward || ""}, ${
          addr.district || ""
        }, ${addr.city || ""}`.trim();
        if (customerAddress === ",") customerAddress = "Đang cập nhật";
      }

      return {
        _id: order.orderId,
        orderId: order.orderId,
        createdAt: order.createdAt,
        customerName: order.userId?.name || "Khách hàng",
        customerPhone: order.delivery_address?.phoneNumber || "",
        customerAddress: customerAddress,
        status: order.order_status,
        paymentMethod: order.payment_status,
        totalAmount: order.totalAmount || 0,
        products: order.products.map((p) => ({
          name: p.product_details?.name || "Sản phẩm",
          quantity: p.quantity,
        })),
        branchName: "Chi nhánh Gò Vấp",
      };
    });

    return res.json({
      success: true,
      message: "Danh sách đơn hàng chờ giao",
      data: formattedOrders,
    });
  } catch (error) {
    console.error("Lỗi khi lấy đơn chờ giao:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy đơn chờ giao",
    });
  }
};

export const getShippingOrdersController = async (req, res) => {
  try {
    const orders = await OrderModel.aggregate([
      {
        $match: {
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
          payment_status: { $first: "$payment_status" },
          shipper: { $first: "$shipper" },
          products: {
            $push: {
              product_details: "$product_details",
              quantity: "$quantity",
              sizes: "$sizes",
              bases: "$bases",
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
      { path: "shipper", select: "name phone" },
    ]);

    const formattedOrders = populatedOrders.map((order) => {
      let customerAddress = "Đang cập nhật";
      if (order.delivery_address) {
        const addr = order.delivery_address;
        customerAddress = `${addr.street || ""}, ${addr.ward || ""}, ${
          addr.district || ""
        }, ${addr.city || ""}`.trim();
        if (customerAddress === ",") customerAddress = "Đang cập nhật";
      }

      return {
        _id: order.orderId,
        orderId: order.orderId,
        createdAt: order.createdAt,
        customerName: order.userId?.name || "Khách hàng",
        customerPhone: order.delivery_address?.phoneNumber || "",
        customerAddress: customerAddress,
        status: order.order_status,
        paymentMethod: order.payment_status,
        totalAmount: order.totalAmount || 0,
        products: order.products.map((p) => ({
          name: p.product_details?.name || "Sản phẩm",
          quantity: p.quantity,
        })),
        shipperName: order.shipper?.name || "Chưa có shipper",
        shipperPhone: order.shipper?.phone || "",
        shippingStartedAt: order.createdAt,
        distance: `${(Math.random() * 5 + 1).toFixed(1)}km`,
        estimatedTime: "15-20 phút",
      };
    });

    return res.json({
      success: true,
      message: "Danh sách đơn hàng đang giao",
      data: formattedOrders,
    });
  } catch (error) {
    console.error("Lỗi khi lấy đơn đang giao:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy đơn đang giao",
    });
  }
};

export const getDeliveredOrdersController = async (req, res) => {
  try {
    const orders = await OrderModel.aggregate([
      {
        $match: {
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
          payment_status: { $first: "$payment_status" },
          shipper: { $first: "$shipper" },
          deliveredAt: { $first: "$deliveredAt" },
          products: {
            $push: {
              product_details: "$product_details",
              quantity: "$quantity",
              sizes: "$sizes",
              bases: "$bases",
              totalAmt: "$totalAmt",
            },
          },
          totalAmount: { $sum: "$totalAmt" },
        },
      },
      { $sort: { deliveredAt: -1 } },
    ]);

    const populatedOrders = await OrderModel.populate(orders, [
      { path: "userId", select: "name email phone" },
      {
        path: "delivery_address",
        select: "street ward district city phoneNumber coordinates",
      },
      { path: "shipper", select: "name" },
    ]);

    const formattedOrders = populatedOrders.map((order) => {
      let customerAddress = "Đang cập nhật";
      if (order.delivery_address) {
        const addr = order.delivery_address;
        customerAddress = `${addr.street || ""}, ${addr.ward || ""}, ${
          addr.district || ""
        }, ${addr.city || ""}`.trim();
        if (customerAddress === ",") customerAddress = "Đang cập nhật";
      }

      const createdAt = new Date(order.createdAt);
      const deliveredAt = new Date(order.deliveredAt || order.createdAt);
      const deliveryTimeMinutes = Math.round(
        (deliveredAt - createdAt) / (1000 * 60)
      );

      return {
        _id: order.orderId,
        orderId: order.orderId,
        createdAt: order.createdAt,
        deliveredAt: order.deliveredAt || order.createdAt,
        customerName: order.userId?.name || "Khách hàng",
        customerPhone: order.delivery_address?.phoneNumber || "",
        customerAddress: customerAddress,
        status: order.order_status,
        paymentMethod: order.payment_status,
        totalAmount: order.totalAmount || 0,
        products: order.products.map((p) => ({
          name: p.product_details?.name || "Sản phẩm",
          quantity: p.quantity,
        })),
        shipperName: order.shipper?.name || "Không xác định",
        deliveryTime: deliveryTimeMinutes,
        rating: 5,
      };
    });

    return res.json({
      success: true,
      message: "Danh sách đơn hàng đã giao",
      data: formattedOrders,
    });
  } catch (error) {
    console.error("Lỗi khi lấy đơn đã giao:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy đơn đã giao",
    });
  }
};

export const loginAdminController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await UserModel.findOne({ email });

    if (!admin) {
      return res
        .status(400)
        .json({ message: "Tài khoản không tồn tại.", success: false });
    }

    const checkPassword = await bcryptjs.compare(password, admin.password);
    if (!checkPassword) {
      return res.status(400).json({ message: "Sai mật khẩu.", success: false });
    }

    if (admin.role !== "ADMIN") {
      return res.status(403).json({
        message: "Tài khoản này không có quyền truy cập trang quản trị.",
        success: false,
      });
    }

    const accessToken = generatedAccessToken(admin._id, admin.role);
    const refreshToken = await generatedRefreshToken(admin._id, admin.role);

    await UserModel.findByIdAndUpdate(admin._id, {
      last_login_date: new Date(),
      refresh_token: refreshToken,
    });

    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      path: "/api/v1/quan-tri-vien",
    };
    res.cookie("adminAccessToken", accessToken, cookieOptions);
    res.cookie("adminRefreshToken", refreshToken, cookieOptions);

    res.json({
      message: "Đăng nhập quản trị thành công!",
      success: true,
      data: { accessToken, refreshToken },
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

export const logoutAdminController = async (req, res) => {
  try {
    const refreshTokenFromHeader =
      req.headers.authorization && req.headers.authorization.split(" ")[1];
    let adminIdToLogout = null;

    if (refreshTokenFromHeader) {
      try {
        const decoded = jwt.verify(
          refreshTokenFromHeader,
          process.env.SECRET_KEY_REFRESH_TOKEN
        );
        adminIdToLogout = decoded.id;
      } catch (error) {
        //
      }
    }

    const cookieOptions = { httpOnly: true, secure: true, sameSite: "None" };

    res.clearCookie("adminAccessToken", cookieOptions);
    res.clearCookie("adminRefreshToken", cookieOptions);

    if (adminIdToLogout) {
      await UserModel.findByIdAndUpdate(adminIdToLogout, { refresh_token: "" });
    }

    res.json({ message: "", success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

export const refreshAccessTokenAdminController = async (req, res) => {
  try {
    const refreshTokenFromHeader = req.headers.authorization?.split(" ")[1];
    if (!refreshTokenFromHeader) {
      return res.status(401).json({ message: "Refresh Token", success: false });
    }

    const decoded = jwt.verify(
      refreshTokenFromHeader,
      process.env.SECRET_KEY_REFRESH_TOKEN
    );
    const adminId = decoded.id;

    const admin = await UserModel.findById(adminId);

    if (
      !admin ||
      admin.role !== "ADMIN" ||
      admin.refresh_token !== refreshTokenFromHeader
    ) {
      return res.status(403).json({
        message: "Mã thông báo làm mới không hợp lệ cho Quản trị viên",
        success: false,
      });
    }

    const newAccessToken = await generatedAccessToken(adminId);
    res.json({
      message: "Mã thông báo truy cập đã được làm mới thành công!",
      success: true,
      data: { accessToken: newAccessToken },
    });
  } catch (error) {
    res.status(401).json({
      message: "Mã thông báo làm mới không hợp lệ hoặc đã hết hạn",
      success: false,
    });
  }
};

export const getAdminDetailsController = async (req, res) => {
  try {
    const userId = req.userId; // middleware

    const adminDetails = await UserModel.findById(userId).select(
      "-password -refresh_token"
    );

    if (!adminDetails || adminDetails.role !== "ADMIN") {
      return res.status(403).json({
        message: "Không tìm thấy thông tin Quản trị viên.",
        success: false,
      });
    }

    res.json({
      message: "Lấy thông tin Admin thành công.",
      success: true,
      data: adminDetails,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Lỗi server khi lấy thông tin Admin.",
      success: false,
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find().select(
      "_id name email mobile role profile_image"
    );

    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!["USER", "ADMIN", "DELIVERY"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Vai trò không hợp lệ",
      });
    }

    const updated = await UserModel.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select("_id name email mobile role");

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Người dùng không tồn tại",
      });
    }

    res.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await UserModel.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Người dùng không tồn tại",
      });
    }

    res.json({ success: true, message: "Xóa tài khoản người dùng thành công" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const createDeliveryAccountController = async (req, res) => {
  try {
    const adminId = req.userId; // middleware
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng cung cấp đầy đủ name, email, password",
      });
    }

    const admin = await UserModel.findById(adminId);
    if (!admin || admin.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền thực hiện hành động này",
      });
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email đã tồn tại trong hệ thống",
      });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(password, salt);

    const newDelivery = new UserModel({
      name,
      email,
      password: hashPassword,
      role: "DELIVERY",
      verify_email: false,
      status: "Active",
    });

    const save = await newDelivery.save();

    const verifyEmailUrl = `${process.env.FRONTEND_URL}/xac-thuc-email?code=${save._id}`;

    await sendEmail({
      sendTo: email,
      subject: "Xác thực tài khoản giao hàng - PizzaTP",
      html: verifyEmailTemplate({
        name,
        url: verifyEmailUrl,
      }),
    });

    return res.json({
      success: true,
      message: "Tạo tài khoản DELIVERY thành công. Email xác thực đã được gửi.",
      data: {
        _id: save._id,
        name: save.name,
        email: save.email,
        role: save.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const assignShipperController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { shipperId } = req.body;

    await OrderModel.updateMany(
      { orderId: orderId },
      {
        shipper: new mongoose.Types.ObjectId(shipperId),
        order_status: "shipping",
        updatedAt: new Date(),
      }
    );

    return res.json({
      success: true,
      message: "Đã phân công shipper thành công",
    });
  } catch (error) {
    console.error("Lỗi khi phân công shipper:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi phân công shipper",
    });
  }
};

export const cancelOrderController = async (req, res) => {
  try {
    const { orderId } = req.params;

    await OrderModel.updateMany(
      { orderId: orderId },
      {
        order_status: "cancelled",
        cancelledBy: "admin",
        cancelledAt: new Date(),
        updatedAt: new Date(),
      }
    );

    return res.json({
      success: true,
      message: "Đã hủy đơn hàng thành công",
    });
  } catch (error) {
    console.error("Lỗi khi hủy đơn hàng:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi hủy đơn hàng",
    });
  }
};

export const confirmDeliveryController = async (req, res) => {
  try {
    const { orderId } = req.params;

    await OrderModel.updateMany(
      { orderId: orderId },
      {
        order_status: "delivered",
        deliveredAt: new Date(),
        updatedAt: new Date(),
      }
    );

    return res.json({
      success: true,
      message: "Đã xác nhận giao hàng thành công",
    });
  } catch (error) {
    console.error("Lỗi khi xác nhận giao hàng:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi xác nhận giao hàng",
    });
  }
};

export const getShippersController = async (req, res) => {
  try {
    const shippers = await UserModel.find({ role: "DELIVERY" }).select(
      "_id name email phone status"
    );

    return res.json({
      success: true,
      message: "Danh sách shipper",
      data: shippers,
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách shipper:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy danh sách shipper",
    });
  }
};
