export class AppError extends Error {
  statusCode: number;
  details?: { message: string }[];

  constructor(message: string, statusCode: number = 500, details?: { message: string }[]) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}
