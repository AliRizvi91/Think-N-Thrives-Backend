// routes/faqRoutes.ts
import { Router } from "express";
import {
  getAllFaqs,
  getFaqById,
  createFaq,
  updateFaq,
  deleteFaq,
} from "../controllers/faqs.controller";

const FaqRouter = Router();

FaqRouter.get("/", getAllFaqs);
FaqRouter.post("/", createFaq);

FaqRouter.get("/:id", getFaqById);
FaqRouter.put("/:id", updateFaq);
FaqRouter.delete("/:id", deleteFaq);

export default FaqRouter;
