import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECERET_KEY,
});

// Function to upload file to Cloudinary

export const uploadOnCloudinary = async (buffer: Buffer) => {
  return new Promise<string | null>((resolve) => {
    cloudinary.uploader.upload_stream(
      { resource_type: "auto" },
      (error, result) => {
        if (error) {
          console.error("Cloudinary Error:", error);
          return resolve(null);
        }
        resolve(result?.secure_url || null);
      }
    ).end(buffer);
  });
};
