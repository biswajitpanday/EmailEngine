import { Request, Response, NextFunction } from "express";
import logger from "./Logger";

class ApplicationError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

class ValidationError extends ApplicationError {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

class AuthenticationError extends ApplicationError {
  constructor(message: string) {
    super(message);
    this.name = "AuthenticationError";
  }
}

class NotFoundError extends ApplicationError {
  constructor(message: string) {
    super(message);
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

  if (err instanceof ValidationError) {
    return res.status(400).json({ error: err.message });
  }

  if (err instanceof AuthenticationError) {
    return res.status(401).json({ error: err.message });
  }

  if (err instanceof NotFoundError) {
    return res.status(404).json({ error: err.message });
  }
  // For other types of errors, you can handle them similarly
  // e.g., DatabaseError, NotFoundError, etc.

  res.status(500).json({ error: "Internal Server Error" });
};

export { errorHandler, ValidationError, AuthenticationError, NotFoundError };
