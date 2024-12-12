import { v2 as cloudinary } from "cloudinary";
import { cloudinaryConfig } from "../config/cloudinary.js";

cloudinary.config(cloudinaryConfig);

export const uploadToCloudinary = async (imagePath) => {
	const uploadResult = await cloudinary.uploader.upload(imagePath).catch((error) => {
		console.log(error);
	});
	return uploadResult;
};
