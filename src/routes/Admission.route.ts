// routes/AdmissionRoutes.ts
import { Router } from "express";
import {
  getAllAdmissions,
  getAdmissionById,
  createAdmission,
  updateAdmission,
  deleteAdmission,
} from "../controllers/admission.controller";

const AdmissionRouter = Router();

AdmissionRouter.get("/", getAllAdmissions);
AdmissionRouter.post("/", createAdmission);

AdmissionRouter.get("/:id", getAdmissionById);
AdmissionRouter.put("/:id", updateAdmission);
AdmissionRouter.delete("/:id", deleteAdmission);

export default AdmissionRouter;
