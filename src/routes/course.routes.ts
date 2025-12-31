// routes/courseRoutes.ts
import { Router } from "express";
import {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../controllers/course.controller";
import { upload } from "../middlewares/multerMiddleware";

const CourseRouter = Router();

CourseRouter.get("/", getAllCourses);
CourseRouter.post("/", upload.single("image"), createCourse);

CourseRouter.get("/:id", getCourseById);
CourseRouter.put("/:id", upload.single("image"), updateCourse);
CourseRouter.delete("/:id", deleteCourse);

export default CourseRouter;
