// controllers/reviewController.ts
import { Request, Response } from "express";
import { Review_Model, IReview } from "../models/review.model";
import { logger } from "../config/logger.config";

//___---- Get All Reviews ----___
export const getAllReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const reviews: IReview[] = await Review_Model.find().populate("user").populate("course");
    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch reviews" });
  }
};

//___---- Get Reviews by Course ----___
export const getReviewsByCourse = async (req: Request<{ courseId: string }>, res: Response): Promise<void> => {
  try {
    const { courseId } = req.params;
    const reviews: IReview[] = await Review_Model.find({ course: courseId }).populate("user");
    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch course reviews" });
  }
};

//___---- Create Review ----___
export const createReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user, course, comment } = req.body;
    if (!user || !course || !comment) {
      res.status(400).json({ success: false, message: "Required fields missing" });
      return;
    }
    const review: IReview = await Review_Model.create({ user, course, comment });
    res.status(201).json({ success: true, data: review });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, message: "Failed to create review" });
  }
};

//___---- Update Review ----___
export const updateReview = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData: Partial<IReview> = req.body;
    const updatedReview: IReview | null = await Review_Model.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedReview) {
      res.status(404).json({ success: false, message: "Review not found" });
      return;
    }
    res.status(200).json({ success: true, data: updatedReview });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, message: "Failed to update review" });
  }
};

//___---- Delete Review ----___
export const deleteReview = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedReview: IReview | null = await Review_Model.findByIdAndDelete(id);
    if (!deletedReview) {
      res.status(404).json({ success: false, message: "Review not found" });
      return;
    }
    res.status(200).json({ success: true, data: deletedReview });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, message: "Failed to delete review" });
  }
};
