// routes/contactRoutes.ts
import { Router } from "express";
import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from "../controllers/contact.controller";

const ContactRouter = Router();

ContactRouter.get("/", getAllContacts);
ContactRouter.post("/", createContact);

ContactRouter.get("/:id", getContactById);
ContactRouter.put("/:id", updateContact);
ContactRouter.delete("/:id", deleteContact);

export default ContactRouter;
