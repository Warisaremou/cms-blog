import dotenv from "dotenv";

dotenv.config();

export const cloudinaryConfig = {
	secure: true,
	cloud_name: process.env.CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
};

