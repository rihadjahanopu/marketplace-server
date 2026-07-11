import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { initAuth } from "./lib/auth.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import adminRoutes from "./routes/admin.js";
import authRoutes from "./routes/auth.js";
import itemRoutes from "./routes/items.js";
import uploadRoutes from "./routes/upload.js";
import { config } from "./utils/config.js";
import { connectDB } from "./utils/database.js";

const app = express();

app.use(helmet());
app.use(
	cors({
		origin: config.FRONTEND_URL,
		credentials: true,
	})
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));


app.get("/api/health", (_req, res) => {
	res.status(200).json({ success: true, message: "Server is running" });
});

// Attach auth dynamically to wait for DB connection
app.use("/api/auth", async (req, res, next) => {
	try {
		const auth = await initAuth();
		return toNodeHandler(auth)(req, res);
	} catch (err) {
		next(err);
	}
});

app.use("/api", authRoutes); // mounts /me at /api/me
app.use("/api/items", itemRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/admin", adminRoutes);

app.use(notFound);
app.use(errorHandler);

if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
	const start = async () => {
		await connectDB();
		app.listen(config.PORT, () => {
			console.log(`Server running on port ${config.PORT}`);
		});
	};
	start();
}

export default app;
