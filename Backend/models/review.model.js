import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
    product: { type: mongoose.Schema.ObjectId, ref: "Product", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: "" },
    photos: [{ type: String }], 
    approved: { type: Boolean, default: true },
    helpfulCount: { type: Number, default: 0 },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
    likes: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);
 

reviewSchema.index({ user: 1, product: 1 });

const Review = mongoose.model("Review", reviewSchema);
export default Review;   
