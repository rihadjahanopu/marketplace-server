import dotenv from "dotenv";
dotenv.config();

export const config = {
	PORT: process.env.PORT || 5000,
	MONGODB_URI:
		process.env.MONGODB_URI || "mongodb://localhost:27017/marketplace",
	JWT_SECRET:
		process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production",
	JWT_EXPIRE: process.env.JWT_EXPIRE || "7d",
	NODE_ENV: process.env.NODE_ENV || "development",
	FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",
	BETTER_AUTH_SECRET:
		process.env.BETTER_AUTH_SECRET || "change-me-to-a-long-random-secret",
	BETTER_AUTH_URL: process.env.BETTER_AUTH_URL || "http://localhost:5000",
	CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || "",
	CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || "",
	CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || "",
};
