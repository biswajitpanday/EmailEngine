import { Request, Response, NextFunction } from "express";
import logger from "./Logger";

class ApplicationError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

class ValidationError extends ApplicationError {
  constructor(message: string) {
    super(message, 400);
    this.name = "ValidationError";
  }
}

class AuthenticationError extends ApplicationError {
  constructor(message: string) {
    super(message, 401);
    this.name = "AuthenticationError";
  }
}

class NotFoundError extends ApplicationError {
  constructor(message: string) {
    super(message, 404);
    this.name = "NotFoundError";
  }
}

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(err.message, { stack: err.stack });

  if (err instanceof ApplicationError) {
    return res.status(err.statusCode).json({ error: err.message });
  }
  res.status(500).json({ error: "Internal Server Error" });
};

export { errorHandler, ValidationError, AuthenticationError, NotFoundError };
