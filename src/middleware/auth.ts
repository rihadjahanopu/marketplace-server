import { NextFunction, Request, Response } from "express";
import { getAuth } from "../lib/auth.js";

declare global {
	namespace Express {
		interface Request {
			user?: {
				id: string;
				email: string;
				name?: string;
				role: "user" | "admin";
			};
		}
	}
}

export const authMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const auth = await getAuth();
		const session = await auth.api.getSession({
			headers: new Headers(req.headers as Record<string, string>),
		});

		if (!session?.user) {
			res
				.status(401)
				.json({ success: false, message: "Access denied. No token provided." });
			return;
		}

		req.user = {
			id: session.user.id,
			email: session.user.email,
			name: session.user.name,
			role: (session.user as any).role as "user" | "admin",
		};
		next();
	} catch {
		res.status(401).json({ success: false, message: "Invalid token" });
	}
};

export const optionalAuth = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const auth = await getAuth();
		const session = await auth.api.getSession({
			headers: new Headers(req.headers as Record<string, string>),
		});

		if (session?.user) {
			req.user = {
				id: session.user.id,
				email: session.user.email,
				name: session.user.name,
				role: (session.user as any).role as "user" | "admin",
			};
		}
		next();
	} catch {
		next();
	}
};

export const isAdmin = (
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	if (!req.user || req.user.role !== "admin") {
		res.status(403).json({ success: false, message: "Admin access required" });
		return;
	}
	next();
};
