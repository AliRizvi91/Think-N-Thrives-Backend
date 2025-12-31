import { Router, Request, Response } from "express";
import { upload } from "../middlewares/multerMiddleware";
import { protect } from "../middlewares/authMiddleware";
import {
  getAllUsers,
  getUser,
  addUser,
  deleteUser,
  Login,
  googleLogin,
  TokenVerification,
  ResetPassword,
  updateUser,
} from "../controllers/user.controller";

// Custom Request type
interface AuthRequest extends Request {
  user?: {
    id: string;
    email?: string;
    role?: string;
  };
}

const User_R = Router();

// ___---- Get All Users ----___
User_R.get("/", getAllUsers);

// ___---- Signup ----___
User_R.post("/signup", upload.single("image"), addUser);


// ___---- Profile ----___
User_R.get("/profile", protect, (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({
      message: "Unauthorized - No user data found",
    });
  }
  res.status(200).json({
    user: req.user,
  });
});

// ___---- Auth & Tokens ----___
User_R.post("/login", Login);
User_R.post("/google-login", googleLogin);
User_R.post("/reset-password", ResetPassword);
User_R.post("/verify-token", TokenVerification);

// ___---- CRUD by Id ----___
User_R.get("/:id", getUser);
User_R.delete("/:id", deleteUser);
User_R.put("/:id", upload.single("image"), updateUser);

export default User_R;
