import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, {
  NextFunction,
  type Request,
  type Response,
  type Router,
} from 'express';
import { z } from 'zod';
import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { ServiceResponse } from '@/common/models/serviceResponse';
import prismaClient from '@/config/prisma';

export const healthCheckRegistry = new OpenAPIRegistry();
export const healthCheckRouter: Router = express.Router();

healthCheckRegistry.registerPath({
  method: 'get',
  path: '/health-check',
  tags: ['Health Check'],
  responses: createApiResponse(z.null(), 'Success'),
});

healthCheckRouter.get(
  '/',
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      await prismaClient.$queryRaw`SELECT 1`;

      const serviceResponse = ServiceResponse.success(
        'Service is healthy, database connection successful',
        null
      );
      res.status(serviceResponse.statusCode).send(serviceResponse);
    } catch (error) {
      console.log('[CONTROLLER] - HEALTH ERROR OCCURED');
      next(error);
    }
  }
);
