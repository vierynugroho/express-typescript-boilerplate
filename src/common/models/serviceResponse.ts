import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

export class ServiceResponse<T = null> {
  readonly meta?: {
    statusCode: number;
    message: string;
    detail?: string;
  };
  readonly data?: T;
  readonly errors?: {
    name?: string;
    type?: string;
    message: string;
    detail?: string;
    statusCode?: number;
  };
  readonly statusCode: number;

  private constructor(response: {
    meta?: {
      statusCode: number;
      message: string;
      detail?: string;
    };
    data?: T;
    errors?: {
      time?: Date | string;
      name?: string;
      type?: string;
      message: string;
      detail?: string;
      statusCode?: number;
    };
  }) {
    this.meta = response.meta;
    this.data = response.data as T;
    this.errors = response.errors;
    this.statusCode =
      response.meta?.statusCode || response.errors?.statusCode || 0;
  }

  static success<T>(
    message: string,
    data: T,
    statusCode: number = StatusCodes.OK
  ) {
    return new ServiceResponse<T>({
      meta: {
        statusCode,
        message,
        detail: undefined,
      },
      data,
    });
  }

  static failure<T>(
    message: string,
    error?: any,
    statusCode: number = StatusCodes.BAD_REQUEST
  ) {
    return new ServiceResponse<T>({
      errors: {
        time: new Date().toLocaleString(),
        statusCode: statusCode,
        name: error?.name || 'Error',
        type: error?.type,
        message: message || 'Error has occurred',
        detail: error?.stack || error || error?.message,
      },
    });
  }
}

export const ServiceResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    message: z.string(),
    responseObject: dataSchema.optional(),
  });
