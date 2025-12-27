import mongoose from "mongoose";

const shipperDailyStatsSchema = new mongoose.Schema(
  {
    shipperId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    totalOrders: {
      type: Number,
      default: 0,
    },
    totalEarnings: {
      type: Number,
      default: 0,
    },
    orders: [
      {
        orderId: String,
        deliveredAt: Date,
        amount: Number,
        products: Array,
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);


shipperDailyStatsSchema.index({ shipperId: 1, date: 1 }, { unique: true });

const ShipperDailyStats = mongoose.model(
  "ShipperDailyStats",
  shipperDailyStatsSchema
);

const shipperAllTimeStatsSchema = new mongoose.Schema(
  {
    shipperId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    totalOrders: {
      type: Number,
      default: 0,
    },
    totalEarnings: {
      type: Number,
      default: 0,
    },
    averageEarnings: {
      type: Number,
      default: 0,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const ShipperAllTimeStats = mongoose.model(
  "ShipperAllTimeStats",
  shipperAllTimeStatsSchema
);

export { ShipperDailyStats, ShipperAllTimeStats };
