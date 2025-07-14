import { Response } from "express";

export function handleControllerError(error: unknown, res: Response, message: string) {
  console.error(`${message}:`, error);
  res.status(500).json({
    error: message,
    message: error instanceof Error ? error.message : "Unknown error"
  });
}
