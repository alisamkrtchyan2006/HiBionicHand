import { Request, Response, NextFunction } from 'express';
import { ResponseUtil } from '../utils/response.util';
import { Prisma } from '@prisma/client';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', err);

  // Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      ResponseUtil.error(res, 'Duplicate entry. This record already exists.', 409);
      return;
    }
    if (err.code === 'P2025') {
      ResponseUtil.error(res, 'Record not found', 404);
      return;
    }
  }

  // Default error
  const statusCode = (err as any).statusCode || 500;
  const message = err.message || 'Internal server error';

  ResponseUtil.error(res, message, statusCode);
};

