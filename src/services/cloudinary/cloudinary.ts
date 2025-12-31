// services/cloudinary.ts
import { v2 as cloudinary } from "cloudinary";

export const uploadOnCloudinary = async (
  buffer: Buffer
): Promise<string | null> => {
  return new Promise((resolve) => {
    cloudinary.uploader.upload_stream(
      { resource_type: "auto" },
      (error, result) => {
        if (error) return resolve(null);
        resolve(result?.secure_url || null);
      }
    ).end(buffer);
  });
};
