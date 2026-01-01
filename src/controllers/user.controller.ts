import type { Request, Response } from "express";
import { User_Model } from "../models/user.model";
import crypto from "crypto";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt, { type SignOptions } from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import fs from "fs";


import { uploadOnCloudinary } from "../services/cloudinary/cloudinary";
import { sendmailer } from "../services/sendMails/mail";
import { sendPasswordResetEmail } from "../services/sendMails/resetPassword";

dotenv.config();

interface AddUserBody {
  image?: string;
  username: string;
  email: string;
  password: string;
  role?: "admin" | "user";
}
interface UserParams {
  id: string;
}
// Google OAuth client
const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "postmessage"
);

// 🔐 Token generator
const generateToken = (id: string, role?: string): string => {
  const secret = process.env.JWT_SECRET_KEY as string;
  const options: SignOptions = {
    expiresIn: (process.env.JWT_Expiry_Time ?? "3d") as any,
  };
  return jwt.sign({ id, role }, secret, options);
};

// ================= GET ALL USERS =================
export const getAllUsers = async (
  _req: Request,
  res: Response
): Promise<Response> => {
  try {
    const users = await User_Model.find();
    return res.status(200).json({ success: true, data: users });
  } catch {
    return res.status(500).json({ success: false, message: "Failed to get all users" });
  }
};

// ================= GET USER =================
export const getUser = async (
  req: Request<UserParams>,
  res: Response
): Promise<Response> => {
  try {
    const user = await User_Model.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    return res.status(200).json({ success: true, data: user });
  } catch {
    return res.status(500).json({ success: false, message: "Failed to get user" });
  }
};

// ================= ADD USER =================
export const addUser = async (req: Request, res: Response) => {
  try {

    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }


    const file = req.file as Express.Multer.File | undefined;
    let imageUrl: string | undefined;

if (file) {
  const uploaded = await uploadOnCloudinary(file.buffer);
  imageUrl = uploaded ?? undefined;
}


    const user = await User_Model.create({
      username,
      email,
      password,
      role,
      image: imageUrl,
    });

    return res.status(201).json({
      user,
      token: generateToken(user._id.toString(), user.role),
    });
  } catch (error) {
    console.error("SIGNUP ERROR:", error);
    return res.status(500).json({ message: "Signup failed" });
  }
};


// ================= DELETE USER =================
export const deleteUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const user = await User_Model.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    return res.status(200).json({ success: true, data: user });
  } catch {
    return res.status(500).json({ success: false, message: "Failed to delete user" });
  }
};

// ================= LOGIN =================
export const Login = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { email, password } = req.body;

    const user = await User_Model.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken(user._id.toString(), user.role);
    await sendmailer(email, token, user.username);

    return res.status(200).json({ success: true, message: "Login successful", token });
  } catch {
    return res.status(500).json({ success: false, message: "Login failed" });
  }
};

// ================= TOKEN VERIFY =================

export async function TokenVerification(req: Request, res: Response) {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Token is required",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY as string
    ) as { id: string };

    const user = await User_Model.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ✅ MATCH FRONTEND EXPECTATION
    return res.status(200).json({
      success: true,
      message: "Token verified successfully",
      data: {
        user,
        token,
      },
    });
  } catch (error: any) {
    let message = "Token verification failed";

    if (error.name === "JsonWebTokenError") {
      message = "Invalid token";
    } else if (error.name === "TokenExpiredError") {
      message = "Token expired";
    }

    return res.status(401).json({
      success: false,
      message,
    });
  }
}



// ================= GOOGLE LOGIN =================
export const googleLogin = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { tokens } = await client.getToken(req.body.code);

    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token as string,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload?.email) return res.status(403).json({ success: false, message: "Invalid Google payload" });

    let user = await User_Model.findOne({ email: payload.email });
    if (!user) {
      user = await User_Model.create({
        username: payload.name,
        email: payload.email,
        image: payload.picture ?? undefined,
      });
    }

    const token = generateToken(user._id.toString(), user.role);
    return res.status(200).json({ success: true, user, token });
  } catch {
    return res.status(500).json({ success: false, message: "Google login failed" });
  }
};

// ================= RESET PASSWORD =================
export const ResetPassword = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const decoded = jwt.verify(
      req.body.token,
      process.env.JWT_SECRET_KEY as string
    ) as { id: string };

    const user = await User_Model.findById(decoded.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    user.password = req.body.password;
    await user.save();

    return res.status(200).json({ success: true, message: "Password reset successful" });
  } catch {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

// ================= UPDATE USER =================
export const updateUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const user = await User_Model.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    Object.assign(user, req.body);
    await user.save();

    return res.status(200).json({ success: true, data: user });
  } catch {
    return res.status(500).json({ success: false, message: "Failed to update user" });
  }
};
