import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Provide name"], trim: true },
    email: {
      type: String,
      required: [true, "Provide email"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: [true, "Provide password"] },
    mobile: { type: String, default: null },
    google_id: { type: String },
    refresh_token: { type: String, default: "" },
    verify_email: { type: Boolean, default: false },
    last_login_date: { type: Date, default: null },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Suspended"],
      default: "Active",
    },
    address_details: [{ type: mongoose.Schema.ObjectId, ref: "address" }],
    shopping_cart: [{ type: mongoose.Schema.ObjectId, ref: "cartProduct" }],
    orderHistory: [{ type: mongoose.Schema.ObjectId, ref: "order" }],
    favorites: [{ type: mongoose.Schema.ObjectId, ref: "favorite" }],
    notifications: [{ type: mongoose.Schema.ObjectId, ref: "notification" }],
    forgot_password_otp: { type: String, default: null },
    forgot_password_expiry: { type: Date, default: null },
    profile_image: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["ADMIN", "USER", "DELIVERY"],
      default: "USER",
    },
  },
  { timestamps: true }
);

userSchema.index({ email: 1 });
userSchema.index({ mobile: 1 });

const User = mongoose.model("User", userSchema);
export default User;
