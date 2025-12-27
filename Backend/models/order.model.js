import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      index: true,
    },
    orderId: {
      type: String,
      required: true,
      index: true,
      unique: true, 
    },
    productId: {
      type: mongoose.Schema.ObjectId,
      ref: "product",
      index: true,
    },
    product_details: {
      name: String,
      image: Array,
      price: Number,
      discount: Number,
    },
    paymentId: { type: String, default: "" },
    payment_status: { type: String, default: "" },
    delivery_address: {
      type: mongoose.Schema.ObjectId,
      ref: "address",
      index: true,
    },
    quantity: { type: Number, default: 1 },
    subtotalAmt: { type: Number, default: 0 },
    totalAmt: { type: Number, default: 0 },
    invoice_receipt: { type: String, default: "" },
    sizes: [
      {
        name: { type: String },
        price: { type: Number },
      },
    ],
    bases: [
      {
        name: { type: String },
        price: { type: Number },
      },
    ],
    discountCode: { type: String, default: "" },
    order_status: {
      type: String,
      default: "pending",
      enum: [
        "pending",
        "processing",
        "shipping",
        "delivered",
        "cancelled",
        "failed",
      ],
      index: true,
    },
    shipper: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    deliveredAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);


orderSchema.index({ shipper: 1, order_status: 1 });
orderSchema.index({ order_status: 1, shipper: 1, deliveredAt: -1 });
orderSchema.index({ userId: 1, createdAt: -1 });

const OrderModel = mongoose.model("order", orderSchema);
export default OrderModel;
