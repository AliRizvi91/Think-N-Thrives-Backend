// routes/reviewRoutes.ts
import { Router } from "express";
import {
  getAllReviews,
  getReviewsByCourse,
  createReview,
  updateReview,
  deleteReview,
} from "../controllers/review.controller";

const ReviewRouter = Router();

ReviewRouter.get("/", getAllReviews);
ReviewRouter.post("/", createReview);

ReviewRouter.get("/course/:courseId", getReviewsByCourse);

ReviewRouter.put("/:id", updateReview);
ReviewRouter.delete("/:id", deleteReview);

export default ReviewRouter;
