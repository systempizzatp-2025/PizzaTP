import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.ObjectId, ref: "User", required: false },


    isGlobal: { type: Boolean, default: false }, 

    title: { type: String, required: true },
    message: { type: String, required: true },

    image: { type: String, default: "" }, 

    type: {
      type: String,
      enum: ["Info", "Order", "Promo", "System"],
      default: "Info",
    },

    channel: {
      type: String,
      enum: ["InApp", "Email", "SMS", "Push"],
      default: "InApp",
    },

    isRead: { type: Boolean, default: false },

    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      default: null,
    },

    sentAt: { type: Date, default: null },

    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
