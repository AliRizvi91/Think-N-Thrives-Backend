import { Request, Response } from "express";
import Admission ,{IAdmission} from "../models/Admission.model";
import Course from "../models/course.model";

// ___---- Get All Admissions ----___
// Get All Admissions
export const getAllAdmissions = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const admissions = await Admission.find()
      .populate("selectedCourses", "title category duration author")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: admissions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch admissions",
    });
  }
};


// ___---- Get Admission by ID ----___
export const getAdmissionById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const admission = await Admission.findById(id).populate(
      "selectedCourses",
      "title category duration author"
    );

    if (!admission) {
      res.status(404).json({ message: "Admission not found" });
      return;
    }

    res.status(200).json(admission);
  } catch {
    res.status(500).json({ message: "Failed to fetch admission" });
  }
};

// ___---- Create a New Admission ----___
export const createAdmission = async (
  req: Request<{}, {}, IAdmission>,
  res: Response
): Promise<void> => {
  try {
    const {
      name,
      whatsappNumber,
      selectedCourses,
      educationLevel,
      age,
      referralSource,
    } = req.body;

    if (!name || !whatsappNumber || !selectedCourses || !educationLevel || !age) {
      res.status(400).json({ message: "Required fields missing" });
      return;
    }

    const validCourses = await Course.find({
      _id: { $in: selectedCourses },
    });

    if (validCourses.length !== selectedCourses.length) {
      res
        .status(400)
        .json({ message: "One or more selected courses are invalid" });
      return;
    }

    const admission = await Admission.create({
      name,
      whatsappNumber,
      selectedCourses,
      educationLevel,
      age,
      referralSource,
    });

    res.status(201).json(admission);
  } catch {
    res.status(500).json({ message: "Failed to create admission" });
  }
};

// ___---- Update Admission ----___
export const updateAdmission = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (updateData.selectedCourses) {
      const validCourses = await Course.find({
        _id: { $in: updateData.selectedCourses },
      });

      if (validCourses.length !== updateData.selectedCourses.length) {
        res
          .status(400)
          .json({ message: "One or more selected courses are invalid" });
        return;
      }
    }

    const updatedAdmission = await Admission.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).populate("selectedCourses", "title category duration author");

    if (!updatedAdmission) {
      res.status(404).json({ message: "Admission not found" });
      return;
    }

    res.status(200).json(updatedAdmission);
  } catch {
    res.status(500).json({ message: "Failed to update admission" });
  }
};

// ___---- Delete Admission ----___
export const deleteAdmission = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedAdmission = await Admission.findByIdAndDelete(id);

    if (!deletedAdmission) {
      res.status(404).json({ message: "Admission not found" });
      return;
    }

    res.status(200).json(deletedAdmission);
  } catch {
    res.status(500).json({ message: "Failed to delete admission" });
  }
};
