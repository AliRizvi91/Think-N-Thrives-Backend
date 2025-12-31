// controllers/courseController.ts
import { Request, Response } from "express";
import Course, { ICourse } from "../models/course.model";
import { uploadOnCloudinary } from "../services/cloudinary/cloudinary";
import { logger } from "../config/logger.config";

//___---- Get All Courses ----___
export const getAllCourses = async (req: Request, res: Response): Promise<void> => {
  try {
    const courses: ICourse[] = await Course.find();
    res.status(200).json({ success: true, data: courses });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch courses" });
  }
};

//___---- Get Course by ID ----___
export const getCourseById = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const course: ICourse | null = await Course.findById(id);
    if (!course) {
      res.status(404).json({ success: false, message: "Course not found" });
      return;
    }
    res.status(200).json({ success: true, data: course });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch course" });
  }
};

//___---- Create a New Course ----___
export const createCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, category, duration, author } = req.body;

    if (!title || !category || !duration || !author) {
      res.status(400).json({ success: false, message: "Required fields missing" });
      return;
    }

    const imageLocalPath = (req as any).file?.path;
    let imageUrl: string | undefined | null;

    if (imageLocalPath) {
      const uploadedImage = await uploadOnCloudinary(imageLocalPath);
      imageUrl = uploadedImage; // directly assign, no .secure_url
    }
    
    const newCourse: ICourse = await Course.create({
      title,
      description,
      category,
      duration,
      author,
      image: imageUrl,
    });

    res.header("Location", `${req.originalUrl}/${newCourse._id}`);
    res.status(201).json({ success: true, data: newCourse });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, message: "Failed to create course" });
  }
};

//___---- Update Course ----___
export const updateCourse = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData: Partial<ICourse> = req.body;

    const imageLocalPath = (req as any).file?.path;
    if (imageLocalPath) {
      const uploadedImage = await uploadOnCloudinary(imageLocalPath);
      if (uploadedImage) updateData.image = uploadedImage;
    }

    const updatedCourse: ICourse | null = await Course.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedCourse) {
      res.status(404).json({ success: false, message: "Course not found" });
      return;
    }

    res.status(200).json({ success: true, data: updatedCourse });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, message: "Failed to update course" });
  }
};

//___---- Delete Course ----___
export const deleteCourse = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedCourse: ICourse | null = await Course.findByIdAndDelete(id);
    if (!deletedCourse) {
      res.status(404).json({ success: false, message: "Course not found" });
      return;
    }
    res.status(200).json({ success: true, data: deletedCourse });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, message: "Failed to delete course" });
  }
};
