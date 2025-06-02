const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");
const logger = require("../utils/logger");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload an image to Cloudinary
 * @param {string} filePath - Path to the image file
 * @returns {Promise<string>} Cloudinary URL of the uploaded image
 */

const uploadImage = async (filePath) => {
  try {
    // Skip upload in test environment
    if (process.env.NOVE_ENV === "test") {
      return `https://res.cloudinary.com/demo/image/upload/test-image-${Date.now()}.jpg`;
    }

    const result = await cloudinary.uploader.upload(filePath, {
      folder: "bien-unido/reports",
      use_filename: true,
      unique_filename: true,
      overwrite: false,
    });

    // Remove file from local storage after upload
    fs.unlink(filePath, (err) => {
      if (err) logger.error("Error removing temp file: ", err);
    });

    return result.secure_url;
  } catch (error) {
    logger.error("Cloudinary upload error:", error);
    throw new Error("Failed to upload image");
  }
};

/**
 * Delete an image from Cloudinary
 * @param {string} imageUrl - Cloudinary URL of the image to delete
 * @returns {Promise<boolean>} True if deletion was successful
 */

const deleteImage = async (imageUrl) => {
  try {
    // Extract public ID from URL
    // Example URL: https://res.cloudinary.com/demo/image/upload/v1234567890/folder/filename.jpg
    const urlParts = imageUrl.split("/");
    const filenameWithExt = urlParts[urlParts.length - 1];
    const publicId = `bien-unido/reports/${path.parse(filenameWithExt).name}`;

    // Skip in test environment
    if (process.env.NODE_ENV === "test") {
      return true;
    }

    await cloudinary.uploader.destroy(publicId);
    return true;
  } catch (error) {
    logger.error("Cloudinary delete error:", error);
    throw new Error("Failed to delete image");
  }
};

module.exports = {
  uploadImage,
  deleteImage,
};
