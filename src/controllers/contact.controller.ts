// controllers/contactController.ts
import { Request, Response } from "express";
import { Contact_Model, IContact } from "../models/contact.model";

//___---- Get All Contacts ----___
export const getAllContacts = async (req: Request, res: Response): Promise<void> => {
  try {
    const contacts: IContact[] = await Contact_Model.find().sort({ createdAt: -1 }); // latest first
    res.status(200).json({ success: true, data: contacts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch contacts" });
  }
};

//___---- Get Contact by ID ----___
export const getContactById = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const contact: IContact | null = await Contact_Model.findById(id);
    if (!contact) {
      res.status(404).json({ success: false, message: "Contact not found" });
      return;
    }
    res.status(200).json({ success: true, data: contact });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch contact" });
  }
};

//___---- Create Contact ----___
export const createContact = async (req: Request<{}, {}, IContact>, res: Response): Promise<void> => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      res.status(400).json({ success: false, message: "Required fields missing" });
      return;
    }

    const newContact: IContact = await Contact_Model.create({ name, email, phone, message });
    res.status(201).json({ success: true, data: newContact });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to create contact" });
  }
};

//___---- Update Contact ----___
export const updateContact = async (req: Request<{ id: string }, {}, Partial<IContact>>, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData: Partial<IContact> = req.body;

    const updatedContact: IContact | null = await Contact_Model.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedContact) {
      res.status(404).json({ success: false, message: "Contact not found" });
      return;
    }

    res.status(200).json({ success: true, data: updatedContact });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to update contact" });
  }
};

//___---- Delete Contact ----___
export const deleteContact = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedContact: IContact | null = await Contact_Model.findByIdAndDelete(id);
    if (!deletedContact) {
      res.status(404).json({ success: false, message: "Contact not found" });
      return;
    }

    res.status(200).json({ success: true, data: deletedContact });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to delete contact" });
  }
};
