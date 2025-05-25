import type {
  ErrorRequestHandler,
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from 'express';
import { StatusCodes } from 'http-status-codes';
import {
  PrismaClientKnownRequestError,
  PrismaClientRustPanicError,
  PrismaClientInitializationError,
  PrismaClientUnknownRequestError,
} from '@prisma/client/runtime/library';
import jwt from 'jsonwebtoken';
import { ServiceResponse } from '../models/serviceResponse';
import { ZodError } from 'zod';

export class AppError extends Error {
  statusCode: number;
  data?: any;

  constructor(statusCode: number, message: string, data?: any) {
    super(message);
    this.statusCode = statusCode;
    this.data = data;
    Error.captureStackTrace(this, this.constructor);
  }
}

const logError = (err: Error) => {
  console.log('\x1b[31m%s\x1b[0m', '=============== ERROR ==============');
  console.log(new Date().toLocaleString());
  console.log('\x1b[31m%s\x1b[0m', '====================================');
  console.log('\x1b[33m%s\x1b[0m', 'Name:', err.name || 'Unknown Error');
  console.log('\x1b[33m%s\x1b[0m', 'Message:', err.message);
  console.log('\x1b[31m%s\x1b[0m', '====================================');
};

const handlePrismaError = (
  err: PrismaClientKnownRequestError,
  res: Response
) => {
  const errorMap: Record<string, { status: number; message: string }> = {
    P2002: { status: 409, message: 'Duplicate field, constraint violation' },
    P2003: { status: 409, message: 'Key Constraint' },
    P2005: { status: 409, message: 'Resource not found' },
    default: { status: 500, message: 'Database error' },
  };

  const { status, message } = errorMap[err.code] || errorMap.default;
  const response = ServiceResponse.failure(message, err, status);
  return res.status(status).json(response);
};

const handleJWTError = (err: Error, res: Response) => {
  let message = 'Authentication error';

  if (err instanceof jwt.JsonWebTokenError) {
    message = `${err.message}, please re-login`;
  } else if (err instanceof jwt.NotBeforeError) {
    message = 'Token is not active, please re-login';
  } else if (err instanceof jwt.TokenExpiredError) {
    message = 'Token is expired, please re-login';
  }

  const response = ServiceResponse.failure(
    message,
    err,
    StatusCodes.UNAUTHORIZED
  );
  return res.status(401).json(response);
};

export const unexpectedRequest: RequestHandler = (_req, res) => {
  res.status(StatusCodes.NOT_FOUND).json({
    ...ServiceResponse.failure(
      'Not Found',
      'Route not found',
      StatusCodes.NOT_FOUND
    ),
    docs: '/api-docs',
  });
};

export const errorMiddleware: ErrorRequestHandler = (
  err: Error,
  _req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (res.headersSent) {
    return next(err);
  }

  logError(err);

  if (
    err instanceof PrismaClientKnownRequestError ||
    err instanceof PrismaClientUnknownRequestError ||
    err instanceof PrismaClientInitializationError ||
    err instanceof PrismaClientRustPanicError
  ) {
    handlePrismaError(err as PrismaClientKnownRequestError, res);
    return;
  }

  if (
    err instanceof jwt.JsonWebTokenError ||
    err instanceof jwt.NotBeforeError ||
    err instanceof jwt.TokenExpiredError
  ) {
    handleJWTError(err, res);
    return;
  }

  if (err instanceof Error && err.name === 'TypeError') {
    const response = ServiceResponse.failure(
      'type error',
      err,
      StatusCodes.BAD_REQUEST
    );
    res.status(StatusCodes.BAD_REQUEST).json(response);
    return;
  }

  if (err instanceof ZodError) {
    const response = ServiceResponse.failure(
      'validation error',
      err.errors,
      StatusCodes.UNPROCESSABLE_ENTITY
    );
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).json(response);
    return;
  }

  if (err instanceof AppError) {
    const response = ServiceResponse.failure(err.message, err, err.statusCode);
    res.status(err.statusCode).json(response);
    return;
  }

  const response = ServiceResponse.failure(
    'something went wrong',
    err,
    StatusCodes.INTERNAL_SERVER_ERROR
  );

  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response);
};
