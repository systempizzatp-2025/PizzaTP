import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
    product: { type: mongoose.Schema.ObjectId, ref: "product", required: true },
    addedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

favoriteSchema.index({ user: 1, product: 1 }, { unique: true });

const Favorite = mongoose.model("favorite", favoriteSchema);
export default Favorite;
