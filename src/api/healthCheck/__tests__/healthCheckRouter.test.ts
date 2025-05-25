import { StatusCodes } from 'http-status-codes';
import request from 'supertest';

import type { ServiceResponse } from '@/common/models/serviceResponse';
import { app } from '@/server';

describe('Health Check API endpoints', () => {
  it('GET / - success', async () => {
    const response = await request(app).get('/api/v1/health-check');
    const result = response.body as ServiceResponse;

    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(result.statusCode).toEqual(StatusCodes.OK);
    expect(result.data).toBeNull();
    expect(result.meta?.message).toEqual('Service is healthy');
  });
});
