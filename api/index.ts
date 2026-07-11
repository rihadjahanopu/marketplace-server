/**
 * Vercel Serverless Entry Point.
 * Vercel calls this file as a serverless function for every request.
 * DB connection is lazily initialized and reused across warm instances.
 */
import type { IncomingMessage, ServerResponse } from "http";
import app from "../src/server.js";
import { connectDB } from "../src/utils/database.js";

let dbPromise: Promise<void> | null = null;

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse
) {
  // If Vercel rewrote the URL and stripped '/api', add it back.
  // Express app expects paths like /api/items.
  if (req.url && !req.url.startsWith("/api")) {
    req.url = `/api${req.url === "/" ? "" : req.url}`;
  }

  // Ensure DB connection is established exactly once
  if (!dbPromise) {
    dbPromise = connectDB();
  }
  await dbPromise;

  return app(req as any, res as any);
}
