import { Router } from "express";
import { prisma } from "../config/db.js";

const router = Router();

router.get("/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: "ok", database: "connected", timestamp: new Date().toISOString() });
  } catch {
    res
      .status(503)
      .json({ status: "error", database: "disconnected", timestamp: new Date().toISOString() });
  }
});

export default router;
