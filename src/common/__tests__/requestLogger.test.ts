import express from 'express';
import { StatusCodes } from 'http-status-codes';
import request from 'supertest';
import { errorMiddleware } from '../middleware/errorHandler';
import morgan from 'morgan';
import { logger_format } from '../../config/logger';

describe('Request Logger Middleware', () => {
  const app = express();

  beforeAll(() => {
    // Menggunakan morgan sebagai request logger
    app.use(morgan(logger_format.MORGAN_FORMAT));
    app.get('/success', (_req, res) => {
      res.status(StatusCodes.OK).send('Success');
    });
    app.get('/redirect', (_req, res) => res.redirect('/success'));
    app.get('/error', () => {
      throw new Error('Test error');
    });
    app.use(errorMiddleware);
  });

  describe('Successful requests', () => {
    it('logs successful requests', async () => {
      const response = await request(app).get('/success');
      expect(response.status).toBe(StatusCodes.OK);
    });

    it('checks existing request id', async () => {
      const requestId = 'test-request-id';
      const response = await request(app)
        .get('/success')
        .set('X-Request-Id', requestId);
      expect(response.status).toBe(StatusCodes.OK);
    });
  });

  describe('Re-directions', () => {
    it('logs re-directions correctly', async () => {
      const response = await request(app).get('/redirect');
      expect(response.status).toBe(StatusCodes.MOVED_TEMPORARILY);
    });
  });

  describe('Error handling', () => {
    it('logs thrown errors with a 500 status code', async () => {
      const response = await request(app).get('/error');
      expect(response.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    });

    it('logs 404 for unknown routes', async () => {
      const response = await request(app).get('/unknown');
      expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });
  });
});
