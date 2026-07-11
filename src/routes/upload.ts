import { Router, Request, Response } from "express";
import { authMiddleware } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { cloudinary } from "../utils/cloudinary.js";
import { asyncHandler } from "../middleware/errorHandler.js";

const router = Router();

router.post(
	"/",
	authMiddleware,
	upload.array("images", 5), // Max 5 images at a time
	asyncHandler(async (req: Request, res: Response): Promise<void> => {
		const files = req.files as Express.Multer.File[];

		if (!files || files.length === 0) {
			res.status(400).json({ success: false, message: "No files uploaded" });
			return;
		}

		try {
			const uploadPromises = files.map((file) => {
				return new Promise<string>((resolve, reject) => {
					const uploadStream = cloudinary.uploader.upload_stream(
						{ folder: "marketplace_items" },
						(error, result) => {
							if (error) {
								reject(error);
							} else if (result) {
								resolve(result.secure_url);
							} else {
								reject(new Error("Unknown upload error"));
							}
						}
					);
					uploadStream.end(file.buffer);
				});
			});

			const urls = await Promise.all(uploadPromises);

			res.status(200).json({
				success: true,
				urls,
			});
		} catch (error) {
			console.error("Cloudinary upload error:", error);
			res
				.status(500)
				.json({ success: false, message: "Error uploading to Cloudinary" });
		}
	})
);

export default router;
