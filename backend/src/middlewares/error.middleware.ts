import type { NextFunction, Request, Response } from "express";

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode = 500,
  ) {
    super(message);
  }
}

export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ status: "error", message: err.message });
    return;
  }

  console.error("[ERROR]", err);
  res.status(500).json({ status: "error", message: "Error interno del servidor" });
};
