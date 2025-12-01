import { Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class ResponseUtil {
  static success<T>(
    res: Response,
    data: T,
    message?: string,
    statusCode: number = 200
  ): Response {
    const response: ApiResponse<T> = {
      success: true,
      data,
      message,
    };
    return res.status(statusCode).json(response);
  }

  static error(
    res: Response,
    message: string,
    statusCode: number = 400,
    error?: any
  ): Response {
    const response: ApiResponse = {
      success: false,
      message,
      error: error?.message || error,
    };
    return res.status(statusCode).json(response);
  }

  static paginated<T>(
    res: Response,
    data: T[],
    page: number,
    limit: number,
    total: number,
    message?: string
  ): Response {
    const totalPages = Math.ceil(total / limit);
    const response: ApiResponse<T[]> = {
      success: true,
      data,
      message,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
    return res.status(200).json(response);
  }
}

