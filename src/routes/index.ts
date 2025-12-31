import { Router } from "express";
import type { Request, Response } from "express";
import AdmissionRoutes from "./Admission.route";
import contactRoutes from "./contact.routes";
import courseRoutes from "./course.routes";
import faqRoutes from "./faq.routes";
import reviewRoutes from "./review.routes";
import userRoutes from "./user.router";

const router = Router();

router.use("/api/studio/admission", AdmissionRoutes);
router.use("/api/studio/contact", contactRoutes);
router.use("/api/studio/course", courseRoutes);
router.use("/api/studio/faqs", faqRoutes);
router.use("/api/studio/review", reviewRoutes);
router.use("/api/studio/user", userRoutes);

router.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "healthy" });
});

router.get("/", (_req: Request, res: Response) => {
  res.json({
    message: "Welcome to Think & Thrive Studio API",
    status: "operational",
  });
});

export default router;
