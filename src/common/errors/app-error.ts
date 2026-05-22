/**
 * AppError is a custom error class that extends the built-in Error class.
 * It includes additional properties such as statusCode and code to provide more context about the error.
 * This class can be used throughout the application to throw consistent and informative errors.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string | null;

  constructor(statusCode: number, message: string, code: string | null = null) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;

    Error.captureStackTrace(this, this.constructor);
  }
}
