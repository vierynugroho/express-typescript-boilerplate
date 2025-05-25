import cors from 'cors';
import express, { type Express } from 'express';
import helmet from 'helmet';
import logger from 'morgan';
import { logger_format } from './config/logger';
import { openAPIRouter } from '@/api-docs/openAPIRouter';
import { healthCheckRouter } from '@/api/healthCheck/healthCheckRouter';
import { userRouter } from '@/api/user/userRouter';
import {
  errorMiddleware,
  unexpectedRequest,
} from '@/common/middleware/errorHandler';
// import rateLimiter from '@/common/middleware/rateLimiter';
import { env } from '@/common/utils/envConfig';
import compression from 'compression';

const app: Express = express();
app.use(logger(logger_format.MORGAN_FORMAT));
app.set('trust proxy', true);
app.use(compression());

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: env.CORS_ORIGIN.split(','),
    credentials: true,
  })
);
app.use(helmet());
// app.use(rateLimiter);

// API Versioning
const v1Routes = express.Router();
app.use('/api-docs', openAPIRouter);
app.use('/api/v1', v1Routes);

v1Routes.use('/health-check', healthCheckRouter);
v1Routes.use('/users', userRouter);

// Swagger UI

// Error handlers
app.use(errorMiddleware);
app.use(unexpectedRequest);

export { app };
