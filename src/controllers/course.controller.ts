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

export const createCourse = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { title, description, category, duration, author } = req.body;

    if (!title || !category || !duration || !author) {
      res
        .status(400)
        .json({ success: false, message: "Required fields missing" });
      return;
    }
    const file = req.file as Express.Multer.File | undefined;
    let imageUrl: string | undefined;

if (file) {
  const uploaded = await uploadOnCloudinary(file.buffer);
  imageUrl = uploaded ?? undefined;
}

  

    const newCourse = await Course.create({
      title,
      description,
      category,
      duration,
      author,
      image: imageUrl,
    });

    res
      .status(201)
      .location(`${req.originalUrl}/${newCourse._id}`)
      .json({ success: true, data: newCourse });
  } catch (error) {
    logger.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to create course" });
  }
};


//___---- Update Course ----___
export const updateCourse = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const {
      title,
      description,
      category,
      duration,
      author,
    } = req.body;

    const updateData: Partial<ICourse> = {};

    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (category) updateData.category = category;
    if (duration) updateData.duration = duration;
    if (author) updateData.author = author;

    // ✅ handle image upload
    const file = req.file as Express.Multer.File | undefined;

    if (file) {
      const uploadedUrl = await uploadOnCloudinary(file.buffer);
      if (uploadedUrl) {
        updateData.image = uploadedUrl; // ✅ IMPORTANT FIX
      }
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      { $set: updateData }, // ✅ safer update
      { new: true, runValidators: true }
    );

    if (!updatedCourse) {
      res.status(404).json({
        success: false,
        message: "Course not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: updatedCourse,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to update course",
    });
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
