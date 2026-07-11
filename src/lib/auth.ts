import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { betterAuth } from "better-auth";
import { bearer } from "better-auth/plugins";
import { passkey } from "@better-auth/passkey";
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
				clientId: process.env.GOOGLE_CLIENT_ID || "placeholder_client_id",
				clientSecret: process.env.GOOGLE_CLIENT_SECRET || "placeholder_client_secret",
				redirectURI: process.env.GOOGLE_CALLBACK_URL,
			},
		},
		plugins: [
			bearer(),
			passkey({
				rpName: "Marketplace",
				rpID: new URL(config.FRONTEND_URL).hostname, // e.g. "localhost"
				origin: config.FRONTEND_URL, // e.g. "http://localhost:3000"
			}),
		],
		trustedOrigins: [config.FRONTEND_URL, config.BETTER_AUTH_URL],
	});

	return authInstance;
};

export const getAuth = (): ReturnType<typeof betterAuth> => {
	if (!authInstance) {
		throw new Error("Auth is not initialized");
	}

	return authInstance;
};
