import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { betterAuth } from "better-auth";
import { bearer } from "better-auth/plugins";
import mongoose from "mongoose";
import { config } from "../utils/config.js";

let authInstance: any = null;

export const initAuth = async () => {
	if (authInstance) {
		return authInstance;
	}

	if (!mongoose.connection.db) {
		throw new Error("MongoDB connection is not ready");
	}

	authInstance = betterAuth({
		baseURL: config.BETTER_AUTH_URL,
		secret: config.BETTER_AUTH_SECRET,
		database: mongodbAdapter(mongoose.connection.db, { transaction: false }),
		user: {
			additionalFields: {
				role: {
					type: "string",
					required: true,
					defaultValue: "user",
				},
			},
		},
		emailAndPassword: {
			enabled: true,
			minPasswordLength: 6,
		},
		socialProviders: {
			google: {
				clientId: config.GOOGLE_CLIENT_ID,
				clientSecret: config.GOOGLE_CLIENT_SECRET,
			}
		},
		plugins: [
			bearer(),
		],
		trustedOrigins: [config.FRONTEND_URL, config.BETTER_AUTH_URL],
		advanced: {
			crossSubDomainCookies: {
				enabled: true,
			},
			defaultCookieAttributes: {
				sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
				secure: process.env.NODE_ENV === "production",
			},
		},
	});

	return authInstance;
};

export const getAuth = (): ReturnType<typeof betterAuth> => {
	if (!authInstance) {
		throw new Error("Auth is not initialized");
	}

	return authInstance;
};
