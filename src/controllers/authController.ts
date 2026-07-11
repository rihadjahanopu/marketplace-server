import { Request, Response } from "express";
import { getAuth } from "../lib/auth.js";
import { asyncHandler } from "../middleware/errorHandler.js";

export const register = asyncHandler(
	async (req: Request, res: Response): Promise<void> => {
		const auth = await getAuth();
		const result = await auth.api.signUpEmail({
			body: req.body,
			headers: new Headers(req.headers as Record<string, string>),
		});

		res.status(200).json({
			success: true,
			message: "Account created successfully",
			token: result.token,
			user: {
				id: result.user.id,
				name: result.user.name,
				email: result.user.email,
				image: (result.user as any).image || null,
				role: (result.user as any).role || "user",
			},
		});
	}
);

export const login = asyncHandler(
	async (req: Request, res: Response): Promise<void> => {
		const auth = await getAuth();
		const result = await auth.api.signInEmail({
			body: req.body,
			headers: new Headers(req.headers as Record<string, string>),
		});

		res.status(200).json({
			success: true,
			message: "Login successful",
			token: result.token,
			user: {
				id: result.user.id,
				name: result.user.name,
				email: result.user.email,
				image: (result.user as any).image || null,
				role: (result.user as any).role || "user",
			},
		});
	}
);

export const getMe = asyncHandler(
	async (req: Request, res: Response): Promise<void> => {
		const auth = await getAuth();
		const session = await auth.api.getSession({
			headers: new Headers(req.headers as Record<string, string>),
		});

		if (!session || !session.user) {
			res.status(401).json({ success: false, message: "Not authenticated" });
			return;
		}

		res.status(200).json({
			success: true,
			user: {
				id: session.user.id,
				name: session.user.name,
				email: session.user.email,
				image: (session.user as any).image || null,
				role: (session.user as any).role || "user",
				createdAt: session.user.createdAt,
			},
		});
	}
);
