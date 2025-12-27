import OrderModel from "../models/order.model.js";
import mongoose from "mongoose";
import UserModel from "../models/user.model.js";
import CartProductModel from "../models/cartProduct.model.js";
import Stripe from "../config/stripe.js";
import { v4 as uuidv4 } from "uuid";
import { io } from "../index.js";
import Notification from "../models/notification.model.js";

export async function CashOnDeliveryOrderController(request, response) {
  try {
    const userId = request.userId;

    const { list_items, totalAmt, addressId, subTotalAmt } = request.body;

    let mainOrderId;
    let isUnique = false;
    let retryCount = 0;
    const MAX_RETRIES = 5;

    while (!isUnique && retryCount < MAX_RETRIES) {
      mainOrderId = generateOrderId();

      const existingOrder = await OrderModel.findOne({ orderId: mainOrderId });

      if (!existingOrder) {
        isUnique = true;
      } else {
        retryCount++;
      }
    }

    if (!isUnique) {
      return response.status(409).json({
        message: "Không thể tạo mã đơn hàng duy nhất, vui lòng thử lại",
        error: true,
        success: false,
      });
    }

    const payload = list_items.map((el) => {
      const sizesArray = el.size
        ? [{ name: el.size, price: el.sizePrice || 0 }]
        : [];
      const basesArray = el.base
        ? [{ name: el.base, price: el.basePrice || 0 }]
        : [];

      return {
        userId,
        orderId: mainOrderId,
        productId: el.productId._id,
        product_details: {
          name: el.productId.name,
          image: el.productId.image,
          price: el.productId.price,
          discount: el.productId.discount || 0,
        },
        paymentId: "",
        payment_status: "CASH ON DELIVERY",
        delivery_address: addressId,
        quantity: el.quantity || 1,
        subtotalAmt: el.finalPrice
          ? el.finalPrice * el.quantity
          : (pricewithDiscount(el.productId.price, el.productId.discount) +
              (el.sizePrice || 0) +
              (el.basePrice || 0)) *
            el.quantity,
        totalAmt: el.finalPrice
          ? el.finalPrice * el.quantity
          : (pricewithDiscount(el.productId.price, el.productId.discount) +
              (el.sizePrice || 0) +
              (el.basePrice || 0)) *
            el.quantity,
        sizes: sizesArray,
        bases: basesArray,
        sizePrice: el.sizePrice || 0,
        basePrice: el.basePrice || 0,
        discountCode: el.discountCode || null,
        order_status: "pending",
      };
    });

    const generatedOrder = await OrderModel.insertMany(payload);

    const newNotification = await Notification.create({
      user: userId,
      title: "Đặt hàng thành công",
      message: `Bạn đã đặt đơn hàng ${mainOrderId} thành công.`,
      image: payload[0].product_details.image
        ? payload[0].product_details.image[0]
        : "",
      type: "Order",
      orderId: generatedOrder[0]._id,
      isRead: false,
      createdAt: new Date(),
    });

    io.to(userId.toString()).emit("newNotification", {
      _id: newNotification._id,
      title: newNotification.title,
      message: newNotification.message,
      image: newNotification.image,
      orderId: newNotification.orderId,
      isRead: newNotification.isRead,
      createdAt: newNotification.createdAt,
    });

    await CartProductModel.deleteMany({ userId });
    await UserModel.updateOne({ _id: userId }, { shopping_cart: [] });

    return response.json({
      message: "Đặt hàng thành công",
      error: false,
      success: true,
      data: {
        orderId: mainOrderId,
        orders: generatedOrder,
        redirectTo: "/theo-doi-don-hang",
      },
    });
  } catch (error) {
    console.error("Error in CashOnDelivery:", error);

    if (error.code === 11000 || error.message.includes("duplicate key")) {
      return response.status(409).json({
        message: "Mã đơn hàng đã tồn tại, vui lòng thử lại",
        error: true,
        success: false,
        retrySuggestion: true,
      });
    }

    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export const pricewithDiscount = (price, dis = 1) => {
  const discountAmount = Math.ceil((Number(price) * Number(dis)) / 100);
  const actualPrice = Number(price) - Number(discountAmount);
  return actualPrice;
};

function generateOrderId() {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const shortId = uuidv4().split("-")[0].toUpperCase();

  const timestamp = Date.now().toString().slice(-6);
  return `PTP${datePart}-${shortId}${timestamp}`;
}

export async function paymentController(request, response) {
  try {
    const userId = request.userId;

    const { list_items, totalAmt, subTotalAmt, discountCode, addressId } =
      request.body;

    const line_items = list_items.map((item) => {
      const unitAmount = item.finalPrice
        ? item.finalPrice
        : pricewithDiscount(item.productId.price, item.productId.discount) +
          (item.sizePrice || 0) +
          (item.basePrice || 0);

      return {
        price_data: {
          currency: "vnd",
          product_data: {
            name: item.productId.name,
            images: item.productId.image,
            metadata: {
              productId: item.productId._id,
              originalPrice: item.productId.price,
              discount: item.productId.discount || 0,
              quantity: item.quantity,
              size: item.size || "",
              base: item.base || "",
              sizePrice: item.sizePrice || 0,
              basePrice: item.basePrice || 0,
              discountCode: discountCode || "",
            },
          },
          unit_amount: unitAmount,
        },
        adjustable_quantity: { enabled: true, minimum: 1 },
        quantity: item.quantity,
      };
    });

    const user = await UserModel.findById(userId);

    const params = {
      submit_type: "pay",
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: user.email,
      metadata: {
        userId: userId,
        addressId: addressId,
        discountCode: discountCode || "",
      },
      line_items,
      success_url: `${process.env.FRONTEND_URL}/thanh-cong`,
      cancel_url: `${process.env.FRONTEND_URL}/that-bai`,
    };

    const session = await Stripe.checkout.sessions.create(params);

    return response.status(200).json(session);
  } catch (error) {
    console.error(error);
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

const getOrderProductItems = async ({
  lineItems,
  userId,
  addressId,
  paymentId,
  payment_status,
}) => {
  const productList = [];

  if (lineItems?.data?.length) {
    for (const item of lineItems.data) {
      const product = await Stripe.products.retrieve(item.price.product);

      const size = product.metadata.size || "";
      const base = product.metadata.base || "";
      const sizePrice = parseFloat(product.metadata.sizePrice) || 0;
      const basePrice = parseFloat(product.metadata.basePrice) || 0;

      const sizesArray = size ? [{ name: size, price: sizePrice }] : [];
      const basesArray = base ? [{ name: base, price: basePrice }] : [];

      const payload = {
        userId: userId,
        orderId: generateOrderId(),
        productId: product.metadata.productId,
        product_details: {
          name: product.name,
          image: product.images,
          price: product.metadata.originalPrice || 0,
          discount: product.metadata.discount || 0,
        },
        paymentId: paymentId,
        payment_status: payment_status,
        delivery_address: addressId,
        quantity: item.quantity || 1,
        subtotalAmt: Number(item.amount_total),
        totalAmt: Number(item.amount_total),
        sizes: sizesArray,
        bases: basesArray,
        sizePrice: sizePrice,
        basePrice: basePrice,
      };

      productList.push(payload);
    }
  }
  return productList;
};

export async function cancelOrderController(request, response) {
  try {
    const userId = request.userId;
    const { orderId, reason } = request.body;

    const orders = await OrderModel.find({
      orderId: orderId,
      userId: userId,
    });

    if (!orders || orders.length === 0) {
      return response.status(404).json({
        message: "Đơn hàng không tồn tại",
        error: true,
        success: false,
      });
    }

    const cannotCancelStatus = [
      "delivered",
      "completed",
      "cancelled",
      "shipping",
      "delivering",
    ];

    for (const order of orders) {
      if (cannotCancelStatus.includes(order.order_status?.toLowerCase())) {
        return response.status(400).json({
          message: `Đơn hàng đã ở trạng thái "${order.order_status}", không thể hủy`,
          error: true,
          success: false,
        });
      }

      if (order.payment_status !== "CASH ON DELIVERY") {
        return response.status(400).json({
          message: "Chỉ có thể hủy đơn thanh toán khi nhận hàng",
          error: true,
          success: false,
        });
      }
    }

    const result = await OrderModel.deleteMany({
      orderId: orderId,
      userId: userId,
      order_status: { $nin: cannotCancelStatus },
      payment_status: "CASH ON DELIVERY",
    });

    if (result.deletedCount === 0) {
      return response.status(400).json({
        message: "Không thể hủy đơn hàng này",
        error: true,
        success: false,
      });
    }

    return response.json({
      message: `Đã hủy ${result.deletedCount} sản phẩm trong đơn hàng`,
      error: false,
      success: true,
      data: {
        deletedCount: result.deletedCount,
        orderId: orderId,
      },
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || "Lỗi server khi hủy đơn",
      error: true,
      success: false,
    });
  }
}
// CLI STRIPE (WEBHOOK) - localhost:8080/api/v1/dat-hang/webhook - stripe listen --forward-to localhost:8080/api/v1/dat-hang/webhook

export async function webhookStripe(request, response) {
  const event = request.body;
  const endPointSecret = process.env.STRIPE_ENDPOINT_WEBHOOK_SECRET_KEY;

  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;
      const lineItems = await Stripe.checkout.sessions.listLineItems(
        session.id
      );
      const userId = session.metadata.userId;
      const orderProduct = await getOrderProductItems({
        lineItems: lineItems,
        userId: userId,
        addressId: session.metadata.addressId,
        paymentId: session.payment_intent,
        payment_status: "paid",
      });

      const enhancedOrderProduct = orderProduct.map((item) => ({
        ...item,
        order_status: "processing",
      }));

      const order = await OrderModel.insertMany(enhancedOrderProduct);

      await Notification.create({
        user: userId,
        title: "Thanh toán thành công",
        message: `Đơn hàng ${order[0].orderId} đã được thanh toán và đang được xử lý.`,
        image: order[0].product_details.image
          ? order[0].product_details.image[0]
          : "",
        type: "Order",
        orderId: order[0]._id,
      });

      io.to(userId.toString()).emit("newNotification", {
        title: "Thanh toán thành công",
        message: `Đơn hàng ${order[0].orderId} đã được thanh toán và đang được xử lý.`,
        image: order[0].product_details.image
          ? order[0].product_details.image[0]
          : "",
        orderId: order[0]._id,
        isRead: false,
        createdAt: new Date().toISOString(),
      });

      if (Boolean(order[0])) {
        const removeCartItems = await UserModel.findByIdAndUpdate(userId, {
          shopping_cart: [],
        });
        const removeCartProductDB = await CartProductModel.deleteMany({
          userId: userId,
        });
      }
      break;
    default:
  }

  response.json({ received: true });
}

export async function getOrderDetails(request, response) {
  try {
    const userId = request.userId;

    const orderList = await OrderModel.find({ userId: userId })
      .sort({
        createdAt: -1,
      })
      .populate("delivery_address");

    return response.json({
      message: "Order List",
      data: orderList,
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message | error,
      error: true,
      success: false,
    });
  }
}
