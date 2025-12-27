import Review from "../models/review.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";
import uploadImageCloudinary from "../utils/uploadImageCloudinary.js";

export const createReview = async (req, res) => {
  try {
    const { product, rating, comment } = req.body;
    const userId = req.userId;

    if (!product || !rating) {
      return res
        .status(400)
        .json({ success: false, message: "Thiếu product hoặc rating" });
    }

    const photoUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploaded = await uploadImageCloudinary(file);
        if (uploaded?.secure_url) photoUrls.push(uploaded.secure_url);
      }
    }

    const review = await Review.create({
      user: userId,
      product,
      rating,
      comment,
      photos: photoUrls,
      approved: true,
    });

    await review.populate("user", "name profile_image");

    res.status(201).json({ success: true, data: review });
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getReviewsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ product: productId, approved: true })
      .populate("user", "name profile_image")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleLikeReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.userId;

    const review = await Review.findById(reviewId);
    if (!review)
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });

    if (!review.likes) review.likes = [];

    if (review.likes.includes(userId)) {
      review.likes.pull(userId);
    } else {
      review.likes.push(userId);
    }

    await review.save();
    await review.populate("user", "name profile_image");

    res.status(200).json({ success: true, data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllReviews = async (req, res) => {
  try {
    const reviewsRaw = await Review.find({})
      .populate("user", "name profile_image")
      .populate({ path: "product", model: "product", select: "name image" })
      .sort({ createdAt: -1 });

    const reviews = reviewsRaw.map((rv) => ({
      ...rv.toObject(),
      product: rv.product || { name: "N/A" },
      user: rv.user || { name: "N/A", profile_image: "" },
    }));

    res.json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findByIdAndDelete(reviewId);

    if (!review) {
      return res
        .status(404)
        .json({ success: false, message: "Review không tồn tại" });
    }

    res.json({ success: true, message: "Xoá review thành công" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
