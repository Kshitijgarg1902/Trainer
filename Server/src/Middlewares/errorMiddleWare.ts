import { Request, Response, NextFunction } from 'express';

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);

  const statusCode = err.statusCode || 500;
  const message =
    statusCode !== 500
      ? err.message
        ? err.message
        : 'Internal Sever Error'
      : 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message: message,
    details: err.details || undefined,
  });
};

export default errorHandler;
