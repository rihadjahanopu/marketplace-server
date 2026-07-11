/**
 * Vercel Serverless Entry Point.
 * Vercel calls this file as a serverless function for every request.
 * DB connection is lazily initialized and reused across warm instances.
 */
import type { IncomingMessage, ServerResponse } from "http";
import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { initAuth } from "../src/lib/auth.js";
import { errorHandler, notFound } from "../src/middleware/errorHandler.js";
import adminRoutes from "../src/routes/admin.js";
import authRoutes from "../src/routes/auth.js";
import itemRoutes from "../src/routes/items.js";
import uploadRoutes from "../src/routes/upload.js";
import { config } from "../src/utils/config.js";
import { connectDB } from "../src/utils/database.js";

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

let initialized = false;

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse
) {
  if (!initialized) {
    await connectDB();
    const auth = await initAuth();

    app.use("/api/auth", toNodeHandler(auth));
    app.use("/api", authRoutes);
    app.use("/api/items", itemRoutes);
    app.use("/api/upload", uploadRoutes);
    app.use("/api/admin", adminRoutes);

    app.use(notFound);
    app.use(errorHandler);

    initialized = true;
  }

  return app(req as any, res as any);
}
