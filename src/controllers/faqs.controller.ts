// controllers/faqController.ts
import { Request, Response } from "express";
import { Faq_Model, IFaq } from "../models/faqs.model";
import { logger } from "../config/logger.config";

//___---- Get All FAQs ----___
export const getAllFaqs = async (req: Request, res: Response): Promise<void> => {
  try {
    const faqs: IFaq[] = await Faq_Model.find().sort({ createdAt: 1 });
    res.status(200).json({ success: true, data: faqs });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch FAQs" });
  }
};

//___---- Get FAQ by ID ----___
export const getFaqById = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const faq: IFaq | null = await Faq_Model.findById(id);
    if (!faq) {
      res.status(404).json({ success: false, message: "FAQ not found" });
      return;
    }
    res.status(200).json({ success: true, data: faq });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch FAQ" });
  }
};

//___---- Create FAQ ----___
export const createFaq = async (req: Request, res: Response): Promise<void> => {
  try {
    const { question, answer } = req.body;
    if (!question || !answer) {
      res.status(400).json({ success: false, message: "Required fields missing" });
      return;
    }
    const newFaq: IFaq = await Faq_Model.create({ question, answer });
    res.status(201).json({ success: true, data: newFaq });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, message: "Failed to create FAQ" });
  }
};

//___---- Update FAQ ----___
export const updateFaq = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData: Partial<IFaq> = req.body;
    const updatedFaq: IFaq | null = await Faq_Model.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedFaq) {
      res.status(404).json({ success: false, message: "FAQ not found" });
      return;
    }
    res.status(200).json({ success: true, data: updatedFaq });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, message: "Failed to update FAQ" });
  }
};

//___---- Delete FAQ ----___
export const deleteFaq = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedFaq: IFaq | null = await Faq_Model.findByIdAndDelete(id);
    if (!deletedFaq) {
      res.status(404).json({ success: false, message: "FAQ not found" });
      return;
    }
    res.status(200).json({ success: true, data: deletedFaq });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, message: "Failed to delete FAQ" });
  }
};
