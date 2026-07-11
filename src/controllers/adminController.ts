import { Request, Response } from "express";
import mongoose from "mongoose";
import { asyncHandler } from "../middleware/errorHandler.js";
import { Item } from "../models/Item.js";

// Utility to get the user collection
const getUserCollection = () => mongoose.connection.db!.collection("user");
const getSessionCollection = () => mongoose.connection.db!.collection("session");
const getAccountCollection = () => mongoose.connection.db!.collection("account");

export const getUsers = asyncHandler(
	async (_req: Request, res: Response): Promise<void> => {
		const users = await getUserCollection().find({}).toArray();

		// We shouldn't send passwords back
		const safeUsers = users.map((user) => ({
			id: user._id,
			name: user.name,
			email: user.email,
			role: user.role || "user",
			createdAt: user.createdAt,
			emailVerified: user.emailVerified,
		}));

		res.status(200).json({
			success: true,
			users: safeUsers,
		});
	}
);

export const updateUserRole = asyncHandler(
	async (req: Request, res: Response): Promise<void> => {
		const { id } = req.params;
		const { role } = req.body;

		if (!["user", "admin"].includes(role)) {
			res.status(400).json({ success: false, message: "Invalid role" });
			return;
		}

		if (req.user?.id === id) {
			res.status(400).json({ success: false, message: "You cannot change your own role" });
			return;
		}

		const result = await getUserCollection().findOneAndUpdate(
			{ _id: new mongoose.Types.ObjectId(id) },
			{ $set: { role, updatedAt: new Date() } },
			{ returnDocument: "after" }
		);

		if (!result) {
			res.status(404).json({ success: false, message: "User not found" });
			return;
		}

		res.status(200).json({
			success: true,
			message: "User role updated successfully",
			user: {
				id: result._id,
				name: result.name,
				email: result.email,
				role: result.role,
			},
		});
	}
);

export const deleteUser = asyncHandler(
	async (req: Request, res: Response): Promise<void> => {
		const { id } = req.params;

		if (req.user?.id === id) {
			res.status(400).json({ success: false, message: "You cannot delete yourself" });
			return;
		}

		const objectId = new mongoose.Types.ObjectId(id);

		// Delete user from BetterAuth collections
		const deleteUserResult = await getUserCollection().deleteOne({ _id: objectId });
		
		if (deleteUserResult.deletedCount === 0) {
			res.status(404).json({ success: false, message: "User not found" });
			return;
		}

		// Cleanup associated auth data
		await Promise.all([
			getSessionCollection().deleteMany({ userId: id }),
			getAccountCollection().deleteMany({ userId: id }),
		]);

		res.status(200).json({
			success: true,
			message: "User deleted successfully",
		});
	}
);

// ── Admin Item Management ──────────────────────────────────────────────────────

export const getAllItems = asyncHandler(
	async (_req: Request, res: Response): Promise<void> => {
		const items = await Item.find({})
			.populate("createdBy", "name email")
			.sort({ createdAt: -1 })
			.lean();

		res.status(200).json({ success: true, items });
	}
);

export const adminDeleteItem = asyncHandler(
	async (req: Request, res: Response): Promise<void> => {
		const { id } = req.params;
		const item = await Item.findByIdAndDelete(id);

		if (!item) {
			res.status(404).json({ success: false, message: "Item not found" });
			return;
		}

		res.status(200).json({ success: true, message: "Item deleted successfully" });
	}
);
