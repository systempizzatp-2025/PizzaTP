import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
    label: { type: String, default: "Nhà riêng" },
    fullName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    street: { type: String, required: true },
    ward: { type: String, default: "" },
    district: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, default: "" },
    postalCode: { type: String, default: "" },
    isDefault: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

addressSchema.index({ user: 1, isDefault: 1 });

const Address = mongoose.model("address", addressSchema);
export default Address;
