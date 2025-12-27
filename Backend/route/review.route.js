import express from "express";
import auth from "../middleware/auth.js";
import authAdmin from "../middleware/authAdmin.js";
import upload from "../middleware/multer.js";

import {
  createReview,
  getReviewsByProduct,
  toggleLikeReview,
  getAllReviews,
  deleteReview,
} from "../controllers/review.controller.js";

const reviewRouter = express.Router();


reviewRouter.get("/admin/all", authAdmin, getAllReviews);
reviewRouter.delete("/admin/:reviewId", authAdmin, deleteReview);


reviewRouter.post("/", auth, upload.array("photos"), createReview);
reviewRouter.post("/like/:reviewId", auth, toggleLikeReview);

reviewRouter.get("/:productId", getReviewsByProduct);

export default reviewRouter;
